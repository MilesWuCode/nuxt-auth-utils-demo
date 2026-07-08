export default defineEventHandler(() => {
  throw createError({
    statusCode: 401,
    message: 'Invalid credentials',
  })
})
