import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Customers from './pages/Customers.jsx'
import Deals from './pages/Deals.jsx'
import Login from './pages/Login.jsx'
import { supabase, useSupabase } from './lib/db.js'

export default function App() {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(!useSupabase)

  useEffect(() => {
    if (!useSupabase) return
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true) })
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!ready) return <div className="center">Đang tải...</div>
  if (useSupabase && !session) return <Login />

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>📇 Mini CRM</h1>
        <nav>
          <NavLink to="/dashboard">📊 Tổng quan</NavLink>
          <NavLink to="/customers">👥 Khách hàng</NavLink>
          <NavLink to="/deals">💼 Giao dịch</NavLink>
        </nav>
        {useSupabase ? (
          <div className="user">
            <small>{session.user.email}</small>
            <button onClick={() => supabase.auth.signOut()}>Đăng xuất</button>
          </div>
        ) : (
          <small className="mode">🟡 Chế độ demo (dữ liệu lưu trên trình duyệt)</small>
        )}
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  )
}
