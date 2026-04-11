import request from '@/utils/request'
import type {
  PublisherSearchForm,
  TablePublisherData,
  PublisherDialogForm
} from '@/types/publisher'
import type { Result, PageResult } from '@/types/common'

// 分页查询出版社
export const pageQueryPublisher = (params: PublisherSearchForm) => {
  return request.get<Result<PageResult<TablePublisherData[]>>>('/publisher', { params })
}

// 获取出版社信息
export const getPublisher = (id: number) => {
  return request.get<Result<PublisherDialogForm>>(`/publisher/${id}`)
}

// 获取所有出版社
export const getAllPublisher = () => {
  return request.get<Result<PublisherDialogForm[]>>('/publisher/all')
}

// 添加出版社
export const addPublisher = (data: PublisherDialogForm) => {
  return request.post<Result<void>>('/publisher', data)
}

// 编辑出版社
export const editPublisher = (data: PublisherDialogForm) => {
  return request.put<Result<void>>('/publisher', data)
}

// 删除出版社
export const deletePublisher = (id: number) => {
  return request.delete<Result<void>>(`/publisher/${id}`)
}

// 批量删除出版社
export const deleteBatchPublisher = (ids: string) => {
  return request.delete<Result<void>>(`/publisher`, { params: { ids: ids } })
}
