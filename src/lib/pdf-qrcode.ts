import QRCode from 'qrcode'
import { PDFDocument, rgb } from 'pdf-lib'

export const FIELD_COORDINATES = {
  QR: { x: 250, y: 50, page: 1 },
  SYAHADAH: { x: 0, y: 0, page: 3 }, // Position akan dihitung otomatis di fungsi drawImageOnPDF
}

export async function generateQRCodeDataURL(text: string): Promise<string> {
  try {
    const url = await QRCode.toDataURL(text, {
      width: 100,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return url
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

export async function drawQRCodeOnPDF(
  pdfBytes: Uint8Array,
  qrText: string,
  coordinates = FIELD_COORDINATES.QR,
): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()

    if (coordinates.page > pages.length) {
      throw new Error(`Page ${coordinates.page} does not exist`)
    }

    const page = pages[coordinates.page - 1]

    const qrDataURL = await generateQRCodeDataURL(qrText)

    const qrImage = await pdfDoc.embedPng(qrDataURL)

    const qrSize = 100
    page.drawImage(qrImage, {
      x: coordinates.x,
      y: coordinates.y,
      width: qrSize,
      height: qrSize,
    })

    return await pdfDoc.save()
  } catch (error) {
    console.error('Error drawing QR code on PDF:', error)
    throw error
  }
}

export async function drawImageOnPDF(
  pdfBytes: Uint8Array,
  imageData: Uint8Array,
  coordinates = FIELD_COORDINATES.SYAHADAH,
): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()

    if (coordinates.page > pages.length) {
      throw new Error(`Page ${coordinates.page} does not exist`)
    }

    const page = pages[coordinates.page - 1]

    const image = await pdfDoc.embedJpg(imageData)

    // Calculate image size: 7/10 of page size
    const pageWidth = page.getWidth()
    const pageHeight = page.getHeight()
    const imageWidth = pageWidth * 0.7
    const imageHeight = pageHeight * 0.7

    // Get image dimensions to maintain aspect ratio
    const imageDims = image.scale(1)
    const imageAspectRatio = imageDims.width / imageDims.height

    // Calculate final dimensions maintaining aspect ratio
    let finalWidth, finalHeight
    if (imageAspectRatio > 1) {
      // Landscape orientation
      finalWidth = imageWidth
      finalHeight = imageWidth / imageAspectRatio
    } else {
      // Portrait orientation (typical for ijazah)
      finalHeight = imageHeight
      finalWidth = imageHeight * imageAspectRatio
    }

    // Center the image on page with margin from top
    const x = (pageWidth - finalWidth) / 2
    const y = pageHeight - finalHeight - 90 // 90 units margin from top (40 + 50)

    page.drawImage(image, {
      x: x,
      y: y,
      width: finalWidth,
      height: finalHeight,
    })

    return await pdfDoc.save()
  } catch (error) {
    console.error('Error drawing image on PDF:', error)
    throw error
  }
}
