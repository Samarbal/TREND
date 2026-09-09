"use client";

import Image from 'next/image'
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const PRODUCT_LINKS = [
    { href: "#studio", label: t("footer.studioLink") },
    { href: "#audiences", label: t("footer.audiencesLink") },
  ];

  const COMPANY_LINKS = [
    { href: "#", label: t("footer.aboutLink") },
    { href: "#", label: t("footer.contactLink") },
    { href: "#", label: t("footer.careersLink") },
  ];

  const LEGAL_LINKS = [
    { href: "#", label: t("footer.privacyLink") },
    { href: "#", label: t("footer.termsLink") },
  ];

  return (
    <footer className="bg-brand-headline text-brand-bg pt-20 pb-8 border-t border-brand-accent/20 font-readex" id="footer">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-brand-bg/10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 font-ruqaa text-2xl font-bold text-white mb-4">
                     <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4EBDD] p-2 shadow-sm">
                          <Image
                            src="/trendy_logo.png"
                            alt="TRENDY AI"
                            width={54}
                            height={54}
                            className="h-12 w-12 object-contain"
                          />
                        </div>
              Trendy
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm mb-5 font-ruqaa">{t("footer.product")}</h5>
            <div className="flex flex-col gap-3 text-sm">
              {PRODUCT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-brand-accent hover:text-brand-bg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm mb-5 font-ruqaa">{t("footer.company")}</h5>
            <div className="flex flex-col gap-3 text-sm">
              {COMPANY_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-brand-accent hover:text-brand-bg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm mb-5 font-ruqaa">{t("footer.legal")}</h5>
            <div className="flex flex-col gap-3 text-sm">
              {LEGAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-brand-accent hover:text-brand-bg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4 text-xs text-brand-bg/80">
          <div>{t("footer.copyright")}</div>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-brand-accent/50 text-brand-accent flex items-center justify-center hover:bg-brand-accent hover:text-brand-headline transition-colors"
            >
              𝕏
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-brand-accent/50 text-brand-accent flex items-center justify-center hover:bg-brand-accent hover:text-brand-headline transition-colors"
            >
              in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
