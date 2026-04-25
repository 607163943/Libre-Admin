import request from '@/utils/request'
import type { AssignRolesForm } from '@/types/user-role'
import type { Result } from '@/types/common'
import type { RoleItem } from '@/types/role'

// 批量设置指定用户的角色（传入 userId 及 roleId 集合）
export const assignUserRoles = (data: AssignRolesForm) => {
  return request.post<Result<void>>('/user-role/assign', data)
}

// 查询指定用户已拥有的角色列表
export const getRolesByUserId = (userId: number | string) => {
  return request.get<Result<RoleItem[]>>(`/user-role/user/${userId}`)
}
