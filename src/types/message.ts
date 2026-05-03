import type { PageParams } from './common'

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

export interface SearchMessageForm extends PageParams {
  type: number
}

export interface MessageItem {
  id: number
  content: string
  title: string
  createTime: string
  isRead: number
  type: number
}

export interface MessageDetail {
  id: number
  content: string
  title: string
  createTime: string
  type: number
}
