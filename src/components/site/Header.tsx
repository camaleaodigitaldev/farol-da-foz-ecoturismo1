import { useEffect, useState } from 'react'
import type { SiteContent } from '../../lib/content'
import { waLink } from '../../lib/wa'
import { Menu, Close, WhatsApp } from '../Icons'

const NAV = [
  { href: '#passeios', label: 'Passeios' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#frota', label: 'Frota' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#depoimentos', label: 'Avaliações' },
  { href: '#base', label: 'Nossa Base' },
]

export default function Header({ content }: { content: SiteContent }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const wa = waLink(content.settings.whatsapp)

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? '#fff' : 'transparent',
          boxShadow: scrolled ? '0 6px 24px -18px rgba(26,43,61,.5)' : 'none',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
        }}
      >
        <div
          className="mx-auto flex items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-8"
          style={{ maxWidth: 1220, height: scrolled ? 68 : 84 }}
        >
          <a href="#topo" className="flex items-center">
            <img
              src={scrolled ? content.settings.logoDark : content.settings.logoLight}
              alt="Farol da Foz Ecoturismo"
              className="w-auto transition-all duration-300"
              style={{ height: scrolled ? 46 : 62 }}
            />
          </a>

          <nav className="hidden items-center gap-[26px] whitespace-nowrap lg:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="font-heading text-sm font-semibold transition-colors"
                style={{ color: scrolled ? '#1a2b3d' : '#fff' }}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-gold px-[22px] py-[11px] font-heading text-sm font-bold text-navy transition hover:bg-[#ffbb1a] lg:inline-flex"
            style={{ boxShadow: '0 8px 20px -8px rgba(242,169,0,.8)' }}
          >
            Reservar
          </a>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            className="flex h-[46px] w-[46px] items-center justify-center rounded-[13px] transition-colors lg:hidden"
            style={{ background: scrolled ? '#f1f3f6' : 'rgba(255,255,255,.16)', color: scrolled ? '#1a2b3d' : '#fff' }}
          >
            <Menu />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] transition ${menuOpen ? 'visible' : 'invisible'}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-navy/50 transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-[340px] flex-col bg-white p-6 shadow-2xl transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <img src={content.settings.logoDark} alt="Farol da Foz" className="h-11 w-auto" />
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar" className="text-navy">
              <Close />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 font-heading font-semibold text-navy hover:bg-cream-warm"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-wa px-6 py-4 font-heading font-bold text-white"
          >
            <WhatsApp /> Reservar pelo WhatsApp
          </a>
        </aside>
      </div>
    </>
  )
}
