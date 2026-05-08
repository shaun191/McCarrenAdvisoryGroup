import React from "react";
import { motion } from "framer-motion";


function IconBase({ children, className = "h-6 w-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function ArrowRight({ className }) {
  return (
    <IconBase className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </IconBase>
  );
}

function CheckCircle({ className }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-5" />
    </IconBase>
  );
}

function ClipboardIcon({ className }) {
  return (
    <IconBase className={className}>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
      <path d="M8 12h8" />
      <path d="M8 16h6" />
    </IconBase>
  );
}

function FactoryIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M3 21h18" />
      <path d="M5 21V9l5 3V9l5 3V5h4v16" />
      <path d="M9 17h1" />
      <path d="M14 17h1" />
    </IconBase>
  );
}

function UsersIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconBase>
  );
}

function LineChartIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </IconBase>
  );
}

function BriefcaseIcon({ className }) {
  return (
    <IconBase className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M2 13h20" />
    </IconBase>
  );
}

function ShieldIcon({ className }) {
  return (
    <IconBase className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-5" />
    </IconBase>
  );
}

const services = [
  {
    icon: ClipboardIcon,
    title: "Succession Readiness Assessment",
    text: "A practical diagnostic for founder-led companies to identify owner dependency, leadership gaps, process risk, and transferability issues before they become expensive problems.",
    bullets: ["Owner dependency score", "Leadership bench review", "90-day action roadmap"]
  },
  {
    icon: FactoryIcon,
    title: "Operational Succession Planning",
    text: "Turn tribal knowledge and founder-driven decisions into systems, operating rhythms, accountability, and documented processes that the next leader can actually run.",
    bullets: ["Decision-rights mapping", "SOP and KPI structure", "Management cadence"]
  },
  {
    icon: UsersIcon,
    title: "Successor & Leadership Transition",
    text: "Support internal successors, family members, or hired operators as they step into real operating authority without destabilizing the business.",
    bullets: ["Successor coaching", "Role clarity", "Founder-to-operator transition"]
  },
  {
    icon: LineChartIcon,
    title: "Pre-Exit Operational Readiness",
    text: "Prepare a business for sale, investment, or generational transfer by improving operational maturity, reporting discipline, leadership depth, and buyer confidence.",
    bullets: ["Transferability roadmap", "EBITDA quality support", "Diligence preparation"]
  },
  {
    icon: BriefcaseIcon,
    title: "Fractional COO / Transition Operator",
    text: "Hands-on operating support for owners who need an experienced manufacturing executive to stabilize, professionalize, or bridge leadership capacity.",
    bullets: ["Fractional COO support", "Execution leadership", "Operating system buildout"]
  },
  {
    icon: ShieldIcon,
    title: "Family Business Risk Reduction",
    text: "Help owners, families, advisors, and stakeholders separate emotional complexity from operational reality and protect enterprise value through transition.",
    bullets: ["Family/operator alignment", "Continuity planning", "Governance basics"]
  }
];

const industries = [
  "Manufacturing",
  "Packaging",
  "Contract Decorating",
  "Industrial Services",
  "Distribution",
  "Founder-Led B2B Companies"
];

function runSanityTests() {
  console.assert(services.length === 6, "Expected six service cards.");
  console.assert(industries.length >= 5, "Expected at least five industry tags.");
  console.assert(
    services.every((service) => service.title && service.text && service.bullets.length >= 3),
    "Every service should include a title, description, and at least three bullets."
  );
}

runSanityTests();

export default function FounderTransitionWebsite() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.18),_transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <nav className="flex items-center justify-between">
            <div className="text-lg font-semibold tracking-tight">McCarren Advisory Group</div>
            <div className="hidden gap-8 text-sm text-slate-300 md:flex">
              <a href="#services" className="hover:text-white">Services</a>
              <a href="#fit" className="hover:text-white">Who We Help</a>
              <a href="#process" className="hover:text-white">Process</a>
              <a href="#contact" className="hover:text-white">Contact</a>
            </div>
          </nav>

          <div className="grid items-center gap-12 py-24 lg:grid-cols-2 lg:py-32">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-6 inline-flex rounded-full border border-slate-700 bg-white/5 px-4 py-2 text-sm text-slate-300">
                Operational succession for founder-led companies
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Make your business transferable before transition forces your hand.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                We help founder-led manufacturing and industrial companies reduce owner dependency, build leadership capacity, professionalize operations, and prepare for succession, sale, or generational transfer.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a href='https://outlook.office.com/book/McCarrenAdvisoryGroup@flow-eze.com/?ismsaljsauthenabled'
  target="_blank"
  rel="noopener noreferrer" className="inline-flex items-center rounded-2xl bg-white px-6 py-4 text-base font-semibold text-slate-950 shadow-sm hover:bg-slate-100">
                  Schedule a Readiness Call <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a href="#services" className="inline-flex items-center rounded-2xl border border-slate-600 bg-white/5 px-6 py-4 text-base font-semibold text-white hover:bg-white/10">
                  View Services
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <div className="rounded-3xl border border-slate-800 bg-white/10 p-8 shadow-2xl backdrop-blur">
                  <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-300">The core question</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">
                    Could the company run without the owner for 90 days?
                  </h2>
                  <div className="mt-8 space-y-5 text-slate-300">
                    {[
                      "Are key decisions stuck with one person?",
                      "Is customer knowledge documented or relationship-dependent?",
                      "Can managers read the numbers and act on them?",
                      "Is the next leader truly ready to operate the business?"
                    ].map((item) => (
                      <div key={item} className="flex gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="fit" className="bg-white py-20 text-slate-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Who we help</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Built for owners who are still too central to the business.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Our work is designed for privately held, founder-led, family-owned, and lower-middle-market companies where leadership transition is not just an HR issue — it is an operational risk.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {industries.map((industry) => (
              <span key={industry} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-slate-50 py-20 text-slate-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Services</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Practical advisory for the pieces that make succession work.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{service.text}</p>
                    <ul className="mt-5 space-y-2 text-sm text-slate-700">
                      {service.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="process" className="bg-white py-20 text-slate-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Process</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Start with a clear picture of the risk.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Most owners wait until a sale, illness, family conflict, or leadership gap exposes how dependent the business really is. We start by identifying the operating risks, then build a focused plan to reduce them.
              </p>
            </div>
            <div className="space-y-5">
              {[
                ["01", "Assess", "Interview ownership and key managers, review operations, evaluate owner dependency, and identify succession constraints."],
                ["02", "Prioritize", "Separate urgent transition risks from nice-to-have improvements and build a practical roadmap."],
                ["03", "Build", "Install operating rhythms, decision structures, KPIs, documentation, and management accountability."],
                ["04", "Transition", "Support the founder, successor, family, or hired operator through the change in authority and responsibility."]
              ].map(([num, title, text]) => (
                <div key={num} className="rounded-3xl border border-slate-200 p-6">
                  <div className="flex gap-5">
                    <div className="text-sm font-semibold text-sky-700">{num}</div>
                    <div>
                      <h3 className="text-xl font-semibold">{title}</h3>
                      <p className="mt-2 leading-7 text-slate-600">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">Positioning</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                Succession is not only about who comes next. It is about whether the business is ready to be led by anyone else.
              </h2>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-white/5 p-7">
              <h3 className="text-xl font-semibold">Common triggers</h3>
              <ul className="mt-5 space-y-3 text-slate-300">
                <li>Founder wants to step back</li>
                <li>Family successor is uncertain</li>
                <li>Key manager may leave</li>
                <li>Sale or recapitalization is being considered</li>
                <li>Business depends too heavily on the owner</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white py-20 text-slate-950">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Ready to understand how transferable your business really is?
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Start with a confidential readiness conversation. We will discuss where the business is most dependent on the current owner and what would need to change before succession, sale, or transition.
          </p>
          <div className="mt-10">
            <a href="mailto:preparedwith@mccarrenadvisory.com" className="inline-flex items-center rounded-2xl bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-slate-800">
              Contact McCarren Advisory Group <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500">Schedule a complimentary call here</p>
        </div>
      </section>
    </div>
  );
}

