'use client'

import { supabase } from '../../lib/supabase'
import { useState } from 'react'

export default function TestePage() {
  const [resultado, setResultado] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('sara@saranails.com')
  const [senha, setSenha] = useState('010101')
  
  const testar = async () => {
    setLoading(true)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha
    })
    
    setResultado(JSON.stringify({ data, error }, null, 2))
    setLoading(false)
  }
  
  return (
    <div style={{ padding: '50px', fontFamily: 'monospace' }}>
      <h1>Teste de Login</h1>
      
      <div style={{ marginBottom: '10px' }}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ padding: '10px', width: '250px', marginRight: '10px' }}
        />
        <input 
          type="password" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          style={{ padding: '10px', width: '150px' }}
        />
      </div>
      
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
        {loading ? 'Testando...' : 'Testar Login'}
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