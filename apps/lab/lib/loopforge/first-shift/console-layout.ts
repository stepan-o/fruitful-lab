export type ConsoleLayout = "wall" | "portrait" | "channel" | "compact";

/** Available console space, not device identity. No simulation state enters this choice. */
export function consoleLayout(width: number, height: number): ConsoleLayout {
  if (width > 700) return height < 470 ? "compact" : "wall";
  return width < 360 || height < 520 ? "channel" : "portrait";
}
