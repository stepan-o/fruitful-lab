"use client";
import { useState, type FormEvent } from "react";
import { LoaderCircle, Mail } from "lucide-react";
import { useLocale } from "@/lib/mexico-city/locale";
export type AuthMode = "login" | "register" | "forgot";
export default function AccountForm({
  initialMode = "login",
  next,
  success,
}: {
  initialMode?: AuthMode;
  next: string;
  success: () => Promise<void>;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  function switchMode(value: AuthMode) {
    setMode(value);
    setPassword("");
    setError("");
    setSent(false);
  }
  const messages: Record<string, [string, string]> = {
    account_exists: [
      "Ese correo ya tiene una cuenta. Entra con tu contraseña o pide un enlace para recuperarla.",
      "That email already has an account. Sign in or request a password reset link.",
    ],
    login_failed: [
      "El correo o la contraseña no coinciden. Puedes intentarlo de nuevo o recuperar tu contraseña.",
      "The email or password doesn’t match. Try again or reset your password.",
    ],
    registration_invalid: [
      "Revisa tus datos. La contraseña debe tener al menos 10 caracteres.",
      "Check your details. Your password needs at least 10 characters.",
    ],
    email_unavailable: [
      "La recuperación por correo todavía no está disponible. Pide un enlace privado a quien administra Fruitful Lab.",
      "Email recovery is not available yet. Ask your Fruitful Lab administrator for a private link.",
    ],
    try_later: [
      "Ya recibimos varias solicitudes. Espera unos minutos antes de pedir otro enlace.",
      "We received several requests. Wait a few minutes before requesting another link.",
    ],
    service_unavailable: [
      "No pudimos conectar con las cuentas. Inténtalo de nuevo en un momento.",
      "We couldn’t reach the account service. Please try again shortly.",
    ],
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const normalized = email.trim().toLowerCase();
      if (mode === "forgot") {
        const response = await fetch("/api/account/forgot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalized, locale }),
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            typeof data.detail === "string"
              ? data.detail
              : "service_unavailable",
          );
        }
        setSent(true);
        return;
      }
      if (mode === "register") {
        const response = await fetch("/api/mexico-city/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: normalized,
            password,
            full_name: name.trim(),
          }),
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            response.status >= 500
              ? "service_unavailable"
              : typeof data.detail === "string"
                ? data.detail
                : "registration_invalid",
          );
        }
      }
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, password, next }),
      });
      if (!response.ok)
        throw new Error(
          response.status === 401 ? "login_failed" : "service_unavailable",
        );
      setPassword("");
      await success();
    } catch (e) {
      setError(
        e instanceof Error && messages[e.message]
          ? e.message
          : "service_unavailable",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mc-account-form">
      <div
        className="mc-auth-tabs"
        role="group"
        aria-label={say("Acceso a tu cuenta", "Account access")}
      >
        <button
          type="button"
          aria-pressed={mode === "login"}
          disabled={busy}
          onClick={() => switchMode("login")}
        >
          {say("Entrar", "Log in")}
        </button>
        <button
          type="button"
          aria-pressed={mode === "register"}
          disabled={busy}
          onClick={() => switchMode("register")}
        >
          {say("Crear cuenta", "Create account")}
        </button>
      </div>
      {mode === "forgot" && (
        <h2>
          {say("Vamos a recuperar tu cuenta.", "Let’s recover your account.")}
        </h2>
      )}
      {sent ? (
        <div className="mc-recovery-sent" role="status">
          <Mail size={28} />
          <h2>{say("Revisa tu correo.", "Check your inbox.")}</h2>
          <p>
            {say(
              "Si hay una cuenta con ese correo, te llegará un enlace para elegir una contraseña nueva. Revisa también la carpeta de spam.",
              "If that email has an account, you’ll receive a link to choose a new password. Check your spam folder too.",
            )}
          </p>
          <button className="mc-primary" onClick={() => switchMode("login")}>
            {say("Volver a entrar", "Back to login")}
          </button>
          <button
            className="mc-text-button"
            onClick={() => {
              setSent(false);
              setError("");
            }}
          >
            {say(
              "Corregir correo o pedir otro enlace",
              "Correct email or request another link",
            )}
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          {mode === "register" && (
            <label>
              {say("Cómo te llamas", "Your name")}
              <input
                name="name"
                autoComplete="name"
                required
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}
          <label>
            {say("Correo electrónico", "Email")}
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {mode !== "forgot" && (
            <label>
              {say("Contraseña", "Password")}
              <input
                name="password"
                type="password"
                aria-describedby={
                  mode === "register" ? "mc-password-hint" : undefined
                }
                autoComplete={
                  mode === "register" ? "new-password" : "current-password"
                }
                required
                minLength={mode === "register" ? 10 : 1}
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}
          {mode === "register" && (
            <small id="mc-password-hint">
              {say(
                "Al menos 10 caracteres. Puedes usar una frase.",
                "At least 10 characters. A passphrase works well.",
              )}
            </small>
          )}
          {mode === "forgot" && (
            <p className="mc-muted">
              {say(
                "Te mandaremos un enlace privado. Tu contraseña actual seguirá funcionando hasta que elijas una nueva.",
                "We’ll send a private link. Your current password keeps working until you choose a new one.",
              )}
            </p>
          )}
          {error && (
            <p className="mc-error" role="alert">
              {messages[error][locale === "es" ? 0 : 1]}
            </p>
          )}
          <button className="mc-primary" disabled={busy}>
            {busy ? (
              <LoaderCircle className="mc-spin" size={18} />
            ) : (
              <Mail size={18} />
            )}{" "}
            {mode === "register"
              ? say("Crear cuenta y entrar", "Create account and enter")
              : mode === "forgot"
                ? say("Enviar enlace de recuperación", "Send recovery link")
                : say("Entrar al juego", "Enter the game")}
          </button>
        </form>
      )}
      {!sent && (
        <button
          type="button"
          className="mc-text-button"
          disabled={busy}
          onClick={() => switchMode(mode === "forgot" ? "login" : "forgot")}
        >
          {mode === "forgot"
            ? say("Volver a entrar", "Back to login")
            : say("Olvidé mi contraseña", "Forgot password")}
        </button>
      )}
    </div>
  );
}
