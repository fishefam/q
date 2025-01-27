import { revalidatePath } from 'next/cache'
import { redirect as redirect_ } from 'next/navigation'
import isEmail from 'validator/es/lib/isEmail'
import isStrongPassword from 'validator/es/lib/isStrongPassword'

export enum AuthErrorMessage {
  InvalidCredentials = 'Wrong email or password',
  InvalidEmail = 'Invalid email',
  WeakPassword = 'Weak password',
}

export function getAuthFormData(
  formData: FormData,
  checkStrongPassword = false,
): [AuthError, undefined] | [undefined, AuthData] {
  const data: AuthData = {
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
    redirectTo: (formData.get('redirectTo')?.toString() ?? '') as Path,
  }
  const error: AuthError = {}

  if (!isEmail(data.email)) error.email = AuthErrorMessage.InvalidEmail
  if (checkStrongPassword && !isStrongPassword(data.password))
    error.password = AuthErrorMessage.WeakPassword

  if (Object.values(error).some((value) => value.length))
    return [error, undefined]

  return [undefined, data]
}

export function redirect(redirectTo?: Path) {
  const path = redirectTo && redirectTo.length > 0 ? redirectTo : '/cms'
  revalidatePath(path, 'layout')
  redirect_(path)
}
