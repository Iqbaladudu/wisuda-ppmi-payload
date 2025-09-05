'use client'

import React, { useState } from 'react'

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

function SendWaCell(field: any) {
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle')
  const [message, setMessage] = useState<string>('Kirim')

  const handleSendWA = async () => {
    if (!field?.rowData?.whatsapp) {
      setSendStatus('error')
      setMessage('No WhatsApp number')
      return
    }

    setSendStatus('sending')
    setMessage('Sending...')

    try {
      // Format phone number for WhatsApp API
      const phoneNumber = field.rowData.whatsapp.replace('+', '') + '@s.whatsapp.net'

      // Create confirmation message
      const confirmationMessage = `Assalamu'alaikum ${field.rowData.name},\n\nSelamat! Pendaftaran wisuda PPMI Anda telah dikonfirmasi.\n\nDetail Pendaftaran:\n- Nama: ${field.rowData.name}\n- Tipe: ${field.rowData.registrant_type}\n- Universitas: ${field.rowData.university}\n- ID Pendaftaran: ${field.rowData.reg_id}\n\nSilakan hadir sesuai jadwal yang akan diinformasikan selanjutnya.\n\nBarakallahu feekum.`

      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          message: confirmationMessage,
          is_forwarded: false,
          duration: 3600,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      setSendStatus('success')
      setMessage('Sent!')
    } catch (error: any) {
      setSendStatus('error')
      setMessage(`Failed: ${error.message}`)
    } finally {
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSendStatus('idle')
        setMessage('Kirim')
      }, 3000)
    }
  }

  const disabled = sendStatus === 'sending'

  return (
    <button
      onClick={handleSendWA}
      disabled={disabled}
      style={{
        marginBottom: '10px',
        backgroundColor: 'white',
        color: 'black',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {message}
    </button>
  )
}

export default SendWaCell
