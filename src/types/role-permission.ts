export interface RolePermissionSearchForm {
  roleId: number | undefined
  permissionId: number | undefined
}

export interface RolePermissionDialogForm {
  id: number | string
  roleId: number | undefined
  permissionId: number | undefined
}

export interface TableRolePermissionData {
  id: number
  roleName: string
  permissionCode: string
  permissionDesc: string
}
