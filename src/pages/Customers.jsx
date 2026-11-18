import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../lib/db.js'
import PageHero from '../components/PageHero.jsx'
import { CUSTOMER_STATUS, avatarStyle, initials } from '../lib/format.js'

const empty = { name: '', company: '', phone: '', email: '', status: 'lead', note: '' }

export default function Customers() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('')
  const [err, setErr] = useState('')

  const load = () => db.list('customers').then(setRows).catch((e) => setErr(e.message))
  useEffect(() => { load() }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    try {
      if (editId) await db.update('customers', editId, form)
      else await db.insert('customers', form)
      setForm(empty); setEditId(null); load()
    } catch (e) { setErr(e.message) }
  }
  const edit = (c) => {
    setEditId(c.id)
    setForm({ name: c.name, company: c.company || '', phone: c.phone || '', email: c.email || '', status: c.status || 'lead', note: c.note || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const del = async (id) => { if (confirm('Xoá khách hàng này (kèm giao dịch của họ)?')) { await db.remove('customers', id); load() } }

  const shown = rows.filter((c) =>
    (!filter || c.status === filter) &&
    [c.name, c.company, c.phone, c.email].join(' ').toLowerCase().includes(q.toLowerCase()))
  const count = (k) => rows.filter((c) => c.status === k).length

  return (
    <>
      <PageHero icon="👥" title="Khách hàng" subtitle="Quản lý danh bạ, trạng thái hợp tác và hồ sơ chăm sóc từng khách." color="indigo">
        <button className={'chip' + (!filter ? ' on' : '')} onClick={() => setFilter('')}>Tất cả <b>{rows.length}</b></button>
        {Object.entries(CUSTOMER_STATUS).map(([k, v]) => (
          <button key={k} className={'chip' + (filter === k ? ' on' : '')} onClick={() => setFilter(filter === k ? '' : k)}>
            {v} <b>{count(k)}</b>
          </button>
        ))}
      </PageHero>
      {err && <p className="error">{err}</p>}

      <form className="card section" onSubmit={submit}>
        <div className="section-head">
          <h3>{editId ? '✏️ Chỉnh sửa khách hàng' : '➕ Thêm khách hàng mới'}</h3>
        </div>
        <div className="form">
          <input placeholder="Tên *" value={form.name} onChange={set('name')} />
          <input placeholder="Công ty" value={form.company} onChange={set('company')} />
          <input placeholder="Số điện thoại" value={form.phone} onChange={set('phone')} />
          <input type="email" placeholder="Email" value={form.email} onChange={set('email')} />
          <select value={form.status} onChange={set('status')}>
            {Object.entries(CUSTOMER_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <input placeholder="Ghi chú" value={form.note} onChange={set('note')} />
          <button className="primary">{editId ? 'Cập nhật' : 'Thêm khách hàng'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm(empty) }}>Huỷ</button>}
        </div>
      </form>

      <div className="card section">
        <div className="section-head">
          <h3>Danh sách <span className="count-pill">{shown.length}</span></h3>
          <input className="search" placeholder="🔍 Tìm theo tên, công ty, SĐT, email..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="scroll">
          <table>
            <thead><tr><th>Khách hàng</th><th>Công ty</th><th>SĐT</th><th>Email</th><th>Trạng thái</th><th>Ghi chú</th><th></th></tr></thead>
            <tbody>
              {shown.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link className="cust-cell" to={`/customers/${c.id}`}>
                      <span className="avatar" style={avatarStyle(c.name)}>{initials(c.name)}</span>
                      <b>{c.name}</b>
                    </Link>
                  </td>
                  <td>{c.company}</td><td>{c.phone}</td><td>{c.email}</td>
                  <td><span className={'badge ' + c.status}>{CUSTOMER_STATUS[c.status]}</span></td>
                  <td>{c.note}</td>
                  <td className="actions"><Link className="btn-link" to={`/customers/${c.id}`}>Chi tiết</Link><button onClick={() => edit(c)}>Sửa</button><button className="danger" onClick={() => del(c.id)}>Xoá</button></td>
                </tr>
              ))}
              {!shown.length && <tr><td colSpan="7" className="empty">Chưa có khách hàng</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
