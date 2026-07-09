import type { SiteContent } from '../../lib/content'
import { waLink } from '../../lib/wa'

// A simple accent-tinted marker per feature card (icon library kept minimal).
function Marker({ accent }: { accent: 'gold' | 'eco' }) {
  const gold = accent === 'gold'
  return (
    <div
      className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-[10px]"
      style={{ background: gold ? '#f7f2e6' : '#eaf3ee', color: gold ? '#b8862f' : '#2f8f6b' }}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.5 6H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z" />
      </svg>
    </div>
  )
}

export default function Features({ content }: { content: SiteContent }) {
  return (
    <section id="diferenciais" className="bg-white px-5 py-14 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1080px]">
        <div className="mx-auto mb-11 max-w-[720px] text-center sm:mb-16">
          <span className="mb-3.5 inline-block font-heading text-xs font-semibold uppercase tracking-[.16em] text-gold-warm">
            Pioneiros na Foz do São Francisco
          </span>
          <h2 className="mb-4 font-heading font-bold leading-[1.1] text-navy" style={{ fontSize: 'clamp(26px,4vw,40px)', letterSpacing: '-.02em' }}>
            Garantindo segurança e emoção em cada etapa do passeio
          </h2>
          <p className="m-0 font-body leading-[1.7] text-[#6b7787]" style={{ fontSize: 'clamp(15px,1.7vw,17px)' }}>
            A Farol da Foz foi a primeira empresa de ecoturismo estruturada na foz do rio São Francisco. Nossos condutores
            são certificados pela <strong className="font-semibold text-[#4a5665]">ABETA</strong> e pelo{' '}
            <strong className="font-semibold text-[#4a5665]">SEBRAE</strong>, com vasta experiência sobre as dunas da região.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3">
          {content.features.map((f) => (
            <div key={f.title} className="rounded-[14px] border border-[#eeeae0] bg-white p-4">
              <Marker accent={f.accent} />
              <h3 className="mb-1.5 font-heading text-[13.5px] font-semibold leading-tight text-navy">{f.title}</h3>
              <p className="m-0 font-body text-xs leading-[1.5] text-[#6b7787]">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3.5 sm:mt-14">
          <a
            href={waLink(content.settings.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-wa px-7 py-3.5 font-heading text-[15px] font-bold text-white transition hover:-translate-y-0.5"
            style={{ boxShadow: '0 14px 30px -12px rgba(37,211,102,.6)' }}
          >
            Tirar dúvidas no WhatsApp
          </a>
          <a
            href="#passeios"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#ead9ab] bg-white px-6 py-3.5 font-heading text-[15px] font-bold text-gold-text transition hover:border-gold"
          >
            Ver os passeios
          </a>
        </div>
      </div>
    </section>
  )
}
