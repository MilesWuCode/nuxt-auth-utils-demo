export default defineEventHandler(async (event) => {
  const { user, token, loggedInAt } = await requireUserSession(event)

  const session = await setUserSession(event, {
    user: { ...user, fetched_at: Date.now() },
    token,
    loggedInAt,
  })

  setResponseStatus(event, 200)

  return session.user
})
