import request from '@/utils/request'
import type { LendSearchForm, TableLendData, LendDialogForm } from '@/types/lend'
import type { Result, PageResult } from '@/types/common'

// 分页查询借阅
export const pageQueryLend = (params: LendSearchForm) => {
  return request.get<Result<PageResult<TableLendData[]>>>('/lend', { params })
}

// 获取借阅信息
export const getLend = (id: number) => {
  return request.get<Result<LendDialogForm>>(`/lend/${id}`)
}

// 获取所有借阅
export const getAllLend = () => {
  return request.get<Result<LendDialogForm[]>>('/lend/all')
}

// 添加借阅
export const addLend = (data: LendDialogForm) => {
  return request.post<Result<void>>('/lend', data)
}

// 编辑借阅
export const editLend = (data: LendDialogForm) => {
  return request.put<Result<void>>('/lend', data)
}

// 删除借阅
export const deleteLend = (id: number) => {
  return request.delete<Result<void>>(`/lend/${id}`)
}
