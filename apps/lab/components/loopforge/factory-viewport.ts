/** Keep scene geometry uniform; the raster budget is independent of composition. */
export function factoryViewport(cssWidth: number, cssHeight: number) {
  const baseScale = cssWidth <= 640 && cssHeight < 480
    ? Math.max(.42, (cssHeight - 140) / 400)
    : cssWidth <= 640
      ? Math.max(.68, Math.min(.92, (cssHeight - 100) / 780))
      : cssHeight > cssWidth * 1.1
        ? Math.min(1.2, cssHeight / 840)
        : Math.max(.64, Math.min(1, cssWidth / 1050, cssHeight / 600));
  // Widening only the final X transform flattens every specimen and lamp.
  // Grow the whole scene on large displays; limit that growth by available
  // height so ultrawide monitors reveal more cargo instead of cropping it.
  const scale = Math.max(baseScale, Math.min(cssWidth / 1800, cssHeight / 840));
  const resolution = Math.min(1.5, 2100 / cssWidth, 1400 / cssHeight);
  return {
    width: cssWidth / scale,
    height: cssHeight / scale,
    pixelWidth: Math.round(cssWidth * resolution),
    pixelHeight: Math.round(cssHeight * resolution),
  };
}
