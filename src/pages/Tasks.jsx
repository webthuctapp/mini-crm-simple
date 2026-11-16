import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../lib/db.js'
import { fmtDateTime, taskBucket } from '../lib/format.js'

const GROUPS = [
  { key: 'overdue', label: '🔴 Quá hạn' },
  { key: 'today', label: '🟡 Hôm nay' },
  { key: 'upcoming', label: '🔵 Sắp tới' },
  { key: 'done', label: '✅ Đã xong' },
]

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ title: '', customer_id: '', due_at: '' })
  const [hideDone, setHideDone] = useState(false)
  const [err, setErr] = useState('')

  const load = async () => {
    try {
      const [ts, cs] = await Promise.all([db.list('tasks'), db.list('customers')])
      setTasks(ts)
      setCustomers(cs)
    } catch (e) { setErr(e.message) }
  }
  useEffect(() => { load() }, [])

  const add = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    try {
      const due_at = form.due_at ? new Date(form.due_at).toISOString() : null
      await db.insert('tasks', {
        title: form.title.trim(),
        customer_id: form.customer_id || null,
        due_at,
        done: false,
      })
      setForm({ title: '', customer_id: form.customer_id, due_at: '' })
      load()
    } catch (e) { setErr(e.message) }
  }

  const toggle = async (t) => { await db.update('tasks', t.id, { done: !t.done }); load() }
  const del = async (id) => { if (confirm('Xoá nhắc việc này?')) { await db.remove('tasks', id); load() } }
  const custOf = (id) => customers.find((c) => c.id === id)

  return (
    <>
      <div className="row-head">
        <h2>Nhắc việc & Lịch hẹn</h2>
        <label className="check" style={{ marginLeft: 'auto' }}>
          <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} />
          <span>Ẩn việc đã xong</span>
        </label>
      </div>
      {err && <p className="error">{err}</p>}

      <form className="card form" onSubmit={add}>
        <input
          placeholder="Việc cần làm * (VD: Gọi lại anh Nam)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
          <option value="">-- Không gắn khách --</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          type="datetime-local"
          value={form.due_at}
          onChange={(e) => setForm({ ...form, due_at: e.target.value })}
        />
        <button className="primary">Thêm nhắc việc</button>
      </form>

      {GROUPS.filter((g) => !(hideDone && g.key === 'done')).map((g) => {
        const list = tasks
          .filter((t) => taskBucket(t) === g.key)
          .sort((a, b) => (a.due_at || '9999').localeCompare(b.due_at || '9999'))
        return (
          <div className={'card task-group ' + g.key} key={g.key}>
            <h3>{g.label} <span>({list.length})</span></h3>
            {list.map((t) => {
              const c = custOf(t.customer_id)
              return (
                <div className={'row task-row' + (t.done ? ' done' : '')} key={t.id}>
                  <label className="check">
                    <input type="checkbox" checked={t.done} onChange={() => toggle(t)} />
                    <b>{t.title}</b>
                  </label>
                  <div className="task-meta">
                    {c && <Link to={`/customers/${c.id}`}>{c.name}</Link>}
                    <small>{fmtDateTime(t.due_at)}</small>
                    <button className="danger sm" onClick={() => del(t.id)}>Xoá</button>
                  </div>
                </div>
              )
            })}
            {!list.length && <p className="empty">Không có việc nào</p>}
          </div>
        )
      })}
    </>
  )
}
