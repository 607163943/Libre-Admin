export interface LendSearchForm {
  userId: number | undefined
  bookId: number | undefined
  state: number | undefined
}

export interface LendDialogForm {
  id: number | string
  userId: number | undefined
  bookId: number | undefined
  state: number | undefined
  renewCount: number
  lendTime: string
  returnTime: string
}

export interface TableLendData {
  id: number
  username: string
  bookName: string
  renewCount: number
  lendTime: string
  dueTime: string
  returnTime: string
  status: number
}
