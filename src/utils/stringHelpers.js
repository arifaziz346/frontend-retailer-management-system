// Limit text length and add "..." if it exceeds the limit
export const limitDisplayText = (text, limit) => {
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

// Clean error message
export const cleanError = (error) => {
  if (Array.isArray(error)) {
    return error[0]?.replace(/^\[?"?|"?\]?$/g, '').replace(/\.$/, '');
  }
  return String(error).replace(/^\[?"?|"?\]?$/g, '').replace(/\.$/, '');
};
// export const clearError = (error: unknown) => {
//   if (Array.isArray(error)) {
//     return error[0]?.replace(/^\[?"?|"?\]?$/g, '').replace(/\.$/, '')
//   }
//   return String(error).replace(/^\[?"?|"?\]?$/g, '').replace(/\.$/, '')
// }
// utils/formatDate.js

