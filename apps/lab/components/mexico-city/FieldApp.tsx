"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Camera,
  Check,
  ChevronDown,
  Compass,
  Home,
  MapPin,
  Paintbrush,
  Plus,
  Search,
  Sparkles,
  Swords,
  Trophy,
  Users,
  X,
} from "lucide-react";
import {
  LocaleProvider,
  LanguageSwitch,
  useLocale,
} from "@/lib/mexico-city/locale";
import {
  CATEGORIES,
  GOALS,
  ERRORS,
  demoCommand,
  demoState,
  emptyState,
  expireChallenges,
  groupPoints,
  personalPoints,
  type Category,
  type FieldState,
  type Mode,
  type Copy,
} from "@/lib/mexico-city/field-game";
import { STORIES, storyById } from "@/lib/mexico-city/content";
import type { LearningId } from "@/lib/mexico-city/rewards";
import { directions } from "@/lib/mexico-city/map-engine";
import FieldMap, { type MapHandle } from "./FieldMap";
import { FieldLogin } from "./FieldEntry";
import {
  Capture,
  ChallengeCard,
  ChallengeComposer,
  RecordDetails,
  newDraft,
  type Draft,
  type Send,
} from "./FieldTasks";
import GameDialog from "./GameDialog";
import GameName from "./GameName";
import Artwork from "./Artwork";
const OverviewChapter = dynamic(() => import("./OverviewChapter"));
const NahuatlGames = dynamic(() => import("./NahuatlGames"));
const StoryReader = dynamic(() => import("./StoryReader"));
type Panel =
  | "capture"
  | "journal"
  | "settings"
  | "search"
  | "group"
  | "compose"
  | "record"
  | "place"
  | "chapter"
  | "nahuatl"
  | "story"
  | "finish"
  | null;
type Props = {
  initialUser: FieldState["me"] | null;
  guest: boolean;
  demo: boolean;
  initialMode: string;
  invite: string;
};
const validModes = ["home", "solo", "friends", "community"];
function Game({ initialUser, guest, demo, initialMode, invite }: Props) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const copy = (value: Copy) => value[locale === "es" ? 0 : 1];
  const [kind, setKind] = useState<"account" | "guest" | "demo">(
    demo ? "demo" : guest ? "guest" : "account",
  );
  const [authenticated, setAuthenticated] = useState(!!initialUser);
  const [state, setState] = useState<FieldState>(() =>
    demo
      ? demoState()
      : emptyState(guest ? undefined : initialUser || undefined),
  );
  const [mode, setMode] = useState<Mode>(
    validModes.includes(initialMode) ? (initialMode as Mode) : "home",
  );
  const [panel, setPanel] = useState<Panel>(invite ? "group" : null),
    [groupId, setGroupId] = useState("");
  const [scope, setScope] = useState<"group" | "global">("global"),
    [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null),
    [picking, setPicking] = useState(false),
    [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(kind === "account" && authenticated),
    [error, setError] = useState("");
  const [notice, setNotice] = useState<Copy | null>(null),
    [query, setQuery] = useState(""),
    [now, setNow] = useState(Date.now());
  const [inviteCode, setInviteCode] = useState(invite),
    [groupName, setGroupName] = useState("");
  const map = useRef<MapHandle>(null),
    mutation = useRef(false),
    generation = useRef(0),
    clockOffset = useRef(0),
    retryCommand = useRef<{ signature: string; id: string } | null>(null),
    sheetTouch = useRef<number | null>(null),
    demoLearning = useRef<Record<string, FieldState["learning"]>>({});
  const group = state.groups.find((g) => g.id === groupId) || state.groups[0];
  const own = state.records.filter((r) => r.owner === state.me.id);
  const goal = GOALS.find((g) => g.id === state.goal);
  const points =
    mode === "friends" && group
      ? groupPoints(group, state.me.id)
      : personalPoints(state);
  const visibleRecords = useMemo(
    () =>
      mode === "community"
        ? scope === "global"
          ? state.publicRecords
          : state.records.filter((r) => r.groupId === group?.id)
        : mode === "friends"
          ? state.records.filter((r) => r.groupId === group?.id)
          : state.records.filter((r) => r.owner === state.me.id),
    [mode, scope, state.publicRecords, state.records, state.me.id, group?.id],
  );
  const selectedRecord = [
    ...state.records,
    ...state.publicRecords,
    ...state.moderation,
  ].find((r) => r.id === selected);
  const story = STORIES.find((s) => s.id === selected);
  const captureChallenge = state.groups
    .find((g) => g.id === draft?.groupId)
    ?.challenges.find((c) => c.id === draft?.challengeId);
  const labels: Record<Mode, Copy> = {
    home: ["Inicio", "Home"],
    solo: ["Aventura", "Adventure"],
    friends: ["Amigos", "Friends"],
    community: ["Comunidad", "Community"],
  };
  const panelTitles: Record<NonNullable<Panel>, Copy> = {
    capture: ["Guardar hallazgo", "Keep discovery"],
    journal: ["Mi bitácora", "My logbook"],
    settings: ["Tu cuenta", "Your account"],
    search: ["Buscar en tu mapa", "Search your map"],
    group: ["Tu grupo", "Your group"],
    compose: ["Lanzar un reto", "Send a challenge"],
    record: ["Tu hallazgo", "Your discovery"],
    place: ["Un lugar por descubrir", "A place to discover"],
    chapter: ["Entender la ciudad", "Understand the city"],
    nahuatl: ["Náhuatl", "Nahuatl"],
    story: ["Historia", "Story"],
    finish: ["Tu salida", "Your outing"],
  };
  function updateUrl(
    nextMode: Mode,
    nextPanel: Panel,
    item = selected,
    replace = false,
  ) {
    const url = new URL(window.location.href);
    url.search = "";
    if (kind !== "account")
      url.searchParams.set(kind === "guest" ? "guest" : "demo", "1");
    url.searchParams.set("mode", nextMode);
    if (nextPanel) url.searchParams.set("panel", nextPanel);
    if (item && nextPanel) url.searchParams.set("item", item);
    window.history[replace ? "replaceState" : "pushState"](
      { cdmx: true },
      "",
      url,
    );
  }
  function show(next: Panel, item = selected) {
    setPanel(next);
    setSelected(item);
    updateUrl(mode, next, item);
  }
  function close() {
    setPanel(null);
    setPicking(false);
    updateUrl(mode, null, "", true);
  }
  function navigate(next: Mode) {
    setMode(next);
    setPanel(null);
    setPicking(false);
    setExpanded(false);
    updateUrl(next, null, "");
  }
  useEffect(() => {
    const pop = () => {
      const params = new URLSearchParams(location.search);
      const m = params.get("mode");
      setMode(validModes.includes(m || "") ? (m as Mode) : "home");
      setPanel(null);
      setPicking(false);
      setSelected("");
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  const refresh = useCallback(async () => {
    if (mutation.current) return;
    const version = ++generation.current;
    try {
      const response = await fetch("/api/mexico-city/state", {
        cache: "no-store",
      });
      if (response.status === 401) {
        if (version === generation.current) setAuthenticated(false);
        throw new Error("sign_in_required");
      }
      if (!response.ok) throw new Error("service_unavailable");
      const data: FieldState = await response.json();
      if (version === generation.current && !mutation.current) {
        clockOffset.current = data.serverTime - Date.now();
        setNow(data.serverTime);
        setState(data);
        setError("");
        setAuthenticated(true);
      }
    } catch (error) {
      if (version === generation.current)
        setError(
          error instanceof Error ? error.message : "service_unavailable",
        );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (kind !== "account" || !authenticated) return;
    void refresh();
    const interval = setInterval(() => {
      if (!document.hidden) void refresh();
    }, 30000);
    const focus = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener("visibilitychange", focus);
    window.addEventListener("focus", focus);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", focus);
      window.removeEventListener("focus", focus);
    };
  }, [kind, authenticated, refresh]);
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now() + clockOffset.current);
      if (kind !== "account")
        setState((previous) => expireChallenges(previous, Date.now()));
    }, 10000);
    return () => clearInterval(timer);
  }, [kind]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    if (kind !== "guest" || mode !== "community") return;
    const controller = new AbortController();
    fetch("/api/mexico-city/community", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const data = await r.json();
        setState((s) => ({
          ...s,
          publicRecords: data.records,
          publicRanks: data.ranks,
        }));
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("service_unavailable");
      });
    return () => controller.abort();
  }, [kind, mode]);
  const send: Send = async (command) => {
    if (mutation.current) return false;
    mutation.current = true;
    generation.current++;
    setBusy(true);
    setError("");
    try {
      const signature = JSON.stringify(command);
      const id =
        command.id ||
        (retryCommand.current?.signature === signature
          ? retryCommand.current.id
          : crypto.randomUUID());
      retryCommand.current = { signature, id };
      const payload = { ...command, id };
      if (kind === "account") {
        const response = await fetch("/api/mexico-city/command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.status === 401) {
          setAuthenticated(false);
          throw new Error("sign_in_required");
        }
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            typeof data.detail === "string"
              ? data.detail
              : "service_unavailable",
          );
        clockOffset.current = data.serverTime - Date.now();
        setNow(data.serverTime);
        setState(data);
      } else setState(demoCommand(state, payload));
      retryCommand.current = null;
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "service_unavailable");
      return false;
    } finally {
      mutation.current = false;
      setBusy(false);
    }
  };
  function capture(
    challengeId?: string,
    category: Category = goal?.category || "art",
  ) {
    const next = newDraft();
    next.category = category;
    if (challengeId && group) {
      next.challengeId = challengeId;
      next.groupId = group.id;
      next.title =
        group.challenges.find((c) => c.id === challengeId)?.title || "";
    }
    if (story && (panel === "place" || panel === "story")) {
      next.category = "history";
      next.place = storyById(story.id, locale).place;
      next.point = { lat: story.coordinate[1], lng: story.coordinate[0] };
    }
    setDraft(next);
    show("capture");
  }
  async function saveRecord() {
    if (!draft?.point) return;
    const result = await send({
      kind: "record",
      id: draft.id,
      title: draft.title.trim(),
      category: draft.category,
      note: draft.note.trim(),
      place: draft.place.trim(),
      lat: draft.point.lat,
      lng: draft.point.lng,
      photo: draft.photo,
      publish: kind !== "guest" && draft.publish,
      ...(draft.challengeId
        ? { challengeId: draft.challengeId, groupId: draft.groupId }
        : {}),
    });
    if (result) {
      setNotice(
        draft.challengeId
          ? [
              "+30 en tu bitácora · reto enviado a revisión",
              "+30 in your logbook · challenge sent for review",
            ]
          : [
              "¡Un lugar más que ya es parte de tu historia! +30",
              "One more place that’s part of your story! +30",
            ],
      );
      setDraft(null);
      close();
    }
  }
  function startGuest() {
    generation.current++;
    retryCommand.current = null;
    clockOffset.current = 0;
    setKind("guest");
    setState(emptyState());
    setError("");
    setPanel(null);
    setMode("home");
    window.history.replaceState({}, "", "/mexico-city/play?guest=1");
  }
  function signIn() {
    generation.current++;
    retryCommand.current = null;
    setState(emptyState());
    setDraft(null);
    setKind("account");
    setAuthenticated(false);
    setPanel(null);
    window.history.replaceState({}, "", `/mexico-city/play?mode=${mode}`);
  }
  function selectRecord(id: string, type: "story" | "record") {
    const r =
      type === "story"
        ? STORIES.find((s) => s.id === id)
        : visibleRecords.find((r) => r.id === id);
    if (r && "coordinate" in r)
      map.current?.focus({ lat: r.coordinate[1], lng: r.coordinate[0] }, 15);
    else if (r) map.current?.focus(r, 15);
    show(type === "story" ? "place" : "record", id);
  }
  const award = (id: LearningId) => send({ kind: "learn", learningId: id });
  if (kind === "account" && !authenticated)
    return (
      <main className="mc-entry" lang={locale === "es" ? "es-MX" : "en"}>
        <LanguageSwitch />
        <FieldLogin
          next="/mexico-city/play"
          success={async () => {
            setAuthenticated(true);
            await refresh();
          }}
          guest={startGuest}
        />
      </main>
    );
  const liveChallenges =
    group?.challenges
      .filter(
        (c) =>
          !["declined", "expired", "forfeited", "incomplete"].includes(
            c.status,
          ),
      )
      .slice()
      .reverse() || [];
  const contributions = mode === "community" ? visibleRecords : own;
  const categoriesFound = new Set(contributions.map((r) => r.category));
  const communityRanks =
    state.publicRanks ??
    Object.values(
      state.publicRecords.reduce<
        Record<string, { name: string; count: number }>
      >((acc, r) => {
        acc[r.owner] ||= { name: r.name, count: 0 };
        acc[r.owner].count++;
        return acc;
      }, {}),
    ).sort((a, b) => b.count - a.count);
  const modeIcons = {
    home: Home,
    solo: Compass,
    friends: Swords,
    community: Paintbrush,
  };
  return (
    <main
      className={`mc-game ${expanded ? "is-expanded" : ""} ${picking ? "is-picking" : ""}`}
      lang={locale === "es" ? "es-MX" : "en"}
    >
      <FieldMap
        ref={map}
        records={visibleRecords}
        selected={selected}
        select={selectRecord}
        painted={mode === "community"}
        picking={picking}
        pick={(point) => {
          if (draft) setDraft({ ...draft, point });
          setPicking(false);
          setPanel("capture");
        }}
      />
      <header className="mc-game-header">
        <Link href="/mexico-city" className="mc-brand">
          <GameName />
        </Link>
        <div>
          <LanguageSwitch />
          <button
            className="mc-icon-button"
            onClick={() => show("search")}
            aria-label={say("Buscar", "Search")}
          >
            <Search size={20} />
          </button>
          <button
            className="mc-avatar"
            onClick={() => show("settings")}
            aria-label={say("Cuenta y ajustes", "Account and settings")}
          >
            {state.me.name.slice(0, 1)}
          </button>
        </div>
      </header>
      {kind !== "account" && (
        <div className="mc-session-banner">
          {kind === "demo"
            ? say(
                "Demo · datos de ejemplo · sin guardar",
                "Demo · sample data · not saved",
              )
            : say(
                "Salida de prueba · solo esta sesión",
                "Trial outing · this session only",
              )}
          {kind === "demo" ? (
            <button
              onClick={() => {
                const nextId = state.me.id === "susy" ? "stepan" : "susy";
                demoLearning.current[state.me.id] = state.learning;
                setState({
                  ...state,
                  me: {
                    id: nextId,
                    name: nextId === "susy" ? "Susy" : "Stepan",
                    admin: true,
                  },
                  learning: demoLearning.current[nextId] || {},
                  goal: null,
                });
              }}
            >
              {say("Jugar como", "Play as")}{" "}
              {state.me.id === "susy" ? "Stepan" : "Susy"} ↔
            </button>
          ) : (
            <button onClick={signIn}>{say("Entrar", "Sign in")} ↗</button>
          )}
        </div>
      )}
      {!picking && (
        <>
          <div className="mc-points-hud">
            <Sparkles size={18} />
            <strong>{points}</strong>
            <span>
              {mode === "friends"
                ? say("en este grupo", "in this group")
                : say("tu aventura", "your adventure")}
            </span>
            <button
              onClick={() => show("journal")}
              aria-label={say("Abrir bitácora", "Open logbook")}
            >
              <BookOpen size={18} />
            </button>
          </div>
          <button
            className="mc-capture-fab"
            onClick={() => (draft ? show("capture") : capture())}
            aria-label={
              draft
                ? say("Continuar hallazgo", "Continue discovery")
                : say("Guardar un hallazgo", "Keep a discovery")
            }
          >
            <Camera size={23} />
          </button>
        </>
      )}
      {picking && (
        <button
          className="mc-pick-back mc-secondary"
          onClick={() => {
            setPicking(false);
            setPanel("capture");
          }}
        >
          {say("Volver a mi foto", "Back to my photo")}
        </button>
      )}
      {notice && (
        <div className="mc-toast" role="status">
          <Sparkles size={20} />
          <span>{copy(notice)}</span>
          <button
            onClick={() => setNotice(null)}
            aria-label={say("Cerrar", "Close")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {!picking && (
        <section className="mc-game-sheet" aria-label={copy(labels[mode])}>
          <button
            className="mc-sheet-handle"
            aria-label={
              expanded
                ? say("Reducir panel", "Collapse panel")
                : say("Ampliar panel", "Expand panel")
            }
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
            onTouchStart={(e) => {
              sheetTouch.current = e.touches[0].clientY;
            }}
            onTouchEnd={(e) => {
              if (
                sheetTouch.current !== null &&
                Math.abs(e.changedTouches[0].clientY - sheetTouch.current) > 25
              )
                setExpanded(e.changedTouches[0].clientY < sheetTouch.current);
              sheetTouch.current = null;
            }}
          >
            <span />
          </button>
          <div className="mc-sheet-scroll">
            {error && (
              <div className="mc-error" role="alert">
                <p>{copy(ERRORS[error] || ERRORS.service_unavailable)}</p>
                {kind === "account" && (
                  <button onClick={() => void refresh()}>
                    {say("Volver a conectar", "Reconnect")}
                  </button>
                )}
                <button
                  onClick={() => setError("")}
                  aria-label={say("Cerrar aviso", "Dismiss notice")}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {loading && (
              <p role="status">
                {say("Abriendo tu aventura…", "Opening your adventure…")}
              </p>
            )}
            {mode === "home" && (
              <>
                <div className="mc-row">
                  <p className="mc-eyebrow">
                    {say("Hoy, un poquito más lejos", "A little further today")}
                  </p>
                  <span className="mc-day-mark">CDMX / 01</span>
                </div>
                <h1>{say("¿Y si doblas aquí?", "What if you turn here?")}</h1>
                <p className="mc-intro">
                  {say(
                    "Tu siguiente hallazgo no está en esta pantalla.",
                    "Your next discovery is beyond this screen.",
                  )}
                </p>
                <button
                  className="mc-featured-goal"
                  onClick={() => {
                    navigate("solo");
                    setExpanded(true);
                  }}
                >
                  <Artwork id={(goal || GOALS[0]).art} sizes="140px" />
                  <div>
                    <span>
                      {say("Una excusa para salir", "A reason to head out")}
                    </span>
                    <h2>{copy((goal || GOALS[0]).title)}</h2>
                    <small>{copy((goal || GOALS[0]).duration)}</small>
                    <b>
                      {say("Elegir mi salida", "Choose my outing")}{" "}
                      <ArrowRight size={16} />
                    </b>
                  </div>
                </button>
                <div className="mc-home-links">
                  <button onClick={() => navigate("friends")}>
                    <Swords size={20} />
                    <span>
                      {say(
                        "Alguien tiene un reto para ti",
                        "A challenge between friends",
                      )}
                      <small>
                        {group
                          ? group.name
                          : say(
                              "Crea tu primer grupo",
                              "Create your first group",
                            )}
                      </small>
                    </span>
                    <ArrowUpRight size={18} />
                  </button>
                  <button onClick={() => navigate("community")}>
                    <Paintbrush size={20} />
                    <span>
                      {say(
                        "Lo que encontramos juntos",
                        "What we find together",
                      )}
                      <small>{say("Pinta la ciudad", "Paint the city")}</small>
                    </span>
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </>
            )}
            {mode === "solo" && (
              <>
                <p className="mc-eyebrow">
                  {say("Tu aventura", "Your adventure")}
                </p>
                <h1>
                  {goal
                    ? copy(goal.title)
                    : say(
                        "¿Qué se te antoja descubrir?",
                        "What would you like to discover?",
                      )}
                </h1>
                {goal ? (
                  <>
                    <p>{copy(goal.description)}</p>
                    <div className="mc-row">
                      <span className="mc-tag">{copy(goal.duration)}</span>
                      <strong className="mc-reward">+30</strong>
                    </div>
                    <button className="mc-primary" onClick={() => capture()}>
                      <Camera size={18} />
                      {say("Ya encontré algo", "I found something")}
                    </button>
                    {goal.point && (
                      <div className="mc-button-pair">
                        <button
                          className="mc-secondary"
                          onClick={() => {
                            map.current?.focus(goal.point!);
                            setExpanded(false);
                          }}
                        >
                          {say("Ubicar en el mapa", "Find on the map")}
                        </button>
                        <a
                          className="mc-secondary"
                          href={directions(goal.point, "transit")}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {say("Cómo llegar", "Directions")} ↗
                        </a>
                      </div>
                    )}
                    <button
                      className="mc-text-button"
                      disabled={busy}
                      onClick={() => void send({ kind: "goal", goalId: null })}
                    >
                      {say("Elegir otra salida", "Choose another outing")}
                    </button>
                  </>
                ) : (
                  <div className="mc-goal-list">
                    {GOALS.map((g) => (
                      <button
                        key={g.id}
                        disabled={busy}
                        onClick={async () => {
                          if (await send({ kind: "goal", goalId: g.id })) {
                            if (g.point) map.current?.focus(g.point);
                            setExpanded(false);
                          }
                        }}
                      >
                        <Artwork id={g.art} sizes="88px" />
                        <span>
                          <strong>{copy(g.title)}</strong>
                          <small>{copy(g.duration)}</small>
                        </span>
                        <ArrowRight size={18} />
                      </button>
                    ))}
                  </div>
                )}
                <div className="mc-section-heading">
                  <h2>
                    {say(
                      "Tu mirada, en números",
                      "Your perspective, in numbers",
                    )}
                  </h2>
                  <button
                    onClick={() => show("journal")}
                    aria-label={say("Abrir bitácora", "Open logbook")}
                  >
                    <BookOpen size={19} />
                  </button>
                </div>
                <div className="mc-stat-line">
                  <span>
                    <b>{own.length}</b>
                    {say("hallazgos", "discoveries")}
                  </span>
                  <span>
                    <b>{new Set(own.map((r) => r.category)).size}/5</b>
                    {say("categorías", "categories")}
                  </span>
                  <span>
                    <b>{personalPoints(state)}</b>
                    {say("puntos personales", "personal points")}
                  </span>
                </div>
                {own.length >= 3 && (
                  <p className="mc-note">
                    {new Set(own.map((r) => r.category)).size === 1
                      ? say(
                          "Tus hallazgos tienen algo en común. ¿Te animas a buscar otra cosa hoy?",
                          "Your discoveries have something in common. Try something different today?",
                        )
                      : say(
                          "Tu bitácora ya mezcla distintas miradas de la ciudad. Sigue esa curiosidad.",
                          "Your logbook already mixes different perspectives on the city. Follow that curiosity.",
                        )}
                  </p>
                )}
                <div className="mc-learning-links">
                  <p className="mc-eyebrow">
                    {say(
                      "Para cuando te dé curiosidad · opcional",
                      "For when you’re curious · optional",
                    )}
                  </p>
                  <button onClick={() => show("chapter")}>
                    <MapPin size={18} />
                    {say(
                      "Por qué la ciudad tiene esta forma",
                      "Why the city has this shape",
                    )}
                    <ArrowUpRight size={17} />
                  </button>
                  <button onClick={() => show("nahuatl")}>
                    <BookOpen size={18} />
                    {say("Un poquito de náhuatl", "A little Nahuatl")}
                    <ArrowUpRight size={17} />
                  </button>
                </div>
                {kind === "guest" && (
                  <button
                    className="mc-secondary"
                    onClick={() => show("finish")}
                  >
                    {say("Terminar mi salida", "Finish my outing")}
                  </button>
                )}
              </>
            )}
            {mode === "friends" && (
              <>
                <p className="mc-eyebrow">
                  {say("Retos entre amigos", "Challenges with friends")}
                </p>
                <h1>
                  {say("A ver qué encuentras.", "Let’s see what you find.")}
                </h1>
                {kind === "guest" ? (
                  <div className="mc-empty">
                    <Users size={32} />
                    <h2>
                      {say(
                        "Mejor con alguien conocido.",
                        "Better with someone you know.",
                      )}
                    </h2>
                    <p>
                      {say(
                        "Tu salida sin cuenta es individual. Entra para crear un grupo, proponer retos y confirmar las fotos de tus amigos.",
                        "Your guest outing is solo. Sign in to create a group, send challenges and confirm friends’ photos.",
                      )}
                    </p>
                    <button className="mc-primary" onClick={signIn}>
                      {say("Entrar con mi cuenta", "Sign in")}
                    </button>
                    <Link
                      className="mc-text-button"
                      href="/mexico-city/play?demo=1&mode=friends"
                    >
                      {say(
                        "Ver una partida de ejemplo",
                        "Explore a sample game",
                      )}{" "}
                      ↗
                    </Link>
                  </div>
                ) : !group ? (
                  <div className="mc-empty">
                    <Swords size={35} />
                    <h2>
                      {say(
                        "Tu gente. Sus ocurrencias.",
                        "Your people. Their ideas.",
                      )}
                    </h2>
                    <p>
                      {say(
                        "Invita a alguien y conviertan sus próximas salidas en retos.",
                        "Invite someone and turn your next outings into challenges.",
                      )}
                    </p>
                    <button
                      className="mc-primary"
                      onClick={() => show("group")}
                    >
                      <Plus size={18} />
                      {say(
                        "Crear o unirme a un grupo",
                        "Create or join a group",
                      )}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mc-row">
                      <button
                        className="mc-group-button"
                        onClick={() => show("group")}
                      >
                        <Users size={17} />
                        {group.name}
                        <ChevronDown size={16} />
                      </button>
                      <button
                        className="mc-icon-button"
                        onClick={() => show("compose")}
                        aria-label={say("Lanzar reto", "Send challenge")}
                      >
                        <Plus size={22} />
                      </button>
                    </div>
                    <div className="mc-scoreboard">
                      {group.members
                        .slice()
                        .sort(
                          (a, b) =>
                            groupPoints(group, b.id) - groupPoints(group, a.id),
                        )
                        .map((m, i) => (
                          <div
                            key={m.id}
                            className={m.id === state.me.id ? "is-you" : ""}
                          >
                            <span>
                              {i === 0 ? <Trophy size={17} /> : i + 1}
                            </span>
                            <b>{m.name}</b>
                            <strong>{groupPoints(group, m.id)}</strong>
                          </div>
                        ))}
                    </div>
                    <button
                      className="mc-primary"
                      onClick={() => show("compose")}
                    >
                      <Swords size={17} />
                      {say(
                        "Tengo un reto para ti",
                        "I have a challenge for you",
                      )}
                    </button>
                    {group.blocks.map((b) => (
                      <p className="mc-note" key={b.id}>
                        {group.members.find((m) => m.id === b.target)?.name}:{" "}
                        {copy(
                          CATEGORIES.find((c) => c.id === b.category)!.name,
                        )}{" "}
                        · {say("en pausa hasta", "paused until")}{" "}
                        {new Date(b.until).toLocaleTimeString(locale, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    ))}
                    {liveChallenges.length ? (
                      liveChallenges.map((c) => (
                        <ChallengeCard
                          key={c.id}
                          challenge={c}
                          group={group}
                          me={state.me.id}
                          records={state.records}
                          send={send}
                          busy={busy}
                          now={now}
                          capture={() => capture(c.id, c.category)}
                        />
                      ))
                    ) : (
                      <p className="mc-empty">
                        {say(
                          "Todavía no hay retos. Empieza con algo que haría sonreír a la otra persona.",
                          "No challenges yet. Start with something that would make your friend smile.",
                        )}
                      </p>
                    )}
                    <details className="mc-past-challenges">
                      <summary>
                        {say("Retos cerrados", "Closed challenges")}
                      </summary>
                      {group.challenges
                        .filter((c) =>
                          [
                            "declined",
                            "expired",
                            "forfeited",
                            "incomplete",
                          ].includes(c.status),
                        )
                        .map((c) => (
                          <ChallengeCard
                            key={c.id}
                            challenge={c}
                            group={group}
                            me={state.me.id}
                            records={state.records}
                            send={send}
                            busy={busy}
                            now={now}
                            capture={() => capture(c.id, c.category)}
                          />
                        ))}
                    </details>
                    <p className="mc-muted">
                      {say(
                        "Aquí cuentan los retos confirmados, no los puntos de lectura ni tu bitácora personal.",
                        "This score counts confirmed challenges, not reading points or your personal logbook.",
                      )}
                    </p>
                  </>
                )}
              </>
            )}
            {mode === "community" && (
              <>
                <p className="mc-eyebrow">
                  {say("Pinta la ciudad", "Paint the city")}
                </p>
                <h1>
                  {say(
                    "Una ciudad. Muchas miradas.",
                    "One city. Many perspectives.",
                  )}
                </h1>
                <div className="mc-segment">
                  <button
                    aria-pressed={scope === "global"}
                    onClick={() => setScope("global")}
                  >
                    {say("Toda CDMX", "All CDMX")}
                  </button>
                  <button
                    aria-pressed={scope === "group"}
                    onClick={() => setScope("group")}
                  >
                    {say("Mi grupo", "My group")}
                  </button>
                </div>
                {scope === "group" && !group ? (
                  <div className="mc-empty">
                    <p>
                      {say(
                        "Los hallazgos de sus retos se reúnen aquí. Creen un grupo para empezar su mapa compartido.",
                        "Your challenge discoveries gather here. Create a group to begin your shared map.",
                      )}
                    </p>
                    <button
                      className="mc-secondary"
                      onClick={() => navigate("friends")}
                    >
                      {say("Ir a Amigos", "Go to Friends")}
                    </button>
                  </div>
                ) : (
                  <>
                    <p>
                      {scope === "group"
                        ? say(
                            `La bitácora compartida de ${group?.name}. Solo la ve su grupo.`,
                            `The shared logbook of ${group?.name}. Only your group can see it.`,
                          )
                        : say(
                            "Cada hallazgo aprobado añade una nueva mirada al mapa. El siguiente rincón puede ser el tuyo.",
                            "Every approved discovery adds another perspective to the map. The next corner could be yours.",
                          )}
                    </p>
                    <div
                      className="mc-paint-progress"
                      aria-label={say(
                        "Categorías descubiertas",
                        "Categories discovered",
                      )}
                    >
                      {CATEGORIES.map((c) => (
                        <span
                          key={c.id}
                          title={copy(c.name)}
                          style={{
                            background: categoriesFound.has(c.id)
                              ? c.color
                              : "#e8ece6",
                          }}
                        />
                      ))}
                    </div>
                    <div className="mc-row">
                      <strong>
                        {contributions.length}{" "}
                        {scope === "global"
                          ? say(
                              "hallazgos recientes · hasta 300",
                              "recent discoveries · up to 300",
                            )
                          : say("hallazgos compartidos", "shared discoveries")}
                      </strong>
                      <small>
                        {categoriesFound.size}/5{" "}
                        {say("miradas", "perspectives")}
                      </small>
                    </div>
                    <div className="mc-community-goal">
                      <p className="mc-eyebrow">
                        {say(
                          "Una meta común · cinco miradas de la ciudad",
                          "A shared goal · five perspectives on the city",
                        )}
                      </p>
                      <h2>
                        {copy(
                          GOALS.find((g) => !categoriesFound.has(g.category))
                            ?.title || GOALS[0].title,
                        )}
                      </h2>
                      <p>
                        {say(
                          "Completa una salida y, si quieres, propón tu foto para la bitácora de la ciudad.",
                          "Complete an outing and, if you like, propose your photo for the city logbook.",
                        )}
                      </p>
                      <button
                        className="mc-secondary"
                        onClick={() => navigate("solo")}
                      >
                        {say("Elegir una salida", "Choose an outing")}
                        <ArrowRight size={16} />
                      </button>
                    </div>
                    <div className="mc-photo-grid">
                      {contributions.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => selectRecord(r.id, "record")}
                        >
                          <img src={r.photo} alt="" />
                          <strong>{r.title}</strong>
                          <small>{r.name}</small>
                        </button>
                      ))}
                    </div>
                    {!contributions.length && (
                      <p className="mc-empty">
                        {say(
                          "El mapa todavía espera su primera foto.",
                          "The map is waiting for its first photo.",
                        )}
                      </p>
                    )}
                    {scope === "global" && (
                      <>
                        <h2>
                          {say(
                            "Quienes le ponen color",
                            "People adding colour",
                          )}
                        </h2>
                        {communityRanks.length ? (
                          communityRanks.map((r, i) => (
                            <div className="mc-rank" key={i}>
                              <span>{i + 1}</span>
                              <b>{r.name}</b>
                              <strong>{r.count * 30} pts</strong>
                            </div>
                          ))
                        ) : (
                          <p className="mc-muted">
                            {say(
                              "La clasificación empieza con los primeros hallazgos aprobados. +30 por contribución.",
                              "Rankings start with the first approved discoveries. +30 per contribution.",
                            )}
                          </p>
                        )}
                        {state.me.admin &&
                          state.moderation
                            .filter((r) => r.owner !== state.me.id)
                            .map((r) => (
                              <article className="mc-moderation" key={r.id}>
                                <h3>
                                  {say("En revisión", "Awaiting review")}:{" "}
                                  {r.title}
                                </h3>
                                <img src={r.photo} alt={r.title} />
                                <p>
                                  {r.name} · {r.place}
                                </p>
                                <p>{r.note}</p>
                                <div className="mc-button-pair">
                                  <button
                                    className="mc-primary"
                                    disabled={busy}
                                    onClick={() =>
                                      void send({
                                        kind: "moderate",
                                        recordId: r.id,
                                        decision: "confirm",
                                      })
                                    }
                                  >
                                    {say(
                                      "Aprobar publicación",
                                      "Approve publication",
                                    )}
                                  </button>
                                  <button
                                    className="mc-secondary"
                                    disabled={busy}
                                    onClick={() =>
                                      void send({
                                        kind: "moderate",
                                        recordId: r.id,
                                        decision: "reject",
                                      })
                                    }
                                  >
                                    {say("No publicar", "Don’t publish")}
                                  </button>
                                </div>
                              </article>
                            ))}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </section>
      )}
      {!picking && (
        <nav
          className="mc-bottom-nav"
          aria-label={say("Modos del juego", "Game modes")}
        >
          {(Object.keys(labels) as Mode[]).map((m) => {
            const Icon = modeIcons[m];
            return (
              <button
                key={m}
                aria-current={mode === m ? "page" : undefined}
                onClick={() => navigate(m)}
              >
                <Icon size={22} strokeWidth={mode === m ? 2.4 : 1.6} />
                <span>{copy(labels[m])}</span>
                {m === "friends" &&
                  group?.challenges.some(
                    (c) => c.target === state.me.id && c.status === "offered",
                  ) && <i />}
              </button>
            );
          })}
        </nav>
      )}
      {panel &&
        !["chapter", "nahuatl", "story"].includes(panel) &&
        !picking && (
          <GameDialog
            label={copy(panelTitles[panel])}
            close={close}
            className="mc-task-dialog"
          >
            {error && (
              <p className="mc-error" role="alert">
                {copy(ERRORS[error] || ERRORS.service_unavailable)}
              </p>
            )}
            {panel === "capture" && draft && (
              <Capture
                draft={draft}
                change={setDraft}
                pick={() => {
                  setPanel(null);
                  setPicking(true);
                  if (draft.point) map.current?.focus(draft.point, 16);
                }}
                submit={() => void saveRecord()}
                busy={busy}
                guest={kind === "guest"}
                challenge={captureChallenge}
              />
            )}
            {panel === "compose" && group && (
              <ChallengeComposer
                group={group}
                me={state.me.id}
                send={send}
                busy={busy}
                done={close}
              />
            )}
            {panel === "record" && selectedRecord && (
              <RecordDetails
                record={selectedRecord}
                own={selectedRecord.owner === state.me.id && kind !== "guest"}
                send={send}
                busy={busy}
              />
            )}
            {panel === "journal" && (
              <>
                <p className="mc-eyebrow">
                  {state.me.name} · {personalPoints(state)} pts
                </p>
                <h2>{say("Mi bitácora", "My logbook")}</h2>
                <p>
                  {say(
                    "Las pequeñas cosas que hicieron tu ciudad más grande.",
                    "The little things that made your city bigger.",
                  )}
                </p>
                {own.length ? (
                  <div className="mc-photo-grid">
                    {own
                      .slice()
                      .reverse()
                      .map((r) => (
                        <button key={r.id} onClick={() => show("record", r.id)}>
                          <img src={r.photo} alt="" />
                          <strong>{r.title}</strong>
                          <small>{r.place}</small>
                        </button>
                      ))}
                  </div>
                ) : (
                  <div className="mc-empty">
                    <Camera size={38} />
                    <p>
                      {say(
                        "Tu primera página está allá afuera.",
                        "Your first page is out there.",
                      )}
                    </p>
                    <button className="mc-primary" onClick={() => capture()}>
                      {say(
                        "Guardar mi primer hallazgo",
                        "Keep my first discovery",
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
            {panel === "place" && story && (
              <>
                <Artwork id={story.id} className="mc-place-art" sizes="400px" />
                <p className="mc-eyebrow">
                  {say(
                    "Una historia para mirar distinto",
                    "A story to look differently",
                  )}
                </p>
                <h2>{storyById(story.id, locale).place}</h2>
                <p>{storyById(story.id, locale).prompt}</p>
                <div className="mc-button-pair">
                  <a
                    className="mc-primary"
                    href={directions(
                      { lat: story.coordinate[1], lng: story.coordinate[0] },
                      "transit",
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {say("Cómo llegar", "Get directions")}
                    <ArrowUpRight size={16} />
                  </a>
                  <button
                    className="mc-secondary"
                    onClick={() => show("story")}
                  >
                    {say("La historia del lugar", "The place’s story")}
                  </button>
                </div>
                <button className="mc-text-button" onClick={() => capture()}>
                  <Camera size={18} />
                  {say(
                    "Ya estoy aquí · guardar foto",
                    "I’m here · keep a photo",
                  )}
                </button>
                <p className="mc-muted">
                  {storyById(story.id, locale).practical}
                </p>
              </>
            )}
            {panel === "search" && (
              <>
                <p className="mc-eyebrow">
                  {say(
                    "Historias y hallazgos de este mapa",
                    "Stories and discoveries on this map",
                  )}
                </p>
                <h2>
                  {say("¿Qué estás buscando?", "What are you looking for?")}
                </h2>
                <label>
                  {say("Buscar por nombre o lugar", "Search by name or place")}
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Zócalo, Chapultepec…"
                  />
                </label>
                <div className="mc-search-results">
                  {STORIES.filter((s) =>
                    `${s.place} ${storyById(s.id, locale).title}`
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  ).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => selectRecord(s.id, "story")}
                    >
                      <MapPin size={18} />
                      <span>
                        {storyById(s.id, locale).place}
                        <small>
                          {say("Historia y salida", "Story and outing")}
                        </small>
                      </span>
                      <ArrowRight size={16} />
                    </button>
                  ))}
                  {visibleRecords
                    .filter((r) =>
                      `${r.title} ${r.place}`
                        .toLowerCase()
                        .includes(query.toLowerCase()),
                    )
                    .map((r) => (
                      <button
                        key={r.id}
                        onClick={() => selectRecord(r.id, "record")}
                      >
                        <Camera size={18} />
                        <span>
                          {r.title}
                          <small>{r.place}</small>
                        </span>
                        <ArrowRight size={16} />
                      </button>
                    ))}
                </div>
                <small>
                  {say(
                    "Esta búsqueda cubre el contenido del juego. Para negocios y rutas actualizadas, abre Cómo llegar desde un lugar.",
                    "This search covers game content. For businesses and updated routes, open directions from a place.",
                  )}
                </small>
              </>
            )}
            {panel === "group" && (
              <>
                <p className="mc-eyebrow">
                  {say(
                    "Un círculo pequeño. Toda una ciudad.",
                    "A small circle. A whole city.",
                  )}
                </p>
                <h2>{say("Tu grupo", "Your group")}</h2>
                {state.groups.map((g) => (
                  <button
                    className="mc-group-choice"
                    key={g.id}
                    onClick={() => {
                      setGroupId(g.id);
                      navigate("friends");
                    }}
                  >
                    <Users size={20} />
                    <span>
                      {g.name}
                      <small>{g.members.map((m) => m.name).join(" · ")}</small>
                    </span>
                    {g.id === group?.id && <Check size={18} />}
                  </button>
                ))}
                {group && (
                  <details>
                    <summary>
                      {say("Invitar a alguien a", "Invite someone to")}{" "}
                      {group.name}
                    </summary>
                    <p>
                      {say(
                        "Comparte este enlace solo con quienes quieras en el grupo. Quien lo tenga puede entrar.",
                        "Share this link only with people you want in your group. Anyone with it can join.",
                      )}
                    </p>
                    <button
                      className="mc-secondary"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            `${location.origin}/mexico-city/play?invite=${encodeURIComponent(group.invite)}`,
                          );
                          setNotice([
                            "Invitación copiada",
                            "Invitation copied",
                          ]);
                        } catch {
                          setNotice([
                            "No se pudo copiar. Usa el código que aparece abajo.",
                            "Couldn’t copy. Use the code below.",
                          ]);
                        }
                      }}
                    >
                      {say("Copiar invitación", "Copy invitation")}
                    </button>
                    <code className="mc-invite-code">{group.invite}</code>
                  </details>
                )}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (
                      await send({
                        kind: "create_group",
                        title: groupName.trim(),
                      })
                    ) {
                      setGroupName("");
                      navigate("friends");
                    }
                  }}
                >
                  <label>
                    {say("Nombre del nuevo grupo", "New group name")}
                    <input
                      required
                      maxLength={100}
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="Susy + Stepan"
                    />
                  </label>
                  <button className="mc-primary" disabled={busy}>
                    {say("Crear grupo", "Create group")}
                  </button>
                </form>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (
                      await send({
                        kind: "join_group",
                        invite: inviteCode.trim(),
                      })
                    ) {
                      setInviteCode("");
                      navigate("friends");
                    }
                  }}
                >
                  <label>
                    {say(
                      "Tengo un código de invitación",
                      "I have an invitation code",
                    )}
                    <input
                      required
                      value={inviteCode}
                      maxLength={100}
                      onChange={(e) => setInviteCode(e.target.value)}
                    />
                  </label>
                  <button className="mc-secondary" disabled={busy}>
                    {say("Unirme al grupo", "Join group")}
                  </button>
                </form>
              </>
            )}
            {panel === "settings" && (
              <>
                <p className="mc-eyebrow">
                  {say(
                    "Mexico city discovery game · nombre de trabajo",
                    "Mexico city discovery game · working reference",
                  )}
                </p>
                <h2>{state.me.name}</h2>
                <p>
                  {kind === "account"
                    ? say(
                        "Tu bitácora y tus grupos pertenecen a tu cuenta de Fruitful Lab.",
                        "Your logbook and groups belong to your Fruitful Lab account.",
                      )
                    : say(
                        "Esta sesión es temporal. Recargar o cerrar borra sus hallazgos y puntos.",
                        "This session is temporary. Reloading or closing loses its discoveries and points.",
                      )}
                </p>
                <div className="mc-settings-links">
                  <Link href="/mexico-city/game-design">
                    {say("Diseño, reglas y alcance", "Design, rules and scope")}{" "}
                    ↗
                  </Link>
                  <Link href="/mexico-city/atlas">
                    {say(
                      "Atlas ilustrado y fuentes",
                      "Illustrated atlas and sources",
                    )}{" "}
                    ↗
                  </Link>
                  <button onClick={() => show("chapter")}>
                    {say("Entender la ciudad", "Understand the city")} ↗
                  </button>
                </div>
                <p className="mc-muted">
                  {say(
                    "+30 por hallazgo personal. Los retos tienen su propio marcador por grupo. Los quizzes suman solo a tu aventura. No hay multiplicadores.",
                    "+30 per personal discovery. Challenges have a separate score per group. Quizzes add only to your adventure. No multipliers.",
                  )}
                </p>
                {kind === "account" ? (
                  <button
                    className="mc-secondary"
                    onClick={async () => {
                      const response = await fetch("/api/auth/logout", {
                        method: "POST",
                      });
                      if (response.ok) {
                        setState(emptyState());
                        generation.current++;
                        setAuthenticated(false);
                        setDraft(null);
                        close();
                      } else setError("service_unavailable");
                    }}
                  >
                    {say("Cerrar sesión", "Sign out")}
                  </button>
                ) : (
                  <>
                    <button className="mc-primary" onClick={signIn}>
                      {say(
                        "Entrar a mi aventura guardada",
                        "Enter my saved adventure",
                      )}
                    </button>
                    {kind === "demo" && (
                      <button
                        className="mc-secondary"
                        onClick={() => {
                          setState(demoState());
                          demoLearning.current = {};
                          setDraft(null);
                          close();
                        }}
                      >
                        {say("Reiniciar la demo", "Restart demo")}
                      </button>
                    )}
                  </>
                )}
                <small>
                  {say(
                    "El transporte superpuesto es una referencia, no un aviso de operación en vivo. Las indicaciones se abren en Google Maps.",
                    "Transit overlays are reference data, not live service status. Directions open in Google Maps.",
                  )}
                </small>
              </>
            )}
            {panel === "finish" && (
              <>
                <div className="mc-finish-star">
                  <Sparkles size={45} />
                </div>
                <p className="mc-eyebrow">
                  {say("Una salida que ya es tuya", "An outing that’s yours")}
                </p>
                <h2>
                  {say(
                    "Hoy miraste distinto.",
                    "Today you looked differently.",
                  )}
                </h2>
                <div className="mc-stat-line">
                  <span>
                    <b>{own.length}</b>
                    {say("hallazgos", "discoveries")}
                  </span>
                  <span>
                    <b>{personalPoints(state)}</b>
                    {say("puntos", "points")}
                  </span>
                </div>
                <p>
                  {say(
                    "No necesitas una cuenta para que esta salida haya valido la pena. Tu sesión termina al cerrar o recargar; conserva tus fotos originales en tu dispositivo.",
                    "You don’t need an account for this outing to matter. This session ends when you close or reload; keep your original photos on your device.",
                  )}
                </p>
                <button className="mc-primary" onClick={() => show("journal")}>
                  {say("Ver lo que encontré", "See what I found")}
                </button>
                <button className="mc-text-button" onClick={close}>
                  {say("Seguir paseando", "Keep wandering")}
                </button>
              </>
            )}
          </GameDialog>
        )}
      {panel === "chapter" && (
        <OverviewChapter
          close={close}
          learning={state.learning}
          award={award}
          player={state.me.name}
          total={personalPoints(state)}
          nahuatl={() => show("nahuatl")}
        />
      )}
      {panel === "nahuatl" && (
        <NahuatlGames
          close={close}
          learning={state.learning}
          award={award}
          player={state.me.name}
          total={personalPoints(state)}
        />
      )}
      {panel === "story" && story && (
        <StoryReader
          id={story.id}
          collected={false}
          collect={() => capture(undefined, "history")}
          close={close}
          fieldwork={() => capture(undefined, "history")}
          outdoor
        />
      )}
    </main>
  );
}
export default function FieldApp(props: Props) {
  return (
    <LocaleProvider>
      <Game {...props} />
    </LocaleProvider>
  );
}
