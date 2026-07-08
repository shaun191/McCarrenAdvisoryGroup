import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
  ResourcePopup — free-resource lead magnet for McCarren Advisory Group.

  Flow: choose a topic -> enter name + email -> the matching PDF downloads
  instantly, the lead is sent to Dynamics 365, and a Google Ads lead
  conversion fires.

  ─────────────────────────────────────────────────────────────────────────
  WIRING THE LEAD TO DYNAMICS 365  (see RESOURCE_POPUP_SETUP.md for full steps)
  Paste your Power Automate "When an HTTP request is received" URL below.
  Until you do, the popup still works end-to-end (PDF downloads, conversion
  fires); the lead POST is simply skipped.
*/
const LEAD_ENDPOINT = ""; // e.g. "https://prod-xx.westus.logic.azure.com/workflows/.../triggers/manual/paths/invoke?..."

// Optional: a dedicated Google Ads "lead" conversion label, e.g. "AW-18291211119/AbCdEfg".
// Leave blank to only fire the standard GA4 "generate_lead" event.
const LEAD_CONVERSION_SEND_TO = "";

// Show the timed popup after this many seconds (exit-intent can trigger sooner).
const AUTO_OPEN_DELAY_MS = 25000;
const SEEN_KEY = "mag_resource_popup_seen_v1";

const TOPICS = [
  {
    key: "family-business",
    label: "Family Business",
    blurb: "Protect the family, the legacy, and the value of the business — at the same time.",
    file: "/resources/McCarren_Family_Business_Continuity_Guide.pdf",
    guide: "The Family Business Continuity Guide",
  },
  {
    key: "business-advisement",
    label: "Business Advisement",
    blurb: "Five levers that make your company run — and sell — without depending on you.",
    file: "/resources/McCarren_Owner_Independent_Business_Guide.pdf",
    guide: "The Owner-Independent Business Guide",
  },
  {
    key: "succession-planning",
    label: "Succession Planning",
    blurb: "A practical roadmap to transition on your terms — by sale, family, or management.",
    file: "/resources/McCarren_Succession_Readiness_Guide.pdf",
    guide: "The Succession Readiness Guide",
  },
];

function TopicIcon({ variant, className = "h-6 w-6" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  if (variant === "family-business") {
    return (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  }
  if (variant === "business-advisement") {
    return (
      <svg {...common}>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
      <path d="M8 12h8" />
      <path d="M8 16h6" />
    </svg>
  );
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function ResourcePopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("choose"); // choose | form | done
  const [topic, setTopic] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const seenRef = useRef(false);

  // Auto-open once per visitor: timed + exit-intent.
  useEffect(() => {
    try {
      seenRef.current = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seenRef.current = false;
    }
    if (seenRef.current) return;

    const openAuto = () => {
      if (seenRef.current) return;
      seenRef.current = true;
      try {
        window.localStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
      setStep("choose");
      setOpen(true);
    };

    const timer = window.setTimeout(openAuto, AUTO_OPEN_DELAY_MS);
    const onMouseLeave = (e) => {
      if (e.clientY <= 0) openAuto();
    };
    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  // Lock body scroll + ESC to close while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openManually() {
    seenRef.current = true;
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setStep("choose");
    setOpen(true);
  }

  function close() {
    setOpen(false);
    // Reset after the exit animation so a re-open starts fresh.
    window.setTimeout(() => {
      setStep("choose");
      setTopic(null);
      setError("");
      setForm({ name: "", email: "", company: "", phone: "" });
    }, 250);
  }

  function chooseTopic(t) {
    setTopic(t);
    setStep("form");
  }

  function downloadGuide(t) {
    const a = document.createElement("a");
    a.href = t.file;
    a.download = t.file.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!isValidEmail(form.email)) return setError("Please enter a valid email address.");

    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      phone: form.phone.trim(),
      topic: topic.key,
      topicLabel: topic.label,
      guide: topic.guide,
      source: "website-resource-popup",
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      submittedAt: new Date().toISOString(),
    };

    // Best-effort send to Dynamics 365 (via Power Automate). Never block the
    // download on a network hiccup — the visitor still gets their guide.
    if (LEAD_ENDPOINT) {
      try {
        await fetch(LEAD_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        /* swallow — lead can be recaptured; UX continues */
      }
    }

    // Analytics: standard lead event + optional dedicated Ads conversion.
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "generate_lead", {
        lead_topic: topic.label,
        value: 1,
      });
      if (LEAD_CONVERSION_SEND_TO) {
        window.gtag("event", "conversion", { send_to: LEAD_CONVERSION_SEND_TO });
      }
    }

    downloadGuide(topic);
    setSubmitting(false);
    setStep("done");
  }

  return (
    <>
      {/* Persistent launcher — always available even after the auto-popup is dismissed */}
      <button
        type="button"
        onClick={openManually}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-600 hover:shadow-xl"
        aria-label="Get a free resource"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M12 18v-6" />
          <path d="m9 15 3 3 3-3" />
        </svg>
        Free Guides
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={close}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Free resources"
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <button
                type="button"
                onClick={close}
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              {/* STEP 1 — CHOOSE TOPIC */}
              {step === "choose" && (
                <div className="p-8 sm:p-10">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Free guide</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Which challenge is closest to home right now?
                  </h2>
                  <p className="mt-3 leading-7 text-slate-600">
                    Pick one and we&rsquo;ll send you a practical, no-fluff guide built from real
                    founder-led transitions.
                  </p>
                  <div className="mt-7 grid gap-4">
                    {TOPICS.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => chooseTopic(t)}
                        className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                          <TopicIcon variant={t.key} />
                        </span>
                        <span className="flex-1">
                          <span className="block text-lg font-semibold text-slate-950">{t.label}</span>
                          <span className="mt-1 block text-sm leading-6 text-slate-600">{t.blurb}</span>
                        </span>
                        <svg className="mt-3 h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2 — FORM */}
              {step === "form" && topic && (
                <div className="grid sm:grid-cols-5">
                  <div className="hidden bg-slate-950 p-8 text-white sm:col-span-2 sm:block">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <TopicIcon variant={topic.key} />
                    </span>
                    <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                      Your guide
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug">{topic.guide}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{topic.blurb}</p>
                    <button
                      type="button"
                      onClick={() => setStep("choose")}
                      className="mt-8 text-sm font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
                    >
                      &larr; Choose a different topic
                    </button>
                    <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                      <img
                        src="/shaun.jpg"
                        alt="Shaun McCarren"
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div className="text-xs leading-tight text-slate-300">
                        <div className="font-semibold text-white">Shaun McCarren</div>
                        <div>Founder, McCarren Advisory</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 sm:col-span-3">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                      Where should we send it?
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Enter your details and your guide downloads right away.
                    </p>
                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <label htmlFor="mag-name" className="block text-sm font-medium text-slate-700">Name</label>
                        <input
                          id="mag-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                          placeholder="Jane Owner"
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label htmlFor="mag-email" className="block text-sm font-medium text-slate-700">Work email</label>
                        <input
                          id="mag-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                          placeholder="jane@company.com"
                          autoComplete="email"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="mag-company" className="block text-sm font-medium text-slate-700">
                            Company <span className="font-normal text-slate-400">(optional)</span>
                          </label>
                          <input
                            id="mag-company"
                            type="text"
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            placeholder="Acme Mfg."
                            autoComplete="organization"
                          />
                        </div>
                        <div>
                          <label htmlFor="mag-phone" className="block text-sm font-medium text-slate-700">
                            Phone <span className="font-normal text-slate-400">(optional)</span>
                          </label>
                          <input
                            id="mag-phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            placeholder="(779) 555-0100"
                            autoComplete="tel"
                          />
                        </div>
                      </div>

                      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? "Preparing your guide…" : "Get my free guide"}
                      </button>
                      <p className="text-xs leading-5 text-slate-500">
                        We&rsquo;ll email you occasional, useful notes on succession and owner
                        independence. No spam, unsubscribe anytime. See our{" "}
                        <a href="/privacy.html" className="underline hover:text-slate-700">Privacy Policy</a>.
                      </p>
                    </form>
                  </div>
                </div>
              )}

              {/* STEP 3 — DONE */}
              {step === "done" && topic && (
                <div className="p-8 text-center sm:p-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-5" />
                    </svg>
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                    Your guide is on its way down.
                  </h2>
                  <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
                    <span className="font-semibold text-slate-900">{topic.guide}</span> should be in
                    your downloads. If it didn&rsquo;t start,{" "}
                    <button
                      type="button"
                      onClick={() => downloadGuide(topic)}
                      className="font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-800"
                    >
                      click here to download it
                    </button>
                    .
                  </p>
                  <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-left">
                    <p className="text-sm font-semibold text-slate-900">Want to talk it through?</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      A 30-minute confidential call — no pitch, just an honest read on your situation.
                    </p>
                    <a
                      href="https://outlook.office.com/book/McCarrenAdvisoryGroup@flow-eze.com/?ismsaljsauthenabled"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center rounded-2xl bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                    >
                      Schedule a readiness call
                      <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-6 text-sm font-medium text-slate-500 hover:text-slate-700"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
