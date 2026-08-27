import type { ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'

interface AuthShellProps {
  hero: ReactNode
  subcopy: string
  features: { icon: LucideIcon; label: string }[]
  children: ReactNode
}

export function AuthShell({ hero, subcopy, features, children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <section
        className="hidden flex-col justify-center gap-[18px] px-14 py-16 lg:flex"
        style={{
          background:
            'radial-gradient(130% 90% at 80% 100%, rgba(120, 35, 30, .45), transparent 45%), linear-gradient(135deg, #312B20 0%, #1A1A1A 62%, #241416 100%)',
        }}
      >

        <p className="flex items-baseline gap-3 text-[#F8FAFC]">
          <span className="font-display text-[40px] leading-none">TRENDY AI</span>
          <span className="font-display text-[30px] leading-none text-brand-accent"> ترندي </span>
        </p>
        <h1 className="max-w-[15ch] font-display text-[45px] leading-[1.1] text-[#F8FAFC]">
          {hero}
        </h1>
        <p className="max-w-[44ch] text-[15px] leading-[1.55] text-brand-bg/75">{subcopy}</p>
        <ul className="mt-4 flex flex-col gap-3">
          {features.map((feature) => (
            <li
              key={feature.label}
              className="flex items-center gap-3 whitespace-nowrap text-[12px] text-brand-bg/85"
            >
              <feature.icon className="h-4 w-4 shrink-0 text-brand-accent" />
              {feature.label}
            </li>
          ))}
        </ul>
      </section>
      <section className="auth-theme flex items-center justify-center bg-[#F2EAD3] px-4 py-12">
        <div className="w-full max-w-[372px]">{children}</div>
      </section>
    </div>
  )
}
