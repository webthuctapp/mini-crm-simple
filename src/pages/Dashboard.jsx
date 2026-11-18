import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../lib/db.js'
import PageHero from '../components/PageHero.jsx'
import { DEAL_STATUS, CUSTOMER_STATUS, money, fmtDate, fmtDateTime, taskBucket, avatarStyle, initials } from '../lib/format.js'

const DEAL_COLORS = { new: '#3b82f6', negotiating: '#f59e0b', won: '#16a34a', lost: '#ef4444' }
const CUST_COLORS = { lead: '#f59e0b', active: '#16a34a', inactive: '#94a3b8' }

export default function Dashboard() {
  const [customers, setCustomers] = useState([])
  const [deals, setDeals] = useState([])
  const [tasks, setTasks] = useState([])
  const [err, setErr] = useState('')

  const load = () => {
    Promise.all([db.list('customers'), db.list('deals'), db.list('tasks')])
      .then(([c, d, t]) => { setCustomers(c); setDeals(d); setTasks(t) })
      .catch((e) => setErr(e.message))
  }
  useEffect(() => { load() }, [])

  const toggleTask = async (t) => { await db.update('tasks', t.id, { done: !t.done }); load() }
  const custName = (id) => customers.find((c) => c.id === id)?.name

  const sum = (list) => list.reduce((s, d) => s + Number(d.amount || 0), 0)
  const won = deals.filter((d) => d.status === 'won')
  const open = deals.filter((d) => ['new', 'negotiating'].includes(d.status))
  const closed = deals.filter((d) => ['won', 'lost'].includes(d.status))
  const rate = closed.length ? Math.round((won.length / closed.length) * 100) : 0
  const maxD = Math.max(1, ...Object.keys(DEAL_STATUS).map((k) => deals.filter((d) => d.status === k).length))
  const maxC = Math.max(1, ...Object.keys(CUSTOMER_STATUS).map((k) => customers.filter((c) => c.status === k).length))
  const urgent = tasks.filter((t) => ['overdue', 'today'].includes(taskBucket(t)))
    .sort((a, b) => (a.due_at || '').localeCompare(b.due_at || ''))
  const overdueCount = tasks.filter((t) => taskBucket(t) === 'overdue').length

  return (
    <>
      <PageHero
        icon="📊"
        title="Xin chào, chúc bạn một ngày hiệu quả 👋"
        subtitle={`Bạn có ${urgent.length} việc cần chú ý${overdueCount ? ` (${overdueCount} đã quá hạn)` : ''} và ${open.length} giao dịch đang mở.`}
      >
        <Link className="hero-btn" to="/tasks">Xem nhắc việc →</Link>
      </PageHero>
      {err && <p className="error">{err}</p>}

      <div className="stats">
        <div className="stat-card grad-blue">
          <div className="stat-ico">👥</div>
          <span>Khách hàng</span>
          <b>{customers.length}</b>
        </div>
        <div className="stat-card grad-purple">
          <div className="stat-ico">💼</div>
          <span>Giao dịch</span>
          <b>{deals.length}</b>
        </div>
        <div className="stat-card grad-green">
          <div className="stat-ico">💰</div>
          <span>Doanh thu (thành công)</span>
          <b>{money(sum(won))}</b>
        </div>
        <div className="stat-card grad-amber">
          <div className="stat-ico">⏳</div>
          <span>Đang chờ chốt</span>
          <b>{money(sum(open))}</b>
        </div>
        <div className="stat-card grad-cyan">
          <div className="stat-ico">🎯</div>
          <span>Tỉ lệ chốt</span>
          <b>{rate}%</b>
        </div>
      </div>

      <div className="card section">
        <div className="section-head">
          <h3>📅 Nhắc việc cần chú ý <span className="count-pill">{urgent.length}</span></h3>
          <Link to="/tasks">Xem tất cả →</Link>
        </div>
        {urgent.slice(0, 5).map((t) => {
          const b = taskBucket(t)
          return (
            <div className={'task-line ' + b} key={t.id}>
              <label className="check">
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t)} />
                <span>{t.title}</span>
              </label>
              <div className="task-meta">
                {custName(t.customer_id) && <Link to={`/customers/${t.customer_id}`}>{custName(t.customer_id)}</Link>}
                <span className={'due-tag ' + b}>{b === 'overdue' ? '🔴 Quá hạn' : '🟡 Hôm nay'} · {fmtDateTime(t.due_at)}</span>
              </div>
            </div>
          )
        })}
        {!urgent.length && <p className="empty">Không có việc quá hạn hay hôm nay 🎉</p>}
      </div>

      <div className="two">
        <div className="card section">
          <div className="section-head"><h3>💼 Giao dịch theo trạng thái</h3></div>
          {Object.entries(DEAL_STATUS).map(([k, label]) => {
            const n = deals.filter((d) => d.status === k).length
            return (
              <div className="bar-row" key={k}>
                <span><i className="dot" style={{ background: DEAL_COLORS[k] }} />{label}</span>
                <div className="bar"><div style={{ width: (n / maxD) * 100 + '%', background: DEAL_COLORS[k] }} /></div>
                <b>{n}</b>
              </div>
            )
          })}
        </div>
        <div className="card section">
          <div className="section-head"><h3>👥 Khách hàng theo trạng thái</h3></div>
          {Object.entries(CUSTOMER_STATUS).map(([k, label]) => {
            const n = customers.filter((c) => c.status === k).length
            return (
              <div className="bar-row" key={k}>
                <span><i className="dot" style={{ background: CUST_COLORS[k] }} />{label}</span>
                <div className="bar"><div style={{ width: (n / maxC) * 100 + '%', background: CUST_COLORS[k] }} /></div>
                <b>{n}</b>
              </div>
            )
          })}
        </div>
      </div>

      <div className="two">
        <div className="card section">
          <div className="section-head"><h3>🆕 Khách hàng mới nhất</h3><Link to="/customers">Xem tất cả →</Link></div>
          {customers.slice(0, 5).map((c) => (
            <div className="row" key={c.id}>
              <Link className="cust-cell" to={`/customers/${c.id}`}>
                <span className="avatar" style={avatarStyle(c.name)}>{initials(c.name)}</span>
                <span><b>{c.name}</b><small className="sub">{c.company}</small></span>
              </Link>
              <small>{fmtDate(c.created_at)}</small>
            </div>
          ))}
          {!customers.length && <p className="empty">Chưa có dữ liệu</p>}
        </div>
        <div className="card section">
          <div className="section-head"><h3>🔥 Giao dịch lớn đang mở</h3><Link to="/deals">Xem tất cả →</Link></div>
          {[...open].sort((a, b) => b.amount - a.amount).slice(0, 5).map((d) => (
            <div className="row" key={d.id}>
              <span><b>{d.title}</b><small className="sub">{custName(d.customer_id)}</small></span>
              <b className="amount">{money(d.amount)}</b>
            </div>
          ))}
          {!open.length && <p className="empty">Chưa có dữ liệu</p>}
        </div>
      </div>
    </>
  )
}
