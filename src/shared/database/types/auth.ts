export type Role = {
  description: string | undefined
  id: number
  name: string
}

export type User = {
  cms: boolean
  createdAt: Date | undefined
  firstName: string | undefined
  id: string
  lastName: string | undefined
  middleName: string | undefined
  provider: string
  roleId: number
  updatedAt: Date | undefined
}
