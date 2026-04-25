import request from '@/utils/request'
import type { ModuleForm, TableModuleData, ModuleDialogForm } from '@/types/module'
import type { Result, PageResult } from '@/types/common'

// 分页查询模块
export const pageQueryModule = (params: ModuleForm) => {
  return request.get<Result<PageResult<TableModuleData[]>>>('/module', { params })
}

// 获取模块信息
export const getModule = (id: number) => {
  return request.get<Result<ModuleDialogForm>>(`/module/${id}`)
}

// 获取所有模块
export const getAllModule = () => {
  return request.get<Result<ModuleDialogForm[]>>('/module/all')
}

// 添加模块
export const addModule = (data: ModuleDialogForm) => {
  return request.post<Result<void>>('/module', data)
}

// 编辑模块
export const editModule = (data: ModuleDialogForm) => {
  return request.put<Result<void>>('/module', data)
}

// 删除模块
export const deleteModule = (id: number) => {
  return request.delete<Result<void>>(`/module/${id}`)
}

// 批量删除模块
export const deleteBatchModule = (ids: string) => {
  return request.delete<Result<void>>(`/module`, { params: { ids: ids } })
}
