import request from '@/utils/request'
import type { UserRoleSearchForm, TableUserRoleData, UserRoleDialogForm } from '@/types/user-role'
import type { Result, PageResult } from '@/types/common'

// 分页查询用户角色
export const pageQueryUserRole = (params: UserRoleSearchForm) => {
  return request.get<Result<PageResult<TableUserRoleData[]>>>('/user-role', { params })
}

// 获取用户角色信息
export const getUserRole = (id: number) => {
  return request.get<Result<UserRoleDialogForm>>(`/user-role/${id}`)
}

// 获取所有用户角色
export const getAllUserRole = () => {
  return request.get<Result<UserRoleDialogForm[]>>('/user-role/all')
}

// 添加用户角色
export const addUserRole = (data: UserRoleDialogForm) => {
  return request.post<Result<void>>('/user-role', data)
}

// 编辑用户角色
export const editUserRole = (data: UserRoleDialogForm) => {
  return request.put<Result<void>>('/user-role', data)
}

// 删除用户角色
export const deleteUserRole = (id: number) => {
  return request.delete<Result<void>>(`/user-role/${id}`)
}

// 批量删除用户角色
export const deleteBatchUserRole = (ids: string) => {
  return request.delete<Result<void>>(`/user-role`, { params: { ids: ids } })
}
