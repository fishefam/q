import { revalidatePath } from 'next/cache'
import { redirect as redirect_ } from 'next/navigation'
import isEmail from 'validator/es/lib/isEmail'
import isStrongPassword from 'validator/es/lib/isStrongPassword'

export enum ErrorMessage {
  InvalidCredentials = 'Wrong email or password',
  InvalidEmail = 'Invalid email',
  WeakPassword = 'Weak password',
}

export type AuthData = {
  redirectTo: Path | undefined
} & Record<'email' | 'password', string | undefined>
export type AuthError<T = unknown> = {
  [key in keyof AuthData]?: ErrorMessage
} & { action?: T }

export function getAuthFormData(
  formData: FormData,
  options?: { checkPassword?: boolean },
): [AuthError, undefined] | [undefined, AuthData] {
  const data: AuthData = {
    email: getFormData(formData, 'email'),
    password: getFormData(formData, 'password'),
    redirectTo: getFormData(formData, 'redirectTo'),
  }
  const error: AuthError = {}

  if (data.email && !isEmail(data.email))
    error.email = ErrorMessage.InvalidEmail

  if (
    options?.checkPassword &&
    data.password &&
    !isStrongPassword(data.password)
  )
    error.password = ErrorMessage.WeakPassword

  if (Object.values(error).some(Boolean)) return [error, undefined]

  return [undefined, data]
}

export function redirect(path = '/cms') {
  revalidatePath(path, 'layout')
  redirect_(path)
}

function getFormData<T extends 'redirectTo' | string>(
  formData: FormData,
  key: T,
) {
  return formData.get(key)?.toString() as
    | (T extends 'redirectTo' ? Path : string)
    | undefined
}
