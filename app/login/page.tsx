'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(
        'https://iydjcgoysopqvujltnki.supabase.co/auth/v1/token?grant_type=password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'sb_publishable_iomyJl0Iky0TPAvnqOpp5w_GG6G4xU8'
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      )
      
      const data = await response.json()
      
      if (data.access_token) {
        // Salvar token no localStorage
        localStorage.setItem('supabase_token', data.access_token)
        localStorage.setItem('supabase_user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else {
        alert('Email ou senha incorretos')
      }
    } catch (err) {
      alert('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      
      <div className="relative z-10 w-96 mx-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-3xl">💅</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Beauty Scheduler
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Organize seu salão com estilo</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            
            <input
              type="password"
              placeholder="Senha"
              className="w-full p-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}