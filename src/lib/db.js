import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const useSupabase = Boolean(url && key)
export const supabase = useSupabase ? createClient(url, key) : null

// ---- Fallback localStorage khi chưa cấu hình Supabase (chế độ demo) ----
const read = (t) => JSON.parse(localStorage.getItem('cf_' + t) || '[]')
const write = (t, rows) => localStorage.setItem('cf_' + t, JSON.stringify(rows))

const local = {
  async list(t) { return read(t).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')) },
  async insert(t, row) {
    const rows = Array.isArray(row) ? row : [row]
    const made = rows.map((r) => ({ ...r, id: crypto.randomUUID(), created_at: new Date().toISOString() }))
    write(t, [...read(t), ...made]); return made
  },
  async update(t, id, patch) { write(t, read(t).map((r) => (r.id === id ? { ...r, ...patch } : r))) },
  async remove(t, id) {
    write(t, read(t).filter((r) => r.id !== id))
    if (t === 'customers') write('orders', read('orders').map((o) => (o.customer_id === id ? { ...o, customer_id: null } : o)))
  },
}

const remote = {
  async list(t) {
    const { data, error } = await supabase.from(t).select('*').order('created_at', { ascending: false })
    if (error) throw error; return data
  },
  async insert(t, row) {
    const { data, error } = await supabase.from(t).insert(row).select()
    if (error) throw error; return data
  },
  async update(t, id, patch) {
    const { error } = await supabase.from(t).update(patch).eq('id', id)
    if (error) throw error
  },
  async remove(t, id) {
    const { error } = await supabase.from(t).delete().eq('id', id)
    if (error) throw error
  },
}

export const db = useSupabase ? remote : local
