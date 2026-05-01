<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 类型定义
interface NotificationItem {
  id: number
  type: 'warning' | 'info'
  title: string
  content: string
  time: string
  isRead: boolean
}

// 状态变量
const activeTab = ref('all')
const currentPage = ref(1)
const total = ref(12)
const notifications = ref<NotificationItem[]>([
  {
    id: 1,
    type: 'warning',
    title: '借阅到期超期预警',
    content: '管理员您好，已有 5 名读者的图书借阅已超期，请及时处理。',
    time: '2026-04-27 13:27',
    isRead: false
  },
  {
    id: 2,
    type: 'info',
    title: '系统备份成功通知',
    content: '数据库自动备份任务已于凌晨 03:00 完成，备份文件已上传云端。',
    time: '2026-04-27 10:15',
    isRead: false
  },
  {
    id: 3,
    type: 'warning',
    title: '新权限申请提醒',
    content: '用户 "John_Doe" 申请了 [图书导出] 权限，请前往审核。',
    time: '2026-04-26 15:30',
    isRead: false
  }
])

/**
 * 获取通知列表数据
 */
const fetchNotifications = async () => {
  // TODO: 使用 axios 或 fetch 调用 API 获取列表数据
  // const res = await api.getNotifications({ page: currentPage.value, status: activeTab.value });
  // notifications.value = res.data;
  // total.value = res.total;
  console.log('Fetching notifications...')
}

/**
 * 标记全部已读
 */
const handleMarkAllRead = async () => {
  // TODO: 调用标记已读 API
  // await api.markAllAsRead();
  console.log('Marking all as read...')
}

// 初始化
onMounted(() => {
  fetchNotifications()
})
</script>
<template>
  <div class="min-h-screen bg-white flex">
    <main class="flex-1 flex flex-col">
      <!-- 内容主体 -->
      <section class="p-6 flex-1 flex flex-col h-full">
        <h2 class="text-lg font-bold mb-4 shrink-0">我的通知</h2>

        <!-- 容器卡片 -->
        <div class="bg-white rounded-md shadow-sm p-4 flex-1 flex flex-col min-h-0">
          <div class="flex justify-between items-center mb-4 shrink-0">
            <!-- 局部定制 Tabs 样式 -->
            <a-config-provider
              :theme="{
                components: {
                  Tabs: {
                    colorPrimary: '#2563eb',
                    itemSelectedColor: '#2563eb',
                    horizontalMargin: '0 0 0 0'
                  }
                }
              }"
            >
              <a-tabs v-model:activeKey="activeTab" class="flex-1">
                <a-tab-pane key="all" tab="全部通知" />
                <a-tab-pane key="unread" tab="未读" />
                <a-tab-pane key="read" tab="已读" />
              </a-tabs>
            </a-config-provider>

            <a-config-provider
              :theme="{
                token: {
                  colorPrimary: '#4b5563',
                  borderRadius: 4
                }
              }"
            >
              <a-button type="default" size="small" @click="handleMarkAllRead">
                标记全部为已读
              </a-button>
            </a-config-provider>
          </div>

          <!-- 通知列表 -->
          <div class="space-y-0 flex-1 overflow-y-auto">
            <!-- 数据加载占位：此处应有列表请求逻辑 -->
            <div
              v-for="(item, index) in notifications"
              :key="index"
              class="group"
              @click="() => $router.push({ name: 'MessageDetail', params: { id: item.id } })"
            >
              <div
                class="flex items-start py-4 px-2 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <!-- 图标 -->
                <div class="mr-4 mt-1">
                  <div
                    v-if="item.type === 'warning'"
                    class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-sm font-bold"
                  >
                    !
                  </div>
                  <div
                    v-else
                    class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-sm font-bold"
                  >
                    i
                  </div>
                </div>

                <!-- 内容 -->
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span class="font-semibold text-gray-800">{{ item.title }}</span>
                    <span class="text-xs text-gray-400">{{ item.time }}</span>
                  </div>
                  <p class="text-sm text-gray-500 leading-relaxed">
                    {{ item.content }}
                  </p>
                </div>
              </div>
              <a-divider v-if="index !== notifications.length - 1" class="my-0" />
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
:deep(.ant-tabs-nav::before) {
  border-bottom: none !important;
}
</style>
