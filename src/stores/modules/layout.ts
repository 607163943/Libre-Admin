import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  const isMobile = ref(false)

  const setIsMobile = (value: boolean) => {
    isMobile.value = value
  }

  return {
    isMobile,
    setIsMobile
  }
})
