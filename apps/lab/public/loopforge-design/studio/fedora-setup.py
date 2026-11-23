#!/usr/bin/python3 -I
"""Repeat the Loopforge Fedora host baseline. Run from the laptop's local console."""
import argparse
import fcntl
import ipaddress
import json
import os
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

ZONE = "lf-studio"
POLICY = "lf-studio-out"
STATE = Path("/var/lib/loopforge-host-baseline")
RECORD = STATE / "before.json"
FIREWALL = Path("/etc/firewalld")
ENV = {**os.environ, "LC_ALL": "C", "PATH": "/usr/sbin:/usr/bin:/sbin:/bin"}
CONTROL_ICMP = ("neighbour-advertisement", "neighbour-solicitation", "router-solicitation",
                "packet-too-big", "destination-unreachable", "time-exceeded", "parameter-problem")


def run(*args):
    return subprocess.check_output(args, text=True, env=ENV).strip()


def nm(field, *args):
    return run("nmcli", "--escape", "no", "--get-values", field, *args)


def profile_zone(uuid):
    value = nm("connection.zone", "connection", "show", "uuid", uuid)
    return "" if value == "--" else value


def active_devices():
    # Only UUID and device are requested. Connection names can contain punctuation.
    result = {}
    rows = run("nmcli", "-t", "--escape", "no", "-f", "UUID,DEVICE", "connection", "show", "--active")
    for row in rows.splitlines():
        uuid, dev = row.split(":", 1)
        if dev and nm("GENERAL.TYPE", "device", "show", dev) in ("wifi", "ethernet"):
            if (Path("/sys/class/net") / dev / "device").exists():
                result[dev] = uuid
    return result


def inspect(dev, uuid):
    info = json.loads(run("ip", "-j", "address", "show", "dev", dev))[0]["addr_info"]
    subnets = {str(ipaddress.ip_interface(f"{a['local']}/{a['prefixlen']}").network)
               for a in info if a["scope"] in ("link", "global")}
    for family in ("-4", "-6"):
        for route in json.loads(run("ip", "-j", family, "route", "show", "dev", dev)):
            dst = route.get("dst", "default")
            if dst != "default" and "gateway" not in route and "via" not in route and route.get("type", "unicast") == "unicast":
                network = ipaddress.ip_network(dst, strict=False)
                if network.prefixlen:
                    subnets.add(str(network))
    if not any(ipaddress.ip_network(n).version == 4 for n in subnets):
        raise ValueError(f"{dev} needs working IPv4 for the tested baseline")
    # Prefer the DHCP server reported by NetworkManager. It can differ from the gateway.
    options = nm("DHCP4.OPTION", "device", "show", dev).splitlines()
    dhcp = [row.split("=", 1)[1].strip() for row in options
            if row.partition("=")[0].strip() == "dhcp_server_identifier"]
    gateway = nm("IP4.GATEWAY", "device", "show", dev)
    if not dhcp and gateway and gateway != "--":
        dhcp = [gateway]
    dns = []
    for field in ("IP4.DNS", "IP6.DNS"):
        for value in nm(field, "device", "show", dev).splitlines():
            if value and value != "--":
                dns.append(str(ipaddress.ip_address(value.split("%")[0])))
    return dict(device=dev, uuid=uuid, zone=profile_zone(uuid), subnets=sorted(subnets),
                dhcp=[str(ipaddress.IPv4Address(x)) for x in dhcp], dns=sorted(set(dns)))


def firewall_files(profiles):
    # Include private address space so ordinary renumbering cannot open a private LAN path.
    networks = {ipaddress.ip_network(n) for n in
                ("10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "169.254.0.0/16", "fc00::/7", "fe80::/10")}
    for profile in profiles:
        networks.update(ipaddress.ip_network(n) for n in profile["subnets"])
    zone = ET.Element("zone")
    ET.SubElement(zone, "service", name="dhcpv6-client")
    policy = ET.Element("policy", priority="-1", target="CONTINUE")
    ET.SubElement(policy, "ingress-zone", name="HOST")
    ET.SubElement(policy, "egress-zone", name=ZONE)

    def rule(address, priority, action, element=None, **attrs):
        family = "ipv6" if ":" in address else "ipv4"
        r = ET.SubElement(policy, "rule", family=family, priority=str(priority))
        ET.SubElement(r, "destination", address=address)
        if element:
            ET.SubElement(r, element, attrs)
        ET.SubElement(r, action)

    for server in sorted({s for p in profiles for s in p["dhcp"]}):
        rule(server, -20, "accept", "port", port="67", protocol="udp")
    rule("fe80::/10", -20, "accept", "port", port="547", protocol="udp")
    for server in sorted({s for p in profiles for s in p["dns"]}):
        if any(ipaddress.ip_address(server) in network for network in networks):
            for protocol in ("udp", "tcp"):
                rule(server, -20, "accept", "port", port="53", protocol=protocol)
    for version in (4, 6):
        for network in ipaddress.collapse_addresses(n for n in networks if n.version == version):
            if version == 6:
                for name in CONTROL_ICMP:
                    rule(str(network), -20, "accept", "icmp-type", name=name)
            rule(str(network), -10, "reject")
    files = {f"zones/{ZONE}.xml": zone, f"policies/{POLICY}.xml": policy}
    for path, root in files.copy().items():
        ET.indent(root)
        files[path] = ET.tostring(root, encoding="unicode") + "\n"
    return files


def select(devices):
    active = active_devices()
    if not devices:
        raise ValueError("Choose connected interfaces from: " + ", ".join(sorted(active)))
    if len(set(devices)) != len(devices) or any(d not in active for d in devices):
        raise ValueError("Choose distinct, active physical Wi-Fi/Ethernet interfaces: " + ", ".join(sorted(active)))
    return [inspect(d, active[d]) for d in devices]


def show_plan(profiles, files):
    for p in profiles:
        print(f"{p['device']}: profile zone {p['zone'] or '(default)'} -> {ZONE}")
    print(files[f"policies/{POLICY}.xml"], end="")
    print("Selected profiles only. DHCP, listed local DNS ports and IPv6 control messages are exceptions.")
    print("firewalld reloads its saved configuration. Finish or save unrelated runtime-only changes first.")


def audit():
    for field in ("sys_vendor", "product_name", "product_version"):
        identity = Path("/sys/class/dmi/id") / field
        if identity.is_file():
            print(field, identity.read_text().strip())
    print(Path("/etc/fedora-release").read_text().strip(), os.uname().release)
    print("NVIDIA kernel module loaded:", Path("/sys/module/nvidia").is_dir())
    for path in ("/", "/home"):
        source = run("findmnt", "-n", "-o", "SOURCE", "--target", path).split("[", 1)[0]
        print(path, run("lsblk", "-snro", "TYPE,FSTYPE", source).splitlines())
    for cmd in (("mokutil", "--sb-state"), ("getenforce",), ("systemctl", "is-active", "firewalld"),
                ("systemctl", "is-enabled", "firewalld"), ("dnf5", "--refresh", "advisory", "summary",
                "--updates", "--security"), ("virt-host-validate", "qemu")):
        if shutil.which(cmd[0], path=ENV["PATH"]):
            print(" ".join(cmd), flush=True)
            print("exit", subprocess.run(cmd, env=ENV).returncode)
        else:
            print(cmd[0], "unavailable")
    print("KVM device present:", Path("/dev/kvm").is_char_device())


def verify(saved):
    run("firewall-cmd", "--check-config")
    for rel, expected in saved["files"].items():
        if (FIREWALL / rel).read_text() != expected:
            raise ValueError("Managed firewall file changed: " + rel)
    active = active_devices()
    current = []
    for profile in saved["profiles"]:
        uuid = profile["uuid"]
        if profile_zone(uuid) != ZONE:
            raise ValueError("Saved profile zone differs from baseline")
        dev = next((d for d, u in active.items() if u == uuid), None)
        if dev is None:
            raise ValueError("Connect all selected profiles to verify their active rules")
        if run("firewall-cmd", "--get-zone-of-interface", dev) != ZONE:
            raise ValueError(f"{dev} is in a different live zone")
        current.append(inspect(dev, uuid))
    if firewall_files(current) != saved["files"]:
        raise ValueError("Network or DNS changed. Review a new plan before using this profile for studio work.")
    live = run("firewall-cmd", "--get-active-policies").splitlines()
    if POLICY not in [line.strip() for line in live]:
        raise ValueError("Outbound policy is inactive")
    zone = "--zone=" + ZONE
    policy = "--policy=" + POLICY
    for extra in ([], ["--permanent"]):
        def check(obj, field, expected):
            if set(run("firewall-cmd", *extra, obj, field).split()) != set(expected):
                raise ValueError("Unexpected " + obj + " " + field)
        check(zone, "--list-services", ["dhcpv6-client"])
        for field in ("--list-ports", "--list-rich-rules", "--list-protocols", "--list-forward-ports", "--list-source-ports"):
            check(zone, field, [])
        check(policy, "--list-ingress-zones", ["HOST"])
        check(policy, "--list-egress-zones", [ZONE])
        forwarding = subprocess.run(("firewall-cmd", *extra, zone, "--query-forward"), env=ENV,
                                    stdout=subprocess.DEVNULL)
        if forwarding.returncode != 1:
            raise ValueError("Expected intra-zone forwarding to be disabled")
        if extra:
            check(policy, "--get-target", ["CONTINUE"])
            check(policy, "--get-priority", ["-1"])
    if sorted(run("firewall-cmd", policy, "--list-rich-rules").splitlines()) != sorted(
            run("firewall-cmd", "--permanent", policy, "--list-rich-rules").splitlines()):
        raise ValueError("Live outbound rules differ from the saved policy")
    print("Saved assignments and active policy checked. Run the peer and public HTTPS probes in the guide.")


def restore(saved):
    # Refuse to clobber somebody else's edits or remove a zone adopted by another profile.
    owned = {p["uuid"] for p in saved["profiles"]}
    all_ids = nm("UUID", "connection", "show").splitlines()
    if any(profile_zone(uid) == ZONE for uid in all_ids if uid not in owned):
        raise ValueError("Another saved profile uses the managed zone. Resolve locally before rollback.")
    for rel, expected in saved["files"].items():
        path = FIREWALL / rel
        if path.exists() and path.read_text() != expected:
            raise ValueError("Managed file changed. Review it locally before rollback: " + rel)
    for p in saved["profiles"]:
        if p["uuid"] in all_ids and profile_zone(p["uuid"]) == ZONE:
            run("nmcli", "connection", "modify", "uuid", p["uuid"], "connection.zone", p["zone"])
    for rel in saved["files"]:
        (FIREWALL / rel).unlink(missing_ok=True)
    run("firewall-cmd", "--check-config")
    run("firewall-cmd", "--reload")
    RECORD.unlink()
    print("Restored previous assignments and removed the managed configuration.")


def apply(profiles, files):
    if RECORD.exists():
        raise ValueError("An installation record exists. Use verify or rollback before a fresh apply.")
    for name, option in ((ZONE, "--get-zones"), (POLICY, "--get-policies")):
        for extra in ([], ["--permanent"]):
            if name in run("firewall-cmd", *extra, option).split():
                raise ValueError("Reserved firewall name already exists: " + name)
    if any(profile_zone(uid) == ZONE for uid in nm("UUID", "connection", "show").splitlines()):
        raise ValueError("A saved profile already refers to the reserved zone")
    if any((FIREWALL / rel).exists() for rel in files):
        raise ValueError("A reserved configuration path is already occupied")
    run("firewall-cmd", "--check-config")
    run("systemctl", "is-enabled", "firewalld")
    show_plan(profiles, files)
    if not sys.stdin.isatty() or input("Type APPLY at the local console to continue: ") != "APPLY":
        raise ValueError("Cancelled before changes")
    if [inspect(p["device"], active_devices()[p["device"]]) for p in profiles] != profiles:
        raise ValueError("The profiles changed during review. Re-run plan.")
    saved = {"profiles": profiles, "files": files}
    with tempfile.NamedTemporaryFile(mode="w", dir=STATE, delete=False) as tmp:
        json.dump(saved, tmp)
        tmp.flush()
        os.fsync(tmp.fileno())
    os.replace(tmp.name, RECORD)
    try:
        for rel, contents in files.items():
            path = FIREWALL / rel
            path.parent.mkdir(exist_ok=True)
            with tempfile.NamedTemporaryFile(mode="w", dir=path.parent) as target:
                target.write(contents)
                target.flush()
                os.fchmod(target.fileno(), 0o600)
                os.fsync(target.fileno())
                os.link(target.name, path)
            run("restorecon", str(path))
        run("firewall-cmd", "--check-config")
        run("firewall-cmd", "--reload")
        for p in profiles:
            run("nmcli", "connection", "modify", "uuid", p["uuid"], "connection.zone", ZONE)
        verify(saved)
    except (Exception, KeyboardInterrupt):
        print("Apply interrupted. Restoring the recorded state.", file=sys.stderr)
        restore(saved)
        raise


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", nargs="?", default="devices", choices=("devices", "audit", "plan", "apply", "verify", "rollback"))
    parser.add_argument("interfaces", nargs="*", help="physical connection(s) to protect for plan/apply")
    args = parser.parse_args()
    if not Path("/etc/fedora-release").is_file():
        raise ValueError("Run on the intended Fedora host")
    if args.interfaces and args.mode not in ("plan", "apply"):
        parser.error("interface arguments are only used by plan and apply")
    if args.mode == "devices":
        print("\n".join(sorted(active_devices())) or "No active physical interfaces")
    elif args.mode == "audit":
        audit()
    elif args.mode == "plan":
        profiles = select(args.interfaces)
        show_plan(profiles, firewall_files(profiles))
    else:
        if os.geteuid() != 0:
            raise ValueError("Use sudo from the local Fedora console for this mode")
        STATE.mkdir(mode=0o700, exist_ok=True)
        with (STATE / "lock").open("a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            if args.mode == "apply":
                profiles = select(args.interfaces)
                apply(profiles, firewall_files(profiles))
            elif args.mode == "verify":
                verify(json.loads(RECORD.read_text()))
            else:
                restore(json.loads(RECORD.read_text()))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, subprocess.SubprocessError, EOFError, KeyboardInterrupt) as exc:
        sys.exit(f"Stopped: {exc}")
