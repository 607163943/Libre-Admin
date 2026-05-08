export interface LendReviewSearchForm {
  username?: string
  bookName?: string
  state?: number // 0-待审核, 1-通过, 2-驳回
  type?: number // 1-借阅, 2-续借
  applyStartTime?: string
  applyEndTime?: string
}

export interface TableLendReviewData {
  id: number
  userName: string
  bookName: string
  applyType: number // 1-借阅, 2-续借
  lendDays: number
  state: number // 0-待审核, 1-通过, 2-驳回
  applyTime: string
}

export interface ReviewRequestData {
  id: number
  state: number // 1-通过, 2-驳回
}

export interface LendReviewDialogForm {
  id: number | string
  userId: number | undefined
  bookId: number | undefined
  applyType: number | undefined
  lendDays: number
  state: number | undefined
  applyTime: string
}
