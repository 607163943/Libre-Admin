import request from '@/utils/request'
import type { RoleDialogForm } from '@/types/role'
import type { Result } from '@/types/common'

// 获取所有角色
export const getAllRole = () => {
  return request.get<Result<RoleDialogForm[]>>('/role/all')
}
