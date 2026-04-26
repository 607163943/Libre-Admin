<script setup lang="ts">
import {
  BookOutlined,
  UserOutlined,
  BankOutlined,
  SwapOutlined,
  SafetyCertificateOutlined,
  HomeOutlined,
  TeamOutlined,
  UnorderedListOutlined
} from '@ant-design/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/modules/layout'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'LayoutMenu'
})

const { handleToggle } = defineProps<{ handleToggle: () => void }>()
const route = useRoute()
const selectedKeys = ref<string[]>([route.path])

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
    key: '/',
    keyName: 'Home',
    icon: HomeOutlined,
    label: '首页'
  },
  {
    key: '/book',
    keyName: 'Book',
    icon: BookOutlined,
    label: '图书管理'
  },
  {
    key: '/author',
    keyName: 'Author',
    icon: UserOutlined,
    label: '作者管理'
  },
  {
    key: '/publisher',
    keyName: 'Publisher',
    icon: BankOutlined,
    label: '出版社管理'
  },
  {
    key: '/lend',
    keyName: 'Lend',
    icon: SwapOutlined,
    label: '借阅管理'
  },
  {
    key: '/module',
    keyName: 'Module',
    icon: UnorderedListOutlined,
    label: '模块管理'
  },
  {
    key: '/user',
    keyName: 'User',
    icon: UserOutlined,
    label: '用户管理'
  },
  {
    key: '/role',
    keyName: 'Role',
    icon: TeamOutlined,
    label: '角色管理'
  },
  {
    key: '/permission',
    keyName: 'Permission',
    icon: SafetyCertificateOutlined,
    label: '权限管理'
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
