"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  KeyRound,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  LanguageSwitch,
  LocaleProvider,
  useLocale,
} from "@/lib/mexico-city/locale";
import "./accounts.css";

type Account = {
  updated_at?: string;
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_admin: boolean;
  game_member: boolean;
  status: "active" | "paused" | "pending";
};
type Result = {
  users: Account[];
  total: number;
  email_ready: boolean;
  me: number;
};
function Manager() {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [data, setData] = useState<Result | null>(null);
  const [search, setSearch] = useState("");
  const [gameOnly, setGameOnly] = useState(true);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(false);
  const [selected, setSelected] = useState<Account | null>(null);
  const [creating, setCreating] = useState(false);
  const [issued, setIssued] = useState<{
    url: string;
    email: string;
    expires: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const editor = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);
  const load = useCallback(
    async (signal?: AbortSignal) => {
      const version = ++requestId.current;
      setLoading(true);
      try {
        const response = await fetch(
          `/api/admin/users?${new URLSearchParams({ search, offset: String(offset), game_only: String(gameOnly) })}`,
          { cache: "no-store", signal },
        );
        if (!response.ok)
          throw new Error(
            response.status === 401 || response.status === 403
              ? "access"
              : "service",
          );
        const next: Result = await response.json();
        if (version === requestId.current) setData(next);
      } catch (e) {
        if (!signal?.aborted && version === requestId.current)
          setError(e instanceof Error ? e.message : "service");
      } finally {
        if (version === requestId.current) setLoading(false);
      }
    },
    [search, offset, gameOnly],
  );
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => void load(controller.signal), 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [load]);
  useEffect(() => {
    if (selected || creating || issued) editor.current?.focus();
  }, [selected, creating, issued]);
  const errors: Record<string, [string, string]> = {
    account_exists: [
      "Ese correo ya tiene una cuenta. Búscalo en «Todas las cuentas» para reutilizarla.",
      "That email already has an account. Find it under All accounts to reuse it.",
    ],
    access: [
      "Tu sesión ya no tiene acceso. Vuelve a entrar con una cuenta administradora.",
      "Your session no longer has access. Sign in with an administrator account.",
    ],
    protected_admin: [
      "El acceso de administradores se gestiona fuera de esta pantalla.",
      "Administrator access is managed outside this screen.",
    ],
    password_setup_required: [
      "Esta persona debe elegir su contraseña con el enlace de acceso.",
      "This person must choose a password using their access link.",
    ],
    account_paused: [
      "Reactiva la cuenta antes de crear un enlace de recuperación.",
      "Reactivate the account before creating a recovery link.",
    ],
    invalid: [
      "Revisa el nombre y el correo antes de continuar.",
      "Check the name and email before continuing.",
    ],
    service: [
      "No pudimos cargar las cuentas. Inténtalo de nuevo en un momento.",
      "We couldn’t load accounts. Please try again shortly.",
    ],
  };
  async function mutate(path: string, method: string, body?: object) {
    setBusy(true);
    setError("");
    setNotice(false);
    try {
      const response = await fetch(`/api/admin/users${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body ?? {}),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          typeof result.detail === "string" && errors[result.detail]
            ? result.detail
            : response.status === 422
              ? "invalid"
              : response.status === 401 || response.status === 403
                ? "access"
                : "service",
        );
      await load();
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : "service");
      return null;
    } finally {
      setBusy(false);
    }
  }
  function showLink(
    result: { token: string; expires_at: string },
    email: string,
  ) {
    setIssued({
      url: `${location.origin}/account/reset?lang=${locale}#token=${result.token}`,
      email,
      expires: result.expires_at,
    });
    setCopied(false);
  }
  function open(user?: Account) {
    setSelected(user || null);
    setCreating(!user);
    setIssued(null);
    setError("");
    setNotice(false);
  }
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await mutate("", "POST", {
      email: form.get("email"),
      full_name: String(form.get("name")).trim(),
    });
    if (result) {
      setCreating(false);
      setSelected(result.user);
      showLink(result, result.user.email);
    }
  }
  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const result = await mutate(`/${selected.id}`, "PATCH", {
      full_name: String(form.get("name")).trim(),
      game_member: form.get("game") === "on",
    });
    if (result) {
      setSelected(result);
      setNotice(true);
    }
  }
  function status(user: Account) {
    return user.status === "pending"
      ? say("Falta elegir contraseña", "Password setup pending")
      : user.status === "active"
        ? say("Activa", "Active")
        : say("Pausada", "Paused");
  }
  return (
    <div className="account-workspace" lang={locale === "es" ? "es-MX" : "en"}>
      <header className="account-heading">
        <div>
          <p className="account-kicker">
            FRUITFUL LAB / {say("PERSONAS", "PEOPLE")}
          </p>
          <h1>{say("La aventura se comparte.", "Adventure is shared.")}</h1>
          <p>
            {say(
              "Cuentas para Mexico city discovery game y el resto de Fruitful Lab.",
              "Accounts for Mexico city discovery game and the rest of Fruitful Lab.",
            )}
          </p>
        </div>
        <LanguageSwitch />
      </header>
      <div className="account-toolbar">
        <span>
          <Users size={19} />
          {data ? data.total : "—"} {say("cuentas", "accounts")}
        </span>
        <button
          className="account-primary"
          onClick={() => open()}
          disabled={busy}
        >
          <UserPlus size={18} />
          {say("Crear cuenta", "Create account")}
        </button>
      </div>
      {error && (
        <div className="account-error" role="alert">
          {(errors[error] || errors.service)[locale === "es" ? 0 : 1]}
          {error === "access" ? (
            <Link href="/login?next=/admin/users">
              {say("Entrar", "Sign in")}
            </Link>
          ) : (
            <button
              onClick={() => {
                setError("");
                void load();
              }}
            >
              {say("Reintentar", "Try again")}
            </button>
          )}
        </div>
      )}
      <div className="account-layout">
        <section
          className="account-directory"
          aria-label={say("Lista de cuentas", "Account directory")}
        >
          <div className="account-filters">
            <label className="account-search">
              <Search size={18} />
              <input
                aria-label={say(
                  "Buscar por nombre o correo",
                  "Search name or email",
                )}
                placeholder={say("Nombre o correo", "Name or email")}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setOffset(0);
                }}
              />
            </label>
            <select
              aria-label={say("Mostrar cuentas", "Show accounts")}
              value={gameOnly ? "game" : "all"}
              onChange={(e) => {
                setGameOnly(e.target.value === "game");
                setOffset(0);
              }}
            >
              <option value="game">Mexico city discovery game</option>
              <option value="all">
                {say("Todas las cuentas", "All accounts")}
              </option>
            </select>
          </div>
          <div aria-live="polite" className="account-count">
            {loading
              ? say("Cargando cuentas…", "Loading accounts…")
              : data?.users.length
                ? say(
                    "Elige una persona para administrar su acceso.",
                    "Choose a person to manage their access.",
                  )
                : say(
                    "Todavía no hay cuentas en esta vista.",
                    "There are no accounts in this view yet.",
                  )}
          </div>
          <ul className="account-list">
            {data?.users.map((user) => (
              <li key={user.id}>
                <button
                  disabled={busy}
                  aria-pressed={selected?.id === user.id}
                  onClick={() => open(user)}
                >
                  <span className="account-avatar">
                    {(user.full_name || user.email).slice(0, 1).toUpperCase()}
                  </span>
                  <span className="account-person">
                    <strong>{user.full_name || user.email}</strong>
                    <span>{user.email}</span>
                    <small className={`account-status is-${user.status}`}>
                      {status(user)}{" "}
                      {user.is_admin &&
                        `· ${say("Administrador", "Administrator")}`}
                    </small>
                  </span>
                  <ArrowUpRight size={18} />
                </button>
              </li>
            ))}
          </ul>
          {!!data?.total && (
            <nav
              className="account-pagination"
              aria-label={say("Páginas de cuentas", "Account pages")}
            >
              <button
                disabled={busy || offset === 0}
                onClick={() => setOffset(Math.max(0, offset - 30))}
              >
                {say("Anterior", "Previous")}
              </button>
              <span>
                {offset + 1}–{Math.min(offset + 30, data.total)} / {data.total}
              </span>
              <button
                disabled={busy || offset + 30 >= data.total}
                onClick={() => setOffset(offset + 30)}
              >
                {say("Siguiente", "Next")}
              </button>
            </nav>
          )}
        </section>
        <div ref={editor} tabIndex={-1} className="account-editor">
          {creating || selected ? (
            <>
              <button
                className="account-close"
                aria-label={say("Cerrar editor", "Close editor")}
                onClick={() => {
                  setCreating(false);
                  setSelected(null);
                  setIssued(null);
                }}
                disabled={busy}
              >
                <X size={20} />
              </button>
              <p className="account-kicker">
                {creating
                  ? say("UNA PERSONA MÁS", "ONE MORE PERSON")
                  : say("SU CUENTA", "THEIR ACCOUNT")}
              </p>
              <h2>
                {creating
                  ? say("Invita a descubrir.", "Invite someone to discover.")
                  : selected?.full_name || selected?.email}
              </h2>
              {creating ? (
                <form onSubmit={create}>
                  <label>
                    {say("Nombre", "Name")}
                    <input
                      name="name"
                      autoComplete="off"
                      required
                      maxLength={60}
                    />
                  </label>
                  <label>
                    {say("Correo electrónico", "Email")}
                    <input
                      name="email"
                      type="email"
                      autoComplete="off"
                      required
                      maxLength={255}
                    />
                  </label>
                  <p>
                    {say(
                      "Crearemos una cuenta de jugador. La persona elegirá su contraseña con un enlace privado; tú nunca tendrás que conocerla.",
                      "We’ll create a player account. They choose their password using a private link; you never need to know it.",
                    )}
                  </p>
                  <button disabled={busy} className="account-primary">
                    {say("Crear cuenta y enlace", "Create account and link")}
                  </button>
                </form>
              ) : (
                selected && (
                  <>
                    <p className="account-email">{selected.email}</p>
                    <form
                      key={`${selected.id}-${selected.updated_at ?? selected.status}`}
                      onSubmit={update}
                    >
                      <label>
                        {say("Nombre", "Name")}
                        <input
                          name="name"
                          defaultValue={selected.full_name || ""}
                          required
                          maxLength={60}
                        />
                      </label>
                      <label className="account-check">
                        <input
                          type="checkbox"
                          name="game"
                          defaultChecked={selected.game_member}
                        />
                        Mexico city discovery game
                      </label>
                      <small>
                        {say(
                          "Esta etiqueta organiza la lista. Cualquier cuenta activa puede entrar al juego.",
                          "This label organizes the directory. Any active account can enter the game.",
                        )}
                      </small>
                      <button className="account-primary" disabled={busy}>
                        {say("Guardar cambios", "Save changes")}
                      </button>
                      {notice && (
                        <span className="account-saved" role="status">
                          <Check size={16} />
                          {say("Cambios guardados", "Changes saved")}
                        </span>
                      )}
                    </form>
                    {!selected.is_admin && (
                      <div className="account-access-actions">
                        <button
                          disabled={busy || selected.status === "paused"}
                          onClick={async () => {
                            const result = await mutate(
                              `/${selected.id}/setup-link`,
                              "POST",
                            );
                            if (result) showLink(result, selected.email);
                          }}
                        >
                          <KeyRound size={18} />
                          {say(
                            "Nuevo enlace de contraseña",
                            "New password link",
                          )}
                        </button>
                        <button
                          disabled={busy || selected.status === "pending"}
                          onClick={async () => {
                            const result = await mutate(
                              `/${selected.id}`,
                              "PATCH",
                              { is_active: !selected.is_active },
                            );
                            if (result) {
                              setSelected(result);
                              setIssued(null);
                            }
                          }}
                        >
                          {selected.is_active
                            ? say("Pausar acceso", "Pause access")
                            : say("Reactivar acceso", "Restore access")}
                        </button>
                        <small>
                          {say(
                            "Pausar cierra sus sesiones y conserva sus hallazgos. El cambio afecta a todo Fruitful Lab.",
                            "Pausing signs them out and keeps their discoveries. This affects all of Fruitful Lab.",
                          )}
                        </small>
                      </div>
                    )}
                    {selected.is_admin && (
                      <p>
                        {say(
                          "Los administradores recuperan su contraseña desde su propio correo. Sus permisos no se cambian aquí.",
                          "Administrators recover passwords through their own inbox. Their permissions are not changed here.",
                        )}
                      </p>
                    )}
                  </>
                )
              )}
              {issued && (
                <section
                  className="account-issued"
                  aria-label={say("Enlace privado", "Private link")}
                >
                  <KeyRound size={22} />
                  <h3>
                    {say("Solo para esta persona.", "For this person only.")}
                  </h3>
                  <p>{issued.email}</p>
                  <label>
                    {say(
                      "Enlace privado de contraseña",
                      "Private password link",
                    )}
                    <input
                      readOnly
                      value={issued.url}
                      onFocus={(e) => e.target.select()}
                    />
                  </label>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(issued.url);
                        setCopied(true);
                      } catch {
                        setCopied(false);
                      }
                    }}
                  >
                    <Copy size={16} />
                    {copied
                      ? say("Copiado", "Copied")
                      : say("Copiar enlace", "Copy link")}
                  </button>
                  <small>
                    {say(
                      "Quien tenga este enlace puede elegir la contraseña. Compártelo solo con esta persona. No se envió por correo.",
                      "Anyone with this link can choose the password. Share it only with this person. It was not emailed.",
                    )}{" "}
                    {say("Vence:", "Expires:")}{" "}
                    {new Date(issued.expires).toLocaleString(
                      locale === "es" ? "es-MX" : "en-US",
                    )}
                    .{" "}
                    {say(
                      "Un enlace nuevo reemplaza al anterior.",
                      "A new link replaces the previous one.",
                    )}
                  </small>
                </section>
              )}
            </>
          ) : (
            <div className="account-empty">
              <Users size={32} />
              <h2>
                {say(
                  "Cada cuenta, su propia historia.",
                  "Every account, their own story.",
                )}
              </h2>
              <p>
                {say(
                  "Reutiliza una cuenta de Fruitful Lab o crea una nueva para salir a explorar.",
                  "Reuse a Fruitful Lab account or create a new one to explore.",
                )}
              </p>
              <Link href="/mexico-city/play">
                {say("Volver al juego", "Return to the game")} ↗
              </Link>
            </div>
          )}
          {data && (
            <p className="account-email-status">
              {data.email_ready
                ? say(
                    "Recuperación por correo configurada.",
                    "Email recovery is configured.",
                  )
                : say(
                    "Recuperación por correo pendiente de configurar. Los enlaces privados de esta pantalla sí están disponibles.",
                    "Email recovery still needs configuration. Private links from this screen are available.",
                  )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
export default function AccountManager() {
  return (
    <LocaleProvider>
      <Manager />
    </LocaleProvider>
  );
}
