export interface UserRoleSearchForm {
  roleId: number | undefined
}

export interface UserRoleDialogForm {
  id: number | string
  userId: number | undefined
  roleId: number | undefined
}

export interface TableUserRoleData {
  id: number
  userName: string
  roleName: string
}
