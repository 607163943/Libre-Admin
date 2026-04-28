<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { useLayoutStore } from '@/stores/modules/layout'
import { useUserStore } from '@/stores/modules/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { logout } from '@/api/login'

defineOptions({
  name: 'LayoutContainer'
})

const collapsed = ref<boolean>(false)
const drawerOpen = ref<boolean>(false)

// 响应式断点：页面宽度 < 720px 视为移动端
const windowWidth = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 1280)

const layoutStore = useLayoutStore()
const { isMobile } = storeToRefs(layoutStore)
const { setIsMobile } = layoutStore

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const router = useRouter()

// 用户显示名称
const displayName = computed(() => userInfo.value?.name ?? '用户')

function onResize() {
  windowWidth.value = window.innerWidth
  if (!isMobile.value) {
    drawerOpen.value = false
  }
  setIsMobile(windowWidth.value < 720)
}

onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

// 顶部按钮点击：移动端切换抽屉，桌面端切换折叠
function handleToggle() {
  if (isMobile.value) {
    drawerOpen.value = !drawerOpen.value
  } else {
    collapsed.value = !collapsed.value
  }
}

// 退出登录
async function handleLogout() {
  try {
    await logout()
  } catch {
    // 即使接口失败也继续清除本地状态
  } finally {
    userStore.setUserInfo(null)
    message.success('退出登录成功')
    router.push('/login')
  }
}

// Dropdown 菜单项点击
function onMenuClick({ key }: { key: string }) {
  if (key === 'logout') {
    handleLogout()
  }
}
</script>

<template>
  <a-layout class="min-h-dvh">
    <!-- 桌面端侧边栏（≥720px 显示） -->
    <a-layout-sider
      v-if="!isMobile"
      v-model:collapsed="collapsed"
      :trigger="null"
      theme="dark"
      collapsible
    >
      <slot name="menu-sidebar" :handleToggle="handleToggle"></slot>
    </a-layout-sider>

    <!-- 移动端抽屉（<720px 显示） -->
    <a-drawer
      v-if="isMobile"
      v-model:open="drawerOpen"
      placement="left"
      :closable="false"
      :body-style="{ padding: 0, background: '#001529' }"
      :width="200"
    >
      <slot name="menu-sidebar" :handleToggle="handleToggle"></slot>
    </a-drawer>

    <a-layout class="min-h-dvh">
      <a-layout-header class="flex items-center justify-between !px-0" style="background: #fff">
        <!-- 左侧：折叠/展开图标 -->
        <div>
          <menu-unfold-outlined
            v-if="isMobile || collapsed"
            class="trigger"
            @click="handleToggle"
          />
          <menu-fold-outlined v-else class="trigger" @click="handleToggle" />
        </div>

        <!-- 右侧：用户头像 + 用户名下拉菜单 -->
        <div class="flex items-center pr-6">
          <a-dropdown trigger="hover" placement="bottomRight">
            <div
              class="flex items-center gap-2 cursor-pointer select-none hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors duration-200"
            >
              <a-avatar :size="34" class="!bg-blue-500 flex-shrink-0">
                <template #icon>
                  <user-outlined />
                </template>
              </a-avatar>
              <span class="text-gray-700 font-medium text-sm hidden sm:inline-block">{{
                displayName
              }}</span>
            </div>
            <template #overlay>
              <a-menu @click="onMenuClick">
                <a-menu-item
                  key="logout"
                  class="flex items-center gap-2 !text-red-500 hover:!bg-red-50"
                >
                  <logout-outlined />
                  <span>退出登录</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-layout-content style="margin: 0 16px" class="flex flex-col">
        <slot name="breadcrumb"></slot>
        <div class="flex-auto">
          <slot name="content"></slot>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        <slot name="footer"></slot>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style>
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}
</style>
