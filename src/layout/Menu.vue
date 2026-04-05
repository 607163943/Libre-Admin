<script setup lang="ts">
import {
  BookOutlined,
  UserOutlined,
  BankOutlined,
  SwapOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined
} from '@ant-design/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/modules/layout'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'LayoutMenu'
})

const { handleToggle } = defineProps<{ handleToggle: () => void }>()

const selectedKeys = ref<string[]>(['1'])

// 处理菜单跳转
const layoutStore = useLayoutStore()
const { isMobile } = storeToRefs(layoutStore)
const router = useRouter()
const handleSelect = ({ item: { keyName } }: { item: { keyName: string } }) => {
  router.push({ name: keyName })
  if (isMobile.value) {
    handleToggle()
  }
}

// 菜单项数组
const menuItems = [
  {
    key: '1',
    keyName: 'Book',
    icon: BookOutlined,
    label: '图书管理'
  },
  {
    key: '2',
    keyName: 'Author',
    icon: UserOutlined,
    label: '作者管理'
  },
  {
    key: '3',
    keyName: 'Publisher',
    icon: BankOutlined,
    label: '出版社管理'
  },
  {
    key: '4',
    keyName: 'Lend',
    icon: SwapOutlined,
    label: '借阅管理'
  },
  {
    key: '5',
    keyName: 'User',
    icon: UserOutlined,
    label: '用户管理'
  },
  {
    key: '6',
    keyName: 'Role',
    icon: SafetyCertificateOutlined,
    label: '角色管理'
  },
  {
    key: '7',
    keyName: 'UserRole',
    icon: SolutionOutlined,
    label: '用户角色管理'
  }
]
</script>
<template>
  <div class="logo" />
  <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" @click="handleSelect">
    <a-menu-item v-for="item in menuItems" :key="item.key" :keyName="item.keyName">
      <component :is="item.icon" />
      <span>{{ item.label }}</span>
    </a-menu-item>
  </a-menu>
</template>

<style>
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}
</style>
