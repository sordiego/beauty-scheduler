'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ agendamentos: 0, faturamento: 0 })
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      // Pegar do localStorage (mesmo método do login)
      const token = localStorage.getItem('supabase_token')
      const userStr = localStorage.getItem('supabase_user')
      
      if (!token || !userStr) {
        router.push('/login')
        return
      }
      
      try {
        const user = JSON.parse(userStr)
        setUser(user)
        
        // Buscar perfil com maybeSingle
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
        
        if (profile) {
          setProfile(profile)
          
          // Buscar stats
          const { data: appointments } = await supabase
            .from('appointments')
            .select('*, services(preco)')
            .eq('profile_id', user.id)

          if (appointments) {
            const total = appointments.reduce((acc: number, a: any) => acc + (a.services?.preco || 0), 0)
            setStats({
              agendamentos: appointments.length,
              faturamento: total
            })
          }
        }
      } catch (err) {
        console.error('Erro:', err)
      }
    }
    
    checkUser()
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem('supabase_token')
    localStorage.removeItem('supabase_user')
    await supabase.auth.signOut()
    router.push('/login')
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
                {profile?.nome_salao || 'Beauty Scheduler'}
              </h1>
              <p className="text-xs text-gray-500">Plano {profile?.plano || 'Gratuito'}</p>
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
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">📅</div>
              <p className="text-gray-500 text-sm">Agendamentos</p>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.agendamentos}</p>
            <p className="text-xs text-gray-400 mt-1">Total de todos os tempos</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-2xl">💰</div>
              <p className="text-gray-500 text-sm">Faturamento</p>
            </div>
            <p className="text-3xl font-bold text-green-600">R$ {stats.faturamento.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">Total acumulado</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">⭐</div>
              <p className="text-gray-500 text-sm">Avaliação</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">5.0</p>
            <p className="text-xs text-gray-400 mt-1">Média de satisfação</p>
          </div>
        </div>

        {/* Link de agendamento */}
        {profile && (
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-white text-lg font-semibold mb-2">🔗 Seu link de agendamento</h2>
            <p className="text-white/80 text-sm mb-3">Compartilhe este link com suas clientes</p>
            <div className="bg-white/20 backdrop-blur rounded-xl p-3 flex items-center justify-between">
              <code className="text-white font-mono text-sm">
                https://beauty-scheduler-omega.vercel.app/agendar/{profile.slug}/agendar
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://beauty-scheduler-omega.vercel.app/agendar/${profile.slug}/agendar`)
                  alert('✅ Link copiado!')
                }}
                className="bg-white text-pink-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-50 transition"
              >
                Copiar
              </button>
            </div>
          </div>
        )}

        {/* Menu de funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => router.push('/dashboard/agendamentos')}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition">
                📋
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Ver Agendamentos</h3>
                <p className="text-sm text-gray-500">Gerencie todos os horários marcados</p>
              </div>
              <span className="text-gray-400 group-hover:translate-x-1 transition">→</span>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50 opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl">
                📊
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Relatórios</h3>
                <p className="text-sm text-gray-500">Em breve</p>
              </div>
              <span className="bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded-full">Em breve</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}