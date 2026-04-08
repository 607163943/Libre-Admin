import request from '@/utils/request'
import type { LoginForm } from '@/types/login'
import type { UserInfo } from '@/types/user'
import type { Result } from '@/types/common'

// 用户登录
export const login = (data: LoginForm) => {
  return request.post<Result<UserInfo>>('/login', data)
}

// 用户登出
export const logout = () => {
  return request.post<Result<void>>('/logout')
}
