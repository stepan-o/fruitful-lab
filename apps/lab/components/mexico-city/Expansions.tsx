"use client";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  House,
  MapPin,
} from "lucide-react";
import {
  LocaleProvider,
  LanguageSwitch,
  useLocale,
} from "@/lib/mexico-city/locale";
import Artwork from "./Artwork";
function Content({ from }: { from: string }) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const back = `/mexico-city/play${from === "guest" || from === "demo" ? `?${from}=1` : ""}`;
  const cards = [
    {
      id: "atlas",
      number: "01",
      Icon: BookOpen,
      title: "Atlas",
      subtitle: say("La ciudad que había antes", "The city that came before"),
      description: say(
        "Los lagos, las primeras ciudades y las calles que fueron tomando su lugar. Historia, mapas y fotografías para leer el valle antes de recorrerlo.",
        "The lakes, the early cities and the streets that took their place. History, maps and photographs to read the valley before walking through it.",
      ),
      art: "archive-valley-1847",
      href: `/mexico-city/atlas${from ? `?from=${from}` : ""}`,
    },
    {
      id: "activities",
      number: "02",
      Icon: CalendarDays,
      title: say("Actividades", "Activities"),
      subtitle: say("Lo que quieres hacer aquí", "What you want to do here"),
      description: say(
        "Una exposición que cierra pronto, un taller, un sitio para la próxima salida. Los enlaces que vas encontrando se reúnen en tus colecciones y en el mapa.",
        "An exhibition closing soon, a workshop, somewhere for your next outing. The links you find come together in your collections and on the map.",
      ),
      art: "centro",
      href: "/mexico-city/activities",
    },
    {
      id: "housing",
      number: "03",
      Icon: House,
      title: say("Vivienda", "Housing"),
      subtitle: say(
        "Un lugar desde donde vivir la ciudad",
        "Somewhere to make a life in the city",
      ),
      description: say(
        "Departamentos y casas en renta o venta, con sus precios, pendientes y visitas. Compara tus opciones y mira qué queda cerca de cada una.",
        "Apartments and houses to rent or buy, with prices, questions and viewings. Compare your options and see what lies around each one.",
      ),
      art: "coyoacan",
      href: "/mexico-city/housing",
    },
  ];
  return (
    <main className="city-expansions">
      <header className="city-top">
        <Link href={back}>
          <ArrowLeft size={19} />
          {say("Mapa del juego", "Game map")}
        </Link>
        <LanguageSwitch />
      </header>
      <div className="city-opening">
        <span className="city-eyebrow">MEXICO CITY DISCOVERY GAME</span>
        <h1>{say("La ciudad, a tu manera.", "A city of your own.")}</h1>
        <p>
          {say(
            "Hay lugares que primero conocemos en una historia, otros en una foto o en un anuncio. Aquí puedes seguirles la pista, reunir tus planes y darles un lugar en el mapa.",
            "Some places first reach us through a story, others through a photograph or a listing. Here you can follow those threads, collect your plans and find where they belong on the map.",
          )}
        </p>
      </div>
      <div className="city-expansion-grid">
        {cards.map(
          ({ id, number, Icon, title, subtitle, description, art, href }) => (
            <Link
              className={`city-expansion-card is-${id}`}
              href={href}
              key={id}
            >
              <div className="city-expansion-illustration">
                {id === "atlas" ? (
                  <Artwork id={art} sizes="(max-width:700px) 90vw, 35vw" />
                ) : (
                  <div className="city-line-scene" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <Icon strokeWidth={1.25} />
                    <MapPin className="city-scene-pin" />
                  </div>
                )}
                <span className="city-card-number">{number}</span>
              </div>
              <div className="city-expansion-copy">
                <div>
                  <Icon size={22} />
                  <h2>{title}</h2>
                  <ArrowUpRight size={24} />
                </div>
                <h3>{subtitle}</h3>
                <p>{description}</p>
              </div>
            </Link>
          ),
        )}
      </div>
      <footer className="city-expansion-footer">
        <MapPin size={18} />
        <p>
          {say(
            "Tus colecciones acompañan al mapa. El Atlas conserva su propio recorrido de lectura.",
            "Your collections travel with the map. The Atlas has its own path through the city’s history.",
          )}
        </p>
        <Link href="/mexico-city/game-design">
          {say("Diseño del juego", "Game design")}
        </Link>
      </footer>
    </main>
  );
}
export default function Expansions({ from = "" }: { from?: string }) {
  return (
    <LocaleProvider>
      <Content from={from} />
    </LocaleProvider>
  );
}
