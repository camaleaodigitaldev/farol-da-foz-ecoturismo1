import { useRef, useState } from 'react'
import { uploadImage } from '../../lib/upload'

export function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-heading text-[13px] font-semibold text-navy">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[10px] border border-[#dfe3ea] bg-white px-3.5 py-2.5 font-body text-sm text-navy outline-none focus:border-gold"
      />
    </label>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-heading text-[13px] font-semibold text-navy">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full resize-y rounded-[10px] border border-[#dfe3ea] bg-white px-3.5 py-2.5 font-body text-sm text-navy outline-none focus:border-gold"
      />
    </label>
  )
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const pick = async (file?: File) => {
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (e) {
      setErr((e as Error).message || 'Falha no upload')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <span className="mb-1.5 block font-heading text-[13px] font-semibold text-navy">{label}</span>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[10px] border border-[#dfe3ea] bg-[#f3f5f8]">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : null}
        </div>
        <div className="flex-1">
          <input
            ref={input}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="rounded-lg border border-[#dfe3ea] bg-white px-3.5 py-2 font-heading text-[13px] font-semibold text-navy hover:border-gold disabled:opacity-60"
          >
            {busy ? 'Enviando…' : 'Enviar imagem'}
          </button>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="ou cole uma URL"
            className="mt-2 w-full rounded-[10px] border border-[#dfe3ea] bg-white px-3 py-2 font-body text-[13px] text-muted outline-none focus:border-gold"
          />
          {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
        </div>
      </div>
    </div>
  )
}

// Editor for a simple string[] (add / remove / edit lines).
export function StringList({
  label,
  items,
  onChange,
}: {
  label: string
  items: string[]
  onChange: (v: string[]) => void
}) {
  return (
    <div>
      <span className="mb-1.5 block font-heading text-[13px] font-semibold text-navy">{label}</span>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={it}
              onChange={(e) => {
                const next = items.slice()
                next[i] = e.target.value
                onChange(next)
              }}
              className="w-full rounded-[10px] border border-[#dfe3ea] bg-white px-3 py-2 font-body text-sm text-navy outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="rounded-lg border border-[#f0d3d3] bg-[#fdf1f1] px-3 font-heading text-sm font-semibold text-[#c0392b]"
            >
              −
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="mt-2 rounded-lg border border-[#dfe3ea] bg-white px-3 py-1.5 font-heading text-[13px] font-semibold text-navy hover:border-gold"
      >
        + Adicionar
      </button>
    </div>
  )
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-heading text-[13px] font-semibold text-navy">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-[10px] border border-[#dfe3ea] bg-white px-3.5 py-2.5 font-body text-sm text-navy outline-none focus:border-gold"
      />
    </label>
  )
}

export function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description?: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between gap-4 rounded-card border border-[#e3e7ee] bg-white p-4 text-left"
    >
      <span>
        <span className="block font-heading text-sm font-bold text-navy">{label}</span>
        {description && <span className="mt-0.5 block font-body text-xs text-muted">{description}</span>}
      </span>
      <span
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        style={{ background: value ? '#2f8f6b' : '#cbd3dd' }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
          style={{ left: value ? '22px' : '2px' }}
        />
      </span>
    </button>
  )
}

export function Card({ title, children, onRemove }: { title?: string; children: React.ReactNode; onRemove?: () => void }) {
  return (
    <div className="rounded-card border border-[#e3e7ee] bg-white p-5">
      {(title || onRemove) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="font-heading text-[15px] font-bold text-navy">{title}</h3>}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-lg border border-[#f0d3d3] bg-[#fdf1f1] px-3 py-1.5 font-heading text-[13px] font-semibold text-[#c0392b]"
            >
              Remover
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
