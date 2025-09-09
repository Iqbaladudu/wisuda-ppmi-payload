'use client'

import React, { useState } from 'react'

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

function SendWaCell(field: any) {
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle')
  const [message, setMessage] = useState<string>('Kirim PDF')

  const handleSendWA = async () => {
    if (!field?.rowData?.id) {
      setSendStatus('error')
      setMessage('No registrant ID')
      return
    }

    setSendStatus('sending')
    setMessage('Generating PDF & Sending...')

    try {
      // Call the regenerate-pdf API which will trigger the same logic as afterChange
      const response = await fetch('/api/regenerate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrantId: field.rowData.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      setSendStatus('success')
      setMessage('PDF Sent!')
    } catch (error: any) {
      setSendStatus('error')
      setMessage(`Failed: ${error.message}`)
    } finally {
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSendStatus('idle')
        setMessage('Kirim PDF')
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
