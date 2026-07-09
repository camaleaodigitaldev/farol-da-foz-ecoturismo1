// Builds a WhatsApp deep link with a pre-filled message. The phone number comes
// from a single source (settings) so the owner can change it in one place.
export function waLink(phone: string, tourName?: string): string {
  const msg = tourName
    ? `Olá! Tenho interesse no passeio ${tourName} da Farol da Foz Ecoturismo e gostaria de mais informações.`
    : 'Olá! Tenho interesse em um dos passeios da Farol da Foz Ecoturismo e gostaria de mais informações.'
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}
