'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://iydjcgoysopqvujltnki.supabase.co',
  'sb_publishable_iomyJl0Iky0TPAvnqOpp5w_GG6G4xU8'
)

type Appointment = {
  id: string
  cliente_nome: string
  cliente_telefone: string
  data_hora: string
  status: string
  services: {
    nome: string
    preco: number
  }
}

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const token = localStorage.getItem('supabase_token')
    const userStr = localStorage.getItem('supabase_user')
    
    if (!token || !userStr) {
      router.push('/login')
      return
    }
    
    const user = JSON.parse(userStr)
    loadAppointments(user.id)
  }

  const loadAppointments = async (userId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        services (
          nome,
          preco
        )
      `)
      .eq('profile_id', userId)
      .order('data_hora', { ascending: true })

    if (data) {
      setAppointments(data as Appointment[])
    }
    
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setAppointments(appointments.map(a => 
        a.id === id ? { ...a, status } : a
      ))
    }
  }

  const cancelAppointment = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja CANCELAR o agendamento de ${nome}?`)) {
      return
    }

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelado' })
      .eq('id', id)

    if (!error) {
      setAppointments(appointments.map(a => 
        a.id === id ? { ...a, status: 'cancelado' } : a
      ))
      alert('✅ Agendamento cancelado com sucesso!')
    } else {
      alert('❌ Erro ao cancelar agendamento. Tente novamente.')
    }
  }

  const filteredAppointments = appointments.filter(app => {
    const date = parseISO(app.data_hora)
    const today = new Date()
    
    if (filter === 'hoje') {
      return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    }
    if (filter === 'semana') {
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
      const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6))
      return date >= weekStart && date <= weekEnd
    }
    if (filter === 'mes') {
      return format(date, 'yyyy-MM') === format(today, 'yyyy-MM')
    }
    return true
  })

  const totalFaturamento = filteredAppointments
    .filter(a => a.status === 'confirmado' || a.status === 'concluido')
    .reduce((acc, app) => acc + (app.services?.preco || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 p-6">
        <div className="max-w-6xl mx-auto text-center py-12">
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-gray-500 mt-4">Carregando agendamentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <span>📅</span> Agendamentos
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-rose-600 hover:text-rose-800 transition flex items-center gap-1 bg-white/50 px-4 py-2 rounded-xl"
          >
            <span>←</span> Voltar ao Dashboard
          </button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/70 backdrop-blur rounded-2xl p-5 shadow-lg border border-white/50">
            <p className="text-gray-500 text-sm">Total de Agendamentos</p>
            <p className="text-3xl font-bold text-gray-800">{filteredAppointments.length}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-2xl p-5 shadow-lg border border-white/50">
            <p className="text-gray-500 text-sm">Faturamento ({filter})</p>
            <p className="text-3xl font-bold text-green-600">
              R$ {totalFaturamento.toFixed(2)}
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-2xl p-5 shadow-lg border border-white/50">
            <p className="text-gray-500 text-sm">Status</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                ✓ {appointments.filter(a => a.status === 'confirmado').length}
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                ✓✓ {appointments.filter(a => a.status === 'concluido').length}
              </span>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                ✗ {appointments.filter(a => a.status === 'cancelado').length}
              </span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow-lg border border-white/50 mb-6">
          <div className="flex flex-wrap gap-2">
            {['todos', 'hoje', 'semana', 'mes'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl transition text-sm md:text-base ${
                  filter === f 
                    ? 'bg-rose-500 text-white shadow-md' 
                    : 'bg-white/50 text-gray-700 hover:bg-white'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Agendamentos */}
        <div className="bg-white/70 backdrop-blur rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-5xl mb-3">📭</p>
              <p className="text-lg">Nenhum agendamento encontrado</p>
              <p className="text-sm text-gray-400 mt-1">Os agendamentos aparecerão aqui</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-rose-50/50 border-b border-rose-100">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Cliente</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Serviço</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Data/Hora</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Valor</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-rose-50/30 transition">
                      <td className="p-4">
                        <p className="font-medium text-gray-800">{app.cliente_nome}</p>
                        <p className="text-sm text-gray-500">{app.cliente_telefone}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-700">{app.services?.nome || '-'}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-800">
                          {format(parseISO(app.data_hora), "dd 'de' MMM", { locale: ptBR })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(parseISO(app.data_hora), 'HH:mm')}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-green-600">
                          R$ {app.services?.preco?.toFixed(2) || '0.00'}
                        </p>
                      </td>
                      <td className="p-4">
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer ${
                            app.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                            app.status === 'concluido' ? 'bg-blue-100 text-blue-700' :
                            app.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <option value="confirmado">Confirmado</option>
                          <option value="concluido">Concluído</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col md:flex-row gap-2">
                          <a
                            href={`https://wa.me/55${app.cliente_telefone.replace(/\D/g, '')}`}
                            target="_blank"
                            className="text-green-600 hover:text-green-800 text-sm bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-1"
                          >
                            <span>💬</span> WhatsApp
                          </a>
                          <button
                            onClick={() => cancelAppointment(app.id, app.cliente_nome)}
                            className="text-red-600 hover:text-red-800 text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-1"
                          >
                            <span>🗑️</span> Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <p className="text-center text-gray-400 text-xs mt-6">
          Beauty Scheduler • Gestão de agendamentos
        </p>
      </div>
    </div>
  )
}