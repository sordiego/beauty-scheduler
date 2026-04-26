'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }
        
        setUser(user)
        
        // Tentar buscar o perfil, mas não quebrar se falhar
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setProfile(profile)
        } else {
          console.log('Perfil não encontrado para:', user.email)
        }
      } catch (err) {
        console.error('Erro ao carregar:', err)
      } finally {
        setLoading(false)
      }
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
                {profile?.nome_salao || 'Beauty Scheduler'}
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
        {/* Card de Boas-vindas */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Olá, {profile?.nome_salao || 'Profissional'}! 💅
          </h2>
          <p className="text-gray-600">Bem-vinda ao seu painel de controle.</p>
        </div>

        {profile && (
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 shadow-xl mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => router.push('/dashboard/agendamentos')}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition">
                📋
              </div>
              <div>
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