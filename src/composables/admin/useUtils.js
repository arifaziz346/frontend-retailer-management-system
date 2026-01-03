
export const useUtils = () => {
    const limitDisplayText = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    }

    const cleanError = (error) => {
        if (Array.isArray(error)) {
            return error[0]?.replace(/^\[?"?|"?\]?$/g, '').replace(/\.$/, '');
        }
        return String(error).replace(/^\[?"?|"?\]?$/g, '').replace(/\.$/, '');
    }


       //Handle this kind of errors
      // [ "The category image field must be an image.",
     // "The category image field must be a file of type: jpeg, png, jpg, gif." ]
    // utils/formatErrors.js
  function formatErrors(error) {
  if (!error) return ''

  let messages = []

  if (Array.isArray(error)) {
    messages = error
  } else if (typeof error === 'object') {
    messages = Object.values(error).flat()
  } else {
    messages = [String(error)]
  }

  // Return joined with new line
  return messages.join('\n')
}


    // Helper to remove extra symbols and keep plain text
    const cleanText = (str) => {
        return String(str).replace(/[^a-zA-Z0-9\s.,-]/g, '').trim()
    }

    return {
        limitDisplayText,
        cleanError,
        formatErrors,
        cleanText
    }
}
