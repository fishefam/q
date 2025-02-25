import { Button } from '@/shared/shadcn/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn/components/ui/card'
import { Input } from '@/shared/shadcn/components/ui/input'
import { Label } from '@/shared/shadcn/components/ui/label'
import { cn } from '@/shared/shadcn/lib/utils'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="m@example.com" required type="email" />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a className="ml-auto inline-block text-sm underline-offset-4 hover:underline" href="#">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" required type="password" />
              </div>
              <div className="flex flex-col gap-3">
                <Button className="w-full" type="submit">
                  Login
                </Button>
                <Button className="w-full" variant="outline">
                  Login with Google
                </Button>
              </div>
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
