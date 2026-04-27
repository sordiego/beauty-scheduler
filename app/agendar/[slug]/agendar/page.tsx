'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const supabase = createClient(
  'https://iydjcgoysopqvujltnki.supabase.co',
  'sb_publishable_iomyJl0Iky0TPAvnqOpp5w_GG6G4xU8'
)

type Service = {
  id: string
  nome: string
  preco: number
  duracao_min: number
  descricao?: string
}

type Profile = {
  id: string
  nome_salao: string
  slug: string
  telefone_whatsapp: string
  observacoes?: string
}

export default function AgendarPage() {
  const { slug } = useParams()
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [formData, setFormData] = useState({ nome: '', telefone: '' })
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const allTimeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    console.log('🔍 Buscando slug:', slug)
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .limit(1)
    
    console.log('📦 Dados recebidos:', data)
    console.log('❌ Erro:', error)
    
    if (data && data.length > 0) {
      setProfile(data[0] as Profile)
      loadServices(data[0].id)
    } else {
      console.log('⚠️ Perfil NÃO encontrado para slug:', slug)
      setLoadingProfile(false)
    }
  }

  const loadServices = async (profileId: string) => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('profile_id', profileId)
    
    setServices((data as Service[]) || [])
    setLoadingProfile(false)
  }

  const loadAvailableTimes = async (date: Date) => {
    if (!profile?.id) return
    
    const dataFormatada = date.toISOString().split('T')[0]
    
    const { data } = await supabase
      .from('appointments')
      .select(`
        data_hora,
        services(duracao_min)
      `)
      .eq('profile_id', profile.id)
      .gte('data_hora', `${dataFormatada}T00:00:00`)
      .lte('data_hora', `${dataFormatada}T23:59:59`)
      .neq('status', 'cancelado')

    const appointments = data as any[] || []
    
    const horariosBloqueados = new Set<string>()
    
    appointments.forEach((app) => {
      const horaUTC = new Date(app.data_hora)
      const horaInicio = new Date(horaUTC.getTime() + (3 * 60 * 60 * 1000))
      const duracaoMin = app.services?.duracao_min || 60
      
      const slotsOcupados = Math.ceil(duracaoMin / 60)
      
      for (let i = 0; i < slotsOcupados; i++) {
        const horarioBloqueado = new Date(horaInicio)
        horarioBloqueado.setHours(horaInicio.getHours() + i)
        
        const hora = horarioBloqueado.getHours().toString().padStart(2, '0')
        const minutos = horarioBloqueado.getMinutes().toString().padStart(2, '0')
        const horarioFormatado = `${hora}:${minutos}`
        
        horariosBloqueados.add(horarioFormatado)
      }
    })
    
    const disponiveis = allTimeSlots.filter(h => !horariosBloqueados.has(h))
    setAvailableTimes(disponiveis)
  }

  const handleSelectService = (service: Service) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    loadAvailableTimes(date)
    setStep(3)
  }

  const handleSelectTime = (time: string) => {
    setSelectedTime(time)
    setStep(4)
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataHora = `${selectedDate?.toISOString().split('T')[0]}T${selectedTime}:00`
      
      const { error } = await supabase
        .from('appointments')
        .insert({
          profile_id: profile?.id,
          service_id: selectedService?.id,
          cliente_nome: formData.nome,
          cliente_telefone: formData.telefone,
          data_hora: dataHora,
          status: 'confirmado'
        })

      if (error) throw error

      setStep(5)

    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao confirmar agendamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-rose-50 to-amber-100 flex items-center justify-center">
        <div className="flex gap-3">
          <div className="w-4 h-4 bg-rose-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-rose-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-rose-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-rose-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-4">😢</div>
          <h1 className="text-4xl font-bold text-gray-600 mb-2">Salão não encontrado</h1>
          <p className="text-gray-500 text-lg">O link que você acessou não existe.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-rose-50 to-amber-100 relative overflow-hidden">
      <div className="absolute top-5 left-5 w-32 md:w-60 h-32 md:h-60 bg-rose-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>
      <div className="absolute bottom-5 right-5 w-40 md:w-80 h-40 md:h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <div className="text-center mb-6 md:mb-8">
          
          <div className="w-36 h-36 md:w-44 md:h-44 mx-auto mb-4 md:mb-5">
            <img 
              src={`/${slug}.png`}
              alt={profile.nome_salao}
              className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white"
            />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent px-2">
            {profile.nome_salao}
          </h1>
          
          <div className="flex items-center justify-center gap-1 md:gap-2 mt-6 md:mt-7">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all ${
                  step >= s 
                    ? 'bg-gradient-to-r from-rose-400 to-amber-400 text-white shadow-lg' 
                    : 'bg-white/50 text-gray-400'
                }`}>
                  {s}
                </div>
                {s < 5 && (
                  <div className={`w-6 md:w-10 h-0.5 ${step > s ? 'bg-rose-400' : 'bg-gray-300'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-5 md:p-7 border border-white/50">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <span className="text-3xl">💄</span> Escolha o serviço
              </h2>
              <div className="space-y-4">
                {services.length === 0 ? (
                  <p className="text-center text-gray-500 py-8 text-lg">Nenhum serviço cadastrado ainda.</p>
                ) : (
                  services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleSelectService(service)}
                      className="w-full p-5 bg-white/50 rounded-2xl text-left hover:bg-rose-50 hover:scale-[1.02] transition-all border border-white/50 hover:border-rose-200 group"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-xl text-gray-800 group-hover:text-rose-600 transition">
                            {service.nome}
                          </h3>
                          <p className="text-base text-gray-500">{service.duracao_min} minutos</p>
                        </div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                          R$ {service.preco.toFixed(2)}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <span className="text-3xl">📅</span> Escolha a data
              </h2>
              <div className="flex justify-center">
                <Calendar
                  onChange={(value) => {
                    if (value instanceof Date) {
                      handleSelectDate(value)
                    }
                  }}
                  value={selectedDate}
                  minDate={new Date()}
                  className="border-0 !bg-transparent text-lg"
                  tileClassName={({ date }) => 
                    `hover:bg-rose-100 rounded-lg transition text-base ${date.toDateString() === selectedDate?.toDateString() ? 'bg-rose-400 text-white' : ''}`
                  }
                />
              </div>
              <button
                onClick={() => setStep(1)}
                className="mt-5 text-rose-500 hover:text-rose-700 transition flex items-center gap-1 text-lg"
              >
                <span>←</span> Voltar
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <span className="text-3xl">⏰</span> Escolha o horário
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleSelectTime(time)}
                    className="p-4 bg-white/50 rounded-xl hover:bg-rose-400 hover:text-white transition-all border border-white/50 hover:scale-105 text-lg"
                  >
                    {time}
                  </button>
                ))}
              </div>
              {availableTimes.length === 0 && (
                <p className="text-center text-gray-500 mt-5 py-8 bg-gray-50 rounded-xl text-lg">
                  😢 Nenhum horário disponível nesta data.
                </p>
              )}
              <button
                onClick={() => setStep(2)}
                className="mt-5 text-rose-500 hover:text-rose-700 transition flex items-center gap-1 text-lg"
              >
                <span>←</span> Voltar
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <span className="text-3xl">📝</span> Seus dados
              </h2>
              <form onSubmit={handleSubmitForm} className="space-y-5">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Nome completo</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full p-4 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-lg"
                    placeholder="Maria Silva"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    className="w-full p-4 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-lg"
                    placeholder="11999999999"
                  />
                </div>
                
                <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-5 rounded-2xl">
                  <p className="font-semibold text-gray-800 text-lg">✨ Resumo</p>
                  <p className="text-base text-gray-600">{selectedService?.nome}</p>
                  <p className="text-base text-gray-600">
                    {selectedDate?.toLocaleDateString('pt-BR')} às {selectedTime}
                  </p>
                  <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text mt-3">
                    Total: R$ {selectedService?.preco.toFixed(2)}
                  </p>
                </div>
                
                <div className="flex gap-4 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-7 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-lg"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-rose-400 to-amber-400 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 text-lg"
                  >
                    {loading ? 'Confirmando...' : 'Confirmar Agendamento ✨'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-10">
              <div className="text-8xl mb-5 animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text mb-3">
                Agendamento Confirmado!
              </h2>
              <p className="text-gray-600 mb-5 text-lg">
                {formData.nome}, seu horário está marcado:
              </p>
              <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-5 rounded-2xl inline-block">
                <p className="font-semibold text-gray-800 text-xl">{selectedService?.nome}</p>
                <p className="text-xl text-gray-700">
                  {selectedDate?.toLocaleDateString('pt-BR')} às {selectedTime}
                </p>
              </div>
              <p className="text-base text-gray-500 mt-7">
                Enviamos uma confirmação para seu WhatsApp! 💚
              </p>
              <Link
                href={`/agendar/${slug}`}
                className="mt-7 inline-block bg-gradient-to-r from-rose-400 to-amber-400 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition text-lg"
              >
                Voltar ao início
              </Link>
            </div>
          )}
        </div>

        {profile?.observacoes && (
          <div className="mt-7 bg-rose-50/80 backdrop-blur rounded-2xl p-6 border border-rose-200 shadow-inner">
            <h3 className="font-semibold text-rose-700 mb-4 flex items-center gap-2 text-xl">
              <span>ℹ️</span> Informações Importantes
            </h3>
            <ul className="text-base text-gray-700 space-y-3">
              {profile.observacoes.split('•').filter(Boolean).map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-rose-500 text-xl mt-0.5">•</span>
                  <span>{item.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="text-center mt-7">
          <p className="text-gray-400 text-sm">
            Agendamento rápido e prático 💅✨
          </p>
          <p className="text-gray-300 text-xs mt-1">
            Beauty Scheduler • Agendamento rápido e seguro
          </p>
        </div>
      </div>
    </div>
  )
}