<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { ArrowLeftOutlined, NotificationOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// 定义接口
interface OverdueItem {
  readerName: string
  readerId: string
  bookTitle: string
}

interface MessageDetail {
  title: string
  sourceModule: string
  sendTime: string
  greeting: string
  targetList: OverdueItem[]
  hasMore: boolean
}

// 响应式数据
const messageDetail = reactive<MessageDetail>({
  title: '',
  sourceModule: '',
  sendTime: '',
  greeting: '',
  targetList: [],
  hasMore: false
})

// 获取通知详情数据
const fetchMessageDetail = async () => {
  // 请求占位：这里通常是 axios.get('/api/messages/detail', { params: { id: ... } })
  // [Placeholder for API Request]

  // 模拟数据填充
  setTimeout(() => {
    messageDetail.title = '借阅到期超期预警'
    messageDetail.sourceModule = 'Libre 借阅管理模块'
    messageDetail.sendTime = '2026-04-27 13:27:31'
    messageDetail.greeting = '管理员您好，系统检测到以下读者的借阅已超过 30 天期限，请及时核查：'
    messageDetail.targetList = [
      { readerName: '张三', readerId: '10086', bookTitle: '三体' },
      { readerName: '李四', readerId: '10087', bookTitle: '算法导论' }
    ]
    messageDetail.hasMore = true
  }, 300)
}

// 操作处理
const handleProcess = () => {
  // 请求占位：跳转或执行处理逻辑
  // [Placeholder for Processing Logic]
  message.success('正在跳转至借阅管理页面...')
}

const handleRemindLater = () => {
  // 请求占位：设置提醒定时器
  // [Placeholder for Reminder API]
  message.info('已设为 1 小时后提醒')
}

const handleDelete = () => {
  // 请求占位：执行删除操作
  // [Placeholder for Delete API]
  message.warning('通知已标记为待删除')
}

onMounted(() => {
  fetchMessageDetail()
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- 主要内容区 -->
    <div class="bg-white rounded-sm shadow-s p-8 min-h-[600px]">
      <!-- 返回按钮 -->
      <div class="mb-8">
        <a-config-provider
          :theme="{
            token: {
              colorPrimary: '#4b5563',
              borderRadius: 2
            }
          }"
        >
          <a-button
            type="link"
            class="px-0 flex items-center text-gray-600 hover:text-blue-600"
            @click="() => $router.back()"
          >
            <template #icon><arrow-left-outlined /></template>
            返回通知列表
          </a-button>
        </a-config-provider>
      </div>

      <!-- 标题 -->
      <h1 class="text-2xl font-bold text-gray-800 mb-4">
        {{ messageDetail.title || '加载中...' }}
      </h1>

      <a-divider class="my-6" />

      <!-- 发送者信息卡片 -->
      <div class="bg-gray-50 border border-gray-100 rounded-md p-4 mb-8">
        <div class="flex justify-between items-start">
          <div class="flex space-x-4">
            <div
              class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl"
            >
              <notification-outlined />
            </div>
            <div>
              <div class="text-base font-semibold text-gray-800">系统自动触发</div>
              <div class="text-sm text-gray-500 mt-1">来自：{{ messageDetail.sourceModule }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-400 uppercase tracking-wider">发送时间</div>
            <div class="text-sm text-gray-600 mt-1 font-mono">{{ messageDetail.sendTime }}</div>
          </div>
        </div>
      </div>

      <!-- 通知正文内容 -->
      <div class="prose max-w-none text-gray-700 leading-relaxed min-h-[200px]">
        <p class="font-medium mb-4">通知内容：</p>
        <p class="mb-4">{{ messageDetail.greeting }}</p>
        <ul class="list-decimal pl-5 space-y-2">
          <li v-for="(item, index) in messageDetail.targetList" :key="index">
            <span class="font-medium">{{ item.readerName }}</span>
            (读者 ID: {{ item.readerId }}) -
            <span class="italic text-blue-600">《{{ item.bookTitle }}》</span>
          </li>
        </ul>
        <p v-if="messageDetail.hasMore" class="mt-2 text-gray-400 italic">...</p>
      </div>

      <a-divider class="my-8" />

      <!-- 操作按钮栏 -->
      <div class="flex space-x-4">
        <!-- 使用局部 ConfigProvider 定制按钮样式 -->
        <a-config-provider
          :theme="{
            token: {
              colorPrimary: '#2563eb',
              borderRadius: 4
            },
            components: {
              Button: {
                controlHeight: 40,
                paddingContentHorizontal: 24
              }
            }
          }"
        >
          <a-button type="primary" @click="handleProcess">前往处理</a-button>
        </a-config-provider>

        <a-config-provider
          :theme="{
            token: {
              colorPrimary: '#d97706',
              borderRadius: 4
            }
          }"
        >
          <a-button @click="handleRemindLater">稍后提醒</a-button>
        </a-config-provider>

        <a-config-provider
          :theme="{
            token: {
              colorError: '#dc2626',
              borderRadius: 4
            },
            components: {
              Button: {
                colorBorder: '#dc2626',
                colorText: '#dc2626'
              }
            }
          }"
        >
          <a-button danger @click="handleDelete">删除该通知</a-button>
        </a-config-provider>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 使用 Tailwind CSS，此处无需大量原生 CSS */
:deep(.ant-layout-header) {
  padding-inline: 24px;
  line-height: 56px;
}

/* 针对 prose 的一些列表微调 */
.prose ul {
  list-style-type: decimal;
}
</style>
