'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      setLoading(false)
    }
    
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-200"></div>
        </div>
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
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
          <h2 className="text-xl font-semibold mb-4">✅ Login realizado com sucesso!</h2>
          <p className="text-gray-600">Email: {user?.email}</p>
          <p className="text-gray-600">ID: {user?.id}</p>
        </div>
      </main>
    </div>
  )
}