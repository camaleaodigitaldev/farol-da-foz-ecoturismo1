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

// NOTE: This panel does LIVE CRUD directly on the `reservations` table. It never
// touches the content `draft` / "Publicar" flow — reservations are independent
// of the site content document.

const STATUSES: { key: ReservationStatus; label: string; bg: string; color: string }[] = [
  { key: 'pendente', label: 'Pendente', bg: '#fdeec4', color: '#8a6100' },
  { key: 'confirmada', label: 'Confirmada', bg: '#d8f0e2', color: '#0c7b4e' },
  { key: 'concluida', label: 'Concluída', bg: '#dfe7f5', color: '#274b8f' },
  { key: 'cancelada', label: 'Cancelada', bg: '#f7dcdc', color: '#a5342b' },
]

function statusMeta(s: ReservationStatus) {
  return STATUSES.find((x) => x.key === s) ?? STATUSES[0]
}

export default function ReservationsPanel({ fleet }: { fleet: FleetVehicle[] }) {
  const [rows, setRows] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<ReservationStatus | 'todos'>('todos')
  const [date, setDate] = useState('')
  const [departure, setDeparture] = useState<Departure | 'todas'>('todas')

  const totalSeats = useMemo(() => fleet.reduce((s, v) => s + (v.seats || 0), 0), [fleet])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listReservations({ status, date: date || undefined, departure })
      setRows(data)
    } catch (e) {
      setError('Não foi possível carregar as reservas. Verifique sua conexão.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, date, departure])

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

  // Occupancy per departure for the currently filtered day (active = pendente+confirmada)
  const occupancy = useMemo(() => {
    const acc: Record<string, number> = { '09h': 0, '14h': 0 }
    for (const r of rows) {
      if (r.status === 'pendente' || r.status === 'confirmada') {
        acc[r.departure] = (acc[r.departure] || 0) + r.people
      }
    }
    return acc
  }, [rows])

  const selectCls = 'rounded-[10px] border border-[#dfe3ea] bg-white px-3 py-2 font-body text-sm text-navy outline-none focus:border-gold'

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-card border border-[#e3e7ee] bg-white p-4">
        <label className="block">
          <span className="mb-1.5 block font-heading text-[12px] font-semibold text-navy">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as ReservationStatus | 'todos')} className={selectCls}>
            <option value="todos">Todos</option>
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block font-heading text-[12px] font-semibold text-navy">Data</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={selectCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-heading text-[12px] font-semibold text-navy">Saída</span>
          <select value={departure} onChange={(e) => setDeparture(e.target.value as Departure | 'todas')} className={selectCls}>
            <option value="todas">Todas</option>
            <option value="09h">09h</option>
            <option value="14h">14h</option>
          </select>
        </label>
        {(date || status !== 'todos' || departure !== 'todas') && (
          <button
            onClick={() => {
              setStatus('todos')
              setDate('')
              setDeparture('todas')
            }}
            className="rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 font-heading text-[13px] font-semibold text-muted hover:border-gold"
          >
            Limpar
          </button>
        )}
        <button onClick={load} className="ml-auto rounded-lg bg-navy px-4 py-2 font-heading text-[13px] font-semibold text-white hover:bg-steel">
          Atualizar
        </button>
      </div>

      {/* Occupancy (only meaningful when a date is selected) */}
      {date && (
        <div className="flex flex-wrap gap-3">
          {(['09h', '14h'] as Departure[]).map((d) => {
            const used = occupancy[d] || 0
            const full = totalSeats > 0 && used >= totalSeats
            return (
              <div key={d} className="rounded-card border border-[#e3e7ee] bg-white px-4 py-3">
                <div className="font-heading text-xs font-semibold text-muted">Saída {d}</div>
                <div className="font-heading text-lg font-bold" style={{ color: full ? '#a5342b' : '#1a2b3d' }}>
                  {used}/{totalSeats || '—'} lugares
                </div>
              </div>
            )
          })}
        </div>
      )}

      {error && <p className="font-body text-sm text-red-500">{error}</p>}
      {loading ? (
        <p className="font-body text-sm text-muted">Carregando…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-card border border-dashed border-[#dfe3ea] bg-white p-8 text-center font-body text-sm text-muted">
          Nenhuma reserva encontrada com esses filtros.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
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
                    <a
                      href={`https://wa.me/${r.phone}?text=${encodeURIComponent(`Olá ${r.customer_name}! Sobre sua pré-reserva do passeio ${r.tour_title} na Farol da Foz Ecoturismo...`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-eco underline"
                    >
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
          })}
        </div>
      )}
    </div>
  )
}
