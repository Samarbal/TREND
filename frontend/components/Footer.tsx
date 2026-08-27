const PRODUCT_LINKS = [
  { href: "#studio", label: "Content Studio" },
  { href: "#audiences", label: "Who is this for?" },
];

const COMPANY_LINKS = [
  { href: "#", label: "About Us" },
  { href: "#", label: "Contact Us" },
  { href: "#", label: "Careers" },
];

const LEGAL_LINKS = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms & Conditions" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-headline text-brand-bg pt-20 pb-8 border-t border-brand-accent/20 font-readex" id="footer">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-brand-bg/10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 font-ruqaa text-2xl font-bold text-white mb-4">
              <div className="w-9 h-9 rounded-lg bg-brand-bg flex items-center justify-center">
                <span className="text-brand-primary font-ruqaa text-lg">T</span>
              </div>
              Trendy
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              A comprehensive AI platform for building and managing brands, from
              the first idea to ready-to-publish content.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm mb-5 font-ruqaa">Product</h5>
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
            <h5 className="text-white font-bold text-sm mb-5 font-ruqaa">Company</h5>
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
            <h5 className="text-white font-bold text-sm mb-5 font-ruqaa">Legal</h5>
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
          <div>© 2026 Trendy (Trendy AI). All rights reserved.</div>
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
