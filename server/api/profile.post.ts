import * as z from 'zod'

export default defineEventHandler(async (event) => {
  const { user, loggedInAt, secure, tokenExpiredAt } =
    await requireUserSession(event)

  const bodySchema = z.object({
    name: z.string('required').nonempty('required'),
  })

  const { name } = await readValidatedBody(event, bodySchema.parse)

  await setUserSession(event, {
    user: { ...user, name },
    loggedInAt,
    secure,
    tokenExpiredAt,
  })

  setResponseStatus(event, 200)
})
