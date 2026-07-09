import { createContext, useContext, useState, type ReactNode } from 'react'
import type { SiteContent, Tour } from './content'

interface BookingCtx {
  bookingEnabled: boolean
  phone: string
  open: boolean
  preselectedTour: Tour | null
  content: SiteContent
  openBooking: (tour?: Tour | null) => void
  closeBooking: () => void
}

const Ctx = createContext<BookingCtx | null>(null)

export function BookingProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [preselectedTour, setPreselected] = useState<Tour | null>(null)

  const openBooking = (tour?: Tour | null) => {
    setPreselected(tour ?? null)
    setOpen(true)
  }
  const closeBooking = () => setOpen(false)

  return (
    <Ctx.Provider
      value={{
        bookingEnabled: content.settings.bookingEnabled,
        phone: content.settings.whatsapp,
        open,
        preselectedTour,
        content,
        openBooking,
        closeBooking,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useBooking(): BookingCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider')
  return ctx
}
