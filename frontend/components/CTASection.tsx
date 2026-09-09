"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-[#9F201C] text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(242,234,211,0.18),transparent_70%)] pointer-events-none" />
      <div className="max-w-2xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl text-white mb-6 font-ruqaa">
          {t("cta.heading")}
        </h2>
        <p className="text-brand-cream text-lg mb-10 leading-relaxed font-readex">
          {t("cta.subheading")}
        </p>
        <a
          href="#trial"
          className="inline-flex items-center justify-center bg-brand-cream text-brand-headline px-10 py-4 rounded-full font-bold text-base shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 border border-white/20 font-readex"
        >
          {t("cta.button")}
        </a>
      </div>
    </section>
  );
}
