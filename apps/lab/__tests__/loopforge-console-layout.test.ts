import { consoleLayout } from "@/lib/loopforge/first-shift/console-layout";

describe("console space allocation", () => {
  it.each([
    [1440, 860, "wall"], [1024, 700, "wall"], [390, 800, "portrait"],
    [320, 700, "channel"], [390, 480, "channel"], [844, 350, "compact"],
    [2555, 1270, "wall"],
  ])("fits %i × %i available space as %s", (width, height, layout) => {
    expect(consoleLayout(width, height)).toBe(layout);
  });
});
