export interface HomeTotalCard {
  bookCount: number
  readerCount: number
  todayLendCount: number
}

export interface LendBookTop {
  homeTopBookItemList: LendBookTopItem[]
}

export interface LendBookTopItem {
  bookName: string
  lendCount: number
}

export interface RecentLendTrendItem {
  date: string
  count: number
}

export interface RecentLendTrend {
  recentLendTrendItemList: RecentLendTrendItem[]
}
