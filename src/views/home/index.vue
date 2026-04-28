<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { BookOutlined, TeamOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import type { HomeTotalCard, LendBookTop, RecentLendTrend } from '@/types/home'
import { getHomeTotalCard, getRecentLendTrend, getTopBook } from '@/api/home'
// 全局
const loading = ref(false)
const statsLoading = ref(false)

// 调整统计图大小
const handleResize = () => {
  trendChart?.resize()
  rankChart?.resize()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  rankChart?.dispose()
  trendChart = null
  rankChart = null
})

// 统计卡片
const homeTotalCard = ref<HomeTotalCard>({
  bookCount: 12540,
  readerCount: 3210,
  todayLendCount: 85
})

// 处理卡片统计数据
const handleTotalCard = () => {
  statsLoading.value = true
  getHomeTotalCard()
    .then((res) => {
      homeTotalCard.value = res.data.data
    })
    .catch(() => {})
    .finally(() => {
      statsLoading.value = false
    })
}

onMounted(() => {
  handleTotalCard()
})

// 借阅趋势
const recentLendTrend = ref<RecentLendTrend>({
  recentLendTrendItemList: [
    // 改为最近7天
    { date: '4-01', count: 40 },
    { date: '4-02', count: 45 },
    { date: '4-03', count: 30 },
    { date: '4-04', count: 55 },
    { date: '4-05', count: 70 },
    { date: '4-06', count: 85 },
    { date: '4-07', count: 95 }
  ]
})

const trendChartRef = ref<HTMLDivElement | null>(null)
let trendChart: echarts.ECharts | null = null

const buildTrendOption = (): echarts.EChartsOption => {
  const dates = recentLendTrend.value.recentLendTrendItemList.map((m) => m.date)
  const counts = recentLendTrend.value.recentLendTrendItemList.map((m) => m.count)

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      borderWidth: 1,
      textStyle: { color: '#f1f5f9', fontSize: 12 },
      formatter: (params) => {
        const p = Array.isArray(params) ? params[0] : params
        if (p) {
          return `<b>${p.name}</b><br/>借阅次数：<span style="color:#60a5fa;font-weight:700">${p.value}</span> 次`
        } else {
          return ''
        }
      }
    },
    grid: { top: 16, right: 12, bottom: 36, left: 44, containLabel: false },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: 'bold',
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        name: '借阅次数',
        type: 'bar',
        data: counts,
        barMaxWidth: 36,
        barMinHeight: 4,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#bfdbfe' }
          ]),
          borderRadius: [6, 6, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#1d4ed8' },
              { offset: 1, color: '#3b82f6' }
            ])
          }
        },
        label: {
          show: false
        }
      }
    ]
  }
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  if (trendChart) {
    trendChart.dispose()
  }
  trendChart = echarts.init(trendChartRef.value)
  trendChart.setOption(buildTrendOption())
}

//获取借阅趋势数据
const handleRecentLendTrend = () => {
  loading.value = true
  getRecentLendTrend()
    .then(async (res) => {
      recentLendTrend.value = res.data.data

      await nextTick()
      initTrendChart()
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  handleRecentLendTrend()
})

const topBooks = ref<LendBookTop>({
  homeTopBookItemList: [
    {
      bookName: 'The Psychology of Money',
      lendCount: 842
    },
    {
      bookName: 'The Great Gatsby',
      lendCount: 615
    },
    {
      bookName: 'Atomic Habits',
      lendCount: 582
    },
    {
      bookName: 'Clean Code',
      lendCount: 433
    }
  ]
})

const rankLoading = ref(false)
const rankChartRef = ref<HTMLDivElement | null>(null)
let rankChart: echarts.ECharts | null = null

const buildRankOption = (): echarts.EChartsOption => {
  // Reverse so highest rank is at the top
  const books = [...topBooks.value.homeTopBookItemList].reverse()
  const titles = books.map((b) =>
    b.bookName.length > 18 ? b.bookName.slice(0, 16) + '…' : b.bookName
  )
  const loans = books.map((b) => b.lendCount)

  // 5种高对比度颜色（从排名最低到最高，reversed后索引0=最低排名）
  // 原始顺序（排名1→5）对应的 RGB：金橙、蓝紫、翠绿、玫红、天蓝
  const rankColors: [number, number, number][] = [
    [59, 130, 246], // 天蓝  #3b82f6 —— 第5名（reversed后索引0）
    [236, 72, 153], // 玫红  #ec4899 —— 第4名
    [16, 185, 129], // 翠绿  #10b981 —— 第3名
    [139, 92, 246], // 蓝紫  #8b5cf6 —— 第2名
    [245, 158, 11] // 金橙  #f59e0b —— 第1名（reversed后索引4）
  ]

  const coloredData = loans.map((val, idx) => {
    const [r, g, b] = rankColors[idx % rankColors.length]!
    return {
      value: val,
      itemStyle: {
        borderRadius: [0, 6, 6, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: `rgba(${r}, ${g}, ${b}, 0.2)` },
          { offset: 1, color: `rgba(${r}, ${g}, ${b}, 1)` }
        ])
      }
    }
  })

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      borderWidth: 1,
      textStyle: { color: '#f1f5f9', fontSize: 12 },
      formatter: (params) => {
        const p = Array.isArray(params) ? params[0] : params
        // get original book for full title
        if (p) {
          const originalBook = books[p.dataIndex]
          return `<b>${originalBook?.bookName}</b><br/>借阅次数：<span style="color:#60a5fa;font-weight:700">${p.value}</span>`
        } else {
          return ''
        }
      }
    },
    grid: { top: 8, right: 60, bottom: 8, left: 8, containLabel: true },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: titles,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#475569',
        fontSize: 11,
        fontWeight: 'bold',
        width: 120,
        overflow: 'truncate'
      }
    },
    series: [
      {
        name: '借阅次数',
        type: 'bar',
        data: coloredData,
        barMaxWidth: 18,
        barMinHeight: 6,
        label: {
          show: true,
          position: 'right',
          color: '#475569',
          fontSize: 11,
          fontWeight: 'bold',
          formatter: '{c}'
        }
      }
    ]
  }
}

const initRankChart = () => {
  if (!rankChartRef.value) return
  if (rankChart) {
    rankChart.dispose()
  }
  rankChart = echarts.init(rankChartRef.value)
  rankChart.setOption(buildRankOption())
}

// 获取最受欢迎书籍列表
const handleTopBook = () => {
  rankLoading.value = true
  getTopBook()
    .then(async (res) => {
      topBooks.value = res.data.data

      await nextTick()
      initRankChart()
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      rankLoading.value = false
    })
}

onMounted(() => {
  handleTopBook()
})
</script>

<template>
  <div class="space-y-4 min-h-full">
    <!-- 欢迎卡片 -->
    <section
      class="bg-white rounded-lg p-7 flex flex-col md:flex-row justify-between items-center shadow-sm relative overflow-hidden border border-gray-100"
    >
      <!-- Decorative background blob -->
      <div
        class="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"
      />

      <!-- Left: Admin info -->
      <div class="flex items-center gap-5 z-10">
        <div
          class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0"
        >
          <a-avatar :size="44" class="bg-blue-600">
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </div>
        <div>
          <h2 class="text-xl font-extrabold text-gray-800 leading-tight">
            欢迎回来，系统管理员！
            <span class="text-gray-400 font-normal text-sm ml-2">System Admin</span>
          </h2>
          <p class="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
            <a-tag color="blue" class="m-0">管理员</a-tag>
          </p>
        </div>
      </div>
    </section>

    <!-- 统计卡片 -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <!-- Card 1: Total Books -->
      <a-card
        :loading="statsLoading"
        class="rounded-lg shadow-sm border-0 overflow-hidden"
        :body-style="{ padding: '24px' }"
      >
        <div class="flex justify-between items-start">
          <div class="pl-3">
            <p class="text-sm font-medium text-gray-500">
              总图书量
              <span class="text-xs opacity-60 ml-1">Total Books</span>
            </p>
            <h3 class="text-3xl font-black text-blue-600 mt-1">
              {{ homeTotalCard.bookCount }}
            </h3>
          </div>
          <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BookOutlined class="text-2xl" />
          </div>
        </div>
      </a-card>

      <!-- Card 2: Total Readers -->
      <a-card
        :loading="statsLoading"
        class="rounded-xl shadow-sm border-0 overflow-hidden"
        :body-style="{ padding: '24px' }"
      >
        <div class="flex justify-between items-start">
          <div class="pl-3">
            <p class="text-sm font-medium text-gray-500">
              读者总数
              <span class="text-xs opacity-60 ml-1">Total Readers</span>
            </p>
            <h3 class="text-3xl font-black text-gray-800 mt-1">
              {{ homeTotalCard.readerCount }}
            </h3>
          </div>
          <div class="p-3 bg-gray-100 text-gray-600 rounded-xl">
            <TeamOutlined class="text-2xl" />
          </div>
        </div>
      </a-card>

      <!-- Card 3: Today's Borrowed -->
      <a-card
        :loading="statsLoading"
        class="rounded-xl shadow-sm border-0 overflow-hidden"
        :body-style="{ padding: '24px' }"
      >
        <div class="flex justify-between items-start">
          <div class="pl-3">
            <p class="text-sm font-medium text-gray-500">
              今日借阅
              <span class="text-xs opacity-60 ml-1">Today's Borrowed</span>
            </p>
            <h3 class="text-3xl font-black text-orange-600 mt-1">
              {{ homeTotalCard.todayLendCount }}
            </h3>
          </div>
          <div class="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <SwapOutlined class="text-2xl" />
          </div>
        </div>
      </a-card>
    </section>

    <!-- 借阅趋势 + 热门书籍 -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 借阅趋势 -->
      <a-card class="lg:col-span-7 rounded-lg shadow-sm border-0" :body-style="{ padding: '28px' }">
        <!-- Card header -->
        <div class="flex justify-between items-center mb-5">
          <div>
            <h3 class="text-base font-bold text-gray-800">
              借阅趋势
              <span class="text-sm text-gray-400 font-medium ml-2">Borrowing Trends</span>
            </h3>
          </div>
        </div>

        <!-- 借阅趋势统计图 -->
        <a-spin :spinning="loading">
          <div ref="trendChartRef" class="trend-chart" />
        </a-spin>
      </a-card>

      <!-- 热门书籍 -->
      <a-card class="lg:col-span-5 rounded-lg shadow-sm border-0" :body-style="{ padding: '28px' }">
        <!-- Card header -->
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-base font-bold text-gray-800">
            最受欢迎书籍
            <span class="text-sm text-gray-400 font-medium ml-1">Top Borrowed</span>
          </h3>
        </div>

        <!-- 热门书籍统计图 -->
        <a-spin :spinning="rankLoading">
          <div ref="rankChartRef" class="rank-chart" />
        </a-spin>
      </a-card>
    </section>
  </div>
</template>

<style scoped>
.trend-chart {
  width: 100%;
  height: 220px;
}

.rank-chart {
  width: 100%;
  height: 200px;
}
</style>
