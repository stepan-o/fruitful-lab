"use client";

import { useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";

type SubscribeFormType = "newsletter" | "fit-check" | "resource-interest";

type SubscribeFormProps = {
  formType: SubscribeFormType;
  buttonLabel: string;
  successMessage: string;
  resourceInterest?: string;
  fields?: Record<string, string | number>;
  includeName?: boolean;
  includeWebsite?: boolean;
  emailPlaceholder?: string;
  namePlaceholder?: string;
  websitePlaceholder?: string;
  className?: string;
  buttonClassName?: string;
};

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function SubscribeForm({
  formType,
  buttonLabel,
  successMessage,
  resourceInterest,
  fields,
  includeName = false,
  includeWebsite = false,
  emailPlaceholder = "Email address",
  namePlaceholder = "Your name",
  websitePlaceholder = "Website / brand",
  className = "mt-5 grid gap-3",
  buttonClassName = "button-primary min-h-11 px-5",
}: SubscribeFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = getField(formData, "email");

    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          formType,
          email,
          name: getField(formData, "name"),
          website: getField(formData, "website"),
          company: getField(formData, "company"),
          signupPage: window.location.pathname,
          leadSource: "fruitful-pin-website",
          resourceInterest,
          fields,
        }),
      });
      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Please try again.");
      }

      form.reset();
      setStatus("success");
      setMessage(successMessage);

      if (formType === "newsletter") {
        trackEvent("newsletter_signup", {
          form_type: formType,
          page_path: window.location.pathname,
        });
      }

      if (formType === "resource-interest") {
        trackEvent("resource_interest", {
          form_type: formType,
          resource_interest: resourceInterest,
          page_path: window.location.pathname,
        });
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again or email hello@fruitfulpin.com.");
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      <input className="hidden" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {includeName ? <input className="blog-form-input" type="text" name="name" placeholder={namePlaceholder} autoComplete="name" /> : null}
      {includeWebsite ? <input className="blog-form-input" type="text" name="website" placeholder={websitePlaceholder} autoComplete="url" /> : null}
      <input className="blog-form-input" type="email" name="email" placeholder={emailPlaceholder} autoComplete="email" required />
      <button className={buttonClassName} type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : buttonLabel}
      </button>
      {message ? (
        <p className={`form-status-message ${status === "success" ? "is-success" : "is-error"}`} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
