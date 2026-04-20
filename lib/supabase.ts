import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ijmhowrcrm.supabase.co'
const supabaseAnonKey = 'sb_publishable_9Ef3fR5sHgN9Kc9zlMBDyA_U3gxzNBT'

console.log('🔧 Supabase URL:', supabaseUrl)
console.log('🔧 Supabase Key:', supabaseAnonKey ? 'OK' : 'FALTANDO')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})