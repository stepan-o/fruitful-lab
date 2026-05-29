export type Letter = {
  title: string;
  season: string;
  excerpt: string;
  readTime: string;
};

export type Ritual = {
  title: string;
  moment: string;
  description: string;
  materials: string[];
};

export type StudioValue = {
  title: string;
  body: string;
};

export const LETTERS: Letter[] = [
  {
    title: "A Note for the First Soft Morning",
    season: "Spring",
    excerpt:
      "A slow invitation to notice what is opening, what is asking for more light, and what can stay tender while it grows.",
    readTime: "4 min",
  },
  {
    title: "The Garden Does Not Hurry",
    season: "Summer",
    excerpt:
      "A warm letter about attention, patience, and the quiet discipline of returning to what wants to be cared for.",
    readTime: "5 min",
  },
  {
    title: "What the Windowsill Keeps",
    season: "Any season",
    excerpt:
      "Small domestic observations for people who collect scraps of beauty and need a gentler place to put them down.",
    readTime: "3 min",
  },
];

export const RITUALS: Ritual[] = [
  {
    title: "Morning Petal List",
    moment: "Before the day gets loud",
    description:
      "Choose one color, one scent, and one honest sentence. Let those three things decide what deserves your first attention.",
    materials: ["Notebook", "Something blooming", "Ten quiet minutes"],
  },
  {
    title: "Window Light Reset",
    moment: "When the afternoon frays",
    description:
      "Move one object into better light, clear one small surface, and write down the next kind thing you can do for the room.",
    materials: ["A windowsill", "A soft cloth", "One small object"],
  },
  {
    title: "Evening Seed Line",
    moment: "Before sleep",
    description:
      "Close the day with one sentence that can become tomorrow's first seed: a question, a hope, or a simple next step.",
    materials: ["Pen", "Paper", "A bedside place for the note"],
  },
];

export const STUDIO_VALUES: StudioValue[] = [
  {
    title: "Softness with structure",
    body:
      "Bloom Whispers is calm, but not vague. Each note and ritual gives tenderness a place to land.",
  },
  {
    title: "Seasonal attention",
    body:
      "The site follows small natural shifts: light, color, scent, weather, rooms, and the tiny decisions that shape a day.",
  },
  {
    title: "Beauty without pressure",
    body:
      "This is a brand for people who want more noticing and less performance in their creative and domestic life.",
  },
];

export const HOME_FEATURES = [
  {
    eyebrow: "Letters",
    title: "Soft field notes for ordinary days",
    body:
      "Short essays and seasonal reflections written for the moments when your attention wants somewhere quieter to go.",
    href: "/letters",
  },
  {
    eyebrow: "Rituals",
    title: "Small practices with real edges",
    body:
      "Gentle prompts for morning, afternoon, and evening that fit inside a lived-in day instead of asking for a perfect one.",
    href: "/rituals",
  },
  {
    eyebrow: "Studio",
    title: "A brand world built for slow return",
    body:
      "A first home for Bloom Whispers as it grows into letters, seasonal offerings, and a more tactile creative archive.",
    href: "/about",
  },
] as const;
