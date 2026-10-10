"use client";

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
}: {
  children: ReactNode;
  label: string;
  close: () => void;
  className?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
}) {
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
  return (
    <dialog
      ref={ref}
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
        aria-label={`Close ${label}`}
      >
        ×
      </button>
      {children}
    </dialog>
  );
}
