import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/user'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  const setUserInfo = (newUserInfo: UserInfo) => {
    userInfo.value = newUserInfo
  }

  return {
    userInfo,
    setUserInfo
  }
})
