"use client";

import Reveal from "./Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AudiencesSection() {
  const { t } = useLanguage();

  const AUDIENCES = [
    {
      title: t("audiences.audience1Title"),
      body: t("audiences.audience1Body"),
    },
    {
      title: t("audiences.audience2Title"),
      body: t("audiences.audience2Body"),
    },
    {
      title: t("audiences.audience3Title"),
      body: t("audiences.audience3Body"),
    },
  ];

  return (
    <section className="py-24 bg-brand-cream relative" id="audiences">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/30 text-brand-headline font-bold text-xs px-4 py-1.5 rounded-full mb-5 font-readex">
            <i className="w-2 h-2 rounded-full bg-brand-primary block" />
            {t("audiences.badge")}
          </div>
          <h2 className="text-4xl md:text-5xl mb-4 font-ruqaa text-brand-headline">
            {t("audiences.heading")}
          </h2>
          <p className="text-lg opacity-80 leading-relaxed font-readex text-brand-ink">
            {t("audiences.subheading")}
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
