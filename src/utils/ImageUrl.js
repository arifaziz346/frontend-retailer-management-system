

export function getStoragePath(input) {
  // Handle arrays
  if (Array.isArray(input)) {
    return input.map(i => getStoragePath(i))
  }

  if (!input) return null

  const url = String(input).trim()

  // 🔸 If it's a blob or data URL → return null
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return null
  }

  // 🔸 Find "/storage/" and return everything after it
  const storageIndex = url.indexOf('/storage/')
  if (storageIndex !== -1) {
    return url.substring(storageIndex + '/storage/'.length)
  }

  // 🔸 If it's already a relative path (no /storage/)
  if (!url.startsWith('http') && !url.startsWith('blob:') && !url.startsWith('data:')) {
    return url
  }

  // 🔸 For anything else (like full URLs without /storage/) → return null
  return null
}

export default getStoragePath
