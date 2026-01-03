// ✅ Named export
import { nextTick } from 'vue'

export function usePrint() {
  const printElement = async (elementRef) => {
    if (!elementRef.value) return

    await nextTick()

    const printContents = elementRef.value.innerHTML
    const originalContents = document.body.innerHTML

    document.body.innerHTML = printContents
    window.print()
    document.body.innerHTML = originalContents
    window.location.reload()
  }

  return { printElement }
}
