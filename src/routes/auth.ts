import { createFileRoute, redirect } from '@tanstack/react-router'
import { clerkClient, auth } from '@clerk/tanstack-react-start/server'
import { constants, privateEncrypt } from 'node:crypto'
import { z } from 'zod'

const User = z.object({
  email: z.string().nonempty(),
  name: z.string().nonempty(),
  company: z.string().nonempty(),
})

const SearchSchema = z.object({
  callback_url: z.string().url(),
})

const encrypt = (user: z.infer<typeof User>) => {
  return privateEncrypt(
    {
      key: process.env.PRIVATE_KEY!,
      padding: constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(JSON.stringify(user), 'utf8'),
  ).toString('base64url')
}

export const Route = createFileRoute('/auth')({
  validateSearch: SearchSchema,

  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const { callback_url } = SearchSchema.parse({
          callback_url: url.searchParams.get('callback_url'),
        })

        const { isAuthenticated, userId } = await auth()

        if (!isAuthenticated || !userId) {
          throw redirect({
            to: '/sign-in',
            search: {
              redirect_url: request.url,
            },
          })
        }

        const user = await clerkClient().users.getUser(userId)

        const userEntity = User.parse({
          email: user.emailAddresses[0]?.emailAddress,
          name: user.fullName,
          company: 'default',
        })

        const encryptedUser = encrypt(userEntity)

        const redirectUrl = new URL(callback_url)
        redirectUrl.searchParams.set('user', encryptedUser)

        return Response.redirect(redirectUrl.toString(), 302)
      },
    },
  },
})
