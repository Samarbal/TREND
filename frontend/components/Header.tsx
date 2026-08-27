"use client";

import { useState } from "react";

const NAV_LINKS = [
  { href: "#hero", label: "About us" },
  { href: "#studio", label: "Content Studio" },
  { href: "#trial", label: "Free Trial" },
  { href: "#audiences", label: "Who is this for?" },
  { href: "#footer", label: "Contact us" },
];
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-accent/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 font-ruqaa text-2xl font-bold text-brand-headline">
          <div className="w-10 h-10 rounded-lg bg-brand-headline flex items-center justify-center shadow-md">
            <span className="text-brand-accent font-ruqaa text-xl">T</span>
          </div>
          Trendy
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
          <a
            href="/login"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-brand-headline hover:text-brand-primary transition-colors"
          >
            Sign in
          </a>
          <span className="hidden sm:inline text-brand-accent" aria-hidden="true">|</span>
          <a
            href="/signup"
            className="hidden sm:inline-flex items-center text-sm font-bold text-brand-primary hover:text-brand-headline transition-colors"
          >
            Sign up
          </a>
          <button
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
          <div className="mt-2 flex items-center justify-center gap-3 border-t border-brand-accent/20 pt-4">
            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold text-brand-headline hover:text-brand-primary transition-colors"
            >
              Sign in
            </a>
            <span className="text-brand-accent" aria-hidden="true">|</span>
            <a
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-bold text-brand-primary hover:text-brand-headline transition-colors"
            >
              Sign up
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
