<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowLeftOutlined, NotificationOutlined } from '@ant-design/icons-vue'
import type { MessageDetail } from '@/types/message'
import { useRoute } from 'vue-router'
import { getMessageDetail } from '@/api/message'

// 响应式数据
const route = useRoute()

// 响应式数据
const messageData = ref<MessageDetail>({
  id: 0,
  title: '',
  content: '',
  createTime: '',
  type: 0
})

const handleGetMessageDetail = async (id: number) => {
  getMessageDetail(id).then((res) => {
    messageData.value = res.data.data
  })
}

// 初始化请求数据
onMounted(() => {
  handleGetMessageDetail(Number(route.params.id))
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
        {{ messageData.title || '加载中...' }}
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
              <div class="text-sm text-gray-500 mt-1">Libre 数字化图书馆流通部</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-400 uppercase tracking-wider">发送时间</div>
            <div class="text-sm text-gray-600 mt-1 font-mono">{{ messageData.createTime }}</div>
          </div>
        </div>
      </div>

      <!-- 通知正文内容 -->
      <div class="prose max-w-none text-gray-700 leading-relaxed min-h-[200px]">
        <p class="font-medium mb-4">通知内容：</p>
        <div class="mb-4" v-html="messageData.content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
