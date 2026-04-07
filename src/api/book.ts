import request from '@/utils/request'
import type { BookSearchForm, TableBookData, BookDialogForm } from '@/types/book'
import type { Result, PageResult } from '@/types/common'

// 分页查询图书
export const pageQueryBook = (params: BookSearchForm) => {
  return request.get<Result<PageResult<TableBookData[]>>>('/book', { params })
}

// 获取图书信息
export const getBook = (id: number) => {
  return request.get<Result<BookDialogForm>>(`/book/${id}`)
}

// 添加图书
export const addBook = (data: BookDialogForm) => {
  return request.post<Result<void>>('/book', data)
}

// 编辑图书
export const editBook = (data: BookDialogForm) => {
  return request.put<Result<void>>('/book', data)
}

// 删除图书
export const deleteBook = (id: number) => {
  return request.delete<Result<void>>(`/book/${id}`)
}
