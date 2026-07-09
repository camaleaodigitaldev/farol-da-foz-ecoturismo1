import { useEffect, useMemo, useState } from 'react'
import { useBooking } from '../../lib/BookingContext'
import { createReservation, type Departure } from '../../lib/reservations'
import { waBookingLink, formatDateBR } from '../../lib/wa'
import { Close, WhatsApp, Check, ChevronLeft, ChevronRight } from '../Icons'

const DEPARTURES: Departure[] = ['09h', '14h']
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const pad = (n: number) => String(n).padStart(2, '0')
const isoOf = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

// local YYYY-MM-DD (no UTC shift)
function todayISO(): string {
  const d = new Date()
  return isoOf(d.getFullYear(), d.getMonth(), d.getDate())
}

type Step = 'tour' | 'date' | 'people' | 'details'

export default function BookingModal() {
  const { open, preselectedTour, content, phone, closeBooking } = useBooking()
  const tours = content.tours
  const minISO = todayISO()

  const [step, setStep] = useState<Step>('tour')
  const [tourId, setTourId] = useState('')
  const [view, setView] = useState({ y: 0, m: 0 }) // calendar month in view
  const [date, setDate] = useState('')
  const [departure, setDeparture] = useState<Departure | null>(null)
  const [people, setPeople] = useState(2)
  const [name, setName] = useState('')
  const [phoneField, setPhoneField] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [company, setCompany] = useState('') // honeypot (should stay empty)
  const [openedAt, setOpenedAt] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const [showPolicy, setShowPolicy] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  // (re)initialise each time the modal opens
  useEffect(() => {
    if (open) {
      const now = new Date()
      setView({ y: now.getFullYear(), m: now.getMonth() })
      setTourId(preselectedTour?.id ?? '')
      setStep(preselectedTour ? 'date' : 'tour')
      setDate('')
      setDeparture(null)
      setPeople(2)
      setName('')
      setPhoneField('')
      setEmail('')
      setNotes('')
      setCompany('')
      setAccepted(false)
      setShowPolicy(false)
      setError('')
      setDone(false)
      setSubmitting(false)
      setOpenedAt(Date.now())
    }
  }, [open, preselectedTour])

  // lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  const selectedTour = useMemo(() => tours.find((t) => t.id === tourId), [tours, tourId])

  if (!open) return null

  // ---- calendar helpers ------------------------------------------------
  const firstWeekday = new Date(view.y, view.m, 1).getDay()
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const now = new Date()
  const atCurrentMonth = view.y === now.getFullYear() && view.m === now.getMonth()
  const stepMonth = (dir: number) => {
    setView((v) => {
      const m = v.m + dir
      if (m < 0) return { y: v.y - 1, m: 11 }
      if (m > 11) return { y: v.y + 1, m: 0 }
      return { ...v, m }
    })
  }

  const pickDate = (isoDay: string) => {
    setDate(isoDay)
    setDeparture(null)
  }

  const goBack = () => {
    setError('')
    if (step === 'date') setStep('tour')
    else if (step === 'people') setStep('date')
    else if (step === 'details') setStep('people')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const digits = phoneField.replace(/\D/g, '')
    if (!name.trim()) return setError('Informe seu nome.')
    if (digits.length < 10) return setError('Informe um WhatsApp válido com DDD.')
    if (!tourId || !date || !departure) return setError('Volte e escolha passeio, data e horário.')
    if (date < minISO) return setError('A data deve ser hoje ou no futuro.')
    if (people < 1) return setError('Informe o número de pessoas.')
    if (!accepted) return setError('É necessário aceitar a política de cancelamento.')
    // honeypot / too-fast bot guard
    if (company.trim() || Date.now() - openedAt < 1500) {
      return setError('Não foi possível enviar. Tente novamente.')
    }

    setSubmitting(true)
    try {
      const tourTitle = selectedTour?.title ?? 'Passeio'
      await createReservation({
        customer_name: name.trim(),
        phone: digits,
        email: email.trim() || null,
        tour_id: tourId,
        tour_title: tourTitle,
        date,
        departure,
        people,
        notes: notes.trim() || null,
      })
      // only open WhatsApp after the reservation actually persisted
      window.open(waBookingLink(phone, { name: name.trim(), tourTitle, date, departure, people }), '_blank')
      setDone(true)
    } catch (err) {
      setError('Não foi possível registrar a pré-reserva. Tente novamente ou fale pelo WhatsApp.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls =
    'w-full rounded-xl border border-[#e3e7ee] bg-white px-3.5 py-2.5 font-body text-sm text-navy outline-none focus:border-gold'
  const labelCls = 'mb-1.5 block font-heading text-[13px] font-semibold text-navy'

  const STEP_TITLES: Record<Step, string> = {
    tour: 'Escolha o passeio',
    date: 'Selecione a data',
    people: 'Quantas pessoas?',
    details: 'Seus dados',
  }
  const STEP_INDEX: Record<Step, number> = { tour: 1, date: 2, people: 3, details: 4 }

  return (
    <>
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-navy/60 p-0 sm:items-center sm:p-4" onClick={closeBooking}>
      <div
        className="max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-t-3xl bg-cream p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            {!done && step !== 'tour' && !(step === 'date' && preselectedTour) && (
              <button onClick={goBack} aria-label="Voltar" className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-navy shadow-sm hover:text-gold-text">
                <ChevronLeft size={18} />
              </button>
            )}
            <div>
              <h2 className="font-heading text-xl font-bold text-navy">{done ? 'Pré-reserva enviada!' : STEP_TITLES[step]}</h2>
              {!done && <p className="mt-0.5 font-body text-xs text-muted">Passo {STEP_INDEX[step]} de 4 · pagamento pelo WhatsApp</p>}
            </div>
          </div>
          <button onClick={closeBooking} aria-label="Fechar" className="shrink-0 text-navy hover:text-gold-text">
            <Close />
          </button>
        </div>

        {/* Selection summary chips */}
        {!done && (selectedTour || date || departure) && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {selectedTour && (
              <span className="rounded-full bg-navy px-3 py-1 font-heading text-[11px] font-bold text-white">{selectedTour.title}</span>
            )}
            {date && (
              <span className="rounded-full bg-gold px-3 py-1 font-heading text-[11px] font-bold text-navy">{formatDateBR(date)}</span>
            )}
            {departure && (
              <span className="rounded-full bg-gold px-3 py-1 font-heading text-[11px] font-bold text-navy">Saída {departure}</span>
            )}
            {step === 'details' && (
              <span className="rounded-full bg-gold px-3 py-1 font-heading text-[11px] font-bold text-navy">
                {people} {people === 1 ? 'pessoa' : 'pessoas'}
              </span>
            )}
          </div>
        )}

        {done ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-wa/15 text-wa">
              <Check size={34} />
            </div>
            <p className="mx-auto mb-6 max-w-[36ch] font-body text-sm text-muted">
              Abrimos o WhatsApp com o resumo. A confirmação e o pagamento são feitos por lá.
              Se a janela não abriu, toque no botão abaixo.
            </p>
            <a
              href={waBookingLink(phone, {
                name: name.trim(),
                tourTitle: selectedTour?.title ?? 'Passeio',
                date,
                departure: departure ?? '09h',
                people,
              })}
              target="_blank"
              rel="noreferrer"
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3 font-heading font-bold text-white"
            >
              <WhatsApp /> Abrir WhatsApp
            </a>
            <div>
              <button onClick={closeBooking} className="font-heading text-sm font-semibold text-muted hover:text-navy">
                Fechar
              </button>
            </div>
          </div>
        ) : step === 'tour' ? (
          /* ---------------- Step 1: tour ---------------- */
          <div className="space-y-2.5">
            {tours.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTourId(t.id)
                  setStep('date')
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-[#f0e6cc] bg-white p-3 text-left transition hover:border-gold"
              >
                <img src={t.image} alt={t.title} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                <span className="flex-1">
                  <span className="block font-heading text-[15px] font-bold text-navy">{t.title}</span>
                  <span className="block font-body text-xs text-muted">
                    a partir de <strong className="text-gold-text">R$ {t.price}</strong> · {t.duration}
                  </span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-gold-text" />
              </button>
            ))}
          </div>
        ) : step === 'date' ? (
          /* ---------------- Step 2: calendar + time ---------------- */
          <div>
            <div className="rounded-2xl border border-[#f0e6cc] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <button
                  onClick={() => stepMonth(-1)}
                  disabled={atCurrentMonth}
                  aria-label="Mês anterior"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-navy disabled:opacity-30"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="font-heading text-[15px] font-bold text-navy">
                  {MONTHS[view.m]} {view.y}
                </span>
                <button
                  onClick={() => stepMonth(1)}
                  aria-label="Próximo mês"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-navy"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="mb-1 grid grid-cols-7 text-center">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="py-1 font-heading text-[11px] font-semibold text-muted">
                    {w}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstWeekday }).map((_, i) => (
                  <span key={`b${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1
                  const isoDay = isoOf(view.y, view.m, d)
                  const past = isoDay < minISO
                  const sel = isoDay === date
                  return (
                    <button
                      key={d}
                      disabled={past}
                      onClick={() => pickDate(isoDay)}
                      className="flex items-center justify-center rounded-lg py-2.5 transition disabled:cursor-default"
                      style={{
                        background: sel ? '#f2a900' : past ? 'transparent' : '#faf8f3',
                      }}
                    >
                      <span className="font-heading text-[14px] font-bold" style={{ color: past ? '#c3cbd6' : '#1a2b3d' }}>
                        {d}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {date && (
              <div className="mt-4">
                <p className="mb-2 text-center font-heading text-sm font-bold text-navy">Escolha um horário</p>
                <div className="flex gap-3">
                  {DEPARTURES.map((dep) => (
                    <button
                      key={dep}
                      onClick={() => {
                        setDeparture(dep)
                        setStep('people')
                      }}
                      className="flex-1 rounded-xl border border-[#e3e7ee] bg-white py-3.5 font-heading text-[15px] font-bold text-navy transition hover:border-gold hover:bg-cream-warm"
                    >
                      {dep === '09h' ? '09:00' : '14:00'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : step === 'people' ? (
          /* ---------------- Step 3: people ---------------- */
          <div className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center gap-5">
              <button
                onClick={() => setPeople((p) => Math.max(1, p - 1))}
                aria-label="Menos pessoas"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e3e7ee] bg-white font-heading text-2xl font-bold text-navy hover:border-gold"
              >
                −
              </button>
              <span className="w-16 font-heading text-4xl font-bold text-navy">{people}</span>
              <button
                onClick={() => setPeople((p) => Math.min(60, p + 1))}
                aria-label="Mais pessoas"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gold font-heading text-2xl font-bold text-navy hover:bg-[#ffbb1a]"
              >
                +
              </button>
            </div>
            {selectedTour && Number(selectedTour.price) > 0 && (
              <p className="mb-1.5 font-body text-[13px] text-muted">
                Valor estimado:{' '}
                <strong className="font-semibold text-navy">R$ {people * Number(selectedTour.price)}</strong>
                <span className="text-[11.5px]"> ({people} × R$ {selectedTour.price} · a combinar no WhatsApp)</span>
              </p>
            )}
            <p className="mb-6 font-body text-xs text-muted">
              {selectedTour?.min ? `Saída mínima: ${selectedTour.min}` : 'Escolha quantas pessoas vão no passeio.'}
            </p>
            <button
              onClick={() => setStep('details')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-heading font-bold text-navy transition hover:bg-[#ffbb1a]"
            >
              Continuar <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          /* ---------------- Step 4: details + policy ---------------- */
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Seu nome</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Nome completo" />
              </div>
              <div>
                <label className={labelCls}>WhatsApp</label>
                <input
                  value={phoneField}
                  onChange={(e) => setPhoneField(e.target.value)}
                  className={inputCls}
                  placeholder="(82) 90000-0000"
                  inputMode="tel"
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>E-mail (opcional)</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="voce@email.com" inputMode="email" />
            </div>

            <div>
              <label className={labelCls}>Observações (opcional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputCls} placeholder="Alguma preferência ou dúvida?" />
            </div>

            {/* honeypot — hidden from users, catches bots */}
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            <label className="flex cursor-pointer items-start gap-2.5 font-body text-[13px] text-[#4f5f72]">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#2f8f6b]"
              />
              <span>
                Li e aceito a{' '}
                <button
                  type="button"
                  onClick={() => setShowPolicy(true)}
                  className="font-semibold text-eco underline underline-offset-2"
                >
                  política de cancelamento
                </button>
                .
              </span>
            </label>

            {error && <p className="font-body text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-wa px-6 py-3.5 font-heading font-bold text-white transition hover:opacity-95 disabled:opacity-60"
            >
              <WhatsApp /> {submitting ? 'Enviando…' : 'Enviar pré-reserva'}
            </button>
            <p className="text-center font-body text-xs text-muted">
              A confirmação e o pagamento são combinados pelo WhatsApp.
            </p>
          </form>
        )}
      </div>
    </div>

    {/* Cancellation policy popup (renders above the booking modal) */}
    {showPolicy && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/70 p-4"
        onClick={() => setShowPolicy(false)}
      >
        <div
          className="max-h-[85vh] w-full max-w-[480px] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <h3 className="font-heading text-lg font-bold text-navy">Política de cancelamento</h3>
            <button onClick={() => setShowPolicy(false)} aria-label="Fechar" className="shrink-0 text-navy hover:text-gold-text">
              <Close />
            </button>
          </div>
          <p className="whitespace-pre-line font-body text-sm leading-[1.7] text-[#42556b]">
            {content.settings.cancellationPolicy}
          </p>
          <button
            onClick={() => {
              setAccepted(true)
              setShowPolicy(false)
            }}
            className="mt-6 w-full rounded-full bg-gold px-6 py-3 font-heading font-bold text-navy transition hover:bg-[#ffbb1a]"
          >
            Li e aceito
          </button>
        </div>
      </div>
    )}
    </>
  )
}
