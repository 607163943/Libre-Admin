import request from '@/utils/request'
import type {
  PermissionForm,
  TablePermissionData,
  PermissionDialogForm,
  PermissionCodeForm
} from '@/types/permission'
import type { Result, PageResult } from '@/types/common'

// 分页查询权限
export const pageQueryPermission = (params: PermissionForm) => {
  return request.get<Result<PageResult<TablePermissionData[]>>>('/permission', { params })
}

// 获取权限信息
export const getPermission = (id: number) => {
  return request.get<Result<PermissionDialogForm>>(`/permission/${id}`)
}

// 获取所有权限
export const getAllPermission = () => {
  return request.get<Result<PermissionDialogForm[]>>('/permission/all')
}

// 获取所有权限(完整权限码)
export const getAllPermissionWithCode = () => {
  return request.get<Result<PermissionCodeForm[]>>('/permission/all-code')
}

// 添加权限
export const addPermission = (data: PermissionDialogForm) => {
  return request.post<Result<void>>('/permission', data)
}

// 编辑权限
export const editPermission = (data: PermissionDialogForm) => {
  return request.put<Result<void>>('/permission', data)
}

// 删除权限
export const deletePermission = (id: number) => {
  return request.delete<Result<void>>(`/permission/${id}`)
}

// 批量删除权限
export const deleteBatchPermission = (ids: string) => {
  return request.delete<Result<void>>(`/permission`, { params: { ids: ids } })
}
