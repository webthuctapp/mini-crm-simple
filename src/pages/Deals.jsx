import { useEffect, useState } from 'react'
import { db } from '../lib/db.js'
import PageHero from '../components/PageHero.jsx'
import {
  DEAL_STATUS, DEAL_HINT, PAY_STATUS, money, avatarStyle, initials, paidOf, debtOf, payStatus,
} from '../lib/format.js'

const COL_ICON = { new: '🆕', negotiating: '🤝', won: '🏆', lost: '❌' }

export default function Deals() {
  const [deals, setDeals] = useState([])
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ title: '', amount: '', customer_id: '' })
  const [payInput, setPayInput] = useState({})
  const [err, setErr] = useState('')

  const load = async () => {
    try { setDeals(await db.list('deals')); setCustomers(await db.list('customers')) }
    catch (e) { setErr(e.message) }
  }
  useEffect(() => { load() }, [])

  const add = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.customer_id) return
    try {
      await db.insert('deals', { title: form.title.trim(), amount: Number(form.amount) || 0, paid_amount: 0, customer_id: form.customer_id, status: 'new' })
      setForm({ title: '', amount: '', customer_id: form.customer_id }); load()
    } catch (e) { setErr(e.message) }
  }
  const setStatus = async (id, status) => { await db.update('deals', id, { status }); load() }
  const del = async (id) => { if (confirm('Xoá giao dịch này?')) { await db.remove('deals', id); load() } }

  const addPayment = async (d) => {
    const v = Number(payInput[d.id])
    if (!v || v <= 0) return
    const next = Math.min(paidOf(d) + v, Number(d.amount || 0))
    try {
      await db.update('deals', d.id, { paid_amount: next })
      setPayInput({ ...payInput, [d.id]: '' }); load()
    } catch (e) { setErr(e.message) }
  }
  const payAll = async (d) => {
    try { await db.update('deals', d.id, { paid_amount: Number(d.amount || 0) }); load() }
    catch (e) { setErr(e.message) }
  }

  const custOf = (id) => customers.find((c) => c.id === id)
  const sum = (list, fn = (d) => Number(d.amount || 0)) => list.reduce((s, d) => s + fn(d), 0)
  const won = deals.filter((d) => d.status === 'won')
  const openTotal = sum(deals.filter((d) => ['new', 'negotiating'].includes(d.status)))

  return (
    <>
      <PageHero icon="💼" title="Giao dịch (Cơ hội bán hàng)" subtitle="Mỗi giao dịch là một cơ hội bán hàng cho một khách — theo dõi từ lúc có nhu cầu đến khi chốt và thu tiền." color="violet">
        <div className="hero-stat"><small>Đang chờ chốt</small><b>{money(openTotal)}</b></div>
        <div className="hero-stat"><small>Doanh thu</small><b>{money(sum(won))}</b></div>
        <div className="hero-stat"><small>Đã thu</small><b>{money(sum(won, paidOf))}</b></div>
        <div className="hero-stat red"><small>Công nợ</small><b>{money(sum(won, debtOf))}</b></div>
      </PageHero>
      {err && <p className="error">{err}</p>}
      {!customers.length && <p className="card empty">Hãy thêm khách hàng trước khi tạo giao dịch.</p>}

      <form className="card section" onSubmit={add}>
        <div className="section-head"><h3>➕ Tạo cơ hội / giao dịch mới</h3></div>
        <div className="form">
          <input placeholder="Tên giao dịch *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input type="number" placeholder="Giá trị dự kiến (đ)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
            <option value="">-- Chọn khách hàng (người mua) --</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ''}</option>)}
          </select>
          <button className="primary">Thêm giao dịch</button>
        </div>
      </form>

      <div className="board">
        {Object.entries(DEAL_STATUS).map(([key, label]) => {
          const list = deals.filter((d) => d.status === key)
          return (
            <div className={'column ' + key} key={key}>
              <div className="col-head">
                <h3>{COL_ICON[key]} {label}</h3>
                <span className="count-pill">{list.length}</span>
              </div>
              <div className="col-hint">{DEAL_HINT[key]}</div>
              <div className="col-total">{money(sum(list))}</div>
              {list.map((d) => {
                const c = custOf(d.customer_id)
                const ps = payStatus(d)
                const pct = Number(d.amount) ? Math.round((paidOf(d) / Number(d.amount)) * 100) : 0
                return (
                  <div className={'card deal ' + key} key={d.id}>
                    <b className="deal-title">{d.title}</b>
                    <div className="deal-cust">
                      {c && <span className="avatar sm" style={avatarStyle(c.name)}>{initials(c.name)}</span>}
                      <span>{c?.name || '—'}</span>
                    </div>
                    <div className="amount">{money(d.amount)}</div>

                    {key === 'won' && (
                      <div className="pay-box">
                        <div className="pay-top">
                          <span className={'pay-badge ' + ps}>{PAY_STATUS[ps]}</span>
                          <small>{pct}%</small>
                        </div>
                        <div className="pay-bar"><div className={ps} style={{ width: pct + '%' }} /></div>
                        <div className="pay-nums">
                          <span>Đã thu <b>{money(paidOf(d))}</b></span>
                          <span className={debtOf(d) ? 'debt' : ''}>Còn nợ <b>{money(debtOf(d))}</b></span>
                        </div>
                        {debtOf(d) > 0 && (
                          <div className="pay-form">
                            <input type="number" placeholder="Số tiền khách trả" value={payInput[d.id] || ''} onChange={(e) => setPayInput({ ...payInput, [d.id]: e.target.value })} />
                            <button className="sm" onClick={() => addPayment(d)}>Thu</button>
                            <button className="sm" onClick={() => payAll(d)}>Thu đủ</button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="deal-actions">
                      <select value={d.status} onChange={(e) => setStatus(d.id, e.target.value)}>
                        {Object.entries(DEAL_STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                      </select>
                      <button className="danger sm" onClick={() => del(d.id)}>Xoá</button>
                    </div>
                  </div>
                )
              })}
              {!list.length && <p className="empty">Trống</p>}
            </div>
          )
        })}
      </div>
    </>
  )
}
