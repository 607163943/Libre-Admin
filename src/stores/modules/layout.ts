import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUnreadCount } from '@/api/message'

export const useLayoutStore = defineStore('layout', () => {
  const isMobile = ref(false)

  const setIsMobile = (value: boolean) => {
    isMobile.value = value
  }

  const unReadCount = ref(0)

  const getNewUnReadCount = () => {
    getUnreadCount().then((res) => {
      unReadCount.value = res.data.data
    })
  }

  return {
    isMobile,
    setIsMobile,
    unReadCount,
    getNewUnReadCount
  }
})
