'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login2Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('https://iydjcgoysopqvujltnki.supabase.co/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_iomyJl0Iky0TPAvnqOpp5w_GG6G4xU8'
        },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()
      
      if (data.access_token) {
        alert('✅ LOGIN FUNCIONOU! Token: ' + data.access_token.substring(0, 20) + '...')
        router.push('/dashboard')
      } else if (data.error) {
        alert('❌ Erro: ' + data.error_description || data.error)
      } else {
        alert('❌ Email ou senha incorretos')
      }
    } catch (err: any) {
      alert('❌ Erro de conexão: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 50, maxWidth: 400, margin: '0 auto' }}>
      <h1>Login Alternativo</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
          required
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: 10, background: 'pink', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}