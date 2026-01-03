// ~/utils/getCsrfCookie.js
export const getCsrfCookie = async () => {
  const config = useRuntimeConfig()

  await $fetch(`${config.public.apiBaseUrl}/sanctum/csrf-cookie`, {
    credentials: 'include',
  })
}
