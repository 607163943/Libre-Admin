import request from '@/utils/request'
import type { Result } from '@/types/common'
import type { HomeTotalCard, RecentLendTrend, LendBookTop } from '@/types/home'

// 获取首页卡片统计数据
export const getHomeTotalCard = () => {
  return request.get<Result<HomeTotalCard>>('/home/total/card')
}

// 获取首页借阅趋势
export const getRecentLendTrend = () => {
  return request.get<Result<RecentLendTrend>>('/home/recent/lend-trend')
}

// 获取首页最受欢迎书籍列表
export const getTopBook = () => {
  return request.get<Result<LendBookTop>>('/home/top/book')
}
