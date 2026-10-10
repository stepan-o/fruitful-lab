import { learningPoints, type Learning } from "./rewards";
export type Copy = readonly [string, string];
export type Mode = "home" | "solo" | "friends" | "community";
export type Category = "art" | "food" | "books" | "nature" | "history";
export type Member = { id: string; name: string };
export type Evidence = {
  recordId: string;
  status: "submitted" | "confirmed" | "clarification";
  submittedAt: number;
  feedback: string;
};
export type Challenge = {
  id: string;
  sender: string;
  target: string;
  title: string;
  category: Category;
  duration: number;
  reward: number;
  loss: number;
  together: boolean;
  status:
    | "offered"
    | "active"
    | "submitted"
    | "clarification"
    | "confirmed"
    | "declined"
    | "expired"
    | "forfeited"
    | "incomplete";
  deadline: number | null;
  evidence: Record<string, Evidence>;
};
export type Block = {
  id: string;
  sender: string;
  target: string;
  category: Category;
  until: number;
};
export type Group = {
  id: string;
  name: string;
  invite: string;
  members: Member[];
  challenges: Challenge[];
  blocks: Block[];
};
export type Discovery = {
  id: string;
  owner: string;
  name: string;
  title: string;
  category: Category;
  note: string;
  place: string;
  lat: number;
  lng: number;
  createdAt: number;
  photo: string;
  publication: "private" | "pending" | "approved" | "rejected";
  goalId?: string | null;
  challengeId?: string | null;
  groupId?: string | null;
};
export type FieldState = {
  me: Member & { admin: boolean; email?: string };
  learning: Learning;
  goal: string | null;
  groups: Group[];
  records: Discovery[];
  publicRecords: Discovery[];
  publicRanks?: { id: string; name: string; count: number }[];
  moderation: Discovery[];
  serverTime: number;
};
export type Command = {
  kind:
    | "create_group"
    | "join_group"
    | "challenge"
    | "accept"
    | "decline"
    | "forfeit"
    | "record"
    | "review"
    | "block"
    | "learn"
    | "goal"
    | "publish"
    | "moderate";
  id: string;
  groupId?: string;
  target?: string;
  challengeId?: string;
  recordId?: string;
  title?: string;
  category?: Category;
  note?: string;
  place?: string;
  lat?: number;
  lng?: number;
  photo?: string;
  invite?: string;
  duration?: number;
  reward?: number;
  loss?: number;
  together?: boolean;
  decision?: "confirm" | "clarify" | "reject";
  publish?: boolean;
  learningId?: string;
  goalId?: string | null;
};
export const CATEGORIES: {
  id: Category;
  name: Copy;
  icon: string;
  color: string;
}[] = [
  {
    id: "art",
    name: ["Arte callejero", "Street art"],
    icon: "paintbrush",
    color: "#da684d",
  },
  { id: "food", name: ["Sabores", "Food"], icon: "utensils", color: "#c18a2d" },
  {
    id: "books",
    name: ["Libros", "Books"],
    icon: "book-open",
    color: "#6674ad",
  },
  {
    id: "nature",
    name: ["Naturaleza", "Nature"],
    icon: "leaf",
    color: "#6c8d50",
  },
  {
    id: "history",
    name: ["Historia", "History"],
    icon: "landmark",
    color: "#538b9c",
  },
];
export const GOALS: {
  id: string;
  category: Category;
  title: Copy;
  description: Copy;
  duration: Copy;
  art: string;
  point?: { lat: number; lng: number };
  story?: string;
}[] = [
  {
    id: "mural",
    category: "art",
    title: ["Un mural fuera de tu ruta", "A mural off your usual route"],
    description: [
      "Dobla por una calle que casi nunca tomas. Encuentra un mural o un rótulo pintado a mano, fotografía un detalle y cuenta qué te hizo detenerte.",
      "Turn down a street you rarely take. Find a mural or hand-painted sign, photograph a detail and say what made you stop.",
    ],
    duration: ["Una vuelta de 20–40 min", "A 20–40 min outing"],
    art: "revolucion",
  },
  {
    id: "books",
    category: "books",
    title: ["Una librería que no conocías", "A bookshop you haven’t met"],
    description: [
      "Busca una librería fuera de tus favoritas. Guarda su fachada y el título que te dio curiosidad. No hace falta comprar nada.",
      "Find a bookshop beyond your usual favourites. Record its façade and a title that caught your eye. No purchase needed.",
    ],
    duration: ["Para una tarde libre", "For a free afternoon"],
    art: "zocalo",
  },
  {
    id: "nature",
    category: "nature",
    title: ["Una pausa bajo los árboles", "A pause beneath the trees"],
    description: [
      "Encuentra un rincón verde donde nunca te hayas sentado. Quédate un momento: ¿qué se oye cuando dejas de caminar?",
      "Find a green corner where you’ve never sat. Stay a moment: what can you hear when you stop walking?",
    ],
    duration: ["Una pausa de 15–30 min", "A 15–30 min pause"],
    art: "chapultepec",
  },
  {
    id: "taco",
    category: "food",
    title: ["Un sabor pendiente", "A flavour still to discover"],
    description: [
      "Acércate a un puesto que siempre pasas de largo. Descubre qué preparan y registra qué te llamó la atención. Pregunta antes de fotografiar a alguien.",
      "Stop at a stand you usually walk past. Discover what they make and record what caught your attention. Ask before photographing someone.",
    ],
    duration: ["De camino a otro lado", "On your way somewhere"],
    art: "ehecatl",
  },
  {
    id: "history",
    category: "history",
    title: ["Dos épocas en una foto", "Two eras in one photograph"],
    description: [
      "En Pino Suárez, busca el encuentro entre el adoratorio de Ehécatl y la estación de hoy. Sigue las indicaciones del Metro y no estorbes el paso.",
      "At Pino Suárez, find the meeting of Ehécatl’s shrine and today’s station. Follow Metro instructions and keep circulation clear.",
    ],
    duration: ["Una parada con historia", "A stop with a story"],
    art: "ehecatl",
    point: { lat: 19.425283, lng: -99.132708 },
    story: "ehecatl",
  },
];
export function emptyState(
  me: FieldState["me"] = { id: "guest", name: "Explorador", admin: false },
): FieldState {
  return {
    me,
    learning: {},
    goal: null,
    groups: [],
    records: [],
    publicRecords: [],
    moderation: [],
    serverTime: Date.now(),
  };
}
export function personalPoints(state: FieldState) {
  return (
    state.records.filter((r) => r.owner === state.me.id).length * 30 +
    learningPoints(state.learning)
  );
}
export function groupPoints(group: Group, owner: string) {
  return group.challenges.reduce(
    (sum, c) =>
      sum +
      (c.status === "confirmed" &&
      (c.target === owner || (c.together && c.sender === owner))
        ? c.reward
        : ["expired", "forfeited"].includes(c.status) && c.target === owner
          ? -c.loss
          : 0),
    0,
  );
}
export function expireChallenges(state: FieldState, now: number): FieldState {
  return {
    ...state,
    groups: state.groups.map((g) => ({
      ...g,
      blocks: g.blocks.filter((b) => b.until > now),
      challenges: g.challenges.map((c) =>
        c.deadline &&
        c.deadline <= now &&
        c.together &&
        ["active", "submitted", "clarification"].includes(c.status) &&
        ![c.sender, c.target].every((id) => c.evidence[id])
          ? { ...c, status: "incomplete" as const }
          : c.deadline && c.deadline <= now && c.status === "active"
            ? { ...c, status: "expired" as const }
            : c,
      ),
    })),
  };
}
export function demoState(): FieldState {
  const state = emptyState({ id: "susy", name: "Susy", admin: true });
  state.groups = [
    {
      id: "demo-group",
      name: "Susy + Stepan",
      invite: "DEMO-SUSY-STEPAN",
      members: [
        { id: "susy", name: "Susy" },
        { id: "stepan", name: "Stepan" },
      ],
      challenges: [
        {
          id: "demo-mural",
          sender: "stepan",
          target: "susy",
          title: "Un mural fuera de tu ruta",
          category: "art",
          duration: 1440,
          reward: 100,
          loss: 25,
          together: false,
          status: "offered",
          deadline: null,
          evidence: {},
        },
      ],
      blocks: [],
    },
  ];
  return state;
}
// Isolated, labeled rehearsal only. Account commands are authorized by FastAPI.
export function demoCommand(before: FieldState, c: Command): FieldState {
  const state = structuredClone(expireChallenges(before, Date.now()));
  const uid = state.me.id,
    now = Date.now();
  const group = state.groups.find((g) => g.id === c.groupId);
  const challenge = group?.challenges.find((ch) => ch.id === c.challengeId);
  if (c.kind === "goal") state.goal = c.goalId ?? null;
  if (c.kind === "learn") state.learning[c.learningId as keyof Learning] = true;
  if (c.kind === "create_group" && !state.groups.some((g) => g.id === c.id))
    state.groups.push({
      id: c.id,
      name: c.title!,
      invite: `DEMO-${c.id.slice(0, 8)}`,
      members: [
        state.me,
        {
          id: uid === "susy" ? "stepan" : "susy",
          name: uid === "susy" ? "Stepan" : "Susy",
        },
      ],
      challenges: [],
      blocks: [],
    });
  if (
    c.kind === "join_group" &&
    !state.groups.some((g) => g.invite === c.invite)
  )
    throw new Error("invite_invalid");
  if (
    c.kind === "challenge" &&
    group &&
    !group.challenges.some((ch) => ch.id === c.id)
  ) {
    if (
      group.challenges.filter(
        (ch) =>
          ch.sender === uid &&
          ["offered", "active", "submitted", "clarification"].includes(
            ch.status,
          ),
      ).length >= 3
    )
      throw new Error("challenge_limit");
    group.challenges.push({
      id: c.id,
      sender: uid,
      target: c.target!,
      title: c.title!,
      category: c.category!,
      duration: c.duration!,
      reward: c.reward!,
      loss: c.together ? 0 : c.loss!,
      together: !!c.together,
      status: "offered",
      deadline: null,
      evidence: {},
    });
  }
  if (c.kind === "block" && group && !group.blocks.some((b) => b.id === c.id)) {
    if (
      group.blocks.some((b) => b.sender === uid) ||
      group.challenges.some(
        (ch) =>
          ch.target === c.target &&
          ch.category === c.category &&
          ["active", "submitted", "clarification"].includes(ch.status),
      )
    )
      throw new Error("block_conflict");
    group.blocks.push({
      id: c.id,
      sender: uid,
      target: c.target!,
      category: c.category!,
      until: now + 86400000,
    });
  }
  if (["accept", "decline", "forfeit"].includes(c.kind) && challenge) {
    if (challenge.target !== uid) throw new Error("challenge_forbidden");
    if (c.kind === "accept" && challenge.status === "offered") {
      if (
        group?.blocks.some(
          (b) => b.target === uid && b.category === challenge.category,
        )
      )
        throw new Error("category_blocked");
      challenge.status = "active";
      challenge.deadline = now + challenge.duration * 60000;
    } else if (c.kind === "decline" && challenge.status === "offered")
      challenge.status = "declined";
    else if (c.kind === "forfeit" && challenge.status === "active")
      challenge.status = "forfeited";
  }
  if (c.kind === "record" && !state.records.some((r) => r.id === c.id)) {
    if (!c.photo || !c.title?.trim() || !c.place?.trim())
      throw new Error("record_required");
    if (challenge) {
      if (
        !["active", "submitted", "clarification"].includes(challenge.status) ||
        challenge.category !== c.category ||
        !(
          challenge.target === uid ||
          (challenge.together && challenge.sender === uid)
        )
      )
        throw new Error("challenge_not_active");
      if (
        challenge.evidence[uid] &&
        challenge.evidence[uid].status !== "clarification"
      )
        throw new Error("already_submitted");
      if (!challenge.evidence[uid] && challenge.deadline! <= now)
        throw new Error("challenge_expired");
      challenge.evidence[uid] = {
        recordId: c.id,
        status: "submitted",
        submittedAt: now,
        feedback: "",
      };
      challenge.status = "submitted";
    }
    state.records.push({
      id: c.id,
      owner: uid,
      name: state.me.name,
      title: c.title,
      category: c.category!,
      note: c.note || "",
      place: c.place,
      lat: c.lat!,
      lng: c.lng!,
      photo: c.photo,
      createdAt: now,
      publication: c.publish ? "pending" : "private",
      goalId: !c.challengeId && GOALS.find(g => g.id === state.goal)?.category === c.category ? state.goal : null,
      challengeId: c.challengeId,
      groupId: c.groupId,
    });
    if (!c.challengeId && GOALS.find(g => g.id === state.goal)?.category === c.category) state.goal = null;
  }
  if (c.kind === "review" && challenge) {
    if (!["submitted", "clarification", "confirmed"].includes(challenge.status))
      throw new Error("challenge_not_active");
    if (
      c.target === uid ||
      ![challenge.sender, challenge.target].includes(uid) ||
      (!challenge.together && uid !== challenge.sender)
    )
      throw new Error("review_forbidden");
    const evidence = challenge.evidence[c.target!];
    if (!evidence) throw new Error("evidence_missing");
    if (evidence.status !== "confirmed") {
      evidence.status =
        c.decision === "confirm" ? "confirmed" : "clarification";
      evidence.feedback = c.note || "";
      const required = challenge.together
        ? [challenge.sender, challenge.target]
        : [challenge.target];
      challenge.status = required.every(
        (id) => challenge.evidence[id]?.status === "confirmed",
      )
        ? "confirmed"
        : c.decision === "confirm"
          ? "submitted"
          : "clarification";
    }
  }
  if (c.kind === "publish") {
    const r = state.records.find((r) => r.id === c.recordId && r.owner === uid);
    if (r && ["private", "rejected"].includes(r.publication))
      r.publication = "pending";
  }
  if (c.kind === "moderate") {
    const r = state.records.find((r) => r.id === c.recordId);
    if (!state.me.admin || r?.owner === uid)
      throw new Error("review_forbidden");
    if (r?.publication === "pending")
      r.publication = c.decision === "confirm" ? "approved" : "rejected";
  }
  state.publicRecords = state.records.filter(
    (r) => r.publication === "approved",
  );
  state.moderation = state.records.filter((r) => r.publication === "pending");
  state.serverTime = now;
  return state;
}
export const ERRORS: Record<string, Copy> = {
  service_unavailable: [
    "No pudimos conectar con el juego. Tus cambios no se han enviado; inténtalo de nuevo.",
    "We couldn’t reach the game. Your changes have not been submitted; try again.",
  ],
  sign_in_required: [
    "Tu sesión terminó. Entra de nuevo para continuar.",
    "Your session ended. Sign in again to continue.",
  ],
  account_exists: [
    "Ese correo ya tiene cuenta. Inicia sesión.",
    "That email already has an account. Sign in.",
  ],
  invite_invalid: [
    "No encontramos esa invitación. Revisa el código.",
    "We couldn’t find that invitation. Check the code.",
  ],
  group_limit: [
    "El grupo está completo o alcanzaste el límite de ocho grupos.",
    "The group is full or you’ve reached the eight-group limit.",
  ],
  record_required: [
    "Faltan la foto, el título o el lugar.",
    "Add a photo, title and place.",
  ],
  photo_size: [
    "La foto es demasiado grande. Prueba otra imagen.",
    "That photo is too large. Try another image.",
  ],
  photo_type: [
    "Elige una imagen JPEG, PNG o WebP.",
    "Choose a JPEG, PNG or WebP image.",
  ],
  photo_invalid: [
    "No pudimos leer esa imagen. Prueba otra foto.",
    "We couldn’t read that image. Try another photo.",
  ],
  review_forbidden: [
    "La evidencia la confirma la otra persona.",
    "The other person must confirm the evidence.",
  ],
  challenge_not_active: [
    "Este reto ya no admite esa entrega. Puedes guardar tu hallazgo sin vincularlo al reto.",
    "This challenge cannot accept that submission. You can save your discovery without attaching it.",
  ],
  challenge_expired: [
    "El plazo terminó. Tu foto aún puede quedarse en tu bitácora.",
    "The deadline passed. Your photo can still go in your logbook.",
  ],
  category_blocked: [
    "Esa categoría tiene una pausa temporal en tu grupo.",
    "That category is temporarily paused in your group.",
  ],
  block_conflict: [
    "Ya tienes una carta activa o afectaría un reto aceptado.",
    "You already have an active card, or it would affect an accepted challenge.",
  ],
  challenge_limit: [
    "Puedes tener hasta tres retos pendientes por persona.",
    "You can have up to three outstanding challenges per sender.",
  ],
  already_submitted: [
    "Ya entregaste evidencia para este reto.",
    "You already submitted evidence for this challenge.",
  ],
  record_limit: [
    "Tu bitácora llegó al límite actual de 200 hallazgos.",
    "Your logbook reached the current 200-discovery limit.",
  ],
};
