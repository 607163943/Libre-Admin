<script setup lang="ts" generic="T extends object">
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
// 搜索表单

const { searchForm } = defineProps<{
  searchForm: T
}>()
</script>
<template>
  <div class="bg-white p-4 rounded-lg mb-4">
    <a-form :model="searchForm" name="horizontal_login" layout="inline" autocomplete="off">
      <slot></slot>
      <a-form-item>
        <a-button type="primary" @click="() => $emit('search')"> <SearchOutlined />搜索 </a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="() => $emit('reset')"> <ReloadOutlined />重置 </a-button>
      </a-form-item>
    </a-form>
    
    <!-- 操作按钮组插槽 -->
    <slot name="buttons"></slot>
  </div>
</template>
