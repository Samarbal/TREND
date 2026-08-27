import Reveal from "./Reveal";

const AUDIENCES = [
  {
    title: "Founders & Entrepreneurs",
    body: "You have a product idea and need to build a fast, affordable brand without deep marketing expertise.",
  },
  {
    title: "Small Business Owners",
    body: "You want to refresh your current identity or continuously produce professional content through the Content Studio.",
  },
  {
    title: "Established Brand Owners",
    body: "Already have a logo and colors? Import them directly and benefit from market analysis and content without generating a new identity from scratch.",
  },
];

export default function AudiencesSection() {
  return (
    <section className="py-24 bg-brand-cream relative" id="audiences">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/30 text-brand-headline font-bold text-xs px-4 py-1.5 rounded-full mb-5 font-readex">
            <i className="w-2 h-2 rounded-full bg-brand-primary block" />
            Who is this for?
          </div>
          <h2 className="text-4xl md:text-5xl mb-4 font-ruqaa text-brand-headline">
            Wherever you&apos;re starting from
          </h2>
          <p className="text-lg opacity-80 leading-relaxed font-readex text-brand-ink">
            Whether you have just an idea, a small project, or an existing brand —
            we have a path that fits you.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {AUDIENCES.map((audience) => (
            <Reveal
              key={audience.title}
              className="bg-white border border-brand-accent/20 rounded-2xl p-8 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-card"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-accent/10 text-brand-primary flex items-center justify-center text-xl mb-6 border border-brand-accent/30">
                ◆
              </div>
              <h3 className="font-ruqaa font-bold text-xl text-brand-headline mb-3">
                {audience.title}
              </h3>
              <p className="text-sm opacity-75 leading-relaxed font-readex text-brand-ink">
                {audience.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
