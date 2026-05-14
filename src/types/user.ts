export interface UserSearchForm {
  username: string
  name: string
}

export interface UserDialogForm {
  id: number | string
  username: string
  password: string
  name: string
  email?: string
  phone?: string
}

export interface TableUserData {
  id: number
  username: string
  name: string
  state: number
}

export interface UserInfo {
  name: string
  tokenName: string
  tokenValue: string
}

export interface UserProfileInfo {
  name: string
  email: string
  phone: string
}

export interface UserPasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UserPasswordSubmit {
  oldPassword: string
  newPassword: string
}
