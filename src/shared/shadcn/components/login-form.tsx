'use client'

import type { ChangeEventHandler } from 'react'

import { getActions } from '@/features/auth'
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
import { useState } from 'react'
import isEmail from 'validator/es/lib/isEmail'
import isStrongPassword from 'validator/es/lib/isStrongPassword'

export function LoginForm({
  className,
  ...properties
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [_emailError, setEmailError] = useState<string>()
  const [_passwordError, setPasswordError] = useState<string>()

  const handleEmailInput: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    const { value } = currentTarget
    if (!isEmail(value)) setEmailError('Invalid Email')
    if (isEmail(value)) setEmailError('')
    setEmail(value)
  }

  const handlePasswordInput: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    const { value } = currentTarget
    if (!isStrongPassword(value)) setPasswordError('Weak Password')
    if (isStrongPassword(value)) setPasswordError('')
    setPassword(value)
  }

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
          <form action={getActions()?.login}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  onChange={handleEmailInput}
                  placeholder="m@example.com"
                  value={email}
                />
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
              </div>
              <Button className="w-full" type="submit">
                Login
              </Button>
              <Button className="w-full" variant="outline">
                Login with Google
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
