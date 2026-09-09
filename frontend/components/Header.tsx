"use client";

import { useState } from "react";
import Image from 'next/image'
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();

  const NAV_LINKS = [
    { href: "#hero", label: t("nav.about") },
    { href: "#studio", label: t("nav.studio") },
    { href: "#trial", label: t("nav.trial") },
    { href: "#audiences", label: t("nav.audiences") },
    { href: "#footer", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-accent/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/trendy_logo.png"
            alt="Trendy"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="font-display text-[24px] font-semibold">Trendy</span>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-semibold text-brand-headline">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-brand-primary transition-colors border-b-2 border-transparent hover:border-brand-primary pb-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 font-readex">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-headline hover:text-brand-primary transition-colors border border-brand-accent/40 rounded-full px-3 py-1 hover:border-brand-primary cursor-pointer"
            aria-label="Switch language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{t("langToggle.switchTo")}</span>
          </button>

          <a
            href="/login"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-brand-headline hover:text-brand-primary transition-colors"
          >
            {t("nav.signIn")}
          </a>
          <span className="hidden sm:inline text-brand-accent" aria-hidden="true">|</span>
          <a
            href="/signup"
            className="hidden sm:inline-flex items-center text-sm font-bold text-brand-primary hover:text-brand-headline transition-colors"
          >
            {t("nav.signUp")}
          </a>
          <button
            type="button"
            className="md:hidden text-2xl text-brand-headline p-1"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-brand-bg border-b border-brand-accent/30 shadow-lg p-4 flex flex-col gap-4 text-center font-bold">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-2 hover:text-brand-primary transition-colors block border-b border-brand-accent/10"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex items-center justify-center gap-3 border-t border-brand-accent/20 pt-4 flex-wrap">
            {/* Language toggle in mobile menu */}
            <button
              type="button"
              onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setMenuOpen(false); }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-headline hover:text-brand-primary transition-colors border border-brand-accent/40 rounded-full px-3 py-1 cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{t("langToggle.switchTo")}</span>
            </button>
            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold text-brand-headline hover:text-brand-primary transition-colors"
            >
              {t("nav.signIn")}
            </a>
            <span className="text-brand-accent" aria-hidden="true">|</span>
            <a
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-bold text-brand-primary hover:text-brand-headline transition-colors"
            >
              {t("nav.signUp")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
