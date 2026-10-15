"use client";

import { FormEvent, ReactNode, useState } from "react";

type SignupGroup = "bloom-letter" | "shop-waitlist" | "quiz" | "flower-guide";

type EmailSignupFormProps = {
  buttonLabel: string;
  className: string;
  group: SignupGroup;
  inputId: string;
  placeholder?: string;
  source: string;
  note?: string;
  noteClassName?: string;
  buttonChildren?: ReactNode;
  inputWrapClassName?: string;
  inputIcon?: ReactNode;
  label?: string;
  labelClassName?: string;
  layout?: "inline" | "plain";
  showFirstName?: boolean;
  firstNameId?: string;
};

export function EmailSignupForm({
  buttonChildren,
  buttonLabel,
  className,
  firstNameId,
  group,
  inputIcon,
  inputId,
  inputWrapClassName,
  label = "Email address",
  labelClassName,
  layout = "inline",
  note,
  noteClassName,
  placeholder = "Your email address",
  showFirstName = false,
  source,
}: EmailSignupFormProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, firstName, group, source }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We could not save that email yet.");
      }

      setStatus("success");
      setMessage(result.message || "You're in. Watch your inbox for a note from the garden.");
      setEmail("");
      setFirstName("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not save that email yet.");
    }
  }

  const emailInput = (
    <input
      id={inputId}
      name="email"
      onChange={(event) => setEmail(event.target.value)}
      placeholder={placeholder}
      required
      type="email"
      value={email}
    />
  );

  return (
    <form className={className} onSubmit={submitSignup}>
      {showFirstName ? (
        <>
          <label htmlFor={firstNameId || `${inputId}-first-name`}>First name</label>
          <input
            id={firstNameId || `${inputId}-first-name`}
            name="firstName"
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Your first name"
            type="text"
            value={firstName}
          />
        </>
      ) : null}
      <label className={labelClassName} htmlFor={inputId}>{label}</label>
      {inputWrapClassName ? (
        <div className={inputWrapClassName}>
          {emailInput}
          {inputIcon}
        </div>
      ) : layout === "plain" ? (
        emailInput
      ) : (
        <div>
          {emailInput}
          <button disabled={status === "submitting"} type="submit">
            {buttonChildren || buttonLabel}
          </button>
        </div>
      )}
      {inputWrapClassName || layout === "plain" ? (
        <button disabled={status === "submitting"} type="submit">
          {buttonChildren || buttonLabel}
        </button>
      ) : null}
      {note ? <p className={noteClassName}>{note}</p> : null}
      {message ? (
        <p aria-live="polite" className={`form-status ${status === "error" ? "form-status--error" : ""}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
