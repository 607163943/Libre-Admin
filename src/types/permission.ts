export interface PermissionForm {
  permissionCode: string
  moduleId: number | undefined
  clientType: number | undefined
}

export interface PermissionDialogForm {
  id: number | string
  actionCode: string
  permissionDesc: string
  moduleId: number | undefined
}

export interface PermissionCodeForm {
  id: number | string
  permissionCode: string
  permissionDesc: string
  moduleId: number | undefined
}

export interface TablePermissionData {
  id: number
  permissionCode: string
  permissionDesc: string
}
