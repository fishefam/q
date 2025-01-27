'use client'

import type { ChangeEventHandler } from 'react'

import { getAuthActions } from '@/shared/auth'
import { Button } from '@/shared/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card'
import { Input } from '@/shared/shadcn/components/ui/input'
import { Label } from '@/shared/shadcn/components/ui/label'
import { cn } from '@/shared/shadcn/lib/utils'
import { Render } from '@/shared/utilities/components'
import { useActionState, useEffect, useState } from 'react'
import isEmail from 'validator/es/lib/isEmail'

enum EmailError {
  Empty = 'Required',
  Invalid = 'Invalid email',
}

export function LoginForm({
  className,
  ...properties
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<EmailError>()
  const [passwordError, setPasswordError] = useState<string>()
  const [actionError, dispatch] = useActionState(
    getAuthActions()?.login ?? ((() => {}) as never),
    undefined,
  )

  const handleEmailInput: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    const { value } = currentTarget
    setEmailError(
      isEmail(value)
        ? undefined
        : value === ''
          ? EmailError.Empty
          : EmailError.Invalid,
    )
    setPasswordError(undefined)
    setEmail(value)
  }

  const handlePasswordInput: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    setPasswordError(undefined)
    setPassword(currentTarget.value)
  }

  const action = (formData: FormData) => {
    if (emailError || password.length === 0) return
    dispatch(formData)
  }

  useEffect(() => setPasswordError(actionError?.action), [actionError])

  return (
    <div className={cn('flex flex-col gap-6', className)} {...properties}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  onChange={handleEmailInput}
                  placeholder="john.doe@example.com"
                  value={email}
                />
                <Render if={!!emailError && emailError.length > 0}>
                  <div className="min-h-4 text-xs text-red-500">
                    {emailError}
                  </div>
                </Render>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    href="#"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  name="password"
                  onChange={handlePasswordInput}
                  type="password"
                  value={password}
                />
                <div className="min-h-4 text-xs text-red-500">
                  <Render if={!!passwordError && passwordError.length > 0}>
                    {passwordError}
                  </Render>
                </div>
              </div>
              <Button className="w-full" type="submit">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <a className="underline underline-offset-4" href="#">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
