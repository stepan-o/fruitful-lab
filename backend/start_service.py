"""Supervise independent HTTP and import processes in the existing Railway service.

A separate worker service can instead run `python -m saved_city.worker` and keep
uvicorn as the API start command. The Postgres queue/leases are identical.
"""

import os
import signal
import subprocess
import sys
import time


def main():
    processes = []
    stopping = False

    def stop(*_):
        nonlocal stopping
        stopping = True

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    try:
        processes.append(
            subprocess.Popen(
                [
                    sys.executable,
                    "-m",
                    "uvicorn",
                    "main:app",
                    "--host",
                    "0.0.0.0",
                    "--port",
                    os.getenv("PORT", "8000"),
                ]
            )
        )
        processes.append(subprocess.Popen([sys.executable, "-m", "saved_city.worker"]))
        while not stopping:
            if any(p.poll() is not None for p in processes):
                return 1
            time.sleep(0.5)
        return 0
    finally:
        for p in processes:
            if p.poll() is None:
                p.terminate()
        for p in processes:
            try:
                p.wait(timeout=10)
            except subprocess.TimeoutExpired:
                p.kill()
                p.wait()


if __name__ == "__main__":
    sys.exit(main())
