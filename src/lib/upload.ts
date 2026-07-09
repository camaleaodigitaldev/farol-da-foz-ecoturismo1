import { supabase, MEDIA_BUCKET } from './supabase'

// Uploads a file to the public media bucket and returns its public URL.
export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safe = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase()
    .slice(0, 40)
  // Timestamp keeps names unique without needing Math.random.
  const path = `uploads/${Date.now()}-${safe || 'img'}.${ext}`

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
