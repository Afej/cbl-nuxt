export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  _id: string
  email: string
  name: string
  role: UserRole
}
