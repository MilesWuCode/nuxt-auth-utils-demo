export default defineEventHandler(() => {
  throw createError({
    status: 401,
    message: 'Unauthorized',
  })
})
