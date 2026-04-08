export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  await setUserSession(event, {
    user: {
      fetched_at: Date.now(),
    },
  })

  return setResponseStatus(event, 200)
})
