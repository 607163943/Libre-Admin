import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import Home from '@/views/home/index.vue'
import User from '@/views/user/index.vue'
import Book from '@/views/book/index.vue'
import Author from '@/views/author/index.vue'
import Publisher from '@/views/publisher/index.vue'
import Lend from '@/views/lend/index.vue'
import Role from '@/views/role/index.vue'
import Login from '@/views/login/index.vue'
import Permission from '@/views/permission/index.vue'
import RolePermission from '@/views/role-permission/index.vue'

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
          path: 'role',
          name: 'Role',
          component: Role
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
          path: 'permission',
          name: 'Permission',
          component: Permission
        },
        {
          path: 'role-permission',
          name: 'RolePermission',
          component: RolePermission
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

export default router
