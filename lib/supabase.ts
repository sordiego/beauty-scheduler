import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mgjrjtzjexfrqnlkqiyl.supabase.co'
const supabaseAnonKey = 'sb_publishable_NuopiwB5g5RrvsAfH2AzqA_XNXsQdg9'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)