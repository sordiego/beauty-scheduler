import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

export default async function AgendarPage({ params }: { params: { slug: string } }) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-600 mb-4">Salão não encontrado</h1>
          <p className="text-gray-500">O link que você acessou não existe.</p>
        </div>
      </div>
    )
  }

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('profile_id', profile.id)

  const whatsappLink = `https://wa.me/55${profile.telefone_whatsapp?.replace(/\D/g, '')}?text=Olá! Gostaria de agendar um horário no ${profile.nome_salao}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-700">{profile.nome_salao}</h1>
          <p className="text-gray-600 mt-2">Escolha seu serviço e agende pelo WhatsApp</p>
        </div>

        <div className="grid gap-4">
          {services?.map((service: any) => (
            <div key={service.id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{service.nome}</h3>
                  <p className="text-sm text-gray-500">{service.duracao_min} minutos</p>
                  {service.descricao && (
                    <p className="text-sm text-gray-400 mt-1">{service.descricao}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-pink-600">
                    R$ {typeof service.preco === 'number' ? service.preco.toFixed(2) : service.preco}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!services || services.length === 0) && (
          <div className="text-center text-gray-500 mt-8">
            Nenhum serviço cadastrado ainda.
          </div>
        )}

        <div className="fixed bottom-6 right-6">
          <Link href={whatsappLink} target="_blank">
            <button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-4 shadow-lg flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.556 1.099 3.641l-1.393 4.057 4.197-1.383c1.143.666 2.451 1.017 3.857 1.017 3.182 0 5.77-2.586 5.77-5.767 0-3.18-2.587-5.766-5.77-5.766z"/>
              </svg>
              Agendar pelo WhatsApp
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}