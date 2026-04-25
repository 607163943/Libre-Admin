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

// 批量设置用户角色请求体
export interface AssignRolesForm {
  userId: number | string
  roleIds: number[]
}
