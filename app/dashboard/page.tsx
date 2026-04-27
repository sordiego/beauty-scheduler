'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Pegar o token salvo no localStorage
    const token = localStorage.getItem('supabase_token')
    const userStr = localStorage.getItem('supabase_user')
    
    if (!token || !userStr) {
      router.push('/login')
      return
    }
    
    try {
      const userData = JSON.parse(userStr)
      setUser(userData)
    } catch (err) {
      console.error('Erro ao carregar usuário:', err)
    }
    
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('supabase_token')
    localStorage.removeItem('supabase_user')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <header className="bg-white/70 backdrop-blur-lg border-b border-white/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">💅</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Beauty Scheduler
              </h1>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
          >
            <span className="text-xl">🚪</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Bem-vinda! 💅
          </h2>
          <p className="text-gray-600">Email: {user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-3xl">
                📋
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Agendamentos</h3>
                <p className="text-sm text-gray-500">Em breve</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl">
                📊
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Relatórios</h3>
                <p className="text-sm text-gray-500">Em breve</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}