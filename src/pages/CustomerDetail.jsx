import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../lib/db.js'
import { ACTIVITY_TYPE, CUSTOMER_STATUS, DEAL_STATUS, fmtDateTime, money } from '../lib/format.js'

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

  const delActivity = async (aid) => {
    await db.remove('activities', aid)
    load()
  }

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

  const toggleTask = async (t) => {
    await db.update('tasks', t.id, { done: !t.done })
    load()
  }

  if (loading) return <p>Đang tải...</p>
  if (!customer) return <><Link to="/customers">← Quay lại danh sách</Link><p className="empty">Không tìm thấy khách hàng.</p></>

  return (
    <>
      <div className="row-head">
        <Link className="btn-link" to="/customers">← Quay lại danh sách</Link>
        <h2>{customer.name}</h2>
        <span className={'badge ' + customer.status}>{CUSTOMER_STATUS[customer.status]}</span>
      </div>
      {err && <p className="error">{err}</p>}

      <div className="card info-grid">
        <div><small>Công ty</small><b>{customer.company || '—'}</b></div>
        <div><small>Số điện thoại</small><b>{customer.phone || '—'}</b></div>
        <div><small>Email</small><b>{customer.email || '—'}</b></div>
        <div><small>Ghi chú</small><b>{customer.note || '—'}</b></div>
      </div>

      <div className="two">
        <div className="card">
          <h3>Lịch sử chăm sóc</h3>
          <form className="form" onSubmit={addActivity} style={{ marginBottom: 14 }}>
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
              <div className="timeline-item" key={a.id}>
                <div className="timeline-head">
                  <span>{ACTIVITY_TYPE[a.type] || a.type}</span>
                  <small>{fmtDateTime(a.created_at)}</small>
                  <button className="danger sm" onClick={() => delActivity(a.id)}>Xoá</button>
                </div>
                <p>{a.content}</p>
              </div>
            ))}
            {!activities.length && <p className="empty">Chưa có lịch sử chăm sóc</p>}
          </div>
        </div>

        <div>
          <div className="card">
            <h3>Nhắc việc của khách này</h3>
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
            {tasks.map((t) => (
              <div className={'row task-row' + (t.done ? ' done' : '')} key={t.id}>
                <label className="check">
                  <input type="checkbox" checked={t.done} onChange={() => toggleTask(t)} />
                  <span>{t.title}</span>
                </label>
                <small>{fmtDateTime(t.due_at)}</small>
              </div>
            ))}
            {!tasks.length && <p className="empty">Chưa có nhắc việc</p>}
          </div>

          <div className="card">
            <h3>Giao dịch ({deals.length})</h3>
            {deals.map((d) => (
              <div className="row" key={d.id}>
                <span>{d.title} <small>({DEAL_STATUS[d.status]})</small></span>
                <b>{money(d.amount)}</b>
              </div>
            ))}
            {!deals.length && <p className="empty">Chưa có giao dịch</p>}
          </div>
        </div>
      </div>
    </>
  )
}
