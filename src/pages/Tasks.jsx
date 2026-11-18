import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../lib/db.js'
import PageHero from '../components/PageHero.jsx'
import { fmtDateTime, taskBucket, avatarStyle, initials } from '../lib/format.js'

const GROUPS = [
  { key: 'overdue', label: '🔴 Quá hạn', hint: 'Cần xử lý ngay' },
  { key: 'today', label: '🟡 Hôm nay', hint: 'Hoàn thành trong ngày' },
  { key: 'upcoming', label: '🔵 Sắp tới', hint: 'Việc những ngày tới' },
  { key: 'done', label: '✅ Đã xong', hint: 'Đã hoàn thành' },
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
  const countOf = (k) => tasks.filter((t) => taskBucket(t) === k).length

  return (
    <>
      <PageHero icon="📅" title="Nhắc việc & Lịch hẹn" subtitle="Không bỏ sót khách nào — việc quá hạn và hôm nay luôn được đưa lên đầu." color="rose">
        <div className="hero-stat red"><small>Quá hạn</small><b>{countOf('overdue')}</b></div>
        <div className="hero-stat amber"><small>Hôm nay</small><b>{countOf('today')}</b></div>
        <div className="hero-stat"><small>Sắp tới</small><b>{countOf('upcoming')}</b></div>
      </PageHero>
      {err && <p className="error">{err}</p>}

      <form className="card section" onSubmit={add}>
        <div className="section-head">
          <h3>➕ Thêm nhắc việc</h3>
          <label className="check">
            <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} />
            <span>Ẩn việc đã xong</span>
          </label>
        </div>
        <div className="form">
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
        </div>
      </form>

      {GROUPS.filter((g) => !(hideDone && g.key === 'done')).map((g) => {
        const list = tasks
          .filter((t) => taskBucket(t) === g.key)
          .sort((a, b) => (a.due_at || '9999').localeCompare(b.due_at || '9999'))
        return (
          <div className={'card task-group ' + g.key} key={g.key}>
            <div className="group-head">
              <h3>{g.label} <span className="count-pill">{list.length}</span></h3>
              <small>{g.hint}</small>
            </div>
            {list.map((t) => {
              const c = custOf(t.customer_id)
              return (
                <div className={'task-line ' + g.key + (t.done ? ' done' : '')} key={t.id}>
                  <label className="check">
                    <input type="checkbox" checked={t.done} onChange={() => toggle(t)} />
                    <b>{t.title}</b>
                  </label>
                  <div className="task-meta">
                    {c && (
                      <Link className="cust-cell" to={`/customers/${c.id}`}>
                        <span className="avatar sm" style={avatarStyle(c.name)}>{initials(c.name)}</span>
                        <span>{c.name}</span>
                      </Link>
                    )}
                    <span className={'due-tag ' + g.key}>🕒 {fmtDateTime(t.due_at)}</span>
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
