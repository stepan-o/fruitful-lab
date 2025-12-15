import Link from "next/link";
import LogoutButton from "@/components/layout/LogoutButton";
import { BookCallButton } from "@/components/layout/BookCallButton";
import { getCurrentUser } from "@/lib/auth";
import { PUBLIC_NAV_LINKS } from "@/lib/nav";

function NavLinks() {
  return (
    <nav className="hidden items-center gap-7 text-sm sm:text-base text-slate-700 md:flex">
      {PUBLIC_NAV_LINKS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          className="hover:text-slate-900"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default async function SiteHeader() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-slate-900"
        >
          Fruitful Lab
        </Link>

        {/* Center nav (desktop) */}
        <NavLinks />

        {/* CTAs (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <BookCallButton />

          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login?next=/dashboard"
              className="rounded-md border border-[#0B132B] bg-white px-3 py-2 text-sm md:text-base font-medium text-[#0B132B] hover:bg-[#DFDFDF]"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu */}
        <details className="md:hidden">
          <summary className="cursor-pointer rounded-md px-2 py-1 text-slate-700 ring-slate-300 marker:hidden">
            Menu
          </summary>
          <div className="absolute left-0 right-0 z-10 mt-2 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-col gap-3 text-sm text-slate-700">
              {PUBLIC_NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ))}
              <BookCallButton fullWidth />
              {isLoggedIn ? (
                <div className="pt-2">
                  <LogoutButton />
                </div>
              ) : (
                <Link
                  href="/login?next=/dashboard"
                  className="mt-1 rounded-md border border-[#0B132B] bg-white px-3 py-2 text-center text-sm font-medium text-[#0B132B] hover:bg-[#DFDFDF]"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
