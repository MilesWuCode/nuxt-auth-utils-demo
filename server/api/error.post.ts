export default defineEventHandler(() => {
  throw createError({
    status: 401,
    statusText: 'Invalid credentials',
  })
})
