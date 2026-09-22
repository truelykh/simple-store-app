import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const endpoints = {
  Users: '/api/users',
  Products: '/api/products',
  Orders: '/api/orders',
  Payments: '/api/payments',
  Notifications: '/api/notifications'
}

function App() {
  const [selected, setSelected] = useState(null)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  async function load(name) {
    setSelected(name)
    setError('')
    setData(null)

    try {
      const response = await fetch(endpoints[name])
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setData(await response.json())
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main>
      <h1>Simple Store</h1>
      <p>React → Nginx → Spring Boot microservices</p>

      <div className="buttons">
        {Object.keys(endpoints).map(name => (
          <button key={name} onClick={() => load(name)}>
            {name}
          </button>
        ))}
      </div>

      {selected && <h2>{selected}</h2>}
      {error && <pre>{error}</pre>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
