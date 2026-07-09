// Builds a WhatsApp deep link with a pre-filled message. The phone number comes
// from a single source (settings) so the owner can change it in one place.
export function waLink(phone: string, tourName?: string): string {
  const msg = tourName
    ? `Olá! Tenho interesse no passeio ${tourName} da Farol da Foz Ecoturismo e gostaria de mais informações.`
    : 'Olá! Tenho interesse em um dos passeios da Farol da Foz Ecoturismo e gostaria de mais informações.'
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}

export interface BookingSummary {
  name: string
  tourTitle: string
  date: string // "YYYY-MM-DD"
  departure: string // "09h" | "14h"
  people: number
}

// Formats "YYYY-MM-DD" as "DD/MM/YYYY" without going through Date() (which would
// parse as UTC midnight and can shift the day in BRT).
export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-')
  return d && m && y ? `${d}/${m}/${y}` : iso
}

// WhatsApp link with a multi-line pre-reservation summary, sent to the business.
export function waBookingLink(phone: string, b: BookingSummary): string {
  const msg = [
    'Olá! Acabei de fazer uma *pré-reserva* pelo site da Farol da Foz Ecoturismo:',
    '',
    `• Passeio: ${b.tourTitle}`,
    `• Data: ${formatDateBR(b.date)}`,
    `• Saída: ${b.departure}`,
    `• Pessoas: ${b.people}`,
    `• Nome: ${b.name}`,
    '',
    'Gostaria de confirmar a disponibilidade e o pagamento. Obrigado!',
  ].join('\n')
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}
