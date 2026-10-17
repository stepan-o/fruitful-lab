import type { View } from '@/lib/loopforge/encounters/contract';
type Anchor = { id: string; x: number; y: number; visible: boolean };

/** Composite the exact rendered frame and its public dialogue; no private evidence enters the PNG. */
export function storyboard(source: HTMLCanvasElement, view: View, anchors: Anchor[]) {
  const image = document.createElement('canvas');
  image.width = source.width; image.height = source.height + 64;
  const ctx = image.getContext('2d');
  if (!ctx) throw Error('Image export is unavailable in this browser.');
  ctx.drawImage(source, 0, 0);
  const scale = Math.max(.8, image.width / Math.max(1, source.clientWidth));
  const font = 14 * scale, line = 20 * scale, padding = 12 * scale;
  const width = Math.min(230 * scale, image.width * .6);
  ctx.font = `${font}px sans-serif`;
  for (const speech of view.bubbles) {
    const anchor = anchors.find(a => a.id === speech.speaker && a.visible);
    if (!anchor) continue;
    const words = speech.text.split(' '), lines: string[] = []; let current = '';
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (current && ctx.measureText(next).width > width - 2 * padding) { lines.push(current); current = word; }
      else current = next;
    }
    if (current) lines.push(current);
    const height = (lines.length + 1) * line + 2 * padding;
    const x = Math.max(8, Math.min(image.width - width - 8, anchor.x * source.width / 100 - width / 2));
    const y = Math.max(8, Math.min(source.height - height - 8, anchor.y * source.height / 100 - height - 16));
    ctx.fillStyle = '#e2e1ca'; ctx.fillRect(x, y, width, height);
    ctx.fillStyle = '#172a25'; ctx.textBaseline = 'top';
    ctx.font = `bold ${font}px sans-serif`;
    ctx.fillText(view.actors.find(a => a.id === speech.speaker)?.name ?? speech.speaker, x + padding, y + padding);
    ctx.font = `${font}px sans-serif`;
    lines.forEach((text, i) => ctx.fillText(text, x + padding, y + padding + (i + 1) * line));
  }
  ctx.fillStyle = '#091210'; ctx.fillRect(0, source.height, image.width, 64);
  ctx.fillStyle = '#e2e1ca'; ctx.font = '14px sans-serif'; ctx.textBaseline = 'top';
  ctx.fillText(view.phase, 16, source.height + 12, image.width - 32);
  ctx.fillStyle = '#b9ad77'; ctx.font = '11px monospace';
  ctx.fillText(`LOOPFORGE / ISOLATED REHEARSAL / ${(view.tick / 20).toFixed(2)} s`, 16, source.height + 38);
  return image;
}
