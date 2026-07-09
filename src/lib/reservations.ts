import { supabase } from './supabase'

// ---------------------------------------------------------------------------
// Reservations live in their own relational table (NOT the site_content JSONB
// doc). They are read/written directly here and must never go through the
// content draft / "Publicar" flow.
// ---------------------------------------------------------------------------

export type ReservationStatus = 'pendente' | 'confirmada' | 'cancelada' | 'concluida'
export type Departure = '09h' | '14h'

export interface Reservation {
  id: string
  created_at: string
  updated_at: string
  customer_name: string
  phone: string
  email: string | null
  tour_id: string
  tour_title: string
  date: string // "YYYY-MM-DD"
  departure: Departure
  people: number
  notes: string | null
  admin_notes: string | null
  status: ReservationStatus
}

// Fields the public form supplies. `status` is intentionally omitted — the DB
// default forces 'pendente' and anon RLS only allows pending inserts.
export interface NewReservation {
  customer_name: string
  phone: string
  email: string | null
  tour_id: string
  tour_title: string
  date: string
  departure: Departure
  people: number
  notes: string | null
}

// Public insert. Does NOT chain .select() — the anon role has no SELECT grant,
// so requesting the row back would fail with a permission error.
export async function createReservation(data: NewReservation): Promise<void> {
  const { error } = await supabase.from('reservations').insert(data)
  if (error) throw error
}

export interface ReservationFilters {
  status?: ReservationStatus | 'todos'
  date?: string
  departure?: Departure | 'todas'
}

// Admin-only list (requires an authenticated session).
export async function listReservations(f: ReservationFilters = {}): Promise<Reservation[]> {
  let q = supabase
    .from('reservations')
    .select('*')
    .order('date', { ascending: true })
    .order('departure', { ascending: true })
    .order('created_at', { ascending: false })

  if (f.status && f.status !== 'todos') q = q.eq('status', f.status)
  if (f.departure && f.departure !== 'todas') q = q.eq('departure', f.departure)
  if (f.date) q = q.eq('date', f.date)

  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as Reservation[]
}

export async function updateReservation(
  id: string,
  patch: Partial<Pick<Reservation, 'status' | 'admin_notes'>>
): Promise<void> {
  const { error } = await supabase.from('reservations').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteReservation(id: string): Promise<void> {
  const { error } = await supabase.from('reservations').delete().eq('id', id)
  if (error) throw error
}
