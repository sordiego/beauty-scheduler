'use client'

import { supabase } from '../../lib/supabase'
import { useState } from 'react'

export default function TestePage() {
  const [resultado, setResultado] = useState('')
  const [loading, setLoading] = useState(false)
  
  const testar = async () => {
    setLoading(true)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'isa@aura.com',
      password: '123456'
    })
    
    setResultado(JSON.stringify({ data, error }, null, 2))
    setLoading(false)
  }
  
  return (
    <div style={{ padding: '50px', fontFamily: 'monospace' }}>
      <h1>Teste de Login</h1>
      <button 
        onClick={testar} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          background: 'pink', 
          border: 'none', 
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Testando...' : 'Testar Login com isa@aura.com'}
      </button>
      <pre style={{ 
        marginTop: '20px', 
        padding: '20px', 
        background: '#f5f5f5', 
        borderRadius: '8px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
      }}>
        {resultado || 'Clique no botão para testar...'}
      </pre>
    </div>
  )
}