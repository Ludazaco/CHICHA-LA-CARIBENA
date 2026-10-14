/**
 * Convierte la imagen elegida por el usuario en una URL de datos lista para guardar.
 * Las imágenes se reducen a 512 px como máximo para no llenar el almacenamiento del dispositivo.
 */
export function archivoALogo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type)) {
      reject(new Error('Usa una imagen PNG, JPG, WebP o SVG.'))
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      reject(new Error('La imagen pesa más de 3 MB. Elige una más liviana.'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
    reader.onload = () => {
      const src = String(reader.result)

      // El SVG se guarda tal cual (en una etiqueta <img> no ejecuta scripts).
      if (file.type === 'image/svg+xml') {
        if (src.length > 300_000) reject(new Error('El SVG es muy pesado (máximo 300 KB).'))
        else resolve(src)
        return
      }

      const img = new Image()
      img.onerror = () => reject(new Error('No se pudo abrir la imagen.'))
      img.onload = () => {
        const max = 512
        const k = Math.min(1, max / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * k))
        const h = Math.max(1, Math.round(img.height * k))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo procesar la imagen.'))
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        resolve(file.type === 'image/jpeg' ? canvas.toDataURL('image/jpeg', 0.88) : canvas.toDataURL('image/png'))
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  })
}
