// Inline SVG icons (stroke-based, no external icon library) to match the design.
type P = { className?: string; size?: number; stroke?: number }

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
})

export const WhatsApp = ({ className, size = 20 }: P) => (
  <svg {...base(size)} fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
  </svg>
)

export const Clock = ({ className, size = 15, stroke = 2.2 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

export const Users = ({ className, size = 15, stroke = 2.2 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
  </svg>
)

export const Pin = ({ className, size = 14, stroke = 2 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const Check = ({ className, size = 17, stroke = 2.6 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export const ArrowRight = ({ className, size = 16, stroke = 2.4 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ChevronDown = ({ className, size = 22, stroke = 2.4 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export const ChevronLeft = ({ className, size = 24, stroke = 2.4 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

export const ChevronRight = ({ className, size = 24, stroke = 2.4 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 18l6-6-6-6" />
  </svg>
)

export const Close = ({ className, size = 24, stroke = 2.4 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

export const Menu = ({ className, size = 24, stroke = 2.3 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const Shield = ({ className, size = 20, stroke = 2 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

export const Building = ({ className, size = 20, stroke = 2 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
  </svg>
)

export const Star = ({ className, size = 18 }: P) => (
  <svg {...base(size)} fill="currentColor" className={className}>
    <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
  </svg>
)

export const Mail = ({ className, size = 18, stroke = 2 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
)

export const Instagram = ({ className, size = 20, stroke = 2 }: P) => (
  <svg {...base(size)} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const Facebook = ({ className, size = 20 }: P) => (
  <svg {...base(size)} fill="currentColor" className={className}>
    <path d="M22 12a10 10 0 10-11.5 9.88v-6.99H7.9V12h2.6V9.8c0-2.57 1.53-3.99 3.87-3.99 1.12 0 2.29.2 2.29.2v2.52h-1.29c-1.27 0-1.67.79-1.67 1.6V12h2.84l-.45 2.89h-2.39v6.99A10 10 0 0022 12z" />
  </svg>
)

const Icons = {
  WhatsApp, Clock, Users, Pin, Check, ArrowRight, ChevronDown, ChevronLeft,
  ChevronRight, Close, Menu, Shield, Building, Star, Mail, Instagram, Facebook,
}
export default Icons
