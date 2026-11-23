"""Offline checks for the Fedora host setup. Fixture addresses are reserved for documentation."""
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import xml.etree.ElementTree as ET

spec = importlib.util.spec_from_file_location("baseline", Path(__file__).with_name("fedora-setup.py"))
baseline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(baseline)


class FedoraBaselineTests(unittest.TestCase):
    def setUp(self):
        work = tempfile.TemporaryDirectory()
        self.addCleanup(work.cleanup)
        self.root = Path(work.name)
        for name, path in (("STATE", self.root), ("RECORD", self.root / "state.json"),
                           ("FIREWALL", self.root / "firewall")):
            self.enterContext(patch.object(baseline, name, path))
        self.profile = dict(device="test-link", uuid="test-profile", zone="", subnets=["192.0.2.0/24", "2001:db8:8::/64"],
                            dhcp=["192.0.2.3"], dns=["192.0.2.53"])
        self.files = baseline.firewall_files([self.profile])

    def test_discover_changed_network(self):
        def command(*args):
            if "address" in args:
                return json.dumps([{"addr_info": [{"scope": "global", "local": "198.51.100.42", "prefixlen": 25}]}])
            if "-6" in args:
                return json.dumps([{"dst": "2001:db8:3::/64"}, {"dst": "default", "gateway": "fe80::1"}])
            return "[]"
        def value(field, *args):
            return {"IP4.GATEWAY": "198.51.100.1", "IP4.DNS": "198.51.100.54", "IP6.DNS": "",
                    "DHCP4.OPTION": "dhcp_server_identifier = 198.51.100.10", "connection.zone": "--"}[field]
        with patch.object(baseline, "run", command), patch.object(baseline, "nm", value):
            p = baseline.inspect("different-link", "different-profile")
        self.assertEqual(p["subnets"], ["198.51.100.0/25", "2001:db8:3::/64"])
        self.assertEqual(p["dhcp"], ["198.51.100.10"])
        self.assertEqual(p["dns"], ["198.51.100.54"])
        self.assertEqual(p["zone"], "")

    def test_policy_and_exceptions(self):
        zone = ET.fromstring(self.files[f"zones/{baseline.ZONE}.xml"])
        self.assertEqual([child.tag for child in zone], ["service"])
        policy = ET.fromstring(self.files[f"policies/{baseline.POLICY}.xml"])
        self.assertEqual(policy.find("ingress-zone").get("name"), "HOST")
        self.assertEqual(policy.find("egress-zone").get("name"), baseline.ZONE)
        rules = policy.findall("rule")
        denied = {r.find("destination").get("address") for r in rules if r.find("reject") is not None}
        self.assertTrue({"192.0.2.0/24", "2001:db8:8::/64", "fe80::/10"} <= denied)
        allowed = {(r.find("destination").get("address"), r.find("port").get("port"), r.find("port").get("protocol"))
                   for r in rules if r.find("accept") is not None and r.find("port") is not None}
        self.assertEqual(allowed, {("192.0.2.53", "53", "udp"), ("192.0.2.53", "53", "tcp"),
                                   ("192.0.2.3", "67", "udp"), ("fe80::/10", "547", "udp")})
        self.assertFalse(any(r.find("icmp-type") is not None and r.find("icmp-type").get("name") == "echo-request" for r in rules))
        self.assertTrue(all(int(r.get("priority")) == (-10 if r.find("reject") is not None else -20) for r in rules))

    def write_files(self):
        for rel, data in self.files.items():
            target = baseline.FIREWALL / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(data)

    @unittest.skipUnless(shutil.which("firewall-offline-cmd"), "firewalld offline validator unavailable")
    def test_native_firewalld_accepts_config(self):
        self.write_files()
        subprocess.run(["firewall-offline-cmd", "--system-config", str(baseline.FIREWALL), "--check-config"], check=True)

    def test_rollback_restores_only_owned_assignment(self):
        self.write_files()
        baseline.RECORD.write_text("{}")
        with patch.object(baseline, "nm", return_value="test-profile\nother"), \
             patch.object(baseline, "profile_zone", side_effect=lambda uid: baseline.ZONE if uid == "test-profile" else "public"), \
             patch.object(baseline, "run") as run:
            baseline.restore({"profiles": [self.profile], "files": self.files})
        run.assert_any_call("nmcli", "connection", "modify", "uuid", "test-profile", "connection.zone", "")
        self.assertFalse(baseline.RECORD.exists())
        self.assertFalse(any((baseline.FIREWALL / rel).exists() for rel in self.files))

    def test_foreign_changes_stop_rollback(self):
        self.write_files()
        target = baseline.FIREWALL / next(iter(self.files))
        target.write_text("changed by owner")
        with patch.object(baseline, "nm", return_value="test-profile"), patch.object(baseline, "run") as run:
            with self.assertRaisesRegex(ValueError, "Managed file changed"):
                baseline.restore({"profiles": [self.profile], "files": self.files})
        run.assert_not_called()
        self.assertEqual(target.read_text(), "changed by owner")

    def test_existing_record_rejects_repeat_apply(self):
        baseline.RECORD.write_text("previous record")
        with patch.object(baseline, "run") as run:
            with self.assertRaisesRegex(ValueError, "installation record"):
                baseline.apply([self.profile], self.files)
        run.assert_not_called()


if __name__ == "__main__":
    unittest.main()
