import revisedNinth from "./revised-chapters/09.json";
import revisedEighth from "./revised-chapters/08.json";
import revisedSeventh from "./revised-chapters/07.json";
import revisedSixth from "./revised-chapters/06.json";
import revisedFifth from "./revised-chapters/05.json";
import revisedFourth from "./revised-chapters/04.json";
import revisedThird from "./revised-chapters/03.json";
import revisedSecond from "./revised-chapters/02.json";
import revisedFirst from "./revised-chapters/01.json";
import catalog from "./catalog.json";
import records from "./sources.json";
import type { Chapter, Source } from "./types";
export { catalog };
export const chapters: Chapter[] = [revisedFirst, revisedSecond, revisedThird, revisedFourth, revisedFifth, revisedSixth, revisedSeventh, revisedEighth, revisedNinth] as Chapter[];
export const sources = records as Source[];
const aliases:Record<string,string>={
 "what-shipped":"worth-shipping","what-makes-a-game":"worth-shipping",
 "delegated-work":"division-of-work","agent-or-workflow":"division-of-work",
 "smallest-world":"small-world","different-knowledge":"small-world",
 "memory":"correction","usable-eyes":"correction",
 "readable-scene":"readable-detail","movement":"readable-detail",
 "generate-evaluate-select":"generation","authored-play":"generation",
 "tests":"confidence","playtesting":"confidence","intervention":"handoff"
};
export function chapterById(id: string) { return chapters.find(chapter => chapter.id === (aliases[id]??id)); }
