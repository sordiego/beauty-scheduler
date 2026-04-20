import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Log para debug (vai aparecer nos logs da Vercel)
console.log('🔧 Supabase URL definida:', supabaseUrl ? 'SIM' : 'NÃO')
console.log('🔧 Supabase Key definida:', supabaseAnonKey ? 'SIM' : 'NÃO')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO CRÍTICO: Variáveis de ambiente do Supabase não encontradas!')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)