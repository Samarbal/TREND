"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TrialSection() {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const TRIAL_STEPS = [
    {
      n: "1",
      title: t("trial.step1Title"),
      body: t("trial.step1Body"),
    },
    {
      n: "2",
      title: t("trial.step2Title"),
      body: t("trial.step2Body"),
    },
    {
      n: "3",
      title: t("trial.step3Title"),
      body: t("trial.step3Body"),
    },
  ];

  return (
    <section className="py-24 bg-brand-bg relative" id="trial">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/30 text-brand-headline font-bold text-xs px-4 py-1.5 rounded-full mb-5 font-readex">
            <i className="w-2 h-2 rounded-full bg-brand-primary block" />
            {t("trial.badge")}
          </div>
          <h2 className="text-4xl md:text-5xl mb-6 font-ruqaa text-brand-headline">
            {t("trial.heading")}
          </h2>
          <p className="text-lg opacity-80 leading-relaxed mb-8 font-readex text-brand-ink">
            {t("trial.subheading")}
          </p>

          <div className="flex flex-col gap-0 mt-4 font-readex text-brand-ink">
            {TRIAL_STEPS.map((step) => (
              <div
                key={step.n}
                className="flex gap-4 py-5 border-b border-brand-accent/20 last:border-0"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-headline text-brand-accent flex items-center justify-center text-lg font-ruqaa shrink-0 shadow-md">
                  {step.n}
                </div>
                <div>
                  <h4 className="text-base font-bold mb-1 font-ruqaa text-brand-headline">
                    {step.title}
                  </h4>
                  <p className="text-sm opacity-75 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-card border border-brand-accent/20">
          <h3 className="text-3xl mb-3 font-ruqaa text-brand-headline">
            {t("trial.formHeading")}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-8 font-readex">
            {t("trial.formSubheading")}
          </p>
          <form
            className="flex flex-col gap-4 font-readex"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <input
              className="px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-gray-50 font-readex text-sm transition-all text-brand-ink"
              placeholder={t("trial.emailPlaceholder")}
              required
              type="email"
            />
            <input
              className="px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none bg-gray-50 font-readex text-sm transition-all text-brand-ink"
              placeholder={t("trial.ideaPlaceholder")}
              required
              type="text"
            />
            <button
              className="bg-brand-primary text-white w-full py-4 rounded-xl font-bold text-base mt-2 shadow-lg hover:bg-brand-primary/90 transition-colors"
              type="submit"
            >
              {submitted ? t("trial.submitted") : t("trial.submit")}
            </button>
          </form>
          <div className="text-xs text-center mt-5 text-gray-400 font-medium font-readex">
            {t("trial.noCard")}
          </div>
        </div>
      </div>
    </section>
  );
}
