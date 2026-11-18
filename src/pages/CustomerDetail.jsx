import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../lib/db.js'
import { ACTIVITY_TYPE, CUSTOMER_STATUS, DEAL_STATUS, fmtDateTime, money, avatarStyle, initials, taskBucket } from '../lib/format.js'

const ACT_ICON = { call: '📞', message: '💬', meeting: '🤝', note: '📝' }

export default function CustomerDetail() {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [activities, setActivities] = useState([])
  const [deals, setDeals] = useState([])
  const [tasks, setTasks] = useState([])
  const [actForm, setActForm] = useState({ type: 'call', content: '' })
  const [taskForm, setTaskForm] = useState({ title: '', due_at: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const [cs, as, ds, ts] = await Promise.all([
        db.list('customers'),
        db.list('activities'),
        db.list('deals'),
        db.list('tasks'),
      ])
      setCustomer(cs.find((c) => c.id === id) || null)
      setActivities(as.filter((a) => a.customer_id === id))
      setDeals(ds.filter((d) => d.customer_id === id))
      setTasks(ts.filter((t) => t.customer_id === id))
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [id])

  const addActivity = async (e) => {
    e.preventDefault()
    if (!actForm.content.trim()) return
    try {
      await db.insert('activities', { customer_id: id, type: actForm.type, content: actForm.content.trim() })
      setActForm({ ...actForm, content: '' })
      load()
    } catch (e) { setErr(e.message) }
  }
  const delActivity = async (aid) => { await db.remove('activities', aid); load() }

  const addTask = async (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) return
    try {
      const due_at = taskForm.due_at ? new Date(taskForm.due_at).toISOString() : null
      await db.insert('tasks', { customer_id: id, title: taskForm.title.trim(), due_at, done: false })
      setTaskForm({ title: '', due_at: '' })
      load()
    } catch (e) { setErr(e.message) }
  }
  const toggleTask = async (t) => { await db.update('tasks', t.id, { done: !t.done }); load() }

  if (loading) return <p>Đang tải...</p>
  if (!customer) return <><Link to="/customers">← Quay lại danh sách</Link><p className="empty">Không tìm thấy khách hàng.</p></>

  const dealTotal = deals.reduce((s, d) => s + Number(d.amount || 0), 0)

  return (
    <>
      <Link className="back-link" to="/customers">← Quay lại danh sách</Link>

      <div className="profile-hero">
        <span className="avatar xl" style={avatarStyle(customer.name)}>{initials(customer.name)}</span>
        <div className="profile-main">
          <div className="profile-name">
            <h2>{customer.name}</h2>
            <span className={'badge ' + customer.status}>{CUSTOMER_STATUS[customer.status]}</span>
          </div>
          <p>{customer.company || 'Chưa có công ty'}</p>
          <div className="profile-contact">
            <span>📞 {customer.phone || '—'}</span>
            <span>✉️ {customer.email || '—'}</span>
          </div>
        </div>
        <div className="profile-stats">
          <div><small>Giao dịch</small><b>{deals.length}</b></div>
          <div><small>Tổng giá trị</small><b>{money(dealTotal)}</b></div>
          <div><small>Lần chăm sóc</small><b>{activities.length}</b></div>
        </div>
      </div>
      {err && <p className="error">{err}</p>}
      {customer.note && <div className="note-box">📌 <b>Ghi chú:</b> {customer.note}</div>}

      <div className="two">
        <div className="card section">
          <div className="section-head"><h3>🕒 Lịch sử chăm sóc <span className="count-pill">{activities.length}</span></h3></div>
          <form className="form" onSubmit={addActivity} style={{ marginBottom: 16 }}>
            <select value={actForm.type} onChange={(e) => setActForm({ ...actForm, type: e.target.value })}>
              {Object.entries(ACTIVITY_TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input
              placeholder="Nội dung trao đổi..."
              value={actForm.content}
              onChange={(e) => setActForm({ ...actForm, content: e.target.value })}
            />
            <button className="primary">Lưu</button>
          </form>

          <div className="timeline">
            {activities.map((a) => (
              <div className={'timeline-item ' + a.type} key={a.id}>
                <div className="tl-dot">{ACT_ICON[a.type] || '📝'}</div>
                <div className="tl-body">
                  <div className="timeline-head">
                    <b>{ACTIVITY_TYPE[a.type] || a.type}</b>
                    <small>{fmtDateTime(a.created_at)}</small>
                    <button className="danger sm" onClick={() => delActivity(a.id)}>Xoá</button>
                  </div>
                  <p>{a.content}</p>
                </div>
              </div>
            ))}
            {!activities.length && <p className="empty">Chưa có lịch sử chăm sóc</p>}
          </div>
        </div>

        <div>
          <div className="card section">
            <div className="section-head"><h3>📅 Nhắc việc <span className="count-pill">{tasks.length}</span></h3></div>
            <form className="form" onSubmit={addTask} style={{ marginBottom: 12 }}>
              <input
                placeholder="Việc cần làm..."
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              />
              <input
                type="datetime-local"
                value={taskForm.due_at}
                onChange={(e) => setTaskForm({ ...taskForm, due_at: e.target.value })}
              />
              <button className="primary">Thêm</button>
            </form>
            {tasks.map((t) => {
              const b = taskBucket(t)
              return (
                <div className={'task-line ' + b + (t.done ? ' done' : '')} key={t.id}>
                  <label className="check">
                    <input type="checkbox" checked={t.done} onChange={() => toggleTask(t)} />
                    <span>{t.title}</span>
                  </label>
                  <span className={'due-tag ' + b}>🕒 {fmtDateTime(t.due_at)}</span>
                </div>
              )
            })}
            {!tasks.length && <p className="empty">Chưa có nhắc việc</p>}
          </div>

          <div className="card section">
            <div className="section-head"><h3>💼 Giao dịch <span className="count-pill">{deals.length}</span></h3></div>
            {deals.map((d) => (
              <div className="row" key={d.id}>
                <span><b>{d.title}</b><small className="sub">{DEAL_STATUS[d.status]}</small></span>
                <b className="amount">{money(d.amount)}</b>
              </div>
            ))}
            {!deals.length && <p className="empty">Chưa có giao dịch</p>}
          </div>
        </div>
      </div>
    </>
  )
}
