import * as z from 'zod'

export default defineEventHandler(async (event) => {
  const { user, token, loggedInAt } = await requireUserSession(event)

  const bodySchema = z.object({
    name: z.string('required').nonempty('required'),
  })

  const { name } = await readValidatedBody(event, bodySchema.parse)

  await setUserSession(event, {
    user: { ...user, name },
    token,
    loggedInAt,
  })

  setResponseStatus(event, 200)
})
