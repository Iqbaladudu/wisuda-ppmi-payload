'use client'

import React, { useEffect, useState } from 'react'

type ExportStatus = 'idle' | 'exporting' | 'success' | 'error'
type CredentialStatus = 'loading' | 'connected' | 'disconnected' | 'error'

export default function ExportToSheet() {
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle')
  const [credentialStatus, setCredentialStatus] = useState<CredentialStatus>('loading')
  const [message, setMessage] = useState<string>('Memeriksa koneksi...')

  async function fetchCredentialStatus() {
    try {
      const res = await fetch('/api/google/status', { cache: 'no-store' })
      if (!res.ok) throw new Error('Status request failed')
      const data = await res.json()
      if (data.connected) {
        setCredentialStatus('connected')
        setMessage('Update')
      } else {
        setCredentialStatus('disconnected')
        setMessage('Export')
      }
    } catch (e) {
      setCredentialStatus('error')
      setMessage('Gagal memeriksa koneksi Google')
    }
  }

  useEffect(() => {
    fetchCredentialStatus()
  }, [])

  async function handleExport() {
    if (credentialStatus !== 'connected') return

    setExportStatus('exporting')
    setMessage('Exporting...')

    try {
      const res = await fetch('/api/export/create-or-update/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // Empty body to auto-export all registrants
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${res.status}`)
      }

      const data = await res.json()
      setExportStatus('success')
      setMessage('Exported successfully!')
      // Optionally open the sheet in new tab
      if (data.spreadsheetUrl) {
        window.open(data.spreadsheetUrl, '_blank')
      }
    } catch (e: any) {
      setExportStatus('error')
      setMessage(`Export failed: ${e.message}`)
    } finally {
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setExportStatus('idle')
        setMessage(credentialStatus === 'connected' ? 'Update' : 'Export')
      }, 3000)
    }
  }

  const disabled = credentialStatus !== 'connected' || exportStatus === 'exporting'

  return (
    <button
      onClick={handleExport}
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
