// Resizes an image client-side before upload, so we never send a
// multi-megabyte phone photo as someone's avatar.
export function resizeImage(file: File, maxDim = 512): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = () => {
      img.src = reader.result as string
    }
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const canvas = document.createElement("canvas")
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Canvas not supported"))
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Resize failed"))), "image/jpeg", 0.85)
    }
    img.onerror = reject
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}