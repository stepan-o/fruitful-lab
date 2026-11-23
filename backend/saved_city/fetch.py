"""Bounded public-page fetcher. Each redirect resolves and pins a public IP.

TLS still checks the original hostname; cookies, credentials and proxy environment
variables are never forwarded. The worker cannot follow a link into Railway's LAN.
"""

import http.client
import ipaddress
import socket
import ssl
import time
from urllib.parse import urlsplit, urlunsplit, urljoin, parse_qsl, urlencode


class ImportFailure(Exception):
    def __init__(self, code, retry=False):
        self.code, self.retry = code, retry
        super().__init__(code)


def clean_url(value):
    try:
        u = urlsplit(value.strip())
        host = (u.hostname or "").encode("idna").decode("ascii").lower()
        port = u.port
        if u.scheme not in {"http", "https"} or not host or u.username or u.password:
            raise ValueError()
        if port not in {None, 80 if u.scheme == "http" else 443}:
            raise ValueError()
        if any(ord(c) < 33 for c in value) or len(value) > 2048:
            raise ValueError()
        if host in {"localhost", "metadata.google.internal"} or host.endswith(
            (".local", ".internal", ".localhost")
        ):
            raise ValueError()
        try:
            if not ipaddress.ip_address(host).is_global:
                raise ImportFailure("unsafe_url")
        except ValueError:
            pass
        authority = f"[{host}]" if ":" in host else host
        query = urlencode(
            [
                (k, v)
                for k, v in parse_qsl(u.query, keep_blank_values=True)
                if not k.lower().startswith("utm_")
                and k.lower() not in {"fbclid", "gclid"}
            ]
        )
        return urlunsplit((u.scheme, authority, u.path or "/", query, ""))
    except (ValueError, UnicodeError):
        raise ImportFailure("invalid_url")


def public_addresses(host, port):
    try:
        addresses = list(
            dict.fromkeys(
                r[4][0] for r in socket.getaddrinfo(host, port, type=socket.SOCK_STREAM)
            )
        )
    except OSError:
        raise ImportFailure("source_unreachable", True)
    if not addresses or any(not ipaddress.ip_address(a).is_global for a in addresses):
        raise ImportFailure("unsafe_url")
    return addresses


class PinnedHTTPS(http.client.HTTPSConnection):
    def __init__(self, host, address, port, timeout):
        super().__init__(
            host, port, timeout=timeout, context=ssl.create_default_context()
        )
        self.address = address

    def connect(self):
        sock = socket.create_connection((self.address, self.port), self.timeout)
        self.sock = self._context.wrap_socket(sock, server_hostname=self.host)


class PinnedHTTP(http.client.HTTPConnection):
    def __init__(self, host, address, port, timeout):
        super().__init__(host, port, timeout=timeout)
        self.address = address

    def connect(self):
        self.sock = socket.create_connection((self.address, self.port), self.timeout)


def fetch_public(url, image=False):
    current = clean_url(url)
    for _ in range(5):
        u = urlsplit(current)
        port = 443 if u.scheme == "https" else 80
        address = public_addresses(u.hostname, port)[0]
        cls = PinnedHTTPS if u.scheme == "https" else PinnedHTTP
        connection = cls(u.hostname, address, port, 12)
        try:
            connection.request(
                "GET",
                urlunsplit(("", "", u.path, u.query, "")),
                headers={
                    "User-Agent": "FruitfulCityLinkReader/1.0 (+https://fruitfulab.net/mexico-city)",
                    "Accept": "image/*"
                    if image
                    else "text/html,application/xhtml+xml,text/plain",
                    "Accept-Encoding": "identity",
                },
            )
            response = connection.getresponse()
            if response.status in {301, 302, 303, 307, 308}:
                current = clean_url(
                    urljoin(current, response.getheader("Location", ""))
                )
                continue
            if response.status in {404, 410}:
                raise ImportFailure("source_removed")
            if response.status in {401, 403, 429}:
                raise ImportFailure("source_restricted", response.status == 429)
            if response.status >= 500:
                raise ImportFailure("source_unreachable", True)
            if response.status != 200:
                raise ImportFailure("source_unreadable")
            mime = response.getheader("Content-Type", "").split(";")[0].lower()
            allowed = (
                {"image/jpeg", "image/png", "image/webp"}
                if image
                else {"text/html", "application/xhtml+xml", "text/plain"}
            )
            if (
                mime not in allowed
                or response.getheader("Content-Encoding", "identity") != "identity"
            ):
                raise ImportFailure("source_unreadable")
            chunks, length, started = [], 0, time.monotonic()
            while True:
                if time.monotonic() - started > 20:
                    raise ImportFailure("source_unreachable", True)
                chunk = response.read1(min(65536, 2_000_001 - length))
                if not chunk:
                    break
                chunks.append(chunk)
                length += len(chunk)
                if length > 2_000_000:
                    raise ImportFailure("source_too_large")
            content = b"".join(chunks)
            if len(content) > 2_000_000:
                raise ImportFailure("source_too_large")
            return current, content, mime
        except (OSError, http.client.HTTPException):
            raise ImportFailure("source_unreachable", True)
        finally:
            connection.close()
    raise ImportFailure("too_many_redirects")
