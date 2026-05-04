export interface BookSearchForm {
  bookName: string
  authorId: number | undefined
  publisherId: number | undefined
  isbn: string
  language: string
  publishStartTime?: string
  publishEndTime?: string
}

export interface BookDialogForm {
  id: number | string
  bookName: string
  authorId: number | undefined
  publisherId: number | undefined
  coverUrl: string
  isbn: string
  introduction: string
  language: string
  publishDate: string | undefined
  price: number
  number: number
}

export interface TableBookData {
  id: number
  bookName: string
  authorId: number
  authorName: string
  publisherId: number
  publisherName: string
  isbn: string
  price: number
  number: number
  availableNumber: number
}
