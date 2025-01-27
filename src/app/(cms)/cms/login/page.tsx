import { LoginForm } from '@/shared/shadcn/components/login-form'
import { notFound } from 'next/navigation'

export default function Page() {
  if (process.env.NEXT_PUBLIC_AUTH_PROVIDER)
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    )

  notFound()
}
