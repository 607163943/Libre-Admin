import request from '@/utils/request'
import type { AuthorSearchForm, TableAuthorData, AuthorDialogForm } from '@/types/author'
import type { Result, PageResult } from '@/types/common'

// 分页查询作者
export const pageQueryAuthor = (params: AuthorSearchForm) => {
  return request.get<Result<PageResult<TableAuthorData[]>>>('/author', { params })
}

// 获取作者信息
export const getAuthor = (id: number) => {
  return request.get<Result<AuthorDialogForm>>(`/author/${id}`)
}

// 获取所有作者
export const getAllAuthor = () => {
  return request.get<Result<AuthorDialogForm[]>>('/author/all')
}

// 添加作者
export const addAuthor = (data: AuthorDialogForm) => {
  return request.post<Result<void>>('/author', data)
}

// 编辑作者
export const editAuthor = (data: AuthorDialogForm) => {
  return request.put<Result<void>>('/author', data)
}

// 删除作者
export const deleteAuthor = (id: number) => {
  return request.delete<Result<void>>(`/author/${id}`)
}

// 批量删除作者
export const deleteBatchAuthor = (ids: string) => {
  return request.delete<Result<void>>(`/author`, { params: { ids: ids } })
}
