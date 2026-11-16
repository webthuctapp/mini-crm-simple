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
    <div className="center">
      <form className="card login" onSubmit={submit}>
        <h1>📇 Mini CRM</h1>
        <p>Đăng nhập dành cho nhân viên</p>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <p className="error">{err}</p>}
        <button className="primary" disabled={busy}>{busy ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
      </form>
    </div>
  )
}

