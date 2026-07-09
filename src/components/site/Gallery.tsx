import { useState } from 'react'
import type { SiteContent, GalleryItem } from '../../lib/content'
import { ChevronLeft, ChevronRight, Close } from '../Icons'

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'dunas', label: 'Dunas' },
  { key: 'rio', label: 'Rio & Barco' },
  { key: 'frota', label: 'Frota' },
  { key: 'base', label: 'Nossa Base' },
] as const

export default function Gallery({ content }: { content: SiteContent }) {
  const [full, setFull] = useState(false)
  const [filter, setFilter] = useState<string>('todos')
  const [lb, setLb] = useState<number | null>(null)

  const items = content.gallery.filter((g) => filter === 'todos' || g.cat === filter)
  const preview = content.gallery.slice(0, 8)

  const active: GalleryItem | null = lb != null && lb < items.length ? items[lb] : null
  const step = (d: number) => setLb((i) => (i == null ? null : (i + d + items.length) % items.length))

  return (
    <section id="galeria" className="bg-cream-warm px-5 py-14 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-content">
        <div className="mb-8 flex flex-col items-center gap-4 text-center sm:mb-12 md:flex-row md:justify-between md:text-left">
          <div>
            <span className="mb-3.5 inline-block font-heading text-xs font-bold uppercase tracking-[.14em] text-gold-text">Galeria</span>
            <h2 className="font-heading font-bold leading-[1.08] text-navy" style={{ fontSize: 'clamp(26px,4vw,42px)', letterSpacing: '-.02em' }}>
              Momentos na foz do São Francisco
            </h2>
          </div>
          <button
            onClick={() => setFull(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-heading text-sm font-bold text-navy transition hover:bg-[#ffbb1a]"
          >
            Ver galeria completa
          </button>
        </div>

        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {preview.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setFilter('todos')
                setFull(true)
                setLb(content.gallery.findIndex((x) => x.id === g.id))
              }}
              className="h-[220px] w-[300px] shrink-0 overflow-hidden rounded-card"
            >
              <img src={g.src} alt={g.alt} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
            </button>
          ))}
        </div>
      </div>

      {/* Full gallery overlay */}
      {full && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-cream">
          <div className="mx-auto max-w-content px-5 py-6 sm:px-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-heading text-2xl font-bold text-navy">Galeria completa</h2>
              <button
                onClick={() => {
                  setFull(false)
                  setLb(null)
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[#ead9ab] bg-white px-4 py-2 font-heading text-sm font-bold text-gold-text hover:border-gold"
              >
                <Close size={18} /> Fechar
              </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const on = filter === f.key
                return (
                  <button
                    key={f.key}
                    onClick={() => {
                      setFilter(f.key)
                      setLb(null)
                    }}
                    className="rounded-full border px-4 py-2 font-heading text-[13px] font-bold transition"
                    style={{
                      background: on ? '#f2a900' : '#fff',
                      color: on ? '#1a2b3d' : '#5c6b7e',
                      borderColor: on ? '#f2a900' : '#ead9ab',
                    }}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((g, i) => (
                <button key={g.id} onClick={() => setLb(i)} className="aspect-[4/3] overflow-hidden rounded-xl">
                  <img src={g.src} alt={g.alt} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                </button>
              ))}
            </div>
          </div>

          {/* Lightbox */}
          {active && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4" onClick={() => setLb(null)}>
              <button className="absolute right-4 top-4 text-white/80 hover:text-white" onClick={() => setLb(null)} aria-label="Fechar">
                <Close size={28} />
              </button>
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  step(-1)
                }}
                aria-label="Anterior"
              >
                <ChevronLeft size={28} />
              </button>
              <div className="max-h-[86vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
                <img src={active.src} alt={active.alt} className="max-h-[80vh] w-auto rounded-lg object-contain" />
                <div className="mt-3 text-center font-body text-sm text-white/80">
                  {active.alt} · {(lb ?? 0) + 1} / {items.length}
                </div>
              </div>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
                }}
                aria-label="Próximo"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
