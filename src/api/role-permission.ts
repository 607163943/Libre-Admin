import request from '@/utils/request'
import type { AssignRolePermissionsForm } from '@/types/role-permission'
import type { Result } from '@/types/common'

// 查询指定角色已拥有的权限 id 列表
export const getPermissionsByRoleId = (roleId: number | string) => {
  return request.get<Result<number[]>>(`/role-permission/role/${roleId}`)
}

// 批量设置指定角色的权限（传入 roleId 及 permissionId 集合）
export const assignRolePermissions = (data: AssignRolePermissionsForm) => {
  return request.post<Result<void>>('/role-permission/assign', data)
}
