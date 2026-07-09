import { useRef } from 'react'
import type { SiteContent } from '../../lib/content'
import { Star, ChevronLeft, ChevronRight } from '../Icons'

export default function Reviews({ content }: { content: SiteContent }) {
  const track = useRef<HTMLDivElement>(null)
  const { reviews } = content

  const scroll = (dir: number) => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 360), behavior: 'smooth' })
  }

  return (
    <section id="depoimentos" className="bg-white px-5 py-14 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-content">
        <div className="mb-10 flex flex-col items-center gap-6 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[560px] text-center md:text-left">
            <span className="mb-3.5 inline-block font-heading text-xs font-bold uppercase tracking-[.14em] text-gold-text">Avaliações</span>
            <h2 className="mb-3 font-heading font-bold leading-[1.08] text-navy" style={{ fontSize: 'clamp(26px,4vw,42px)', letterSpacing: '-.02em' }}>
              O que dizem quem viveu a experiência
            </h2>
          </div>
          <div className="flex items-center gap-4 rounded-card border border-[#e9edf2] bg-cream px-5 py-4">
            <span className="font-heading text-[38px] font-bold leading-none text-navy">{reviews.score}</span>
            <div>
              <div className="mb-1 flex text-gold">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={16} />
                ))}
              </div>
              <span className="font-heading text-[13.5px] font-semibold text-muted">
                <strong className="text-[#00915c]">Excelente</strong> · {reviews.total} avaliações
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div ref={track} className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2" id="reviews-track">
            {reviews.items.map((r) => (
              <article key={r.id} className="w-[300px] shrink-0 snap-start rounded-card border border-[#eef1f5] bg-white p-6 shadow-card">
                <div className="mb-3.5 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full font-heading text-lg font-bold text-white"
                    style={{ background: r.color }}
                  >
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-heading text-sm font-bold text-navy">{r.name}</div>
                    <div className="font-body text-[11.5px] text-muted">{r.meta}</div>
                  </div>
                </div>
                <div className="mb-2.5 flex text-gold">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={13} />
                  ))}
                </div>
                <p className="mb-3 font-body text-[13.5px] leading-[1.6] text-[#4f5f72]">{r.text}</p>
                <div className="font-body text-[11.5px] text-[#8592a3]">
                  {r.trip} · {r.visit}
                </div>
              </article>
            ))}
          </div>

          <button onClick={() => scroll(-1)} aria-label="Anterior" className="absolute -left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e3e7ee] bg-white text-navy shadow-card hover:border-gold md:flex">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll(1)} aria-label="Próximo" className="absolute -right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e3e7ee] bg-white text-navy shadow-card hover:border-gold md:flex">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-9 text-center">
          <a
            href={reviews.tripadvisorUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#ead9ab] bg-white px-6 py-3.5 font-heading text-sm font-bold text-gold-text transition hover:border-gold"
          >
            Deixe sua avaliação no Tripadvisor
          </a>
        </div>
      </div>
    </section>
  )
}
