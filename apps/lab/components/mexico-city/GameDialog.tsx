"use client";
import { useLocale, LanguageSwitch } from "@/lib/mexico-city/locale";
import {
  useEffect,
  useRef,
  type ReactNode,
  type KeyboardEventHandler,
} from "react";
export default function GameDialog({
  children,
  label,
  close,
  className = "",
  onKeyDown,
  pageKey,
}: {
  children: ReactNode;
  label: string;
  close: () => void;
  className?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
  pageKey?: string;
}) {
  const { locale, t } = useLocale();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  useEffect(() => {
    if (pageKey === undefined || !ref.current) return;
    const heading = ref.current.querySelector<HTMLElement>(
      "[data-page-heading]",
    );
    heading?.focus({ preventScroll: true });
    ref.current.scrollTop = 0;
  }, [pageKey]);
  return (
    <dialog
      ref={ref}
      lang={locale === "es" ? "es-MX" : "en"}
      aria-label={label}
      className={`ov-dialog ${className}`}
      onKeyDown={onKeyDown}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <button
        className="ov-close"
        onClick={close}
        aria-label={t("Close {label}", { label })}
      >
        ×
      </button>
      <div className="ov-dialog-language">
        <LanguageSwitch />
      </div>
      {children}
    </dialog>
  );
}
