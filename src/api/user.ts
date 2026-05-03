import request from '@/utils/request'
import type { UserSearchForm, TableUserData, UserDialogForm } from '@/types/user'
import type { Result, PageResult } from '@/types/common'

// 分页查询用户
export const pageQueryUser = (params: UserSearchForm) => {
  return request.get<Result<PageResult<TableUserData[]>>>('/user', { params })
}

// 获取用户信息
export const getUser = (id: number) => {
  return request.get<Result<UserDialogForm>>(`/user/${id}`)
}

// 获取所有用户
export const getAllUser = () => {
  return request.get<Result<UserDialogForm[]>>('/user/all')
}

// 添加用户
export const addUser = (data: UserDialogForm) => {
  return request.post<Result<void>>('/user', data)
}

// 编辑用户
export const editUser = (data: UserDialogForm) => {
  return request.put<Result<void>>('/user', data)
}

// 修改用户状态
export const changeUserState = (id: number, state: number) => {
  return request.patch<Result<void>>(`/user/${id}/state/${state}`)
}

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete<Result<void>>(`/user/${id}`)
}

// 批量删除用户
export const deleteBatchUser = (ids: string) => {
  return request.delete<Result<void>>(`/user`, { params: { ids: ids } })
}
