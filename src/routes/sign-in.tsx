import { SignIn } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const SearchSchema = z.object({
  redirect_url: z.string().url(),
})

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
  validateSearch: SearchSchema,
})

function RouteComponent() {
  const { redirect_url } = Route.useSearch()
  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <div className="flex gap-3 items-center">
        <SignIn forceRedirectUrl={redirect_url} />
      </div>
    </div>
  )
}
