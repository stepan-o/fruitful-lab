type WaveDividerProps = {
  fill: string;
  flip?: boolean;
};

export function WaveDivider({ fill, flip = false }: WaveDividerProps) {
  return (
    <svg className={`wave-divider ${flip ? "wave-divider-flip" : ""}`} viewBox="0 0 1440 96" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill={fill}
        d="M0 40L60 46.7C120 53 240 67 360 62.7C480 59 600 37 720 29.3C840 21 960 27 1080 38.7C1200 51 1320 69 1380 78.7L1440 88V96H0V40Z"
      />
    </svg>
  );
}
