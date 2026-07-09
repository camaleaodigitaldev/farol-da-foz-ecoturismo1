import { useState } from 'react'
import type { SiteContent, FleetVehicle } from '../../lib/content'
import { Users } from '../Icons'
import Reveal from '../Reveal'

function Card({ vehicle }: { vehicle: FleetVehicle }) {
  const [sel, setSel] = useState(0)
  const images = vehicle.images.length ? vehicle.images : ['']
  return (
    <article className="h-full overflow-hidden rounded-card border border-white/15 bg-white/[.06] backdrop-blur-sm">
      <div className="relative h-[220px] overflow-hidden bg-steel">
        <img src={images[sel]} alt={vehicle.name} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 px-3 pt-2.5">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSel(i)}
              aria-label="Ver foto"
              className="h-[52px] flex-1 overflow-hidden rounded-[10px] border-2 transition"
              style={{ borderColor: sel === i ? '#f2a900' : 'transparent', opacity: sel === i ? 1 : 0.6 }}
            >
              <img src={src} alt="Miniatura" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="px-[22px] pb-[22px] pt-4">
        <h3 className="mb-2.5 font-heading text-[19px] font-bold text-white">{vehicle.name}</h3>
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 font-heading text-xs font-bold text-navy">
          <Users size={14} className="text-navy" /> {vehicle.capacity}
        </div>
        <p className="m-0 font-body text-sm leading-[1.6] text-white/80">{vehicle.text}</p>
      </div>
    </article>
  )
}

export default function Fleet({ content }: { content: SiteContent }) {
  return (
    <section id="frota" className="px-5 py-14 text-white sm:px-8 sm:py-24" style={{ background: 'linear-gradient(180deg,#22384f,#1a2b3d)' }}>
      <div className="mx-auto max-w-[1140px]">
        <Reveal as="div" className="mx-auto mb-10 max-w-[640px] text-center sm:mb-14">
          <span className="mb-4 inline-block font-heading text-xs font-bold uppercase tracking-[.14em] text-gold-soft">Nossa Frota</span>
          <h2 className="mb-3 font-heading font-bold leading-[1.08]" style={{ fontSize: 'clamp(26px,4vw,42px)', letterSpacing: '-.02em' }}>
            Veículos confortáveis, adaptados para o off-road
          </h2>
          <p className="m-0 font-body leading-[1.6] text-white/80" style={{ fontSize: 'clamp(15px,1.7vw,17px)' }}>
            Preparados para cada terreno — das dunas ao rio São Francisco.
          </p>
        </Reveal>
        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
          {content.fleet.map((v, i) => (
            <Reveal key={v.id} delay={i * 110} className="h-full">
              <Card vehicle={v} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
