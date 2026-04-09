import * as z from 'zod'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const bodySchema = z.object({
    name: z.string('required').nonempty('required'),
  })

  const { name } = await readValidatedBody(event, bodySchema.parse)

  await setUserSession(event, {
    // @ts-ignore
    user: {
      name: name,
    },
  })

  return setResponseStatus(event, 200)
})
