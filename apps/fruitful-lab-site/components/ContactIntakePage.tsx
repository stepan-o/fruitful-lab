"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { BOOKING_URL, CLICKUP_FORM_URL, CONTACT_EMAIL } from "@/lib/site";

const PROBLEM_OPTIONS = [
  "Search visibility",
  "Content system",
  "Paid media path",
  "Email or funnel",
  "Data and reporting",
  "AI creative workflow",
  "Not sure yet",
] as const;

const JOURNEY_OPTIONS = [
  "Pre-launch",
  "Reworking the offer",
  "Rebrand or reposition",
  "Scaling a product line",
  "Marketing feels scattered",
  "Need clearer reporting",
] as const;

const BUDGET_OPTIONS = [
  "Diagnostic only",
  "$5k-$15k",
  "$15k-$40k",
  "$40k+",
  "Not sure yet",
] as const;

const REVENUE_OPTIONS = ["Pre-revenue", "Under $250k", "$250k-$1M", "$1M-$5M", "$5M+"] as const;

const TEAM_OPTIONS = [
  "Founder-led",
  "Small team",
  "Marketing lead + contractors",
  "In-house team",
  "Agency support already",
] as const;

const BUSINESS_MODEL_OPTIONS = [
  "DTC ecommerce",
  "Wholesale or retail",
  "B2B product",
  "Service + product",
  "Marketplace",
  "Other",
] as const;

const AFTER_SUBMIT = [
  {
    title: "A senior strategist reads the context",
    detail: "We look at the product, website, channels, timing, and the clearest first signal.",
    timing: "Within 1 business day",
  },
  {
    title: "We send a recommended starting point",
    detail: "That might be a fit call, diagnostic, focused build, or an honest referral if we are not the fit.",
    timing: "Same reply, no extra step",
  },
  {
    title: "You pick the time. We come prepared.",
    detail: "By the call, we have already reviewed your product path and a few reference points.",
    timing: "Before the call",
  },
  {
    title: "Next step or honest no",
    detail: "If there is a useful formula to build, we scope it. If not, we tell you clearly.",
    timing: "No pressure loop",
  },
] as const;

const FAQS = [
  {
    question: "How fast do you actually respond?",
    answer:
      "The working promise is inside one business day. If the request needs more context, the reply will still tell you what we need before suggesting a call.",
  },
  {
    question: "What is the smallest project you will take?",
    answer:
      "The smallest serious starting point is usually a diagnostic or focused strategy pass. If the work needed is smaller or not a fit, we will say so before scoping anything.",
  },
  {
    question: "Do you work outside the US?",
    answer:
      "Yes. Fruitful Lab can work remotely across time zones as long as the product, scope, and collaboration rhythm are clear.",
  },
  {
    question: "Do you sign NDAs before the first call?",
    answer:
      "Usually we can talk at a high level first. If the conversation needs confidential details, we can review NDA needs before going deeper.",
  },
  {
    question: "Why a form instead of only a calendar link?",
    answer:
      "The form helps us understand the product stage and route the conversation to the right first move. You can still skip it and book directly.",
  },
  {
    question: "What if we are not sure what we need?",
    answer:
      "That is a good reason to reach out. The first job is to identify the bottleneck, not force you to pick a tactic too early.",
  },
] as const;

const STEPS = [
  "What you need",
  "Brand stage",
  "Budget + timing",
  "Business context",
  "Winning looks like",
  "Reply details",
] as const;

type ChoiceKey = "problems" | "journey" | "budget" | "revenue" | "team" | "businessModel";

type FormState = {
  problems: string[];
  journey: string[];
  budget: string[];
  revenue: string[];
  team: string[];
  businessModel: string[];
  idealStart: string;
  deadline: string;
  industry: string;
  website: string;
  winning: string;
  admiredBrands: string;
  competitors: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  source: string;
};

const INITIAL_FORM: FormState = {
  problems: [],
  journey: [],
  budget: [],
  revenue: [],
  team: [],
  businessModel: [],
  idealStart: "",
  deadline: "",
  industry: "",
  website: "",
  winning: "",
  admiredBrands: "",
  competitors: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  source: "",
};

function formatAnswer(value: string | string[]) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not provided";
  return value.trim() || "Not provided";
}

function buildIntakeEmailBody(form: FormState) {
  return [
    "Fruitful Lab intake",
    "",
    `Name: ${formatAnswer([form.firstName, form.lastName].filter(Boolean).join(" "))}`,
    `Email: ${formatAnswer(form.email)}`,
    `Phone: ${formatAnswer(form.phone)}`,
    `Company: ${formatAnswer(form.company)}`,
    `Role: ${formatAnswer(form.role)}`,
    `Website: ${formatAnswer(form.website)}`,
    "",
    `Problems: ${formatAnswer(form.problems)}`,
    `Journey: ${formatAnswer(form.journey)}`,
    `Budget: ${formatAnswer(form.budget)}`,
    `Ideal start: ${formatAnswer(form.idealStart)}`,
    `Deadline: ${formatAnswer(form.deadline)}`,
    "",
    `Industry: ${formatAnswer(form.industry)}`,
    `Revenue: ${formatAnswer(form.revenue)}`,
    `Team: ${formatAnswer(form.team)}`,
    `Business model: ${formatAnswer(form.businessModel)}`,
    "",
    `What winning looks like: ${formatAnswer(form.winning)}`,
    `Brands admired: ${formatAnswer(form.admiredBrands)}`,
    `Competitors: ${formatAnswer(form.competitors)}`,
    `Source: ${formatAnswer(form.source)}`,
  ].join("\n");
}

export function ContactIntakePage() {
  const [step, setStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const progress = useMemo(() => `${Math.round(((step + 1) / STEPS.length) * 100)}%`, [step]);

  function toggleChoice(key: ChoiceKey, value: string) {
    setForm((current) => {
      const exists = current[key].includes(value);
      return {
        ...current,
        [key]: exists ? current[key].filter((item) => item !== value) : [...current[key], value],
      };
    });
  }

  function updateField(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent("Fruitful Lab intake");
    const body = encodeURIComponent(buildIntakeEmailBody(form));
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  function goNext() {
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
  }

  return (
    <div className="cfc-page">
      <section className="cfc-hero">
        <div className="cfc-shell cfc-hero-grid">
          <div className="cfc-hero-copy">
            <h1>
              Tell us about the product you are <span>building.</span>
            </h1>
            <p>
              Six short steps. Takes less than two minutes. We use the context to understand the
              product, stage, signals, and best first move before recommending a fit call or next step.
            </p>

            <div className="cfc-proof-card" aria-label="Contact expectations">
              <p>
                <span>01</span>
                Replying inside one business day
              </p>
              <p>
                <span>02</span>
                Best for product brands with messy discovery paths
              </p>
              <p>
                <span>03</span>
                Remote-friendly across time zones
              </p>
            </div>

            <div className="cfc-direct-links">
              {CLICKUP_FORM_URL ? (
                <a href={CLICKUP_FORM_URL} rel="noreferrer" target="_blank">
                  <span aria-hidden="true">FORM</span>
                  <strong>Start the ClickUp intake</strong>
                  <small>Creates one Fruitful Lab lead task for review</small>
                </a>
              ) : null}
              <a href={BOOKING_URL}>
                <span aria-hidden="true">CAL</span>
                <strong>Skip the form, book a fit call</strong>
                <small>60 min - we will build the first read together</small>
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <span aria-hidden="true">MAIL</span>
                <strong>{CONTACT_EMAIL}</strong>
                <small>For longer notes, NDAs, or early-stage questions</small>
              </a>
            </div>
          </div>

          <form className="cfc-form-card" onSubmit={handleSubmit}>
            {submitted ? (
              <div className="cfc-submit-state">
                <p className="cfc-kicker">Draft opened</p>
                <h2>Your intake draft is ready in your email app.</h2>
                <p>
                  This fallback prepares an email to hello@fruitfulab.com with the context filled in.
                  Review the draft, send it, or use the ClickUp intake link once it is connected.
                </p>
                <button className="cfc-button cfc-button-primary" onClick={() => setSubmitted(false)} type="button">
                  Review the form again
                </button>
              </div>
            ) : (
              <>
                <div className="cfc-form-meta">
                  <span>
                    Step {step + 1} of {STEPS.length} - {STEPS[step]}
                  </span>
                  <span>Less than 2 min</span>
                </div>
                <div className="cfc-progress" aria-hidden="true">
                  <span style={{ width: progress }} />
                </div>
                {step === 0 ? (
                  <ContactStep
                    description="Pick everything that is in scope. We will combine these into a clearer first move."
                    title="What are you trying to solve?"
                  >
                    <ChoiceGrid options={PROBLEM_OPTIONS} selected={form.problems} onToggle={(value) => toggleChoice("problems", value)} />
                  </ContactStep>
                ) : null}
                {step === 1 ? (
                  <ContactStep
                    description="This helps us understand whether the work is about clarity, launch, scale, or repair."
                    title="Where are you in the journey?"
                  >
                    <ChoiceGrid options={JOURNEY_OPTIONS} selected={form.journey} onToggle={(value) => toggleChoice("journey", value)} />
                  </ContactStep>
                ) : null}
                {step === 2 ? (
                  <ContactStep
                    description="No need to have perfect numbers. A rough range helps us suggest the right starting shape."
                    title="Budget and timing"
                  >
                    <ChoiceGrid options={BUDGET_OPTIONS} selected={form.budget} onToggle={(value) => toggleChoice("budget", value)} />
                    <div className="cfc-field-grid">
                      <label className="cfc-field">
                        <span>Ideal start</span>
                        <input
                          className="cfc-input"
                          onChange={(event) => updateField("idealStart", event.target.value)}
                          placeholder="Example: next month, Q3, after launch"
                          value={form.idealStart}
                        />
                      </label>
                      <label className="cfc-field">
                        <span>Hard deadline driving this?</span>
                        <input
                          className="cfc-input"
                          onChange={(event) => updateField("deadline", event.target.value)}
                          placeholder="Launch date, event, seasonal push..."
                          value={form.deadline}
                        />
                      </label>
                    </div>
                  </ContactStep>
                ) : null}
                {step === 3 ? (
                  <ContactStep
                    description="A little about the business helps us calibrate recommendations to the real stage."
                    title="Tell us about the business"
                  >
                    <ChoiceGroup label="Annual revenue" options={REVENUE_OPTIONS} selected={form.revenue} onToggle={(value) => toggleChoice("revenue", value)} />
                    <ChoiceGroup label="Team size" options={TEAM_OPTIONS} selected={form.team} onToggle={(value) => toggleChoice("team", value)} />
                    <ChoiceGroup label="Business model" options={BUSINESS_MODEL_OPTIONS} selected={form.businessModel} onToggle={(value) => toggleChoice("businessModel", value)} />
                    <label className="cfc-field">
                      <span>Industry or category</span>
                      <input
                        className="cfc-input"
                        onChange={(event) => updateField("industry", event.target.value)}
                        placeholder="Baby, home, wellness, food, apparel..."
                        value={form.industry}
                      />
                    </label>
                  </ContactStep>
                ) : null}
                {step === 4 ? (
                  <ContactStep
                    description="Use this space for the outcome, the messy middle, and useful references."
                    title="What does winning look like?"
                  >
                    <label className="cfc-field">
                      <span>The thing you would like to fix or build</span>
                      <textarea
                        className="cfc-input cfc-textarea"
                        onChange={(event) => updateField("winning", event.target.value)}
                        placeholder="Example: customers find us, understand the product, and know which offer to choose."
                        value={form.winning}
                      />
                    </label>
                    <div className="cfc-field-grid">
                      <label className="cfc-field">
                        <span>Current website</span>
                        <input
                          className="cfc-input"
                          onChange={(event) => updateField("website", event.target.value)}
                          placeholder="https://"
                          value={form.website}
                        />
                      </label>
                      <label className="cfc-field">
                        <span>Brands you admire</span>
                        <input
                          className="cfc-input"
                          onChange={(event) => updateField("admiredBrands", event.target.value)}
                          placeholder="Names or links"
                          value={form.admiredBrands}
                        />
                      </label>
                    </div>
                    <label className="cfc-field">
                      <span>Who do you compete with?</span>
                      <input
                        className="cfc-input"
                        onChange={(event) => updateField("competitors", event.target.value)}
                        placeholder="Direct competitors, alternatives, or category references"
                        value={form.competitors}
                      />
                    </label>
                  </ContactStep>
                ) : null}
                {step === 5 ? (
                  <ContactStep
                    description="Where should we send the reply once we have read the context?"
                    title="Where do we send the reply?"
                  >
                    <div className="cfc-field-grid">
                      <label className="cfc-field">
                        <span>First name</span>
                        <input className="cfc-input" onChange={(event) => updateField("firstName", event.target.value)} value={form.firstName} />
                      </label>
                      <label className="cfc-field">
                        <span>Last name</span>
                        <input className="cfc-input" onChange={(event) => updateField("lastName", event.target.value)} value={form.lastName} />
                      </label>
                      <label className="cfc-field">
                        <span>Work email</span>
                        <input
                          className="cfc-input"
                          onChange={(event) => updateField("email", event.target.value)}
                          type="email"
                          value={form.email}
                        />
                      </label>
                      <label className="cfc-field">
                        <span>Phone</span>
                        <input className="cfc-input" onChange={(event) => updateField("phone", event.target.value)} value={form.phone} />
                      </label>
                      <label className="cfc-field">
                        <span>Company</span>
                        <input className="cfc-input" onChange={(event) => updateField("company", event.target.value)} value={form.company} />
                      </label>
                      <label className="cfc-field">
                        <span>Role</span>
                        <input className="cfc-input" onChange={(event) => updateField("role", event.target.value)} value={form.role} />
                      </label>
                    </div>
                    <label className="cfc-field">
                      <span>How did you find us?</span>
                      <input
                        className="cfc-input"
                        onChange={(event) => updateField("source", event.target.value)}
                        placeholder="Referral, LinkedIn, Fruitful Pin, search, podcast..."
                        value={form.source}
                      />
                    </label>
                  </ContactStep>
                ) : null}

                <div className="cfc-form-footer">
                  <p>This fallback opens your email app with the context filled in. We will never sell, share, or spam your inbox.</p>
                  <div>
                    {step > 0 ? (
                      <button className="cfc-button cfc-button-secondary" onClick={goBack} type="button">
                        Back
                      </button>
                    ) : null}
                    {step < STEPS.length - 1 ? (
                      <button className="cfc-button cfc-button-primary" onClick={goNext} type="button">
                        Continue
                      </button>
                    ) : (
                      <button className="cfc-button cfc-button-primary" type="submit">
                        Send intake
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </section>

      <section className="cfc-after-section">
        <div className="cfc-shell cfc-after-grid">
          <div>
            <p className="cfc-kicker">What happens after you submit</p>
            <h2>
              A quick take, a real plan, <span>by our founders.</span>
            </h2>
            <p>
              Every form lands with a human who can understand the product, the context, and
              whether there is a useful next step before we suggest a call or scope.
            </p>
            <div className="cfc-trust-line">
              <span>Product discovery</span>
              <span>Search systems</span>
              <span>Lifecycle</span>
              <span>Data + testing</span>
            </div>
          </div>
          <div className="cfc-timeline-card">
            {AFTER_SUBMIT.map((item, index) => (
              <article key={item.title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                  <small>{item.timing}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cfc-faq-section">
        <div className="cfc-shell cfc-faq-grid">
          <div>
            <p className="cfc-kicker">Before you ask</p>
            <h2>
              Honest <span>answers</span> to the questions everyone asks first.
            </h2>
            <p>If yours is not here, put it in the form. We will address it in the reply.</p>
          </div>
          <div className="cfc-faq-list">
            {FAQS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <article className="cfc-faq-item" key={item.question}>
                  <button aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? -1 : index)} type="button">
                    <span>{item.question}</span>
                    <b>{isOpen ? "x" : "+"}</b>
                  </button>
                  {isOpen ? <p>{item.answer}</p> : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactStep({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="cfc-step">
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="cfc-step-body">{children}</div>
    </div>
  );
}

function ChoiceGrid({
  onToggle,
  options,
  selected,
}: {
  onToggle: (value: string) => void;
  options: readonly string[];
  selected: string[];
}) {
  return (
    <div className="cfc-choice-grid">
      {options.map((option) => (
        <button
          aria-pressed={selected.includes(option)}
          className={selected.includes(option) ? "cfc-choice is-selected" : "cfc-choice"}
          key={option}
          onClick={() => onToggle(option)}
          type="button"
        >
          <span aria-hidden="true" />
          {option}
        </button>
      ))}
    </div>
  );
}

function ChoiceGroup({
  label,
  onToggle,
  options,
  selected,
}: {
  label: string;
  onToggle: (value: string) => void;
  options: readonly string[];
  selected: string[];
}) {
  return (
    <div className="cfc-choice-group">
      <p>{label}</p>
      <ChoiceGrid onToggle={onToggle} options={options} selected={selected} />
    </div>
  );
}
