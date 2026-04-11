<script setup lang="ts">
import { PlusOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons-vue'
const props = defineProps<{
  deleteItemCount: number
}>()
</script>
<template>
  <div class="mt-2 space-x-3">
    <a-button type="primary" @click="() => $emit('add')"> <PlusOutlined />新增 </a-button>
    <a-button
      type="primary"
      danger
      @click="() => $emit('delete')"
      :disabled="props.deleteItemCount === 0"
    >
      <DeleteOutlined />删除
    </a-button>
    <a-button @click="() => $emit('refresh')"><SyncOutlined /> 刷新</a-button>
  </div>
</template>
