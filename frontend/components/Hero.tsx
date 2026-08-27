import Reveal from "./Reveal";

const PHONE_STEPS = [
  { n: "1", label: "Brief", active: true },
  { n: "2", label: "Plan", active: false },
  { n: "3", label: "Carousel", active: false },
  { n: "4", label: "Export", active: false },
];

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden" id="hero">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative z-10">
        <Reveal>
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/30 text-brand-headline font-bold text-xs px-4 py-1.5 rounded-full mb-6">
            <i className="w-2 h-2 rounded-full bg-brand-primary block" />
            AI-Powered Brand Builder
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-[4rem] leading-tight mb-6 font-ruqaa text-brand-headline">
            From a simple idea… to a{" "}
            <em className="not-italic text-brand-primary">brand</em> ready to launch
          </h1>
          <p className="text-lg leading-relaxed text-brand-ink/80 max-w-xl mb-10 font-medium font-readex">
            Trendy is your AI assistant for building brands: market analysis, visual
            identity, and ready-to-publish marketing content — it speaks your
            language and understands your market, in minutes, not months.
          </p>
          <div className="flex flex-wrap gap-4 items-center mb-10">
            <a
              href="#trial"
              className="inline-flex items-center justify-center bg-brand-primary text-[#fafafa] px-8 py-3.5 rounded-full font-bold text-base shadow-vintage hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
            >
              Start Your Free Trial
            </a>
          </div>
          <div className="flex flex-wrap gap-6">
            {["No credit card required", "AI-powered end-to-end", "Results in seconds"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-bold text-brand-headline/80 font-readex"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent block" />
                  {item}
                </div>
              )
            )}
          </div>
        </Reveal>

        <Reveal className="relative flex justify-center items-center min-h-[500px] lg:order-last order-first">
          <div className="absolute w-[340px] md:w-[400px] h-[480px] bg-brand-headline rounded-t-full rounded-b-3xl shadow-2xl opacity-90 border border-brand-accent/20" />

          <div className="relative z-10 w-[280px] bg-[#111] rounded-[2.5rem] p-3 shadow-2xl border border-white/10">
            <div className="bg-white rounded-[1.75rem] overflow-hidden flex flex-col h-[520px]">
              <div className="bg-brand-headline text-white px-4 py-3 flex items-center justify-between">
                <div className="font-bold text-sm flex items-center gap-1 font-ruqaa text-brand-accent">
                  ✦ Trendy
                </div>
                <div className="text-[10px] opacity-70 font-readex">
                  Creating Instagram content
                </div>
              </div>

              <div className="flex justify-between px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 font-readex">
                {PHONE_STEPS.map((step) => (
                  <div
                    key={step.n}
                    className={`flex flex-col items-center gap-1.5 flex-1 ${step.active ? "text-brand-headline" : ""
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step.active
                          ? "bg-brand-primary text-white"
                          : "bg-gray-100"
                        }`}
                    >
                      {step.n}
                    </div>
                    {step.label}
                  </div>
                ))}
              </div>

              <div className="p-4 text-[11px] text-brand-headline flex-1 bg-brand-cream/30 font-readex">
                <div className="font-bold text-[12px] mb-1.5 mt-2">Idea / Product *</div>
                <div className="border border-brand-accent/30 rounded-lg p-2.5 text-[10.5px] text-gray-500 mb-2 bg-white">
                  e.g., specialty coffee with Levantine flavors
                </div>
                <div className="font-bold text-[12px] mb-1.5 mt-3">Brand Name</div>
                <div className="border border-brand-accent/30 rounded-lg p-2.5 text-[10.5px] text-gray-400 mb-2 bg-white">
                  Optional
                </div>
                <div className="font-bold text-[12px] mb-1.5 mt-3">Colors &amp; Font</div>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 text-center">
                    <div className="h-6 rounded-md mb-1 border border-black/10 bg-brand-headline" />
                    <span className="text-[8.5px] text-gray-500">Primary</span>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="h-6 rounded-md mb-1 border border-black/10 bg-brand-primary" />
                    <span className="text-[8.5px] text-gray-500">Secondary</span>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="h-6 rounded-md mb-1 border border-black/10 bg-brand-accent" />
                    <span className="text-[8.5px] text-gray-500">Accent</span>
                  </div>
                </div>
                <div className="mt-4 bg-brand-primary text-white text-center p-2.5 rounded-lg font-bold text-[12px] shadow-sm">
                  Next: Generate Plan →
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex absolute z-20 top-12 -right-8 bg-white rounded-2xl p-3 shadow-xl items-center gap-2 text-xs font-bold text-brand-headline border border-brand-accent/20 font-readex">
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm">
              ✓
            </div>
            Complete brand strategy
          </div>
          <div className="hidden sm:flex absolute z-20 bottom-16 -left-6 bg-white rounded-2xl p-3 shadow-xl items-center gap-2 text-xs font-bold text-brand-headline border border-brand-accent/20 font-readex">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm">
              ✎
            </div>
            3 identity suggestions
          </div>
        </Reveal>
      </div>
    </section>
  );
}
