import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { defaultContent, type SiteContent } from './content'

// Deep-merges the stored document over the defaults so newly-added fields keep
// working even if the saved document predates them.
function merge<T>(base: T, over: unknown): T {
  if (Array.isArray(base)) return (over ?? base) as T
  if (base && typeof base === 'object') {
    if (!over || typeof over !== 'object') return base
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const k of Object.keys(base as Record<string, unknown>)) {
      out[k] = merge((base as Record<string, unknown>)[k], (over as Record<string, unknown>)[k])
    }
    return out as T
  }
  return (over ?? base) as T
}

const TIMEOUT_MS = 6000

export async function fetchContent(): Promise<SiteContent> {
  try {
    const query = supabase.from('site_content').select('data').eq('id', 1).maybeSingle()
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
    )
    const { data, error } = (await Promise.race([query, timeout])) as Awaited<typeof query>
    if (error) throw error
    if (data?.data) return merge(defaultContent, data.data)
  } catch (e) {
    console.warn('Falling back to default content:', e)
  }
  return defaultContent
}

// Renders the bundled defaults immediately so the site never blocks on the
// network, then swaps in the published content once it arrives.
export function useContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent)
  useEffect(() => {
    let alive = true
    fetchContent().then((c) => {
      if (alive) setContent(c)
    })
    return () => {
      alive = false
    }
  }, [])
  return content
}

export async function saveContent(data: SiteContent): Promise<void> {
  const { error } = await supabase
    .from('site_content')
    .upsert({ id: 1, data }, { onConflict: 'id' })
  if (error) throw error
}
