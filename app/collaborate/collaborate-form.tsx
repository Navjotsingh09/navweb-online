"use client";

import { useMemo, useState } from "react";

type Step = 0 | 1 | 2 | 3;

const PROJECT_TYPES = [
  "AI-assisted editorial / writing",
  "Web development",
  "Mobile app development",
  "Figma designs",
  "AI-assisted fast code",
  "Research",
  "Other",
];

const BUDGETS = [
  "Under £1k",
  "£1k – £5k",
  "£5k – £15k",
  "£15k – £50k",
  "£50k+",
  "Let's discuss",
];

const TIMELINES = ["This month", "1–3 months", "3–6 months", "Flexible"];

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
};

export function CollaborateForm() {
  const [step, setStep] = useState<Step>(0);
  const [data, setData] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const stepValid = useMemo(() => {
    if (step === 0) return data.projectType !== "";
    if (step === 1) return data.budget !== "" && data.timeline !== "";
    if (step === 2)
      return (
        data.name.trim().length > 1 &&
        /\S+@\S+\.\S+/.test(data.email) &&
        data.message.trim().length > 5
      );
    return true;
  }, [step, data]);

  const update = (patch: Partial<FormState>) =>
    setData((prev) => ({ ...prev, ...patch }));

  async function handleSubmit() {
    if (!stepValid) return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/navjot.singh@5rv.digital",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `New collaboration enquiry — ${data.projectType}`,
            _template: "table",
            _captcha: "false",
            name: data.name,
            email: data.email,
            phone: data.phone || "(not provided)",
            company: data.company || "(not provided)",
            projectType: data.projectType,
            budget: data.budget,
            timeline: data.timeline,
            message: data.message,
          }),
        }
      );

      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const json = await res.json().catch(() => ({}));
      if (json.success === "false") throw new Error(json.message ?? "Failed");

      setStatus("success");
      setStep(3);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please email directly."
      );
    }
  }

  const totalSteps = 3;
  const progress = ((Math.min(step, totalSteps) / totalSteps) * 100).toFixed(0);

  return (
    <section className="collab-form-card liquid-glass" aria-label="Collaboration form">
      <header className="collab-form-head">
        <div className="collab-progress" aria-hidden="true">
          <div
            className="collab-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="collab-step-label">
          {status === "success"
            ? "Done"
            : `Step ${Math.min(step + 1, totalSteps)} of ${totalSteps}`}
        </p>
      </header>

      {status === "success" ? (
        <div className="collab-success">
          <p className="collab-success-kicker">Sent</p>
          <h2 className="collab-success-title">
            Thanks, {data.name.split(" ")[0] || "friend"}.
          </h2>
          <p className="collab-success-body">
            Your note is on its way to my inbox. I usually reply within a
            working day. If it&apos;s urgent, ring{" "}
            <a href="tel:+447587830397">07587 830 397</a>.
          </p>
          <button
            type="button"
            className="collab-link"
            onClick={() => {
              setStep(0);
              setData(INITIAL);
              setStatus("idle");
            }}
          >
            Send another →
          </button>
        </div>
      ) : (
        <div className="collab-step-stack">
          {step === 0 && (
            <div className="collab-step">
              <p className="collab-q-kicker">01</p>
              <h2 className="collab-q">What kind of project is this?</h2>
              <div className="collab-chip-grid">
                {PROJECT_TYPES.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`collab-chip ${
                      data.projectType === opt ? "is-active" : ""
                    }`}
                    onClick={() => {
                      update({ projectType: opt });
                      setTimeout(() => setStep(1), 220);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="collab-step">
              <p className="collab-q-kicker">02</p>
              <h2 className="collab-q">Budget &amp; timing.</h2>

              <p className="collab-sublabel">Rough budget</p>
              <div className="collab-chip-grid">
                {BUDGETS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`collab-chip ${
                      data.budget === opt ? "is-active" : ""
                    }`}
                    onClick={() => update({ budget: opt })}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <p className="collab-sublabel">Timeline</p>
              <div className="collab-chip-grid">
                {TIMELINES.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`collab-chip ${
                      data.timeline === opt ? "is-active" : ""
                    }`}
                    onClick={() => update({ timeline: opt })}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="collab-step">
              <p className="collab-q-kicker">03</p>
              <h2 className="collab-q">A little about you.</h2>

              <div className="collab-field-row">
                <label className="collab-field">
                  <span>Your name *</span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={data.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="Ada Lovelace"
                  />
                </label>
                <label className="collab-field">
                  <span>Email *</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => update({ email: e.target.value })}
                    placeholder="you@studio.com"
                  />
                </label>
              </div>

              <div className="collab-field-row">
                <label className="collab-field">
                  <span>Phone</span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={data.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                    placeholder="Optional"
                  />
                </label>
                <label className="collab-field">
                  <span>Company</span>
                  <input
                    type="text"
                    autoComplete="organization"
                    value={data.company}
                    onChange={(e) => update({ company: e.target.value })}
                    placeholder="Optional"
                  />
                </label>
              </div>

              <label className="collab-field">
                <span>Tell me more *</span>
                <textarea
                  rows={5}
                  value={data.message}
                  onChange={(e) => update({ message: e.target.value })}
                  placeholder="What are you trying to build, write, or solve?"
                />
              </label>
            </div>
          )}

          {status === "error" && (
            <p className="collab-error" role="alert">
              {errorMsg}{" "}
              <a href="mailto:navjot.singh@5rv.digital">Email directly →</a>
            </p>
          )}

          <div className="collab-actions">
            {step > 0 && (
              <button
                type="button"
                className="collab-btn-ghost"
                onClick={() => setStep((s) => (s - 1) as Step)}
              >
                ← Back
              </button>
            )}
            {!stepValid && step < 2 && (
              <span className="collab-hint" aria-live="polite">
                {step === 0
                  ? "Pick a project type to continue"
                  : "Pick a budget and timeline to continue"}
              </span>
            )}
            {step < 2 ? (
              <button
                type="button"
                className="collab-btn-primary liquid-glass-strong"
                disabled={!stepValid}
                onClick={() => setStep((s) => (s + 1) as Step)}
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                className="collab-btn-primary liquid-glass-strong"
                disabled={!stepValid || status === "submitting"}
                onClick={handleSubmit}
              >
                {status === "submitting" ? "Sending…" : "Send enquiry →"}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
