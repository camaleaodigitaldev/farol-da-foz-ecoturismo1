import { useState } from 'react'
import type { SiteContent, Tour } from '../../lib/content'
import { waLink } from '../../lib/wa'
import { Clock, Users, Check, WhatsApp, ChevronLeft } from '../Icons'
import Reveal from '../Reveal'

function SectionHead({ label, title, sub }: { label: string; title: string; sub: string }) {
  return (
    <div className="mx-auto mb-10 max-w-[660px] text-center sm:mb-14">
      <span className="mb-4 inline-block font-heading text-xs font-bold uppercase tracking-[.14em] text-gold-text">
        {label}
      </span>
      <h2 className="mb-3 font-heading font-bold leading-[1.05] text-navy" style={{ fontSize: 'clamp(28px,4.6vw,46px)', letterSpacing: '-.02em' }}>
        {title}
      </h2>
      <p className="m-0 text-muted" style={{ fontSize: 'clamp(15px,1.8vw,18px)' }}>
        {sub}
      </p>
    </div>
  )
}

function TourDetail({ tour, phone, onClose }: { tour: Tour; phone: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-cream">
      <div className="mx-auto max-w-[1080px] px-5 py-6 sm:px-8">
        <button
          onClick={onClose}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ead9ab] bg-white px-4 py-2 font-heading text-sm font-bold text-gold-text hover:border-gold"
        >
          <ChevronLeft size={18} /> Voltar
        </button>
        <div className="overflow-hidden rounded-card">
          <img src={tour.image} alt={tour.title} className="h-[300px] w-full object-cover sm:h-[420px]" />
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <span className="mb-3 inline-block rounded-md bg-cream-warm px-3 py-1.5 font-heading text-xs font-bold text-gold-text">
              {tour.tag}
            </span>
            <h1 className="mb-4 font-heading font-bold text-navy" style={{ fontSize: 'clamp(26px,4vw,40px)', letterSpacing: '-.02em' }}>
              {tour.title}
            </h1>
            <h3 className="mb-2 font-heading text-lg font-bold text-navy">Sobre o passeio</h3>
            <p className="mb-7 font-body leading-[1.7] text-[#42556b]">{tour.long}</p>

            <h3 className="mb-3 font-heading text-lg font-bold text-navy">O que você vai viver</h3>
            <div className="mb-7 flex flex-wrap gap-2">
              {tour.stops.map((s) => (
                <span key={s} className="rounded-full border border-[#ead9ab] bg-white px-3.5 py-2 font-heading text-[13px] font-semibold text-[#7a5a10]">
                  {s}
                </span>
              ))}
            </div>

            <h3 className="mb-3 font-heading text-lg font-bold text-navy">O que está incluso</h3>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {tour.includes.map((i) => (
                <li key={i} className="flex items-start gap-2.5 font-body text-[14.5px] leading-snug text-[#4f5f72]">
                  <Check className="mt-0.5 shrink-0 text-gold" /> {i}
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit rounded-card border border-[#f0e6cc] bg-white p-6 shadow-card lg:sticky lg:top-6">
            <div className="mb-1 font-heading text-sm font-semibold text-muted">A partir de</div>
            <div className="mb-1 font-heading text-[38px] font-bold leading-none text-navy">R$ {tour.price}</div>
            <div className="mb-5 font-body text-[13px] text-muted">no cartão: {tour.priceCard}</div>
            <dl className="mb-6 space-y-3 text-[14px]">
              <div className="flex justify-between gap-4 border-b border-[#f0e6cc] pb-3">
                <dt className="text-muted">Duração</dt>
                <dd className="text-right font-semibold text-navy">{tour.duration}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#f0e6cc] pb-3">
                <dt className="text-muted">Saídas</dt>
                <dd className="text-right font-semibold text-navy">{tour.schedule}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Saída mínima</dt>
                <dd className="text-right font-semibold text-navy">{tour.min}</dd>
              </div>
            </dl>
            <a
              href={waLink(phone, tour.title)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-wa px-5 py-3.5 font-heading font-bold text-white hover:opacity-95"
            >
              <WhatsApp /> Reservar pelo WhatsApp
            </a>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default function Tours({ content }: { content: SiteContent }) {
  const [active, setActive] = useState<Tour | null>(null)
  const phone = content.settings.whatsapp

  return (
    <section id="passeios" className="px-5 py-14 sm:px-8 sm:py-24" style={{ background: 'linear-gradient(180deg,#faf8f3,#fdf6e6)' }}>
      <div className="mx-auto max-w-content">
        <Reveal>
          <SectionHead label="Nossos Roteiros" title="Nossos Passeios" sub="Escolha a sua aventura e reserve agora mesmo pelo WhatsApp." />
        </Reveal>
        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
          {content.tours.map((t, i) => (
            <Reveal key={t.id} delay={i * 110} className="h-full">
            <article
              className="relative flex h-full flex-col overflow-hidden rounded-card border border-[#f0e6cc] bg-white shadow-card transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_36px_62px_-30px_rgba(26,43,61,.55)]"
            >
              {t.featured && (
                <div className="absolute right-3 top-3 z-[4] rounded-md bg-white/90 px-3 py-1.5 font-heading text-[10.5px] font-semibold tracking-[.1em] text-navy">
                  MAIS COMPLETO
                </div>
              )}
              <div className="relative h-[212px] overflow-hidden">
                <img src={t.image} alt={t.title} className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 rounded-[7px] bg-white/90 px-2.5 py-1.5 font-heading text-[11.5px] font-bold text-navy">
                  {t.tag}
                </div>
                <div className="absolute bottom-3 right-3 rounded-full bg-navy/85 px-3 py-1.5 font-heading text-xs font-bold text-white backdrop-blur-sm">
                  a partir de <span className="text-[#ffc02e]">R$ {t.price}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-[22px]">
                <h3 className="mb-2 font-heading text-xl font-bold text-navy">{t.title}</h3>
                <p className="mb-4 flex-1 font-body text-[14.5px] leading-[1.6] text-muted">{t.short}</p>
                <div className="mb-[18px] flex gap-4 font-body text-[12.5px] font-semibold text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="text-[#c98a00]" /> {t.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="text-[#c98a00]" /> {t.group}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <a
                    href={waLink(phone, t.title)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-wa px-3 py-3.5 font-heading text-[14.5px] font-bold text-white hover:opacity-95"
                  >
                    Reservar agora
                  </a>
                  <button
                    onClick={() => setActive(t)}
                    className="rounded-xl border-[1.5px] border-[#ead9ab] bg-transparent px-3 py-2.5 font-heading text-[13px] font-bold text-gold-text transition hover:border-gold hover:bg-cream-warm"
                  >
                    Ver detalhes e preços
                  </button>
                </div>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      </div>

      {active && <TourDetail tour={active} phone={phone} onClose={() => setActive(null)} />}
    </section>
  )
}
