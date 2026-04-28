export interface MessageSearchForm {
  title: string
}

export interface MessageDialogForm {
  id: number | string
  title: string
  content: string
  type: number | undefined
}

export interface TableMessageData {
  id: number
  title: string
  content: string
  type: number
  createUser: string
}

export interface SendMessageDto {
  id: number
  target: number
}
