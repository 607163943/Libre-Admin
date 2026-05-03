import request from '@/utils/request'
import type {
  MessageSearchForm,
  TableMessageData,
  MessageDialogForm,
  SendMessageDto,
  MessageItem,
  MessageDetail,
  SearchMessageForm
} from '@/types/message'
import type { Result, PageResult } from '@/types/common'

// 分页查询消息
export const pageQueryMessage = (params: MessageSearchForm) => {
  return request.get<Result<PageResult<TableMessageData[]>>>('/message', { params })
}

// 获取消息信息
export const getMessage = (id: number) => {
  return request.get<Result<MessageDialogForm>>(`/message/${id}`)
}

// 获取所有消息
export const getAllMessage = () => {
  return request.get<Result<MessageDialogForm[]>>('/message/all')
}

// 添加消息
export const addMessage = (data: MessageDialogForm) => {
  return request.post<Result<void>>('/message', data)
}

// 编辑消息
export const editMessage = (data: MessageDialogForm) => {
  return request.put<Result<void>>('/message', data)
}

// 删除消息
export const deleteMessage = (id: number) => {
  return request.delete<Result<void>>(`/message/${id}`)
}

// 批量删除消息
export const deleteBatchMessage = (ids: string) => {
  return request.delete<Result<void>>(`/message`, { params: { ids: ids } })
}

// 发送消息
export const sendMessage = (data: SendMessageDto) => {
  return request.post<Result<void>>('/message/send', data)
}

// 获取消息列表
export const getMessageList = (form: SearchMessageForm) => {
  return request.get<Result<PageResult<MessageItem[]>>>('/message/user', {
    params: form
  })
}

// 查看消息
export const getMessageDetail = (id: number) => {
  return request.get<Result<MessageDetail>>(`/message/user/${id}`)
}

// 统计未读取消息数量
export const getUnreadCount = () => {
  return request.get<Result<number>>(`/message/user/unread`)
}

// 标记全部已读
export const setMessageAllRead = () => {
  return request.put<Result<void>>(`/message/user/read/all`)
}
