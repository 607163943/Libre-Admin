export interface PermissionForm {
  permissionCode: string
}

export interface PermissionDialogForm {
  id: number | string
  permissionCode: string
  permissionDesc: string
}

export interface TablePermissionData {
  id: number
  permissionCode: string
  permissionDesc: string
}
