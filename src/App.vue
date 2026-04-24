<script setup lang="ts">
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import 'overlayscrollbars/styles/overlayscrollbars.css'
</script>

<template>
  <OverlayScrollbarsComponent
    defer
    :options="{
      scrollbars: {
        theme: 'os-theme-dark', // 也可以自定义类名
        autoHide: 'scroll', // 仅在滚动时显示
        autoHideDelay: 300
      }
    }"
    class="h-screen w-full"
  >
    <router-view />
  </OverlayScrollbarsComponent>
</template>

<style scoped></style>
