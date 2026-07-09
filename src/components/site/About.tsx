import { useState } from 'react'
import type { SiteContent } from '../../lib/content'
import { ArrowRight } from '../Icons'

export default function About({ content }: { content: SiteContent }) {
  const [expanded, setExpanded] = useState(false)
  const { about } = content
  const shown = expanded ? about.paragraphs : about.paragraphs.slice(0, 2)

  return (
    <section id="sobre" className="bg-cream px-5 py-14 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-[1140px] items-center gap-8 sm:gap-16 md:grid-cols-2">
        <img
          src={about.image}
          alt="Foz do Rio São Francisco"
          className="w-full rounded-card object-cover shadow-[0_24px_50px_-34px_rgba(26,43,61,.45)]"
          style={{ height: 'clamp(320px,44vw,500px)' }}
        />
        <div>
          <span className="mb-4 inline-block font-heading text-xs font-bold uppercase tracking-[.14em] text-gold-text">
            {about.label}
          </span>
          <h2 className="mb-5 font-heading font-bold leading-[1.08] text-navy" style={{ fontSize: 'clamp(26px,4vw,42px)', letterSpacing: '-.02em' }}>
            {about.title}
          </h2>
          <div className="flex flex-col gap-3.5 font-body leading-[1.7] text-[#4f5f72]" style={{ fontSize: 'clamp(15px,1.7vw,17px)' }}>
            {shown.map((p, i) => (
              <p key={i} className="m-0">
                {p}
              </p>
            ))}
          </div>
          {about.paragraphs.length > 2 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border-[1.5px] border-gold bg-transparent px-[22px] py-3 font-heading text-sm font-bold text-gold-text transition hover:bg-gold hover:text-navy"
            >
              <span>{expanded ? 'Ver menos' : 'Ver mais'}</span>
              <ArrowRight />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
