import { useEffect, useMemo, useState } from 'react'
import { useBooking } from '../../lib/BookingContext'
import { createReservation, type Departure } from '../../lib/reservations'
import { waBookingLink } from '../../lib/wa'
import { Close, WhatsApp, Check } from '../Icons'

const DEPARTURES: Departure[] = ['09h', '14h']

// local YYYY-MM-DD for the date input min (no UTC shift)
function todayISO(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export default function BookingModal() {
  const { open, preselectedTour, content, phone, closeBooking } = useBooking()
  const tours = content.tours
  const min = todayISO()

  const [tourId, setTourId] = useState('')
  const [date, setDate] = useState('')
  const [departure, setDeparture] = useState<Departure>('09h')
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
      setTourId(preselectedTour?.id ?? tours[0]?.id ?? '')
      setDate('')
      setDeparture('09h')
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
  }, [open, preselectedTour, tours])

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const digits = phoneField.replace(/\D/g, '')
    if (!name.trim()) return setError('Informe seu nome.')
    if (digits.length < 10) return setError('Informe um WhatsApp válido com DDD.')
    if (!tourId) return setError('Escolha um passeio.')
    if (!date) return setError('Escolha a data do passeio.')
    if (date < min) return setError('A data deve ser hoje ou no futuro.')
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

  return (
    <>
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-navy/60 p-0 sm:items-center sm:p-4" onClick={closeBooking}>
      <div
        className="max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-t-3xl bg-cream p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-navy">Fazer pré-reserva</h2>
            <p className="mt-1 font-body text-sm text-muted">
              Escolha os detalhes e finalize a confirmação pelo WhatsApp.
            </p>
          </div>
          <button onClick={closeBooking} aria-label="Fechar" className="shrink-0 text-navy hover:text-gold-text">
            <Close />
          </button>
        </div>

        {done ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-wa/15 text-wa">
              <Check size={34} />
            </div>
            <h3 className="mb-2 font-heading text-lg font-bold text-navy">Pré-reserva enviada!</h3>
            <p className="mx-auto mb-6 max-w-[36ch] font-body text-sm text-muted">
              Abrimos o WhatsApp com o resumo. A confirmação e o pagamento são feitos por lá.
              Se a janela não abriu, toque no botão abaixo.
            </p>
            <a
              href={waBookingLink(phone, {
                name: name.trim(),
                tourTitle: selectedTour?.title ?? 'Passeio',
                date,
                departure,
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
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className={labelCls}>Passeio</label>
              <select value={tourId} onChange={(e) => setTourId(e.target.value)} className={inputCls}>
                {tours.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Data</label>
                <input type="date" min={min} value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Saída</label>
                <div className="flex gap-2">
                  {DEPARTURES.map((d) => {
                    const on = departure === d
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDeparture(d)}
                        className="flex-1 rounded-xl border py-2.5 font-heading text-sm font-bold transition"
                        style={{
                          background: on ? '#f2a900' : '#fff',
                          color: on ? '#1a2b3d' : '#5c6b7e',
                          borderColor: on ? '#f2a900' : '#e3e7ee',
                        }}
                      >
                        {d}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Número de pessoas</label>
              <input
                type="number"
                min={1}
                max={60}
                value={people}
                onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))}
                className={inputCls}
              />
              {selectedTour?.min && (
                <p className="mt-1 font-body text-xs text-muted">Saída mínima: {selectedTour.min}</p>
              )}
            </div>

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
