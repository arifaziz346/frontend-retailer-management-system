// // composables/useFormErrors.js
// export function useFormErrors(errors) {
//   return (error) => {
//     // Reset existing errors
//     Object.keys(errors).forEach((key) => {
//       errors[key] = ''
//     })

//     // Handle Laravel-style validation errors
//     const backendErrors = error?.response?.data?.errors || error?.data?.errors

//     if (backendErrors) {
//       for (const key in backendErrors) {
//         const fieldErrors = backendErrors[key]
//         errors[key] = Array.isArray(fieldErrors)
//           ? fieldErrors
//           : [fieldErrors]
//       }
//     } else {
//       // Handle general message
//       const message =
//         error?.response?.data?.message ||
//         error?.data?.message ||
//         'Something went wrong'
//       errors.general = [message]
//     }
//   }
// }
// composables/useFormErrors.js
// composables/useFormErrors.js
export function useFormErrors(errors) {
  return (error) => {
    // Reset existing errors
    Object.keys(errors).forEach((key) => {
      errors[key] = ''
    })

    // Extract Laravel-style validation errors
    const backendErrors = error?.response?.data?.errors || error?.data?.errors

    if (backendErrors) {
      for (let key in backendErrors) {
        // 1️⃣ Remove indexes from key like variants.0.unit → variants.unit
        let cleanKey = key.replace(/\.\d+\./g, '.')
        cleanKey = cleanKey.replace(/\.\d+$/, '') // also handle trailing numbers

        // 2️⃣ Convert dot.notation → snake_case (variants.unit → variants_unit)
        cleanKey = cleanKey.replace(/\./g, '_')

        // 3️⃣ Clean message text dynamically (generic, no hardcoded prefix)
        const fieldErrors = backendErrors[key]
        const cleanedMessages = (Array.isArray(fieldErrors) ? fieldErrors : [fieldErrors]).map((msg) => {
          // Remove numeric indexes (.0.)
          msg = msg.replace(/\.\d+\./g, '.').replace(/\.\d+/g, '')

          // Remove all nested prefixes, keep only the last field (e.g. variants.unit → unit)
          msg = msg.replace(/\b([\w]+\.)+([\w]+)\b/g, '$2')

          return msg.trim()
        })

        // 4️⃣ Assign cleaned messages
        errors[cleanKey] = cleanedMessages
      }
    } else {
      // Handle general API error message
      const message =
        error?.response?.data?.message ||
        error?.data?.message ||
        'Something went wrong'
      errors.general = [message]
    }
  }
}

