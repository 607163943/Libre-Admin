import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import Home from '@/views/home/index.vue'
import User from '@/views/user/index.vue'
import Book from '@/views/book/index.vue'
import Author from '@/views/author/index.vue'
import Publisher from '@/views/publisher/index.vue'
import Lend from '@/views/lend/index.vue'
import LendReview from '@/views/lend-review/index.vue'
import Profile from '@/views/profile/index.vue'
import Login from '@/views/login/index.vue'
import Message from '@/views/message/index.vue'
import MessageList from '@/views/message/message-list.vue'
import MessageDetail from '@/views/message/message-detail.vue'
import { useLayoutStore } from '@/stores/modules/layout' // 确保路径正确

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Home',
          component: Home
        },
        {
          path: 'user',
          name: 'User',
          component: User
        },
        {
          path: 'book',
          name: 'Book',
          component: Book
        },
        {
          path: 'author',
          name: 'Author',
          component: Author
        },
        {
          path: 'publisher',
          name: 'Publisher',
          component: Publisher
        },
        {
          path: 'lend',
          name: 'Lend',
          component: Lend
        },
        {
          path: 'lend-review',
          name: 'LendReview',
          component: LendReview
        },
        {
          path: 'message',
          name: 'Message',
          component: Message
        },
        {
          path: 'message/edit',
          name: 'MessageEdit',
          component: () => import('@/views/message/message-edit.vue')
        },
        {
          path: 'message/list',
          name: 'MessageList',
          component: MessageList
        },
        {
          path: 'message/detail/:id',
          name: 'MessageDetail',
          component: MessageDetail
        },
        {
          path: 'profile',
          name: 'Profile',
          component: Profile
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

/**
 * 全局后置钩子
 * 路由跳转完成后，自动触发获取未读消息
 */
router.afterEach(() => {
  // 注意：在组件外部使用 Pinia Store，需要确保在路由实例中使用
  const layoutStore = useLayoutStore()
  layoutStore.getNewUnReadCount()
})

export default router
