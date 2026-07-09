import type { SiteContent } from '../../lib/content'
import { waLink } from '../../lib/wa'
import { WhatsApp, Mail, Pin, Instagram, Facebook } from '../Icons'

const SELOS = [
  { src: '/assets/selo-abeta-white.png', alt: 'ABETA' },
  { src: '/assets/selo-aventura-white.png', alt: 'Aventura Segura' },
  { src: '/assets/selo-caminho-white.png', alt: 'Caminho das Águas' },
]

const NAV = [
  { href: '#passeios', label: 'Passeios' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#frota', label: 'Frota' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#depoimentos', label: 'Avaliações' },
  { href: '#base', label: 'Nossa Base' },
]

export default function Footer({ content }: { content: SiteContent }) {
  const { contact, settings } = content
  return (
    <footer className="bg-navy-deep px-5 pb-8 pt-16 text-white sm:px-8">
      <div className="mx-auto max-w-content">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img src={settings.logoLight} alt="Farol da Foz Ecoturismo" className="mb-5 h-14 w-auto" />
            <p className="mb-5 max-w-[38ch] font-body text-sm leading-[1.7] text-white/70">
              Passeios de ecoturismo na foz do Rio São Francisco. Dunas, ilhas e cultura com condutores certificados ABETA e SEBRAE.
            </p>
            <div className="flex gap-3">
              {contact.instagram && (
                <a href={contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  <Instagram />
                </a>
              )}
              {contact.facebook && (
                <a href={contact.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  <Facebook />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-bold uppercase tracking-[.12em] text-gold-soft">Contato</h4>
            <ul className="space-y-3 font-body text-sm text-white/75">
              <li>
                <a href={waLink(settings.whatsapp)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 text-white/75 hover:text-white">
                  <WhatsApp size={18} /> WhatsApp para reservas
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2.5 text-white/75 hover:text-white">
                  <Mail /> {contact.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5">
                <Pin size={18} className="mt-0.5 shrink-0" /> {contact.address}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-bold uppercase tracking-[.12em] text-gold-soft">Navegação</h4>
            <ul className="grid grid-cols-2 gap-2 font-body text-sm text-white/75">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-white/75 hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 py-8 opacity-90">
          {SELOS.map((s) => (
            <img key={s.alt} src={s.src} alt={s.alt} className="h-14 w-auto object-contain sm:h-16" />
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center font-body text-xs text-white/55 sm:flex-row sm:text-left">
          <span>© {new Date().getFullYear()} Farol da Foz Ecoturismo. Todos os direitos reservados.</span>
          <span>
            Desenvolvido por{' '}
            <a href="https://wa.me/5582998439385" target="_blank" rel="noreferrer" className="font-semibold text-gold-soft hover:text-gold">
              Camaleão Digital
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
