import type { SiteContent } from '../../lib/content'
import { waLink } from '../../lib/wa'
import { WhatsApp } from '../Icons'

export default function FinalCta({ content }: { content: SiteContent }) {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24" style={{ background: 'linear-gradient(180deg,#1a2b3d,#12212f)' }}>
      <div className="mx-auto max-w-[820px] text-center text-white">
        <h2 className="mb-4 font-heading font-bold leading-[1.05]" style={{ fontSize: 'clamp(28px,5vw,48px)', letterSpacing: '-.02em' }}>
          Pronto para sua aventura?
        </h2>
        <p className="mx-auto mb-8 max-w-[46ch] font-body text-white/85" style={{ fontSize: 'clamp(15px,1.9vw,18px)' }}>
          Reserve seu passeio na foz do Rio São Francisco e viva uma experiência inesquecível com quem conhece cada detalhe da região.
        </p>
        <a
          href={waLink(content.settings.whatsapp)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full bg-wa px-9 py-[18px] font-heading font-bold text-white transition hover:-translate-y-0.5"
          style={{ fontSize: 'clamp(15px,2vw,17px)', boxShadow: '0 16px 36px -12px rgba(37,211,102,.7)' }}
        >
          <WhatsApp /> Reservar pelo WhatsApp
        </a>
      </div>
    </section>
  )
}
