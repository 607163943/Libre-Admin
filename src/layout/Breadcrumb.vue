<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeOutlined, RightOutlined } from '@ant-design/icons-vue'

defineOptions({
  name: 'LayoutBreadcrumb'
})

const route = useRoute()
const router = useRouter()

// 路由名到中文标签的映射（与 Menu.vue 保持一致）
const routeNameMap: Record<string, string> = {
  Home: '首页',
  Book: '图书管理',
  Author: '作者管理',
  Publisher: '出版社管理',
  Lend: '借阅管理',
  Message: '消息管理',
  MessageEdit: '消息编辑',
  User: '用户管理',
  MessageList: '我的消息',
  MessageDetail: '消息详情'
}

// 路由父子关系映射（用于构建多级面包屑）
const routeParentMap: Record<string, string> = {
  MessageEdit: 'Message',
  MessageDetail: 'MessageList'
}

interface BreadcrumbItem {
  name: string
  label: string
  isLast: boolean
}

// 根据当前路由动态生成面包屑列表
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const currentName = route.name as string
  const items: BreadcrumbItem[] = []

  // 首页始终作为第一项
  items.push({
    name: 'Home',
    label: routeNameMap['Home'] || '首页',
    isLast: currentName === 'Home'
  })

  // 非首页时处理当前页及可能的父级页面
  if (currentName && currentName !== 'Home') {
    // 收集所有父级页面
    const parents: BreadcrumbItem[] = []
    let pName = routeParentMap[currentName]
    while (pName) {
      if (routeNameMap[pName]) {
        parents.unshift({
          name: pName,
          label: routeNameMap[pName]!,
          isLast: false
        })
      }
      pName = routeParentMap[pName]
    }
    items.push(...parents)

    // 添加当前页
    if (routeNameMap[currentName]) {
      items.push({
        name: currentName,
        label: routeNameMap[currentName],
        isLast: true
      })
    }
  }

  return items
})

const navigateTo = (name: string, isLast: boolean) => {
  if (!isLast) {
    router.push({ name })
  }
}
</script>

<template>
  <!-- 整体容器：使用 a-config-provider 定制 Breadcrumb 组件令牌 -->
  <a-config-provider
    :theme="{
      components: {
        Breadcrumb: {
          itemColor: '#6b7280',
          lastItemColor: '#111827',
          linkColor: '#6b7280',
          linkHoverColor: '#1677ff',
          separatorColor: '#d1d5db',
          fontSize: 13
        }
      }
    }"
  >
    <div class="flex items-center flex-nowrap whitespace-nowrap px-1 py-2 my-2 overflow-hidden">
      <transition name="breadcrumb" mode="out-in">
        <a-breadcrumb :key="String(route.name)" class="select-none flex-nowrap whitespace-nowrap">
          <!-- 自定义分隔符 -->
          <template #separator>
            <a-config-provider
              :theme="{
                components: {
                  Breadcrumb: {
                    separatorColor: '#d1d5db',
                    separatorMargin: 8
                  }
                }
              }"
            >
              <RightOutlined class="text-gray-300 text-[10px]" />
            </a-config-provider>
          </template>

          <a-breadcrumb-item
            v-for="item in breadcrumbs"
            :key="item.name"
            class="!inline-flex !items-center !whitespace-nowrap"
          >
            <!-- 非末级：可点击链接，局部定制 hover 色 -->
            <template v-if="!item.isLast">
              <a-config-provider
                :theme="{
                  components: {
                    Breadcrumb: {
                      linkColor: '#6b7280',
                      linkHoverColor: '#1677ff'
                    }
                  }
                }"
              >
                <span
                  class="inline-flex items-center gap-1 cursor-pointer rounded px-1.5 py-0.5 text-gray-500 transition-all duration-200 hover:text-blue-500 hover:bg-blue-50"
                  @click="navigateTo(item.name, item.isLast)"
                >
                  <HomeOutlined v-if="item.name === 'Home'" class="text-[13px]" />
                  {{ item.label }}
                </span>
              </a-config-provider>
            </template>

            <!-- 末级：当前页，不可点击，局部加粗高亮 -->
            <template v-else>
              <a-config-provider
                :theme="{
                  components: {
                    Breadcrumb: {
                      lastItemColor: '#111827'
                    }
                  }
                }"
              >
                <span
                  class="inline-flex items-center gap-1 font-semibold text-gray-900 rounded px-1.5 py-0.5 bg-gray-100"
                >
                  <HomeOutlined v-if="item.name === 'Home'" class="text-[13px]" />
                  {{ item.label }}
                </span>
              </a-config-provider>
            </template>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </transition>
    </div>
  </a-config-provider>
</template>

<style scoped>
/* 确保 ant-design 面包屑内部列表也是单行 */
:deep(.ant-breadcrumb) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}

:deep(.ant-breadcrumb ol) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}

:deep(.ant-breadcrumb-separator) {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

/* =====================
   面包屑切换动画（out-in 模式）
   离开：向左淡出；进入：从右滑入淡入
   ===================== */
.breadcrumb-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.breadcrumb-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.breadcrumb-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.breadcrumb-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.breadcrumb-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
