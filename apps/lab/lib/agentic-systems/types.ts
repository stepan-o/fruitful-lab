export type Block =
 | { type: "prose"; text: string; sources?: string[] }
 | { type: "heading"; text: string }
 | { type: "visual"; id: string; title: string; caption: string }
 | { type: "evidence"; asset: string; alt: string; caption: string; original: string }
 | { type: "video"; id: string }
 | { type: "build"; title: string; body: string; steps: string[]; exercise: string; links?: {label:string;href:string}[] };
export type Chapter = { id: string; title: string; standfirst: string; opening: string; blocks: Block[]; sourceIds: string[] };
export type Source = { id: string; author: string; date: string; title: string; url: string; kind: string; claim: string; limit: string; use: string; accessed: string };
