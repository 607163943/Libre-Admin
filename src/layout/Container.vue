<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import { useLayoutStore } from '@/stores/modules/layout'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'LayoutContainer'
})

const collapsed = ref<boolean>(false)
const drawerOpen = ref<boolean>(false)

// 响应式断点：页面宽度 < 640px 视为移动端
const windowWidth = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 1280)

const layoutStore = useLayoutStore()
const { isMobile } = storeToRefs(layoutStore)
const { setIsMobile } = layoutStore

function onResize() {
  windowWidth.value = window.innerWidth
  // 切换到桌面端时自动关闭抽屉
  if (!isMobile.value) {
    drawerOpen.value = false
  }
  setIsMobile(windowWidth.value < 670)
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
</script>
<template>
  <a-layout class="min-h-dvh">
    <!-- 桌面端侧边栏（≥640px 显示） -->
    <a-layout-sider
      v-if="!isMobile"
      v-model:collapsed="collapsed"
      :trigger="null"
      theme="dark"
      collapsible
    >
      <slot name="menu-sidebar" :handleToggle="handleToggle"></slot>
    </a-layout-sider>

    <!-- 移动端抽屉（<640px 显示） -->
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
      <a-layout-header style="background: #fff; padding: 0">
        <!-- 移动端：显示展开图标作为抽屉开关；桌面端：根据折叠状态切换图标 -->
        <menu-unfold-outlined v-if="isMobile || collapsed" class="trigger" @click="handleToggle" />
        <menu-fold-outlined v-else class="trigger" @click="handleToggle" />
      </a-layout-header>
      <a-layout-content style="margin: 0 16px" class="flex flex-col">
        <slot name="breadcrumb"></slot>
        <div :style="{ padding: '24px', background: '#fff' }" class="flex-auto">
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
