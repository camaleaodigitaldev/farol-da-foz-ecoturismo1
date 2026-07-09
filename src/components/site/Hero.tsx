import type { SiteContent } from '../../lib/content'
import { waLink } from '../../lib/wa'
import { WhatsApp, ChevronDown, Pin } from '../Icons'

export default function Hero({ content }: { content: SiteContent }) {
  const { hero } = content
  return (
    <section
      id="topo"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: `url(${hero.background})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg,rgba(12,28,45,.5) 0%,rgba(12,28,45,.18) 34%,rgba(12,28,45,.34) 68%,rgba(12,28,45,.74) 100%)',
        }}
      />
      <div className="relative z-[2] w-full max-w-[1000px] px-5 py-[130px] text-center text-white sm:px-10">
        <div className="mb-6 inline-flex animate-ffFade items-center gap-2 rounded-full border border-white/30 bg-white/[.14] px-4 py-2 font-heading text-xs font-semibold backdrop-blur-sm">
          <Pin size={14} className="text-gold-soft" />
          {hero.label}
        </div>
        <h1
          className="animate-ffFade font-heading font-bold leading-[.96]"
          style={{
            fontSize: 'clamp(40px,8vw,88px)',
            letterSpacing: '-.025em',
            textShadow: '0 6px 40px rgba(0,0,0,.45)',
            animationDelay: '.08s',
          }}
        >
          {hero.titleLine1}
          <br />
          <span className="text-gold-soft">{hero.titleLine2}</span>
        </h1>
        <p
          className="mx-auto mb-9 mt-[18px] max-w-[36ch] animate-ffFade font-body text-white/95"
          style={{ fontSize: 'clamp(16px,2.2vw,21px)', lineHeight: 1.55, textShadow: '0 2px 16px rgba(0,0,0,.4)', animationDelay: '.16s' }}
        >
          {hero.subtitle}
        </p>
        <div className="flex animate-ffFade flex-wrap justify-center gap-[14px]" style={{ animationDelay: '.24s' }}>
          <a
            href={waLink(content.settings.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-[10px] rounded-full bg-wa px-8 py-[17px] font-heading font-bold text-white transition-transform hover:-translate-y-0.5"
            style={{ fontSize: 'clamp(15px,2vw,17px)', boxShadow: '0 16px 36px -12px rgba(37,211,102,.7)' }}
          >
            <WhatsApp /> Reservar pelo WhatsApp
          </a>
          <a
            href="#passeios"
            className="inline-flex items-center gap-[10px] rounded-full border-[1.5px] border-white/65 bg-white/[.14] px-[30px] py-[17px] font-heading font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
            style={{ fontSize: 'clamp(15px,2vw,17px)' }}
          >
            Ver os passeios
          </a>
        </div>
      </div>
      <a
        href="#passeios"
        className="absolute bottom-6 left-1/2 z-[2] flex animate-ffBob flex-col items-center gap-1.5 text-white/85"
      >
        <span className="font-heading text-[11px] font-semibold uppercase tracking-[.14em]">Explore</span>
        <ChevronDown />
      </a>
    </section>
  )
}
