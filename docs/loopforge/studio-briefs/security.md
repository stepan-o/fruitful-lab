# SECURITY

## Mandate

Make it possible to give a Loopforge agent a task and come back to a tested change, a draft PR and a preview of that exact commit. The owner opens top-level specialist chats, approves the operating plan and retains administrative access, production releases and spending authority. PRODUCER commissions implementation in the guest, reviews the running result with the owner and submits the approved revision to the studio services. SECURITY implements the boundaries and demonstrates them to the owner.

## Publishing permissions

The owner authorizes one reviewed commit. The guest returns its work to PRODUCER. The branch service writes the immutable ref, the App opens the draft, and GitHub and Vercel supply independent records for PRODUCER to check.

- **Owner → PRODUCER** Gives the work order, playtests the local draft and authorizes the exact reviewed commit with “open the PR.” Only the owner decides whether to merge.
- **Read-only PRODUCER → worker** Reads the base, diff, checks and running result. Sends the scope and revisions to the builder. Returns the guest URL to the owner and submits the approved commit and artifact to branch delivery.
- **Unprivileged CPU guest → PRODUCER** Reads the project and writes its disposable worktree. Runs checks, commits the candidate and serves the local draft. Returns the changed paths, checks, commit and worker artifact. Build processes have no remote publishing credentials.
- **Branch delivery → GitHub branch** Receives the approved base, head SHA and worker artifact. Validates the repository, paths and revision, pushes an immutable feature branch for this head and reads its SHA back. The branch-write credential stays in the service.
- **Loopforge PR Publisher → draft PR** Uses its GitHub App installation to read the delivered branch and open a draft against master. Returns the PR URL and head SHA to PRODUCER. The App's signing material stays in the PR service.
- **Vercel → PRODUCER → owner** Records the deployment state, Git SHA and deployment-specific URL. PRODUCER reports a building preview as pending, then checks the changed content when it is READY. Before reporting, PRODUCER also reads GitHub’s live PR state and full head. The owner receives the PR link, state and verification result.

Studio services perform routine publication. The private operating record identifies the approved invocation for each available service.

## Where the work runs

| Workload | Responsibility |
| --- | --- |
| Build and functional browser checks | A CPU-only virtual machine gets a disposable workspace and explicit time, memory and disk limits. Test access to the host and other network devices from inside the guest. |
| Model access | Subscription Codex is primary. Select another provider explicitly. Keep owner sign-in and credential storage outside the build environment. Record whose entitlement pays for each run and how usage stops. |
| Local evaluation and traces | The host GPU serves a separately authorized local model evaluation. Measure latency, memory and game frame times under studio load. Run Langfuse on demand with an agreed set of trace fields and a retention period. |
| PRs and previews | Branch delivery checks the approved artifact and pushes its commit. The PR App opens the draft. Vercel provides a commit-specific preview for PRODUCER to verify. |

The [AI Lab proposal](/stepanoskin/loopforge/design/studio/ai-lab) describes the provider and evaluation choices. [AI ARCHITECT](/stepanoskin/loopforge/design/studio/ai-architect) owns those design decisions. SECURITY verifies their access and cost implications.

## Current handoff

**26 November 2026 · Verified publishing boundary.** The owner approved the local guest draft for [PR #202](https://github.com/stepan-o/fruitful-lab/pull/202) at `775a22fac1b1c821f7b2fba039c2da34c40fb58d`. Scoped branch delivery published that immutable head. The GitHub App opened the draft and the owner merged it. Vercel recorded a READY preview for the same commit. PRODUCER checked both hosted diagram pages against their reviewed Git HTML.

**Earlier checks.** The read-only PRODUCER desktop and delegated reviewer passed their access checks. The isolated CPU guest built, committed and served the one-file local test. App installation and authentication were verified separately. The documentation delivery exercised the publication path for its approved scope.

The local test used a running guest. Cold startup through a scoped interface remains unproved. The earlier native and browser kernel checks and guest network and owner-file isolation results remain on record. Unattended publishing, the stop drill and the four-hour pilot with C$0 additional charges require separate evidence.

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
