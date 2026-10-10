"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Camera,
  Compass,
  Swords,
  Paintbrush,
  Mail,
  LoaderCircle,
} from "lucide-react";
import {
  LocaleProvider,
  LanguageSwitch,
  useLocale,
} from "@/lib/mexico-city/locale";
import Artwork from "./Artwork";
import GameName from "./GameName";
import { ERRORS } from "@/lib/mexico-city/field-game";

export function FieldLogin({
  next,
  success,
  guest,
}: {
  next: string;
  success: () => Promise<void>;
  guest: () => void;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [register, setRegister] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <section className="mc-login">
      <Link href="/mexico-city" className="mc-brand">
        <GameName />
      </Link>
      <div className="mc-login-art">
        <Artwork id="chapultepec" sizes="320px" />
        <span className="mc-paper-stamp">
          CDMX
          <br />
          19° N · 99° O
        </span>
      </div>
      <p className="mc-eyebrow">
        {say("Tu cuenta de Fruitful Lab", "Your Fruitful Lab account")}
      </p>
      <h1>
        {register
          ? say("Tu ciudad empieza aquí.", "Your city starts here.")
          : say(
              "Todavía hay mucho por descubrir.",
              "There’s so much left to discover.",
            )}
      </h1>
      <p>
        {say(
          "Una misma cuenta para guardar tus hallazgos y jugar con tu grupo.",
          "One account to keep your discoveries and play with your group.",
        )}
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setBusy(true);
          setError("");
          const data = new FormData(e.currentTarget);
          const email = String(data.get("email")).trim().toLowerCase(),
            password = String(data.get("password"));
          try {
            if (register) {
              const response = await fetch("/api/mexico-city/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email,
                  password,
                  full_name: data.get("name"),
                }),
              });
              if (!response.ok) {
                const data = await response.json();
                throw new Error(
                  typeof data.detail === "string"
                    ? data.detail
                    : "registration_invalid",
                );
              }
            }
            const response = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password, next }),
            });
            if (!response.ok)
              throw new Error(
                response.status === 401
                  ? "login_failed"
                  : "service_unavailable",
              );
            await success();
          } catch (error) {
            const code =
              error instanceof Error ? error.message : "service_unavailable";
            setError(
              code === "login_failed"
                ? say(
                    "Revisa tu correo y contraseña.",
                    "Check your email and password.",
                  )
                : code === "registration_invalid"
                  ? say(
                      "Revisa tus datos. Usa una contraseña de al menos 10 caracteres.",
                      "Check your details. Use a password with at least 10 characters.",
                    )
                  : (ERRORS[code] || ERRORS.service_unavailable)[
                      locale === "es" ? 0 : 1
                    ],
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        {register && (
          <label>
            {say("Cómo te llamas", "Your name")}
            <input name="name" autoComplete="name" required maxLength={60} />
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
          />
        </label>
        <label>
          {say("Contraseña", "Password")}
          <input
            name="password"
            type="password"
            autoComplete={register ? "new-password" : "current-password"}
            required
            minLength={register ? 10 : 1}
            maxLength={128}
          />
        </label>
        {error && (
          <p className="mc-error" role="alert">
            {error}
          </p>
        )}
        <button className="mc-primary" disabled={busy}>
          {busy ? (
            <LoaderCircle className="mc-spin" size={18} />
          ) : (
            <Mail size={18} />
          )}
          {register
            ? say("Crear cuenta y entrar", "Create account and enter")
            : say("Entrar al juego", "Enter the game")}
        </button>
      </form>
      <button
        className="mc-text-button"
        onClick={() => {
          setRegister(!register);
          setError("");
        }}
      >
        {register
          ? say("Ya tengo cuenta", "I have an account")
          : say("Crear una cuenta", "Create an account")}
      </button>
      <button className="mc-secondary" onClick={guest}>
        {say(
          "Probar una salida sin cuenta",
          "Try an outing without an account",
        )}
      </button>
      <small>
        {say(
          "La prueba no guarda progreso. Tu aventura con cuenta sí.",
          "The trial doesn’t save progress. Your account adventure does.",
        )}
      </small>
    </section>
  );
}
function Landing({ signedIn }: { signedIn: boolean }) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  return (
    <main className="mc-landing" lang={locale === "es" ? "es-MX" : "en"}>
      <header>
        <Link href="/mexico-city" className="mc-brand">
          <GameName />
        </Link>
        <nav aria-label={say("Navegación", "Navigation")}>
          <Link href="/mexico-city/game-design">
            {say("El diseño", "Game design")}
          </Link>
          <LanguageSwitch />
        </nav>
      </header>
      <section className="mc-landing-hero">
        <div className="mc-landing-copy">
          <p className="mc-eyebrow">
            {say("La ciudad se juega afuera", "The city is played outside")}
          </p>
          <h1>
            {say("Sal de tu ruta.", "Leave your routine.")}
            <br />
            <em>{say("Encuentra tu ciudad.", "Find your city.")}</em>
          </h1>
          <p>
            {say(
              "Un rótulo que te detiene. Un sabor nuevo. Esa calle por la que nunca doblas. Guarda lo que encuentres y reta a alguien a mirar distinto.",
              "A hand-painted sign that makes you stop. A new flavour. That street you never turn down. Keep what you find and challenge someone to look differently.",
            )}
          </p>
          <Link href="/mexico-city/play" className="mc-primary">
            {signedIn
              ? say("Volver al juego", "Return to the game")
              : say("Entrar al juego", "Enter the game")}
            <ArrowUpRight size={20} />
          </Link>
          <Link href="/mexico-city/play?guest=1" className="mc-text-button">
            {say("Probar sin cuenta", "Try without an account")}
            <ArrowRight size={17} />
          </Link>
          <small>
            {say(
              "Una salida completa. Sin registro. Sin guardar progreso.",
              "One complete outing. No registration. No saved progress.",
            )}
          </small>
        </div>
        <div className="mc-landing-world">
          <div className="mc-landing-grid" />
          <span className="mc-coordinate">
            CIUDAD DE MÉXICO
            <br />
            19.4326° N · 99.1332° O
          </span>
          <Artwork
            id="revolucion"
            className="mc-landmark-main"
            sizes="(max-width: 700px) 90vw, 540px"
            preload
          />
          <Artwork
            id="chapultepec"
            className="mc-landmark-side"
            sizes="(max-width: 700px) 150px, 220px"
          />
          <div className="mc-photo-tag">
            <Camera size={22} />
            <span>
              {say("Tu próxima buena historia", "Your next good story")}
              <b>{say("está allá afuera.", "is out there.")}</b>
            </span>
          </div>
          <span className="mc-round-stamp">
            {say(
              "OTRA CALLE\nOTRA MIRADA",
              "ANOTHER STREET\nANOTHER PERSPECTIVE",
            )}
          </span>
        </div>
      </section>
      <section className="mc-landing-modes">
        <p className="mc-eyebrow">
          {say("Tres maneras de salir", "Three ways to get out")}
        </p>
        <div>
          {[
            {
              icon: Compass,
              title: ["Tu aventura", "Your adventure"],
              text: [
                "Una bitácora de lugares, fotos y pequeñas sorpresas que ya son tuyas.",
                "A logbook of places, photos and small surprises that are now yours.",
              ],
              mode: "solo",
            },
            {
              icon: Swords,
              title: ["Retos entre amigos", "Challenges with friends"],
              text: [
                "Lanza un reto, sal de tu rutina y deja que tu rival confirme el hallazgo.",
                "Send a challenge, break your routine and let your friend confirm the discovery.",
              ],
              mode: "friends",
            },
            {
              icon: Paintbrush,
              title: ["Pinta la ciudad", "Paint the city"],
              text: [
                "Lo que descubren juntos, en un mapa. Con tu grupo o con toda CDMX.",
                "What you discover together, on one map. With your group or all CDMX.",
              ],
              mode: "community",
            },
          ].map(({ icon: Icon, title, text, mode }) => (
            <Link key={mode} href={`/mexico-city/play?mode=${mode}`}>
              <Icon size={26} />
              <h2>{title[locale === "es" ? 0 : 1]}</h2>
              <p>{text[locale === "es" ? 0 : 1]}</p>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </section>
      <section className="mc-landing-how">
        <span>01 / {say("Elige una excusa", "Choose a reason")}</span>
        <ArrowRight size={18} />
        <span>02 / {say("Sal a descubrir", "Go discover")}</span>
        <ArrowRight size={18} />
        <span>03 / {say("Guarda tu mirada", "Keep your perspective")}</span>
      </section>
      <footer>
        <p>
          {say(
            "Mexico city discovery game es un nombre de trabajo. Lo estamos construyendo para jugarlo Susy y Stepan.",
            "Mexico city discovery game is a working reference. We’re building it for Susy and Stepan to play.",
          )}
        </p>
        <Link href="/mexico-city/game-design">
          {say("Ver el diseño completo", "Read the full design")}
        </Link>
        <Link href="/mexico-city/play?demo=1">
          {say(
            "Explorar la demo de todos los modos",
            "Explore the all-modes demo",
          )}
        </Link>
        <Link href="/mexico-city/atlas">
          {say("Atlas, historias y fuentes", "Atlas, stories and sources")}
        </Link>
      </footer>
    </main>
  );
}
export default function FieldLanding(props: { signedIn: boolean }) {
  return (
    <LocaleProvider>
      <Landing {...props} />
    </LocaleProvider>
  );
}
