import Reveal from "./Reveal";

const FEATURES = [
  {
    tag: "01 — Cost",
    title: "Replace an entire team",
    body: "No need to hire a separate market researcher, brand designer, and content writer. Trendy combines them into one AI assistant for a simple subscription cost.",
  },
  {
    tag: "02 — Time",
    title: "From months to minutes",
    body: "The branding journey that usually takes weeks of meetings and revisions becomes a smart, streamlined pipeline completed in a single session.",
  },
  {
    tag: "03 — Decisions",
    title: "Decisions backed by data",
    body: "Competitor reports, market trends, and real SWOT analysis before you spend a single dollar on marketing or design.",
  },
];

export default function WhySection() {
  return (
    <section className="py-24 bg-brand-headline text-brand-bg relative border-y border-brand-accent/20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-bg/10 border border-brand-bg/20 text-brand-bg font-bold text-xs px-4 py-1.5 rounded-full mb-5 font-readex">
            <i className="w-2 h-2 rounded-full bg-brand-accent block" />
            Why Trendy
          </div>
          <h2 className="text-4xl md:text-5xl mb-4 text-white font-ruqaa">
            Built to save you three things
          </h2>
          <p className="text-lg opacity-80 leading-relaxed font-readex">
            Time, cost, and confusion. Every feature on the platform is designed to
            serve these three goals.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <Reveal
              key={feature.title}
              className="bg-brand-bg/5 border border-brand-accent/20 rounded-2xl p-8 hover:-translate-y-1.5 hover:bg-brand-bg/10 transition-all duration-300 group"
            >
              <div className="font-ruqaa text-brand-accent text-lg mb-4 tracking-wider group-hover:text-brand-primary transition-colors">
                {feature.tag}
              </div>
              <h3 className="font-ruqaa font-bold text-2xl text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm opacity-70 leading-relaxed font-readex">
                {feature.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
