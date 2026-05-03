<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ExclamationCircleOutlined, NotificationOutlined } from '@ant-design/icons-vue'
import type { MessageItem, SearchMessageForm } from '@/types/message'
import { getMessageList } from '@/api/message'

// 状态变量
// 搜索
const searchForm = ref<SearchMessageForm>({
  page: 1,
  pageSize: 10,
  type: 0
})
const currentPage = ref(1)
const total = ref(0)
const messageList = ref<MessageItem[]>([])

// --- 业务逻辑 ---
const handleSearch = () => {
  getMessageList(searchForm.value).then((res) => {
    messageList.value = res.data.data.data
    total.value = res.data.data.total
  })
}

const handleTabChange = (key: number) => {
  searchForm.value.type = key
  searchForm.value.page = 1
  handleSearch()
}

// 初始化
onMounted(() => {
  handleSearch()
})

/**
 * 标记全部已读
 */
const handleMarkAllRead = async () => {
  // TODO: 调用标记已读 API
  // await api.markAllAsRead();
  console.log('Marking all as read...')
}
</script>
<template>
  <div class="min-h-screen bg-white flex">
    <main class="flex-1 flex flex-col">
      <!-- 内容主体 -->
      <section class="p-6 flex-1 flex flex-col h-full">
        <!-- 容器卡片 -->
        <div class="bg-white rounded-md shadow-sm p-4 flex-1 flex flex-col min-h-0">
          <!-- 局部定制 Tabs 样式 -->
          <a-config-provider
            :theme="{
              components: {
                Tabs: {
                  colorPrimary: '#1677ff',
                  itemSelectedColor: '#1677ff',
                  horizontalMargin: '0 0 0 0'
                }
              }
            }"
          >
            <a-tabs v-model:activeKey="searchForm.type" class="mb-4" @change="handleTabChange">
              <a-tab-pane :key="0" tab="全部消息" />
              <a-tab-pane :key="1" tab="未读 (1)" />
              <a-tab-pane :key="2" tab="已读" />
              <template #rightExtra>
                <a-button type="link" size="small" @click="handleMarkAllRead">
                  全部标记为已读
                </a-button>
              </template>
            </a-tabs>
          </a-config-provider>

          <!-- 通知列表 -->
          <div class="space-y-0 flex-1 overflow-y-auto">
            <!-- 数据加载占位：此处应有列表请求逻辑 -->
            <div
              v-for="(item, index) in messageList"
              :key="index"
              class="group"
              @click="() => $router.push({ name: 'MessageDetail', params: { id: item.id } })"
            >
              <div
                class="flex items-start py-4 px-2 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <!-- 图标 -->
                <div class="mr-4 mt-1">
                  <ExclamationCircleOutlined v-if="item.type === 1" class="text-xl text-orange-500" />
                  <NotificationOutlined v-else class="text-xl text-blue-500" />
                </div>

                <!-- 内容 -->
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span class="font-semibold text-gray-800">
                      <span v-if="item.isRead === 0" class="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 align-middle"></span>
                      {{ item.title }}
                    </span>
                    <span class="text-xs text-gray-400">{{ item.createTime }}</span>
                  </div>
                  <p class="text-sm text-gray-500 leading-relaxed">
                    {{ item.content }}
                  </p>
                </div>
              </div>
              <a-divider v-if="index !== messageList.length - 1" class="my-0" />
            </div>
          </div>

          <!-- 分页组件局部定制 -->
          <div v-show="total > 5" class="mt-6 flex justify-end items-center gap-4 shrink-0">
            <span class="text-sm text-gray-400">共 {{ total }} 条</span>
            <a-config-provider
              :theme="{
                token: {
                  colorPrimary: '#2563eb',
                  borderRadius: 2
                }
              }"
            >
              <a-pagination
                v-model:current="currentPage"
                :total="total"
                :pageSize="5"
                size="small"
                show-less-items
                hideOnSinglePage
              />
            </a-config-provider>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* 使用 Tailwind 配合局部 ConfigProvider，基本不需要额外的 CSS */
</style>
