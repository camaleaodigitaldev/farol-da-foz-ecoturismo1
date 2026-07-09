import { useState } from 'react'
import type { SiteContent } from '../../lib/content'
import { waLink } from '../../lib/wa'
import { Building, Shield, Check, Close, WhatsApp } from '../Icons'
import Reveal from '../Reveal'

export default function BaseSection({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState(false)
  const { base } = content

  return (
    <section id="base" className="bg-cream px-5 py-14 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-[1140px] items-center gap-8 sm:gap-16 md:grid-cols-2">
        <Reveal>
          <span className="mb-4 inline-block font-heading text-xs font-bold uppercase tracking-[.14em] text-gold-text">Nossa Base</span>
          <h2 className="mb-6 font-heading font-bold leading-[1.08] text-navy" style={{ fontSize: 'clamp(26px,4vw,42px)', letterSpacing: '-.02em' }}>
            Estrutura completa para a sua aventura
          </h2>

          <div className="mb-4 rounded-card border border-[#f0e6cc] bg-white p-[22px] shadow-card">
            <h3 className="mb-3.5 flex items-center gap-2 font-heading text-[17px] font-bold text-gold-text">
              <Building /> Base de Apoio
            </h3>
            <ul className="grid gap-x-[18px] gap-y-3 sm:grid-cols-2">
              {base.structure.map((s) => (
                <li key={s} className="flex items-start gap-2.5 font-body text-sm leading-snug text-[#4f5f72]">
                  <Check className="mt-0.5 shrink-0 text-gold" /> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border border-[#f0e6cc] bg-white p-[22px] shadow-card">
            <h3 className="mb-3.5 flex items-center gap-2 font-heading text-[17px] font-bold text-eco">
              <Shield /> Segurança
            </h3>
            <ul className="grid gap-x-[18px] gap-y-3 sm:grid-cols-2">
              {base.safety.map((s) => (
                <li key={s} className="flex items-start gap-2.5 font-body text-sm leading-snug text-[#4f5f72]">
                  <Check className="mt-0.5 shrink-0 text-[#0e9e63]" /> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-heading text-[15px] font-bold text-navy transition hover:bg-[#ffbb1a]"
              style={{ boxShadow: '0 14px 30px -12px rgba(242,169,0,.7)' }}
            >
              Conheça nossa estrutura
            </button>
          </div>
        </Reveal>

        <Reveal as="div" delay={140} className="grid grid-cols-2 gap-3">
          {base.images.slice(0, 4).map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Nossa base"
              className={`w-full rounded-card object-cover shadow-card ${i === 0 ? 'col-span-2 h-[220px]' : 'h-[160px]'}`}
            />
          ))}
        </Reveal>
      </div>

      {/* Base overlay */}
      {open && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-cream">
          <div className="mx-auto max-w-[980px] px-5 py-6 sm:px-8">
            <button
              onClick={() => setOpen(false)}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ead9ab] bg-white px-4 py-2 font-heading text-sm font-bold text-gold-text hover:border-gold"
            >
              <Close size={18} /> Voltar
            </button>

            <h2 className="mb-4 font-heading font-bold text-navy" style={{ fontSize: 'clamp(26px,4vw,40px)', letterSpacing: '-.02em' }}>
              Nossa estrutura
            </h2>
            <p className="mb-8 max-w-[640px] font-body leading-[1.7] text-[#42556b]">{base.intro}</p>

            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {base.images.map((src, i) => (
                <img key={i} src={src} alt="Estrutura da base" className="aspect-square w-full rounded-xl object-cover" />
              ))}
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-card border border-[#f0e6cc] bg-white p-6">
                <h3 className="mb-3.5 flex items-center gap-2 font-heading text-lg font-bold text-gold-text">
                  <Building /> Comodidades
                </h3>
                <ul className="space-y-2.5">
                  {base.structure.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 font-body text-sm text-[#4f5f72]">
                      <Check className="mt-0.5 shrink-0 text-gold" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-card border border-[#f0e6cc] bg-white p-6">
                <h3 className="mb-3.5 flex items-center gap-2 font-heading text-lg font-bold text-eco">
                  <Shield /> Segurança
                </h3>
                <ul className="space-y-2.5">
                  {base.safety.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 font-body text-sm text-[#4f5f72]">
                      <Check className="mt-0.5 shrink-0 text-[#0e9e63]" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Director */}
            <div className="mb-8 rounded-card border border-[#f0e6cc] bg-white p-6 sm:p-8">
              <span className="mb-4 inline-block font-heading text-xs font-bold uppercase tracking-[.14em] text-gold-text">
                Quem cuida da sua experiência
              </span>
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <img src={base.director.photo} alt={base.director.name} className="h-[120px] w-[120px] shrink-0 rounded-full object-cover" />
                <div>
                  <h3 className="mb-1 font-heading font-bold text-navy" style={{ fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-.02em' }}>
                    {base.director.name}
                  </h3>
                  <div className="mb-3 font-heading text-sm font-semibold text-gold-text">{base.director.role}</div>
                  <p className="m-0 font-body leading-[1.7] text-[#42556b]" style={{ fontSize: 'clamp(14px,1.6vw,16px)' }}>
                    {base.director.bio}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href={waLink(content.settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-wa px-8 py-4 font-heading font-bold text-white"
              >
                <WhatsApp /> Fale com a gente no WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
