import { memo, type CSSProperties } from "react";
import styles from "./launcher.module.css";

// Original solid block alphabet. Adjacent cells share a continuous front;
// only exposed edges get depth faces, avoiding the old grid of overlapping cubes.
const alphabet: Record<string, string[]> = {
 A: ["0011100","0111110","1100011","1100011","1111111","1111111","1100011","1100011","1100011"],
 B: ["1111100","1111110","1100011","1100011","1111110","1100011","1100011","1111110","1111100"],
 C: ["0011110","0111111","1100000","1100000","1100000","1100000","1100000","0111111","0011110"],
 D: ["1111100","1111110","1100011","1100011","1100011","1100011","1100011","1111110","1111100"],
 E: ["1111111","1111111","1100000","1100000","1111110","1100000","1100000","1111111","1111111"],
 F: ["1111111","1111111","1100000","1100000","1111110","1100000","1100000","1100000","1100000"],
 G: ["0011110","0111111","1100000","1100000","1101111","1100011","1100011","0111111","0011110"],
 H: ["1100011","1100011","1100011","1100011","1111111","1100011","1100011","1100011","1100011"],
 I: ["1111","1111","0110","0110","0110","0110","0110","1111","1111"],
 K: ["1100011","1100110","1101100","1111000","1111000","1101100","1100110","1100011","1100011"],
 L: ["110000","110000","110000","110000","110000","110000","110000","111111","111111"],
 M: ["1100011","1110111","1111111","1101011","1101011","1100011","1100011","1100011","1100011"],
 N: ["1100011","1110011","1110011","1111011","1101111","1100111","1100111","1100011","1100011"],
 O: ["0011100","0111110","1100011","1100011","1100011","1100011","1100011","0111110","0011100"],
 P: ["1111100","1111110","1100011","1100011","1111110","1111100","1100000","1100000","1100000"],
 R: ["1111100","1111110","1100011","1100011","1111110","1111100","1101100","1100110","1100011"],
 S: ["0011111","0111111","1100000","1110000","0111110","0000111","0000011","1111110","1111100"],
 T: ["1111111","1111111","0011000","0011000","0011000","0011000","0011000","0011000","0011000"],
 U: ["1100011","1100011","1100011","1100011","1100011","1100011","1100011","0111110","0011100"],
 V: ["1100011","1100011","1100011","1100011","1100011","0110110","0110110","0011100","0001000"],
 Y: ["1100011","1100011","0110110","0110110","0011100","0011100","0011100","0011100","0011100"],
 Z: ["1111111","1111111","0000110","0001100","0011000","0110000","1100000","1111111","1111111"],
 s: ["000000","000000","011111","111111","110000","011110","000011","111111","111110"],
};

const cell = 4;
const depth = 5;
const lineHeight = 56;
function point(x: number, y: number, z = 0) {
    // Level baselines. The common extrusion, not text rotation, supplies depth.
    return `${(x + y * .075 + z * .72).toFixed(2)},${(y - z * .62).toFixed(2)}`;
}
function face(points: number[][]) { return `M${points.map(([x,y,z]) => point(x,y,z)).join("L")}Z`; }
function lineWidth(text: string) {
    return [...text].reduce((width, character) => width + (character === " " ? 3.5 : (alphabet[character]?.[0].length ?? 0) + 1.5) * cell, 0);
}
function buildWord(text: string) {
    const lines = text.split("\n");
    const contentWidth = Math.max(...lines.map(lineWidth));
    const letters: { front: string; top: string; side: string; edge: string; index: number }[] = [];
    let index = 0;
    lines.forEach((line, lineIndex) => {
        let cursor = (contentWidth - lineWidth(line)) / 2;
        [...line].forEach(character => {
            if (character === " ") { cursor += cell * 3.5; return; }
            const rows = alphabet[character];
            if (!rows) throw new Error(`Missing block glyph: ${character}`);
            let front = "", top = "", side = "", edge = "";
            for (let y = 0; y < rows.length; y++) {
                // Merge contiguous front cells into one run before projecting.
                for (let x = 0; x < rows[y].length;) {
                    if (rows[y][x] !== "1") { x++; continue; }
                    const start = x;
                    while (rows[y][x] === "1") x++;
                    const x0 = cursor + start * cell, x1 = cursor + x * cell;
                    const y0 = lineIndex * lineHeight + y * cell, y1 = y0 + cell;
                    front += face([[x0,y0,0],[x1,y0,0],[x1,y1,0],[x0,y1,0]]);
                }
                for (let x = 0; x < rows[y].length; x++) {
                    if (rows[y][x] !== "1") continue;
                    const x0 = cursor + x * cell, x1 = x0 + cell;
                    const y0 = lineIndex * lineHeight + y * cell, y1 = y0 + cell;
                    if (rows[y - 1]?.[x] !== "1") {
                        top += face([[x0,y0,0],[x0,y0,depth],[x1,y0,depth],[x1,y0,0]]);
                        edge += `M${point(x0,y0)}L${point(x1,y0)}`;
                    }
                    if (rows[y][x + 1] !== "1") side += face([[x1,y0,0],[x1,y0,depth],[x1,y1,depth],[x1,y1,0]]);
                }
            }
            letters.push({ front, top, side, edge, index: index++ });
            cursor += (rows[0].length + 1.5) * cell;
        });
    });
    return { letters, width: contentWidth + 18, height: 62 + (lines.length - 1) * lineHeight };
}
const labels = ["STEPAN OSKIN", "DATA SCIENCE", "PROFESSIONAL CV", "GAME MONETIZATION", "GAME ENGINES\nAND LLMs", "ABOUT"] as const;
export type BlockLabel = typeof labels[number];
const words = Object.fromEntries(labels.map(text => [text, buildWord(text)])) as Record<BlockLabel, ReturnType<typeof buildWord>>;
const menuWidth = Math.max(...Object.values(words).map(word => word.width));

const BlockWord = memo(function BlockWord({ text }: { text: BlockLabel }) {
    const word = words[text];
    return (
        <svg className={styles.blockWord} viewBox={`0 0 ${word.width} ${word.height}`} style={{ "--word-width": `${word.width}px`, "--word-ratio": word.width / menuWidth } as CSSProperties} aria-hidden="true" focusable="false">
            <g transform="translate(4 10)">
                <g className={styles.wordShadow} transform="translate(-1 7)">
                    <path d={word.letters.map(letter => letter.front).join("")} />
                </g>
                {word.letters.map(letter => (
                    <g key={letter.index} className={styles.letter} style={{ "--letter-delay": `${letter.index * 10}ms` } as CSSProperties}>
                        <path className={styles.side} d={letter.side} />
                        <path className={styles.top} d={letter.top} />
                        <path className={styles.front} d={letter.front} />
                        <path className={styles.bevel} d={letter.edge} />
                    </g>
                ))}
            </g>
        </svg>
    );
});
export default BlockWord;
