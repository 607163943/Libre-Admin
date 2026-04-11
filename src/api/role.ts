import request from '@/utils/request'
import type { RoleSearchForm, TableRoleData, RoleDialogForm } from '@/types/role'
import type { Result, PageResult } from '@/types/common'

// 分页查询角色
export const pageQueryRole = (params: RoleSearchForm) => {
  return request.get<Result<PageResult<TableRoleData[]>>>('/role', { params })
}

// 获取角色信息
export const getRole = (id: number) => {
  return request.get<Result<RoleDialogForm>>(`/role/${id}`)
}

// 获取所有角色
export const getAllRole = () => {
  return request.get<Result<RoleDialogForm[]>>('/role/all')
}

// 添加角色
export const addRole = (data: RoleDialogForm) => {
  return request.post<Result<void>>('/role', data)
}

// 编辑角色
export const editRole = (data: RoleDialogForm) => {
  return request.put<Result<void>>('/role', data)
}

// 删除角色
export const deleteRole = (id: number) => {
  return request.delete<Result<void>>(`/role/${id}`)
}

// 批量删除角色
export const deleteBatchRole = (ids: string) => {
  return request.delete<Result<void>>(`/role`, { params: { ids: ids } })
}
