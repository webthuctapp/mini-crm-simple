import { useState } from 'react'
import { supabase } from '../lib/db.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErr('Sai email hoặc mật khẩu')
    setBusy(false)
  }

  return (
    <div className="login-bg">
      <form className="card login" onSubmit={submit}>
        <div className="brand-badge">📇</div>
        <h1>Mini CRM</h1>
        <p>Hệ thống quản lý khách hàng &amp; bán hàng</p>
        <label className="field">
          <span>Email nhân viên</span>
          <input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="field">
          <span>Mật khẩu</span>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {err && <p className="error">{err}</p>}
        <button className="primary full" disabled={busy}>{busy ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
      </form>
    </div>
  )
}
