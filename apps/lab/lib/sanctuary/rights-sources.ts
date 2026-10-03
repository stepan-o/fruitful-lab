/** Dated, deliberately short verbatim excerpts. Never silently refresh these from live URLs. */
export const rightsReviewDate = "3 October 2026";
export const bg3Notice = "Sanctuary Economics is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards.";
export const rightsSources = [
  {
    id: "canada-review", kind: "Law · Canada", title: "Copyright Act, section 29.1",
    url: "https://laws-lois.justice.gc.ca/eng/acts/c-42/Section-29.1.html?wbdisable=true",
    version: "Section text checked 3 October 2026",
    quote: "Fair dealing for the purpose of criticism or review does not infringe copyright if the following are mentioned:",
    reading: "The section then requires the source and, when given there, the relevant author, performer, recording maker or broadcaster. Attribution is a condition; the dealing must also be fair. We retain source and creator information beside the selected reproductions and in the register below.",
  },
  {
    id: "cch", kind: "Case law · Canada", title: "CCH Canadian Ltd. v. Law Society of Upper Canada, 2004 SCC 13",
    url: "https://decisions.scc-csc.ca/scc-csc/scc-csc/en/2125/1/document.do",
    version: "Judgment, 4 March 2004 · paragraphs 53–60", quote: null,
    reading: "Fairness depends on the actual use, including its purpose, extent, distribution, alternatives, the work’s nature and effects on its market. Our selection is tied to specific criticism and explanation. These records describe an editorial assessment, not a court ruling or individual publisher clearance.",
  },
  {
    id: "us-fair-use", kind: "Legal guidance · United States", title: "US Copyright Office — More Information on Fair Use",
    url: "https://www.copyright.gov/fair-use/", version: "Guidance checked 3 October 2026", quote: null,
    reading: "US fair use is a separate, context-dependent four-factor inquiry. Free access and attribution do not settle it, and there is no universal safe screenshot count. Hosting on Vercel does not select a single worldwide copyright rule.",
  },
  {
    id: "bg3-terms", kind: "Publisher terms · BG3", title: "Baldur’s Gate 3 Fan Content Terms",
    url: "https://baldursgate3.game/bg3-fan-content-terms/", version: "31 July 2025",
    quote: "Any BG3 Fan Content you make must comply with the Wizards FCP",
    reading: "BG3’s specific terms incorporate Wizards’ policy; Larian’s general fan policy does not cover this game. The terms also grant Larian and its partners/licensors reuse rights in published fan content. Our image comes from the official wallpaper collection, with embedded marks and notices preserved.",
  },
  {
    id: "wizards", kind: "Publisher permission · conditional", title: "Wizards of the Coast Fan Content Policy",
    url: "https://company.wizards.com/en/legal/fancontentpolicy", version: "15 November 2017", quote: null,
    reading: "The policy permits qualifying free fan websites using art, requires an unofficial notice, protects existing legal notices and restricts separate logos, other people’s IP, games, music and video. Permission is revocable. Those are conditions of this permission, distinct from the statutory criticism analysis. The BG3 notice above accompanies this edition; there is no paywall, registration requirement or sale of this content.",
  },
  {
    id: "blizzard-marks", kind: "Publisher permission · conditional", title: "Blizzard Entertainment Logo and Trademark Guidelines",
    url: "https://www.blizzard.com/en-sg/legal/8bcb0794-6641-4ce3-a573-8eb243bab342/blizzard-entertainment-logo-and-trademark-guidelines",
    version: "Guidelines checked 3 October 2026; no revision date displayed",
    quote: "alter a Blizzard logo other than to adjust the overall size of the logo;",
    reading: "This excerpt is an item under ‘Do Not’. The permission is tied to qualifying activity policies and also requires appropriate ownership credits and avoids implied sponsorship. It is not a blanket license for every image. We preserve marks inside cited images; any separately displayed identifying logo needs its own recorded basis. Publisher marks are not our masthead, favicon or product identity.",
  },
  {
    id: "vercel", kind: "Hosting procedure", title: "Vercel DMCA Policy",
    url: "https://vercel.com/legal/dmca-policy", version: "Policy checked 3 October 2026", quote: null,
    reading: "A hosting complaint can interrupt access without a court deciding infringement. Media can be removed independently of our original diagrams and prose. A counter-notice is a separate legal decision, not an automatic publishing step.",
  },
] as const;
