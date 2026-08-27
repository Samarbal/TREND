import Reveal from "./Reveal";

const WORKFLOW_STEPS = ["Brief", "Plan", "Carousel", "Export"];

const STUDIO_FEATURES = [
  {
    icon: "↻",
    title: "Unlimited requests",
    body: "Every request from the Content Studio is independent and repeatable without limits, with no need to redo any previous step.",
  },
  {
    icon: "▤",
    title: "Auto-adjusted sizing",
    body: "Image dimensions are automatically adjusted to fit every platform — Instagram, Facebook, and more — without any manual work.",
  },
  {
    icon: "⬇",
    title: "Instant save & download",
    body: "Save or download any post instantly (as text or image) to use right away outside the platform.",
  },
];

const SLIDES = [
  { text: "Organic Coffee\nwith Levantine Soul", dark: true },
  { text: "Start\nyour day with authentic flavor", dark: false },
  { text: "Order\nNow", dark: true },
];

export default function StudioSection() {
  return (
    <section className="py-24 bg-brand-cream relative" id="studio">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-16 items-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/30 text-brand-headline font-bold text-xs px-4 py-1.5 rounded-full mb-5 font-readex">
            <i className="w-2 h-2 rounded-full bg-brand-primary block" />
            Content Studio
          </div>
          <h2 className="text-4xl md:text-5xl mb-6 font-ruqaa text-brand-headline">
            Ready-to-publish content, whenever you need it
          </h2>
          <p className="text-lg opacity-80 leading-relaxed mb-8 font-readex text-brand-ink">
            Once your identity is complete, the Content Creator becomes a permanent
            part of your dashboard — request a new post anytime, and it
            automatically reads your saved identity to keep everything consistent.
          </p>

          <div className="flex flex-wrap gap-2 mb-10 font-readex items-center">
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white border border-brand-accent/30 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  <b className="text-brand-primary font-ruqaa text-lg">{i + 1}</b>
                  {step}
                </div>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <div className="text-brand-accent/60 self-center">→</div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6 font-readex text-brand-ink">
            {STUDIO_FEATURES.map((feature) => (
              <div key={feature.title} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-lg shrink-0 border border-brand-primary/20">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold mb-1 font-ruqaa text-brand-headline">
                    {feature.title}
                  </h4>
                  <p className="text-sm opacity-75 leading-relaxed">{feature.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="relative">
          <div className="bg-white rounded-3xl p-6 shadow-card border border-brand-accent/20 relative z-10">
            <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4 font-readex">
              <div className="flex items-center gap-3 font-bold text-sm text-brand-headline">
                <div className="w-8 h-8 rounded-full bg-brand-headline flex items-center justify-center text-brand-accent font-ruqaa text-xs">
                  N
                </div>
                Noura Coffee
              </div>
              <div className="text-xs text-brand-accent font-bold">
                Carousel — 3 slides
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className={`aspect-[4/5] rounded-xl border border-brand-accent/30 flex items-center justify-center text-center p-3 font-ruqaa text-sm shadow-inner whitespace-pre-line ${
                    slide.dark
                      ? "bg-brand-headline text-white"
                      : "bg-brand-bg text-brand-headline"
                  }`}
                >
                  {slide.text}
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-600 leading-relaxed mb-5 bg-gray-50 p-3 rounded-xl border border-gray-100 font-readex">
              ☕ When the organic bean meets authentic Levantine flavor… Noura is
              born. Taste the difference from the first sip.
            </div>

            <div className="flex gap-3 font-readex">
              <div className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold border border-brand-headline text-brand-headline cursor-pointer hover:bg-gray-50">
                Save
              </div>
              <div className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold bg-brand-primary text-white cursor-pointer hover:bg-brand-primary/90 shadow-md">
                Download
              </div>
            </div>
          </div>

          <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl -z-10" />
        </Reveal>
      </div>
    </section>
  );
}
