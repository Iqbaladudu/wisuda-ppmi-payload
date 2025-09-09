import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to create confirmation message
export const createConfirmationMessage = (data: any, operation: string): string => {
  if (operation === 'create') {
    return `Assalamu'alaikum ${data.name},\n\nSelamat! Pendaftaran wisuda PPMI Anda telah dikonfirmasi.\n\nDetail Pendaftaran:\n- Nama: ${data.name}\n- Tipe: ${data.registrant_type}\n- Universitas: ${data.university}\n- ID Pendaftaran: ${data.reg_id}\n\nSilakan hadir sesuai jadwal yang akan diinformasikan selanjutnya.\n\nBarakallahu feekum.`
  } else if (operation === 'update') {
    return `Assalamu'alaikum ${data.name},\n\nData pendaftaran wisuda PPMI Anda telah diperbarui.\n\nDetail Terbaru:\n- Nama: ${data.name}\n- Tipe: ${data.registrant_type}\n- Universitas: ${data.university}\n- ID Pendaftaran: ${data.reg_id}\n\nJika ada perubahan penting, kami akan menginformasikan lebih lanjut.\n\nBarakallahu feekum.`
  }
  return ''
}

// Helper function to send WhatsApp message
export const sendWhatsAppMessage = async (
  phoneNumber: string,
  message: string,
  apiUrl: string,
  user: string,
  password: string,
  name: string,
): Promise<void> => {
  // Create base64 encoded credentials
  const credentials = Buffer.from(`${user}:${password}`).toString('base64')

  // Call external WhatsApp API
  const response = await fetch(`${apiUrl}/send/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      phone: phoneNumber,
      message: message,
      is_forwarded: false,
      duration: 3600,
    }),
  })

  if (response.ok) {
    console.log(`WhatsApp confirmation sent to ${name} (${phoneNumber})`)
  } else {
    console.error(`Failed to send WhatsApp to ${name}:`, response.status, await response.json())
  }
}

// Helper function to send WhatsApp file with caption
export const sendWhatsAppFile = async (
  phoneNumber: string,
  fileBuffer: Buffer,
  fileName: string,
  caption: string,
  apiUrl: string,
  user: string,
  password: string,
  name: string,
): Promise<void> => {
  // Create base64 encoded credentials
  const credentials = Buffer.from(`${user}:${password}`).toString('base64')

  // Create form data
  const formData = new FormData()
  formData.append('phone', phoneNumber)
  formData.append('caption', caption)
  formData.append('is_forwarded', 'false')
  formData.append('duration', '3600')
  
  // Create file blob
  const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' })
  formData.append('file', fileBlob, fileName)

  try {
    // Call external WhatsApp API for file sending
    const response = await fetch(`${apiUrl}/send/file`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      body: formData,
    })

    if (response.ok) {
      console.log(`WhatsApp PDF sent to ${name} (${phoneNumber})`)
    } else {
      console.error(`Failed to send WhatsApp PDF to ${name}:`, response.status, await response.text())
    }
  } catch (error) {
    console.error(`Error sending WhatsApp PDF to ${name}:`, error)
  }
}
