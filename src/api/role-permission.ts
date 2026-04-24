import request from '@/utils/request'
import type {
  RolePermissionSearchForm,
  TableRolePermissionData,
  RolePermissionDialogForm
} from '@/types/role-permission'
import type { Result, PageResult } from '@/types/common'

// 分页查询角色权限
export const pageQueryRolePermission = (params: RolePermissionSearchForm) => {
  return request.get<Result<PageResult<TableRolePermissionData[]>>>('/role-permission', { params })
}

// 获取角色权限信息
export const getRolePermission = (id: number) => {
  return request.get<Result<RolePermissionDialogForm>>(`/role-permission/${id}`)
}

// 获取所有角色权限
export const getAllRolePermission = () => {
  return request.get<Result<RolePermissionDialogForm[]>>('/role-permission/all')
}

// 添加角色权限
export const addRolePermission = (data: RolePermissionDialogForm) => {
  return request.post<Result<void>>('/role-permission', data)
}

// 编辑角色权限
export const editRolePermission = (data: RolePermissionDialogForm) => {
  return request.put<Result<void>>('/role-permission', data)
}

// 删除角色权限
export const deleteRolePermission = (id: number) => {
  return request.delete<Result<void>>(`/role-permission/${id}`)
}

// 批量删除角色权限
export const deleteBatchRolePermission = (ids: string) => {
  return request.delete<Result<void>>(`/role-permission`, { params: { ids: ids } })
}
