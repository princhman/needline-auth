import {
  UserButton,
  Show,
  SignInButton,
  SignUpButton,
} from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <div className="flex gap-3 items-center">
        <span className="text-3xl">Needline demo auth</span>
        <Show when="signed-in">
          <UserButton />
        </Show>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
      </div>
    </div>
  )
}
