import type { CSSProperties, ReactNode } from 'react'
import type { Tour } from '../../lib/content'
import { useBooking } from '../../lib/BookingContext'
import { waLink } from '../../lib/wa'

type Props = {
  tour?: Tour
  className?: string
  style?: CSSProperties
  children: ReactNode
  /** extra side-effect on click, e.g. close the mobile drawer */
  onNavigate?: () => void
}

// A single reservation CTA that adapts to the booking toggle:
//  - enabled  → a <button> that opens the pre-reservation modal
//  - disabled → an <a> that opens WhatsApp (keeping the tour-name variant),
//               i.e. the exact current behaviour.
export default function ReserveButton({ tour, className, style, children, onNavigate }: Props) {
  const { bookingEnabled, phone, openBooking } = useBooking()

  if (bookingEnabled) {
    return (
      <button
        type="button"
        className={className}
        style={style}
        onClick={() => {
          openBooking(tour ?? null)
          onNavigate?.()
        }}
      >
        {children}
      </button>
    )
  }

  return (
    <a
      href={waLink(phone, tour?.title)}
      target="_blank"
      rel="noreferrer"
      className={className}
      style={style}
      onClick={onNavigate}
    >
      {children}
    </a>
  )
}
