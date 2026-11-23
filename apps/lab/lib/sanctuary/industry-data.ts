/** Source amounts are millions of yen; do not substitute gross consumer spending. */
export const platformRows = [
 {label:"Hardware",values:[1132687,944425],note:"PlayStation consoles."},
 {label:"Physical software",values:[121159,125106],note:"First-party discs, third-party disc royalties and bundled software."},
 {label:"Full-game downloads",values:[949799,1055688],note:"First- and third-party full games sold through PlayStation Store."},
 {label:"Add-on content",values:[1340699,1359617],note:"Items, currencies, expansions and other digital content beyond full games."},
 {label:"Other software",values:[96425,100612],note:"Sony-published games and add-ons on other platforms."},
 {label:"Network services",values:[669873,763126],note:"PlayStation Plus AND advertising. This is not a pure subscription or cloud category."},
 {label:"Other",values:[359402,337076],note:"Primarily peripherals, including PlayStation VR."},
];
export const platformTotals = [4670044,4685651];
export const platformSource="https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/25q4_supplement.pdf";
export const cloudModes=[
 {label:"720p",size:"1280 × 720",fps:60,mbps:15},
 {label:"1080p",size:"1920 × 1080",fps:60,mbps:25},
 {label:"QHD",size:"2560 × 1440",fps:120,mbps:35},
 {label:"4K",size:"3840 × 2160",fps:120,mbps:45},
];
export const cloudRequirementSource="https://www.nvidia.com/en-us/geforce-now/system-reqs./";
export const cloudMilestones=[
 {date:"May 2021",value:10,label:"Over 10m",url:"https://www.sec.gov/Archives/edgar/data/1045810/000104581021000064/nvda-20210502.htm"},
 {date:"Feb 2023",value:25,label:"Over 25m",url:"https://blogs.nvidia.com/blog/geforce-now-thursday-feb-2/"},
];
