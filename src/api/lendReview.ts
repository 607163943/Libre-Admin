import request from '@/utils/request'
import type { LendReviewSearchForm, TableLendReviewData, ReviewRequestData, LendReviewDialogForm } from '@/types/lendReview'
import type { Result, PageResult } from '@/types/common'

// 分页查询借阅审核
export const pageQueryLendReview = (params: LendReviewSearchForm) => {
  return request.get<Result<PageResult<TableLendReviewData[]>>>('/lend-review', { params })
}

// 处理借阅审核
export const reviewLend = (data: ReviewRequestData) => {
  return request.put<Result<void>>('/lend-review/approve', data)
}

// 获取借阅审核信息
export const getLendReview = (id: number) => {
  return request.get<Result<LendReviewDialogForm>>(`/lend-review/${id}`)
}

// 添加借阅审核
export const addLendReview = (data: LendReviewDialogForm) => {
  return request.post<Result<void>>('/lend-review', data)
}

// 编辑借阅审核
export const editLendReview = (data: LendReviewDialogForm) => {
  return request.put<Result<void>>('/lend-review', data)
}

// 删除借阅审核
export const deleteLendReview = (id: number) => {
  return request.delete<Result<void>>(`/lend-review/${id}`)
}

// 批量删除借阅审核
export const deleteBatchLendReview = (ids: string) => {
  return request.delete<Result<void>>(`/lend-review`, { params: { ids: ids } })
}
