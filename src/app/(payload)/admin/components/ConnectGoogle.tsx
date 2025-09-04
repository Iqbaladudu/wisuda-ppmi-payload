'use client'

import React, { useEffect, useState } from 'react'

type Status = 'loading' | 'connected' | 'disconnected' | 'error'

export default function ConnectGoogle() {
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState<string>('Memeriksa koneksi...')

  async function fetchStatus() {
    try {
      const res = await fetch('/api/google/status', { cache: 'no-store' })
      if (!res.ok) throw new Error('Status request failed')
      const data = await res.json()
      if (data.connected) {
        setStatus('connected')
        setMessage('Terhubung dengan Google')
      } else {
        setStatus('disconnected')
        setMessage('Sambungkan ke Google')
      }
    } catch (e) {
      setStatus('error')
      setMessage('Gagal memeriksa koneksi Google')
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const handleClick = () => {
    if (status === 'connected') return
    window.location.href = '/api/google/init'
  }

  const disabled = status === 'loading' || status === 'connected'

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        marginBottom: '10px',
        backgroundColor: 'white',
        color: 'black',
        border: 'none',
        cursor: `${disabled ? 'not-allowed' : 'pointer'}`,
      }}
    >
      {message}
    </button>
  )
}
