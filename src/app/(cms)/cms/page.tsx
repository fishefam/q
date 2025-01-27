'use client'

import { getAuthActions } from '@/shared/auth'
import { Button } from '@/shared/shadcn/components/ui/button'

export default function SignIn() {
  const authAction = getAuthActions()
  console.log(authAction)
  return (
    <>
      <Button
        onClick={() => getAuthActions()?.logout(undefined, new FormData())}
      >
        Signout
      </Button>
    </>
  )
}
