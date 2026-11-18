import { useEffect, useState } from 'react'
import { db } from '../lib/db.js'
import PageHero from '../components/PageHero.jsx'
import { DEAL_STATUS, money, avatarStyle, initials } from '../lib/format.js'

const COL_ICON = { new: '🆕', negotiating: '🤝', won: '🏆', lost: '❌' }

export default function Deals() {
  const [deals, setDeals] = useState([])
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ title: '', amount: '', customer_id: '' })
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
      await db.insert('deals', { title: form.title.trim(), amount: Number(form.amount) || 0, customer_id: form.customer_id, status: 'new' })
      setForm({ title: '', amount: '', customer_id: form.customer_id }); load()
    } catch (e) { setErr(e.message) }
  }
  const setStatus = async (id, status) => { await db.update('deals', id, { status }); load() }
  const del = async (id) => { if (confirm('Xoá giao dịch này?')) { await db.remove('deals', id); load() } }
  const custOf = (id) => customers.find((c) => c.id === id)
  const sum = (list) => list.reduce((s, d) => s + Number(d.amount || 0), 0)
  const openTotal = sum(deals.filter((d) => ['new', 'negotiating'].includes(d.status)))
  const wonTotal = sum(deals.filter((d) => d.status === 'won'))

  return (
    <>
      <PageHero icon="💼" title="Giao dịch" subtitle="Theo dõi tiến độ từng thương vụ từ lúc mới đến khi chốt." color="violet">
        <div className="hero-stat"><small>Đang mở</small><b>{money(openTotal)}</b></div>
        <div className="hero-stat"><small>Đã chốt</small><b>{money(wonTotal)}</b></div>
      </PageHero>
      {err && <p className="error">{err}</p>}
      {!customers.length && <p className="card empty">Hãy thêm khách hàng trước khi tạo giao dịch.</p>}

      <form className="card section" onSubmit={add}>
        <div className="section-head"><h3>➕ Tạo giao dịch mới</h3></div>
        <div className="form">
          <input placeholder="Tên giao dịch *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input type="number" placeholder="Giá trị (đ)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
            <option value="">-- Chọn khách hàng --</option>
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
              <div className="col-total">{money(sum(list))}</div>
              {list.map((d) => {
                const c = custOf(d.customer_id)
                return (
                  <div className={'card deal ' + key} key={d.id}>
                    <b className="deal-title">{d.title}</b>
                    <div className="deal-cust">
                      {c && <span className="avatar sm" style={avatarStyle(c.name)}>{initials(c.name)}</span>}
                      <span>{c?.name || '—'}</span>
                    </div>
                    <div className="amount">{money(d.amount)}</div>
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
