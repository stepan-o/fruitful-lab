# SECURITY

## Mandate

Make it possible to give a Loopforge agent a task and come back to a tested change, a draft PR and a preview of that exact commit. The owner opens top-level specialist chats, approves the operating plan and retains administrative access, production releases and spending authority. PRODUCER coordinates the work. SECURITY implements the boundaries and demonstrates them to the owner.

## Where the work runs

| Workload | Responsibility |
| --- | --- |
| Build and functional browser checks | A CPU-only virtual machine gets a disposable workspace and explicit time, memory and disk limits. Test access to the host and other network devices from inside the guest. |
| Model access | Subscription Codex is primary. Select another provider explicitly. Keep owner sign-in and credential storage outside the build environment. Record whose entitlement pays for each run and how usage stops. |
| Local evaluation and traces | The host GPU serves a separately authorized local model evaluation. Measure latency, memory and game frame times under studio load. Run Langfuse on demand with an agreed set of trace fields and a retention period. |
| PRs and previews | A separate publisher checks the allowed paths, branch and exact commit before opening a draft PR and issuing a preview. Build scripts receive no production or publisher credentials. |

The [AI Lab proposal](/stepanoskin/loopforge/design/studio/ai-lab) describes the provider and evaluation choices. [AI ARCHITECT](/stepanoskin/loopforge/design/studio/ai-architect) owns those design decisions. SECURITY verifies their access and cost implications.

## Current handoff

**24 November 2026.** The owner verified the native build, the reproducible browser kernel and the native/WebAssembly comparison. The existing CPU-only guest passed the tested network and owner-file isolation checks. The desktop app now launches. The next check is the effective read boundary for a supervised desktop review.

1. Confirm the local user, checkout and revision. Review the active project-scoped read-only profile, approval recipient and enabled external tools with the owner. Keep approvals with the owner.
2. Read the engine README as a positive control. Have the owner create a harmless marker outside the checkout and confirm that their ordinary shell can open it. Attempt to open it from the desktop sandbox without printing its contents or widening access. Record an enforced denial, a successful open or an inconclusive result. A missing marker or a skipped probe is inconclusive.
3. When the parent passes and the owner authorizes the probe, spawn one reviewer to repeat both checks. Record the parent and child results separately. If either can open the marker, correct the profile and repeat the checks. Keep identities, paths, marker details and diagnostics in the private record.
4. Give PRODUCER the verdict for the tested review profile. The dedicated unattended client identity, restricted fork publisher, commit-specific preview, stop drill and four-hour pilot with C$0 additional charges still require their own evidence.

## Repeat the Fedora host setup

Use the [Fedora setup script](/loopforge-design/studio/fedora-setup.py) from a reviewed revision. Save it as `fedora-setup.py` and run it at the new laptop’s local console. The host checks and controlled peer tests were performed manually. The packaged procedure still needs an end-to-end run on a fresh physical machine.

1. **Identify and audit.** Run `python3 -I fedora-setup.py devices` to list connected physical interfaces and `sudo python3 -I fedora-setup.py audit` to review the machine model, encrypted storage layers, Secure Boot, SELinux, firewall startup, available security advisories and KVM readiness. Review each result. Set up disk encryption during Fedora installation and enable Secure Boot in firmware as needed. An advisory count covers the repositories reporting advisories. Optional virtualization tools are reported when available.
2. **Choose the connections.** In Bash, run `read -ra links -p "Interfaces to protect, separated by spaces: "` and enter the Wi-Fi and/or Ethernet names just listed. Run `python3 -I fedora-setup.py plan "${links[@]}"`. Review the discovered networks, DHCP and DNS exceptions locally. The plan protects the selected saved profiles. VPNs, other profiles and forwarded VM traffic need their own review.
3. **Establish the baseline.** On each selected link, test a known working peer service you control and a public HTTPS endpoint. If the peer is already unreachable, resolve that before counting a denial as evidence. Save any unrelated runtime-only firewalld changes before applying the saved configuration.
4. **Apply and verify.** Run `sudo python3 -I fedora-setup.py apply "${links[@]}"`. Review the plan and type APPLY. Run `sudo python3 -I fedora-setup.py verify` with all selected links connected. Repeat the same per-link peer and public probes. Expect rejection of new peer connections and success for public HTTPS. Repeat after reboot. For IPv6 link-local tests, include the interface scope on the peer address.
5. **Recover or move networks.** Run `sudo python3 -I fedora-setup.py rollback` at the local console to restore the recorded profile assignments. Recheck connectivity. On a different network, review a fresh plan and reapply after rollback. The script discovers addresses during setup. A changed resolver, public on-link prefix, or wired network can need a new plan.

The setup creates a dedicated ingress zone and a host-output policy. It permits DHCP, DNS to explicitly discovered local resolvers and essential IPv6 control traffic, rejects private and discovered on-link unicast destinations, and leaves public internet routing available. The site default zone and other profiles keep their existing settings. Multicast discovery, other routes and guest forwarding are outside this test. Kernel arguments, disk formatting, firmware settings, GPU assignment and VM provisioning require separate decisions.

## Operating guide for the first run

1. **Agree on the job.** Choose a harmless change and record allowed paths, repository read scope, preview audience, runtime, spending ceiling and shutdown conditions. A worktree separates edits. Enforce permitted changes in the publisher, including checks on workflow and deployment files. Distinguish enforced spending cutoffs from alerts.
2. **Prove guest isolation.** Read a known file in the workspace and test an owner-created private canary. Inspect mounts, session forwarding and available credentials. From the guest, verify the required internet connection and denial of access to a controlled peer and network administration. Keep detailed evidence private.
3. **Build and publish.** Run the relevant checks. Use a dedicated branch, open a draft PR against the current default branch and verify the preview serves its head commit. Verify production restrictions through permission inspection or a disposable test target.
4. **Stop and review.** Prevent queued work from starting, terminate the job and its children, and cancel associated cloud runs. Verify that nothing restarts and demonstrate how the owner can revoke publishing access. Record usage, results and remaining gaps for review.

## What can go in public code or docs

Publish a detail if it describes a standard security practice or if an unauthenticated outsider could trivially determine it from public code or normal use of the public service. Either condition is sufficient. Examples include using disk encryption, enforcing SELinux, giving builds short-lived permissions, or documenting a route already linked from the design board.

Apply the rule to the exact detail you intend to share. A canary test is a publishable practice. Its private contents and location are operational evidence. A public preview route is observable. A link containing a credential grants access. When several ordinary facts together reveal a private access path, assess that combination as a new disclosure.

## Publication and continuity

Publish the role, acceptance criteria and owner-cleared outcomes. Keep private addresses and identifiers, access inventories, canary values and raw diagnostic evidence in the private operating record. Apply the same rule to screenshots, PR text, downloadable prompts, previews and traces. Keep credentials out of chat.

At handoff, update the date, the latest verified milestone and the next check. The owner can supply the private evidence separately. Resume at the first unverified step.
