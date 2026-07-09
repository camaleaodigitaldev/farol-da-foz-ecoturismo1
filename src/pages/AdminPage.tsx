import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { fetchContent, saveContent } from '../lib/useContent'
import { defaultContent, type SiteContent, type Tour, type FleetVehicle, type Review, type GalleryItem } from '../lib/content'
import { Field, TextArea, ImageField, StringList, Card } from '../components/admin/fields'

const SECTIONS = [
  { key: 'hero', label: 'Topo (Hero)' },
  { key: 'tours', label: 'Passeios' },
  { key: 'about', label: 'Sobre' },
  { key: 'features', label: 'Diferenciais' },
  { key: 'fleet', label: 'Frota' },
  { key: 'reviews', label: 'Avaliações' },
  { key: 'gallery', label: 'Galeria' },
  { key: 'base', label: 'Nossa Base' },
  { key: 'contact', label: 'Contato & Rodapé' },
  { key: 'settings', label: 'Configurações' },
] as const

// tiny unique id without Math.random
let counter = 0
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${counter++}`

// ------------------------------- Login ------------------------------------
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErr('E-mail ou senha inválidos.')
    setBusy(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-card border border-[#e3e7ee] bg-white p-8 shadow-card">
        <img src="/assets/logo-dark.png" alt="Farol da Foz" className="mx-auto mb-6 h-14 w-auto" />
        <h1 className="mb-1 text-center font-heading text-xl font-bold text-navy">Painel Admin</h1>
        <p className="mb-6 text-center font-body text-sm text-muted">Farol da Foz Ecoturismo</p>
        <div className="space-y-4">
          <Field label="E-mail" value={email} onChange={setEmail} placeholder="voce@email.com" />
          <label className="block">
            <span className="mb-1.5 block font-heading text-[13px] font-semibold text-navy">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[10px] border border-[#dfe3ea] bg-white px-3.5 py-2.5 font-body text-sm text-navy outline-none focus:border-gold"
            />
          </label>
        </div>
        {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-gold px-6 py-3 font-heading font-bold text-navy transition hover:bg-[#ffbb1a] disabled:opacity-60"
        >
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

// ------------------------------- Editor -----------------------------------
function Editor({ session }: { session: Session }) {
  const [draft, setDraft] = useState<SiteContent | null>(null)
  const [active, setActive] = useState<string>('hero')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)

  useEffect(() => {
    fetchContent().then(setDraft)
  }, [])

  if (!draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
      </div>
    )
  }

  // immutable section updater
  function patch<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d))
    setSaved(false)
  }

  const publish = async () => {
    if (!draft) return
    setSaving(true)
    try {
      await saveContent(draft)
      setSaved(true)
    } catch (e) {
      alert('Erro ao publicar: ' + (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-admin-bg lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-navy text-white transition-transform lg:static lg:translate-x-0 ${
          mobileNav ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5">
          <img src="/assets/logo-branca.png" alt="Farol da Foz" className="h-10 w-auto" />
        </div>
        <nav className="px-3 py-2">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setActive(s.key)
                setMobileNav(false)
              }}
              className={`mb-1 block w-full rounded-lg px-4 py-2.5 text-left font-heading text-sm font-semibold transition ${
                active === s.key ? 'bg-gold text-navy' : 'text-white/75 hover:bg-white/10'
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="mt-4 px-6">
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full rounded-lg border border-white/20 px-4 py-2 font-heading text-sm font-semibold text-white/80 hover:bg-white/10"
          >
            Sair
          </button>
        </div>
      </aside>

      {mobileNav && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileNav(false)} />}

      {/* Main */}
      <div className="flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#e3e7ee] bg-white px-5 py-3.5">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileNav(true)} aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a2b3d" strokeWidth={2.3} strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <h1 className="font-heading text-lg font-bold text-navy">{SECTIONS.find((s) => s.key === active)?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="hidden font-heading text-sm font-semibold text-muted hover:text-navy sm:inline">
              Ver site ↗
            </a>
            <span className="hidden text-xs text-muted md:inline">{session.user.email}</span>
            <button
              onClick={publish}
              disabled={saving}
              className="rounded-full bg-gold px-6 py-2.5 font-heading text-sm font-bold text-navy transition hover:bg-[#ffbb1a] disabled:opacity-60"
            >
              {saving ? 'Publicando…' : saved ? '✓ Publicado' : 'Publicar'}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-8">
          {active === 'hero' && (
            <div className="space-y-5">
              <Field label="Etiqueta (localização)" value={draft.hero.label} onChange={(v) => patch('hero', { ...draft.hero, label: v })} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Título — linha 1" value={draft.hero.titleLine1} onChange={(v) => patch('hero', { ...draft.hero, titleLine1: v })} />
                <Field label="Título — linha 2 (dourado)" value={draft.hero.titleLine2} onChange={(v) => patch('hero', { ...draft.hero, titleLine2: v })} />
              </div>
              <TextArea label="Subtítulo" value={draft.hero.subtitle} onChange={(v) => patch('hero', { ...draft.hero, subtitle: v })} />
              <ImageField label="Foto de fundo" value={draft.hero.background} onChange={(v) => patch('hero', { ...draft.hero, background: v })} />
            </div>
          )}

          {active === 'tours' && (
            <div className="space-y-5">
              {draft.tours.map((t, i) => {
                const set = (u: Partial<Tour>) => {
                  const next = draft.tours.slice()
                  next[i] = { ...t, ...u }
                  patch('tours', next)
                }
                return (
                  <Card key={t.id} title={t.title || 'Passeio'} onRemove={() => patch('tours', draft.tours.filter((_, j) => j !== i))}>
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Nome" value={t.title} onChange={(v) => set({ title: v })} />
                        <Field label="Etiqueta" value={t.tag} onChange={(v) => set({ tag: v })} />
                        <Field label="Preço (a partir de R$)" value={t.price} onChange={(v) => set({ price: v })} />
                        <Field label="Preço no cartão" value={t.priceCard} onChange={(v) => set({ priceCard: v })} />
                        <Field label="Duração" value={t.duration} onChange={(v) => set({ duration: v })} />
                        <Field label="Saídas" value={t.schedule} onChange={(v) => set({ schedule: v })} />
                        <Field label="Grupo" value={t.group} onChange={(v) => set({ group: v })} />
                        <Field label="Saída mínima" value={t.min} onChange={(v) => set({ min: v })} />
                      </div>
                      <TextArea label="Descrição curta" value={t.short} onChange={(v) => set({ short: v })} rows={2} />
                      <TextArea label="Descrição completa" value={t.long} onChange={(v) => set({ long: v })} rows={5} />
                      <StringList label="O que você vai viver" items={t.stops} onChange={(v) => set({ stops: v })} />
                      <StringList label="O que está incluso" items={t.includes} onChange={(v) => set({ includes: v })} />
                      <ImageField label="Foto" value={t.image} onChange={(v) => set({ image: v })} />
                      <label className="flex items-center gap-2 font-body text-sm text-navy">
                        <input type="checkbox" checked={t.featured} onChange={(e) => set({ featured: e.target.checked })} />
                        Marcar como destaque (MAIS COMPLETO)
                      </label>
                    </div>
                  </Card>
                )
              })}
              <button
                onClick={() =>
                  patch('tours', [
                    ...draft.tours,
                    { ...defaultContent.tours[0], id: uid('tour'), title: 'Novo passeio', featured: false },
                  ])
                }
                className="rounded-full border border-[#dfe3ea] bg-white px-5 py-2.5 font-heading text-sm font-semibold text-navy hover:border-gold"
              >
                + Adicionar passeio
              </button>
            </div>
          )}

          {active === 'about' && (
            <div className="space-y-5">
              <Field label="Rótulo" value={draft.about.label} onChange={(v) => patch('about', { ...draft.about, label: v })} />
              <Field label="Título" value={draft.about.title} onChange={(v) => patch('about', { ...draft.about, title: v })} />
              <ImageField label="Foto" value={draft.about.image} onChange={(v) => patch('about', { ...draft.about, image: v })} />
              <StringList label="Parágrafos (os 2 primeiros aparecem antes de 'Ver mais')" items={draft.about.paragraphs} onChange={(v) => patch('about', { ...draft.about, paragraphs: v })} />
            </div>
          )}

          {active === 'features' && (
            <div className="space-y-4">
              {draft.features.map((f, i) => {
                const set = (u: Partial<typeof f>) => {
                  const next = draft.features.slice()
                  next[i] = { ...f, ...u }
                  patch('features', next)
                }
                return (
                  <Card key={i} title={`Diferencial ${i + 1}`}>
                    <div className="space-y-4">
                      <Field label="Título" value={f.title} onChange={(v) => set({ title: v })} />
                      <TextArea label="Descrição" value={f.text} onChange={(v) => set({ text: v })} rows={2} />
                      <label className="block">
                        <span className="mb-1.5 block font-heading text-[13px] font-semibold text-navy">Cor do ícone</span>
                        <select
                          value={f.accent}
                          onChange={(e) => set({ accent: e.target.value as 'gold' | 'eco' })}
                          className="rounded-[10px] border border-[#dfe3ea] bg-white px-3 py-2 font-body text-sm"
                        >
                          <option value="gold">Dourado</option>
                          <option value="eco">Verde</option>
                        </select>
                      </label>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {active === 'fleet' && (
            <div className="space-y-5">
              {draft.fleet.map((v, i) => {
                const set = (u: Partial<FleetVehicle>) => {
                  const next = draft.fleet.slice()
                  next[i] = { ...v, ...u }
                  patch('fleet', next)
                }
                return (
                  <Card key={v.id} title={v.name || 'Veículo'} onRemove={() => patch('fleet', draft.fleet.filter((_, j) => j !== i))}>
                    <div className="space-y-4">
                      <Field label="Nome" value={v.name} onChange={(x) => set({ name: x })} />
                      <Field label="Capacidade" value={v.capacity} onChange={(x) => set({ capacity: x })} />
                      <TextArea label="Descrição" value={v.text} onChange={(x) => set({ text: x })} rows={2} />
                      <StringList label="Fotos (URLs)" items={v.images} onChange={(x) => set({ images: x })} />
                      <ImageField label="Enviar nova foto (adiciona à lista)" value="" onChange={(url) => url && set({ images: [...v.images, url] })} />
                    </div>
                  </Card>
                )
              })}
              <button
                onClick={() => patch('fleet', [...draft.fleet, { id: uid('veh'), name: 'Novo veículo', capacity: '', text: '', images: [] }])}
                className="rounded-full border border-[#dfe3ea] bg-white px-5 py-2.5 font-heading text-sm font-semibold text-navy hover:border-gold"
              >
                + Adicionar veículo
              </button>
            </div>
          )}

          {active === 'reviews' && (
            <div className="space-y-5">
              <Card title="Resumo">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nota (ex: 4,9)" value={draft.reviews.score} onChange={(v) => patch('reviews', { ...draft.reviews, score: v })} />
                  <Field label="Total de avaliações" value={draft.reviews.total} onChange={(v) => patch('reviews', { ...draft.reviews, total: v })} />
                </div>
                <div className="mt-4">
                  <Field label="Link do Tripadvisor" value={draft.reviews.tripadvisorUrl} onChange={(v) => patch('reviews', { ...draft.reviews, tripadvisorUrl: v })} />
                </div>
              </Card>
              {draft.reviews.items.map((r, i) => {
                const set = (u: Partial<Review>) => {
                  const next = draft.reviews.items.slice()
                  next[i] = { ...r, ...u }
                  patch('reviews', { ...draft.reviews, items: next })
                }
                return (
                  <Card key={r.id} title={r.name || 'Depoimento'} onRemove={() => patch('reviews', { ...draft.reviews, items: draft.reviews.items.filter((_, j) => j !== i) })}>
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Nome" value={r.name} onChange={(v) => set({ name: v })} />
                        <Field label="Contribuições / local" value={r.meta} onChange={(v) => set({ meta: v })} />
                        <Field label="Tipo de viagem" value={r.trip} onChange={(v) => set({ trip: v })} />
                        <Field label="Data da visita" value={r.visit} onChange={(v) => set({ visit: v })} />
                      </div>
                      <TextArea label="Texto" value={r.text} onChange={(v) => set({ text: v })} rows={3} />
                    </div>
                  </Card>
                )
              })}
              <button
                onClick={() => patch('reviews', { ...draft.reviews, items: [...draft.reviews.items, { id: uid('rev'), name: '', meta: '', color: '#8a94a6', text: '', visit: '', trip: '' }] })}
                className="rounded-full border border-[#dfe3ea] bg-white px-5 py-2.5 font-heading text-sm font-semibold text-navy hover:border-gold"
              >
                + Adicionar depoimento
              </button>
            </div>
          )}

          {active === 'gallery' && (
            <div className="space-y-5">
              <ImageField
                label="Enviar nova foto para a galeria"
                value=""
                onChange={(url) => url && patch('gallery', [...draft.gallery, { id: uid('gal'), src: url, cat: 'dunas', alt: '' }])}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {draft.gallery.map((g, i) => {
                  const set = (u: Partial<GalleryItem>) => {
                    const next = draft.gallery.slice()
                    next[i] = { ...g, ...u }
                    patch('gallery', next)
                  }
                  return (
                    <Card key={g.id} onRemove={() => patch('gallery', draft.gallery.filter((_, j) => j !== i))}>
                      <img src={g.src} alt={g.alt} className="mb-3 h-32 w-full rounded-lg object-cover" />
                      <div className="space-y-3">
                        <Field label="Legenda" value={g.alt} onChange={(v) => set({ alt: v })} />
                        <label className="block">
                          <span className="mb-1.5 block font-heading text-[13px] font-semibold text-navy">Categoria</span>
                          <select
                            value={g.cat}
                            onChange={(e) => set({ cat: e.target.value as GalleryItem['cat'] })}
                            className="rounded-[10px] border border-[#dfe3ea] bg-white px-3 py-2 font-body text-sm"
                          >
                            <option value="dunas">Dunas</option>
                            <option value="rio">Rio & Barco</option>
                            <option value="frota">Frota</option>
                            <option value="base">Nossa Base</option>
                          </select>
                        </label>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {active === 'base' && (
            <div className="space-y-5">
              <TextArea label="Texto de introdução" value={draft.base.intro} onChange={(v) => patch('base', { ...draft.base, intro: v })} rows={3} />
              <Card title="Estrutura (comodidades)">
                <StringList label="Itens" items={draft.base.structure} onChange={(v) => patch('base', { ...draft.base, structure: v })} />
              </Card>
              <Card title="Segurança">
                <StringList label="Itens" items={draft.base.safety} onChange={(v) => patch('base', { ...draft.base, safety: v })} />
              </Card>
              <Card title="Fotos da base">
                <StringList label="Fotos (URLs)" items={draft.base.images} onChange={(v) => patch('base', { ...draft.base, images: v })} />
                <div className="mt-3">
                  <ImageField label="Enviar nova foto" value="" onChange={(url) => url && patch('base', { ...draft.base, images: [...draft.base.images, url] })} />
                </div>
              </Card>
              <Card title="Direção">
                <div className="space-y-4">
                  <Field label="Nome" value={draft.base.director.name} onChange={(v) => patch('base', { ...draft.base, director: { ...draft.base.director, name: v } })} />
                  <Field label="Cargo" value={draft.base.director.role} onChange={(v) => patch('base', { ...draft.base, director: { ...draft.base.director, role: v } })} />
                  <TextArea label="Bio" value={draft.base.director.bio} onChange={(v) => patch('base', { ...draft.base, director: { ...draft.base.director, bio: v } })} rows={3} />
                  <ImageField label="Foto" value={draft.base.director.photo} onChange={(v) => patch('base', { ...draft.base, director: { ...draft.base.director, photo: v } })} />
                </div>
              </Card>
            </div>
          )}

          {active === 'contact' && (
            <div className="space-y-5">
              <Field label="WhatsApp (rodapé)" value={draft.contact.whatsapp} onChange={(v) => patch('contact', { ...draft.contact, whatsapp: v })} />
              <Field label="E-mail" value={draft.contact.email} onChange={(v) => patch('contact', { ...draft.contact, email: v })} />
              <Field label="Endereço" value={draft.contact.address} onChange={(v) => patch('contact', { ...draft.contact, address: v })} />
              <Field label="Instagram (URL)" value={draft.contact.instagram} onChange={(v) => patch('contact', { ...draft.contact, instagram: v })} />
              <Field label="Facebook (URL)" value={draft.contact.facebook} onChange={(v) => patch('contact', { ...draft.contact, facebook: v })} />
            </div>
          )}

          {active === 'settings' && (
            <div className="space-y-5">
              <div className="rounded-card border border-[#f0e6cc] bg-cream-warm p-4 font-body text-sm text-[#7a5a10]">
                O número do WhatsApp abaixo é usado em <strong>todos os botões de reserva</strong> do site.
              </div>
              <Field label="WhatsApp global (só números, ex: 5582999751975)" value={draft.settings.whatsapp} onChange={(v) => patch('settings', { ...draft.settings, whatsapp: v })} />
              <Field label="E-mail" value={draft.settings.email} onChange={(v) => patch('settings', { ...draft.settings, email: v })} />
              <ImageField label="Logo (versão clara, sobre o hero)" value={draft.settings.logoLight} onChange={(v) => patch('settings', { ...draft.settings, logoLight: v })} />
              <ImageField label="Logo (versão escura, header rolado)" value={draft.settings.logoDark} onChange={(v) => patch('settings', { ...draft.settings, logoDark: v })} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ------------------------------- Root -------------------------------------
export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
      </div>
    )
  }

  return session ? <Editor session={session} /> : <Login />
}
