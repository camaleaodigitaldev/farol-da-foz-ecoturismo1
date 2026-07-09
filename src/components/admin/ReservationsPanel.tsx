import { useEffect, useMemo, useState } from 'react'
import type { FleetVehicle } from '../../lib/content'
import {
  listReservations,
  updateReservation,
  deleteReservation,
  type Reservation,
  type ReservationStatus,
  type Departure,
} from '../../lib/reservations'
import { formatDateBR } from '../../lib/wa'

// NOTE: LIVE CRUD directly on the `reservations` table — independent of the
// content `draft` / "Publicar" flow. This is the company's tour-management hub.

const STATUSES: { key: ReservationStatus; label: string; bg: string; color: string }[] = [
  { key: 'pendente', label: 'Pendente', bg: '#fdeec4', color: '#8a6100' },
  { key: 'confirmada', label: 'Confirmada', bg: '#d8f0e2', color: '#0c7b4e' },
  { key: 'concluida', label: 'Concluída', bg: '#dfe7f5', color: '#274b8f' },
  { key: 'cancelada', label: 'Cancelada', bg: '#f7dcdc', color: '#a5342b' },
]
const statusMeta = (s: ReservationStatus) => STATUSES.find((x) => x.key === s) ?? STATUSES[0]

const DEPARTURES: Departure[] = ['09h', '14h']
const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const pad = (n: number) => String(n).padStart(2, '0')
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fromISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
const startOfWeek = (d: Date) => addDays(d, -d.getDay()) // Sunday
const shortBR = (iso: string) => {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

type Tab = 'painel' | 'pendentes' | 'confirmadas' | 'agenda'
type AgendaMode = 'mensal' | 'semanal'

// customer-facing WhatsApp helper (the customer's own number)
const waCustomer = (r: Reservation) =>
  `https://wa.me/${r.phone}?text=${encodeURIComponent(
    `Olá ${r.customer_name}! Sobre sua pré-reserva do passeio ${r.tour_title} na Farol da Foz Ecoturismo...`
  )}`

export default function ReservationsPanel({ fleet }: { fleet: FleetVehicle[] }) {
  const [rows, setRows] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('painel')
  const [agendaMode, setAgendaMode] = useState<AgendaMode>('mensal')

  const now = new Date()
  const todayIso = toISO(now)
  const [monthView, setMonthView] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [weekStart, setWeekStart] = useState(() => toISO(startOfWeek(now)))
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [showPast, setShowPast] = useState(false)

  const totalSeats = useMemo(() => fleet.reduce((s, v) => s + (v.seats || 0), 0), [fleet])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setRows(await listReservations({}))
    } catch (e) {
      setError('Não foi possível carregar as reservas. Verifique sua conexão.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])

  // ---- mutations (optimistic) -----------------------------------------
  const setRowStatus = async (id: string, s: ReservationStatus) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status: s } : x)))
    try {
      await updateReservation(id, { status: s })
    } catch (e) {
      console.error(e)
      load()
    }
  }
  const saveNotes = async (id: string, admin_notes: string) => {
    try {
      await updateReservation(id, { admin_notes })
    } catch (e) {
      console.error(e)
    }
  }
  const remove = async (id: string) => {
    if (!confirm('Excluir esta reserva? Esta ação não pode ser desfeita.')) return
    setRows((r) => r.filter((x) => x.id !== id))
    try {
      await deleteReservation(id)
    } catch (e) {
      console.error(e)
      load()
    }
  }

  // ---- derived data ----------------------------------------------------
  const pending = useMemo(
    () => rows.filter((r) => r.status === 'pendente').sort((a, b) => a.date.localeCompare(b.date)),
    [rows]
  )
  const confirmed = useMemo(() => rows.filter((r) => r.status === 'confirmada'), [rows])
  const active = (r: Reservation) => r.status === 'pendente' || r.status === 'confirmada'

  const sum = (list: Reservation[]) => list.reduce((s, r) => s + r.people, 0)
  const in7 = toISO(addDays(now, 7))
  const todayConfirmed = confirmed.filter((r) => r.date === todayIso)
  const next7Confirmed = confirmed.filter((r) => r.date >= todayIso && r.date <= in7)
  const monthConfirmed = confirmed.filter((r) => {
    const d = fromISO(r.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const upcomingConfirmed = confirmed
    .filter((r) => r.date >= todayIso)
    .sort((a, b) => a.date.localeCompare(b.date) || a.departure.localeCompare(b.departure))

  // occupancy of today per departure (active = pending+confirmed)
  const occToday = (dep: Departure) =>
    sum(rows.filter((r) => r.date === todayIso && r.departure === dep && active(r)))

  // ---- small render helpers -------------------------------------------
  const Metric = ({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) => (
    <div className="rounded-card border border-[#e3e7ee] bg-white p-4">
      <div className="font-heading text-[12px] font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 font-heading text-2xl font-bold" style={{ color: accent || '#1a2b3d' }}>
        {value}
      </div>
      {sub && <div className="mt-0.5 font-body text-xs text-muted">{sub}</div>}
    </div>
  )

  const CompactRow = ({ r, action }: { r: Reservation; action?: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-3 border-b border-[#eef1f5] py-2.5 last:border-0">
      <div className="min-w-0">
        <div className="truncate font-heading text-[13.5px] font-bold text-navy">{r.customer_name}</div>
        <div className="truncate font-body text-[12px] text-muted">
          {r.tour_title} · {formatDateBR(r.date)} · {r.departure} · {r.people}p
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <a href={waCustomer(r)} target="_blank" rel="noreferrer" className="font-heading text-[12px] font-semibold text-eco underline">
          WhatsApp
        </a>
        {action}
      </div>
    </div>
  )

  const fullCard = (r: Reservation) => {
    const m = statusMeta(r.status)
    return (
      <div key={r.id} className="rounded-card border border-[#e3e7ee] bg-white p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-heading text-base font-bold text-navy">{r.customer_name}</span>
            <span className="rounded-full px-2.5 py-1 font-heading text-[11px] font-bold" style={{ background: m.bg, color: m.color }}>
              {m.label}
            </span>
          </div>
          <span className="font-body text-xs text-muted">
            {r.people} {r.people === 1 ? 'pessoa' : 'pessoas'}
          </span>
        </div>
        <div className="mb-3 grid gap-x-6 gap-y-1 font-body text-[13.5px] text-[#4f5f72] sm:grid-cols-2">
          <div><strong className="font-semibold text-navy">Passeio:</strong> {r.tour_title}</div>
          <div><strong className="font-semibold text-navy">Data:</strong> {formatDateBR(r.date)} · {r.departure}</div>
          <div>
            <strong className="font-semibold text-navy">WhatsApp:</strong>{' '}
            <a href={waCustomer(r)} target="_blank" rel="noreferrer" className="font-semibold text-eco underline">
              {r.phone}
            </a>
          </div>
          {r.email && <div><strong className="font-semibold text-navy">E-mail:</strong> {r.email}</div>}
        </div>
        {r.notes && (
          <p className="mb-3 rounded-lg bg-cream-warm px-3 py-2 font-body text-[13px] text-[#7a5a10]">
            <strong>Obs. do cliente:</strong> {r.notes}
          </p>
        )}
        <textarea
          defaultValue={r.admin_notes ?? ''}
          onBlur={(e) => saveNotes(r.id, e.target.value)}
          rows={2}
          placeholder="Anotações internas (salva ao clicar fora)"
          className="mb-3 w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 font-body text-[13px] text-navy outline-none focus:border-gold"
        />
        <div className="flex flex-wrap items-center gap-2">
          {STATUSES.filter((s) => s.key !== r.status).map((s) => (
            <button
              key={s.key}
              onClick={() => setRowStatus(r.id, s.key)}
              className="rounded-lg border border-[#dfe3ea] bg-white px-3 py-1.5 font-heading text-[12.5px] font-semibold text-navy hover:border-gold"
            >
              → {s.label}
            </button>
          ))}
          <button
            onClick={() => remove(r.id)}
            className="ml-auto rounded-lg border border-[#f0d3d3] bg-[#fdf1f1] px-3 py-1.5 font-heading text-[12.5px] font-semibold text-[#c0392b]"
          >
            Excluir
          </button>
        </div>
      </div>
    )
  }

  const TABS: { key: Tab; label: string; badge?: number }[] = [
    { key: 'painel', label: 'Painel' },
    { key: 'pendentes', label: 'Pendentes', badge: pending.length },
    { key: 'confirmadas', label: 'Confirmadas', badge: upcomingConfirmed.length },
    { key: 'agenda', label: 'Agenda' },
  ]

  if (loading) return <p className="font-body text-sm text-muted">Carregando…</p>

  return (
    <div className="space-y-5">
      {/* Tabs + refresh */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-sm">
          {TABS.map((t) => {
            const on = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 font-heading text-[13px] font-bold transition"
                style={{ background: on ? '#1a2b3d' : 'transparent', color: on ? '#fff' : '#5c6b7e' }}
              >
                {t.label}
                {t.badge ? (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                    style={{ background: on ? '#f2a900' : '#eef1f5', color: on ? '#1a2b3d' : '#5c6b7e' }}
                  >
                    {t.badge}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
        <button onClick={load} className="ml-auto rounded-lg bg-navy px-4 py-2 font-heading text-[13px] font-semibold text-white hover:bg-steel">
          Atualizar
        </button>
      </div>

      {error && <p className="font-body text-sm text-red-500">{error}</p>}

      {/* ---------------- PAINEL ---------------- */}
      {tab === 'painel' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Metric label="Pendentes" value={String(pending.length)} sub="aguardando confirmação" accent={pending.length ? '#8a6100' : '#1a2b3d'} />
            <Metric label="Hoje" value={`${todayConfirmed.length}`} sub={`${sum(todayConfirmed)} pessoas confirmadas`} accent="#0c7b4e" />
            <Metric label="Próximos 7 dias" value={`${next7Confirmed.length}`} sub={`${sum(next7Confirmed)} pessoas`} />
            <Metric label={`${MONTHS[now.getMonth()]}`} value={`${monthConfirmed.length}`} sub={`${sum(monthConfirmed)} pessoas no mês`} />
          </div>

          {/* occupancy today */}
          <div className="rounded-card border border-[#e3e7ee] bg-white p-4">
            <div className="mb-2 font-heading text-[13px] font-bold text-navy">Ocupação de hoje ({formatDateBR(todayIso)})</div>
            <div className="grid grid-cols-2 gap-3">
              {DEPARTURES.map((dep) => {
                const used = occToday(dep)
                const full = totalSeats > 0 && used >= totalSeats
                const pct = totalSeats > 0 ? Math.min(100, Math.round((used / totalSeats) * 100)) : 0
                return (
                  <div key={dep}>
                    <div className="mb-1 flex items-center justify-between font-heading text-[13px] font-semibold text-navy">
                      <span>Saída {dep}</span>
                      <span style={{ color: full ? '#a5342b' : '#5c6b7e' }}>{used}/{totalSeats || '—'}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef1f5]">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: full ? '#a5342b' : '#2f8f6b' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-card border border-[#e3e7ee] bg-white p-4">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-heading text-sm font-bold text-navy">Próximos passeios confirmados</h3>
                {upcomingConfirmed.length > 5 && (
                  <button onClick={() => setTab('confirmadas')} className="font-heading text-[12px] font-semibold text-eco">ver todos</button>
                )}
              </div>
              {upcomingConfirmed.length === 0 ? (
                <p className="py-3 font-body text-[13px] text-muted">Nenhum passeio confirmado à frente.</p>
              ) : (
                upcomingConfirmed.slice(0, 5).map((r) => <CompactRow key={r.id} r={r} />)
              )}
            </div>

            <div className="rounded-card border border-[#e3e7ee] bg-white p-4">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-heading text-sm font-bold text-navy">Pré-reservas a confirmar</h3>
                {pending.length > 5 && (
                  <button onClick={() => setTab('pendentes')} className="font-heading text-[12px] font-semibold text-eco">ver todas</button>
                )}
              </div>
              {pending.length === 0 ? (
                <p className="py-3 font-body text-[13px] text-muted">Nenhuma pré-reserva pendente. 🎉</p>
              ) : (
                pending.slice(0, 5).map((r) => (
                  <CompactRow
                    key={r.id}
                    r={r}
                    action={
                      <button
                        onClick={() => setRowStatus(r.id, 'confirmada')}
                        className="rounded-md bg-[#d8f0e2] px-2.5 py-1 font-heading text-[11.5px] font-bold text-[#0c7b4e]"
                      >
                        Confirmar
                      </button>
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PENDENTES ---------------- */}
      {tab === 'pendentes' && (
        <div className="space-y-3">
          {pending.length === 0 ? (
            <div className="rounded-card border border-dashed border-[#dfe3ea] bg-white p-8 text-center font-body text-sm text-muted">
              Nenhuma pré-reserva pendente.
            </div>
          ) : (
            pending.map(fullCard)
          )}
        </div>
      )}

      {/* ---------------- CONFIRMADAS ---------------- */}
      {tab === 'confirmadas' && (
        <div className="space-y-3">
          <label className="flex items-center gap-2 font-body text-[13px] text-muted">
            <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="h-4 w-4 accent-navy" />
            Mostrar passeios passados
          </label>
          {(() => {
            const list = confirmed
              .filter((r) => (showPast ? true : r.date >= todayIso))
              .sort((a, b) => a.date.localeCompare(b.date) || a.departure.localeCompare(b.departure))
            return list.length === 0 ? (
              <div className="rounded-card border border-dashed border-[#dfe3ea] bg-white p-8 text-center font-body text-sm text-muted">
                Nenhum passeio confirmado.
              </div>
            ) : (
              list.map(fullCard)
            )
          })()}
        </div>
      )}

      {/* ---------------- AGENDA ---------------- */}
      {tab === 'agenda' && (
        <div className="space-y-4">
          <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm" style={{ width: 'fit-content' }}>
            {(['mensal', 'semanal'] as AgendaMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setAgendaMode(mode)}
                className="rounded-full px-4 py-1.5 font-heading text-[13px] font-bold transition"
                style={{ background: agendaMode === mode ? '#f2a900' : 'transparent', color: agendaMode === mode ? '#1a2b3d' : '#5c6b7e' }}
              >
                Agenda {mode}
              </button>
            ))}
            <span className="ml-1 self-center font-body text-[11px] text-muted">só confirmados</span>
          </div>

          {agendaMode === 'mensal' ? (
            <MonthAgenda
              monthView={monthView}
              setMonthView={setMonthView}
              confirmed={confirmed}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              fullCard={fullCard}
              sum={sum}
            />
          ) : (
            <WeekAgenda
              weekStart={weekStart}
              setWeekStart={setWeekStart}
              confirmed={confirmed}
              totalSeats={totalSeats}
            />
          )}
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------------ Month
function MonthAgenda({
  monthView,
  setMonthView,
  confirmed,
  selectedDay,
  setSelectedDay,
  fullCard,
  sum,
}: {
  monthView: { y: number; m: number }
  setMonthView: (v: { y: number; m: number }) => void
  confirmed: Reservation[]
  selectedDay: string | null
  setSelectedDay: (v: string | null) => void
  fullCard: (r: Reservation) => React.ReactNode
  sum: (l: Reservation[]) => number
}) {
  const byDate = useMemo(() => {
    const map = new Map<string, Reservation[]>()
    for (const r of confirmed) {
      const arr = map.get(r.date) ?? []
      arr.push(r)
      map.set(r.date, arr)
    }
    return map
  }, [confirmed])

  const firstWeekday = new Date(monthView.y, monthView.m, 1).getDay()
  const daysInMonth = new Date(monthView.y, monthView.m + 1, 0).getDate()
  const step = (dir: number) => {
    let m = monthView.m + dir
    let y = monthView.y
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setMonthView({ y, m })
    setSelectedDay(null)
  }

  const dayList = selectedDay ? (byDate.get(selectedDay) ?? []).sort((a, b) => a.departure.localeCompare(b.departure)) : []

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-[#e3e7ee] bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => step(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-cream font-heading text-lg text-navy">‹</button>
          <span className="font-heading text-[15px] font-bold text-navy">{MONTHS[monthView.m]} {monthView.y}</span>
          <button onClick={() => step(1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-heading text-lg text-navy">›</button>
        </div>
        <div className="mb-1 grid grid-cols-7 text-center">
          {WEEKDAYS.map((w) => <span key={w} className="py-1 font-heading text-[11px] font-semibold text-muted">{w}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstWeekday }).map((_, i) => <span key={`b${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d = i + 1
            const iso = `${monthView.y}-${pad(monthView.m + 1)}-${pad(d)}`
            const items = byDate.get(iso) ?? []
            const people = sum(items)
            const sel = selectedDay === iso
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(items.length ? iso : null)}
                className="flex min-h-[54px] flex-col items-center rounded-lg border p-1 transition"
                style={{
                  borderColor: sel ? '#f2a900' : '#eef1f5',
                  background: items.length ? (sel ? '#fdf6e6' : '#f6fbf8') : '#fff',
                  cursor: items.length ? 'pointer' : 'default',
                }}
              >
                <span className="font-heading text-[13px] font-bold text-navy">{d}</span>
                {items.length > 0 && (
                  <span className="mt-auto rounded-full bg-[#d8f0e2] px-1.5 py-0.5 font-heading text-[10px] font-bold text-[#0c7b4e]">
                    {items.length}🚙 {people}p
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDay && dayList.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-heading text-sm font-bold text-navy">Passeios de {formatDateBR(selectedDay)}</h3>
          {dayList.map(fullCard)}
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------------ Week
function WeekAgenda({
  weekStart,
  setWeekStart,
  confirmed,
  totalSeats,
}: {
  weekStart: string
  setWeekStart: (v: string) => void
  confirmed: Reservation[]
  totalSeats: number
}) {
  const start = fromISO(weekStart)
  const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i))
  const endIso = toISO(addDays(start, 6))

  const cell = (iso: string, dep: Departure) =>
    confirmed
      .filter((r) => r.date === iso && r.departure === dep)
      .sort((a, b) => b.people - a.people)

  const sumPeople = (list: Reservation[]) => list.reduce((s, r) => s + r.people, 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-card border border-[#e3e7ee] bg-white px-4 py-3">
        <button onClick={() => setWeekStart(toISO(addDays(start, -7)))} className="flex h-9 w-9 items-center justify-center rounded-full bg-cream font-heading text-lg text-navy">‹</button>
        <span className="font-heading text-[14px] font-bold text-navy">Semana de {shortBR(weekStart)} a {shortBR(endIso)}</span>
        <button onClick={() => setWeekStart(toISO(addDays(start, 7)))} className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-heading text-lg text-navy">›</button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          {/* header */}
          <div className="grid grid-cols-[64px_repeat(7,1fr)] gap-1">
            <div />
            {days.map((d) => {
              const iso = toISO(d)
              const isToday = iso === toISO(new Date())
              return (
                <div key={iso} className="rounded-lg py-1.5 text-center" style={{ background: isToday ? '#fdf6e6' : 'transparent' }}>
                  <div className="font-heading text-[11px] font-semibold text-muted">{WEEKDAYS[d.getDay()]}</div>
                  <div className="font-heading text-[13px] font-bold text-navy">{shortBR(iso)}</div>
                </div>
              )
            })}
          </div>
          {/* rows per departure */}
          {DEPARTURES.map((dep) => (
            <div key={dep} className="mt-1 grid grid-cols-[64px_repeat(7,1fr)] gap-1">
              <div className="flex items-center justify-center rounded-lg bg-navy font-heading text-[13px] font-bold text-white">{dep}</div>
              {days.map((d) => {
                const iso = toISO(d)
                const items = cell(iso, dep)
                const ppl = sumPeople(items)
                const full = totalSeats > 0 && ppl >= totalSeats
                return (
                  <div key={iso} className="min-h-[84px] rounded-lg border border-[#eef1f5] bg-white p-1.5">
                    {items.length > 0 && (
                      <div className="mb-1 text-right font-heading text-[10px] font-bold" style={{ color: full ? '#a5342b' : '#0c7b4e' }}>
                        {ppl}/{totalSeats || '—'}
                      </div>
                    )}
                    <div className="space-y-1">
                      {items.map((r) => (
                        <a
                          key={r.id}
                          href={waCustomer(r)}
                          target="_blank"
                          rel="noreferrer"
                          title={`${r.customer_name} · ${r.people}p · ${r.phone} · ${r.tour_title}`}
                          className="block rounded-md bg-[#eaf5ef] px-1.5 py-1 font-body text-[11px] leading-tight text-[#0c5f43] hover:bg-[#d8f0e2]"
                        >
                          <span className="block truncate font-semibold">{r.customer_name}</span>
                          <span className="block truncate">{r.people}p · {r.phone}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="font-body text-[12px] text-muted">Toque em uma pessoa para abrir o WhatsApp dela.</p>
    </div>
  )
}
