import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform rotate-3 hover:rotate-0 transition">
          <span className="text-white text-4xl">💅</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Beauty Scheduler
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          O sistema de agendamento que organiza seu salão, encanta suas clientes e aumenta seu faturamento ✨
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/login">
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-medium shadow-xl hover:shadow-2xl transform hover:scale-105 transition">
              Área da Profissional →
            </button>
          </Link>
          <Link href="/agendar/studio-teste">
            <button className="bg-white/80 backdrop-blur text-gray-700 px-8 py-4 rounded-2xl text-lg font-medium shadow-lg hover:shadow-xl border border-white/50 hover:scale-105 transition">
              Ver exemplo ✨
            </button>
          </Link>
        </div>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/60 backdrop-blur rounded-2xl p-6 border border-white/50">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-semibold text-gray-800 mb-2">Agendamento 24h</h3>
            <p className="text-sm text-gray-500">Suas clientes marcam horário a qualquer hora, sem precisar te chamar</p>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-2xl p-6 border border-white/50">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-800 mb-2">Relatórios inteligentes</h3>
            <p className="text-sm text-gray-500">Acompanhe seu faturamento e saiba qual serviço vende mais</p>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-2xl p-6 border border-white/50">
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="font-semibold text-gray-800 mb-2">Link personalizado</h3>
            <p className="text-sm text-gray-500">Coloque na bio do Instagram e receba agendamentos automáticos</p>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mt-16">
          © 2026 Beauty Scheduler • Por apenas R$ 34,90/mês
        </p>
      </div>
    </div>
  )
}