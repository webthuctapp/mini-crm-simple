import { useEffect, useState } from 'react'
import { db } from '../lib/db.js'
import { DEAL_STATUS, money } from '../lib/format.js'

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
  const nameOf = (id) => customers.find((c) => c.id === id)?.name || '—'

  return (
    <>
      <h2>Giao dịch</h2>
      {err && <p className="error">{err}</p>}
      {!customers.length && <p className="card empty">Hãy thêm khách hàng trước khi tạo giao dịch.</p>}
      <form className="card form" onSubmit={add}>
        <input placeholder="Tên giao dịch *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input type="number" placeholder="Giá trị (đ)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
          <option value="">-- Chọn khách hàng --</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ''}</option>)}
        </select>
        <button className="primary">Thêm giao dịch</button>
      </form>
      <div className="board">
        {Object.entries(DEAL_STATUS).map(([key, label]) => {
          const list = deals.filter((d) => d.status === key)
          return (
            <div className={'column ' + key} key={key}>
              <h3>{label} <span>{list.length}</span></h3>
              <small>{money(list.reduce((s, d) => s + Number(d.amount), 0))}</small>
              {list.map((d) => (
                <div className="card deal" key={d.id}>
                  <b>{d.title}</b>
                  <div>{nameOf(d.customer_id)}</div>
                  <div className="amount">{money(d.amount)}</div>
                  <select value={d.status} onChange={(e) => setStatus(d.id, e.target.value)}>
                    {Object.entries(DEAL_STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                  <button className="danger" onClick={() => del(d.id)}>Xoá</button>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </>
  )
}
