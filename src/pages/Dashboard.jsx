import { useEffect, useState } from 'react'
import { db } from '../lib/db.js'
import { DEAL_STATUS, CUSTOMER_STATUS, money, fmtDate } from '../lib/format.js'

export default function Dashboard() {
  const [customers, setCustomers] = useState([])
  const [deals, setDeals] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    Promise.all([db.list('customers'), db.list('deals')])
      .then(([c, d]) => { setCustomers(c); setDeals(d) })
      .catch((e) => setErr(e.message))
  }, [])

  const sum = (list) => list.reduce((s, d) => s + Number(d.amount || 0), 0)
  const won = deals.filter((d) => d.status === 'won')
  const open = deals.filter((d) => ['new', 'negotiating'].includes(d.status))
  const closed = deals.filter((d) => ['won', 'lost'].includes(d.status))
  const rate = closed.length ? Math.round((won.length / closed.length) * 100) : 0
  const maxD = Math.max(1, ...Object.keys(DEAL_STATUS).map((k) => deals.filter((d) => d.status === k).length))
  const maxC = Math.max(1, ...Object.keys(CUSTOMER_STATUS).map((k) => customers.filter((c) => c.status === k).length))

  return (
    <>
      <h2>Tổng quan</h2>
      {err && <p className="error">{err}</p>}
      <div className="stats">
        <div className="card stat"><span>Khách hàng</span><b>{customers.length}</b></div>
        <div className="card stat"><span>Giao dịch</span><b>{deals.length}</b></div>
        <div className="card stat"><span>Doanh thu (thành công)</span><b>{money(sum(won))}</b></div>
        <div className="card stat"><span>Đang chờ chốt</span><b>{money(sum(open))}</b></div>
        <div className="card stat"><span>Tỉ lệ chốt</span><b>{rate}%</b></div>
      </div>
      <div className="two">
        <div className="card">
          <h3>Giao dịch theo trạng thái</h3>
          {Object.entries(DEAL_STATUS).map(([k, label]) => {
            const n = deals.filter((d) => d.status === k).length
            return <div className="bar-row" key={k}><span>{label}</span><div className="bar"><div style={{ width: (n / maxD) * 100 + '%' }} /></div><b>{n}</b></div>
          })}
        </div>
        <div className="card">
          <h3>Khách hàng theo trạng thái</h3>
          {Object.entries(CUSTOMER_STATUS).map(([k, label]) => {
            const n = customers.filter((c) => c.status === k).length
            return <div className="bar-row" key={k}><span>{label}</span><div className="bar"><div style={{ width: (n / maxC) * 100 + '%' }} /></div><b>{n}</b></div>
          })}
        </div>
      </div>
      <div className="two">
        <div className="card">
          <h3>Khách hàng mới nhất</h3>
          {customers.slice(0, 5).map((c) => <div className="row" key={c.id}><span>{c.name}{c.company ? ` — ${c.company}` : ''}</span><small>{fmtDate(c.created_at)}</small></div>)}
          {!customers.length && <p className="empty">Chưa có dữ liệu</p>}
        </div>
        <div className="card">
          <h3>Giao dịch lớn đang mở</h3>
          {[...open].sort((a, b) => b.amount - a.amount).slice(0, 5).map((d) => <div className="row" key={d.id}><span>{d.title}</span><b>{money(d.amount)}</b></div>)}
          {!open.length && <p className="empty">Chưa có dữ liệu</p>}
        </div>
      </div>
    </>
  )
}
