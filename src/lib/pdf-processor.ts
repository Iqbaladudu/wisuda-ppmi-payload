import { drawQRCodeOnPDF } from './pdf-qrcode'

export async function processPDFWithQRCode(
  pdfUrl: string,
  qrText: string,
  coordinates?: { x: number; y: number; page: number }
): Promise<Uint8Array> {
  try {
    const response = await fetch(pdfUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`)
    }
    
    const pdfBytes = new Uint8Array(await response.arrayBuffer())
    
    const processedPdfBytes = await drawQRCodeOnPDF(
      pdfBytes,
      qrText,
      coordinates
    )
    
    return processedPdfBytes
  } catch (error) {
    console.error('Error processing PDF with QR code:', error)
    throw error
  }
}

export async function downloadAndProcessPDFWithQRCode(
  pdfUrl: string,
  qrText: string,
  filename: string,
  coordinates?: { x: number; y: number; page: number }
): Promise<void> {
  try {
    const processedPdfBytes = await processPDFWithQRCode(pdfUrl, qrText, coordinates)
    
    const blob = new Blob([processedPdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading processed PDF:', error)
    throw error
  }
}