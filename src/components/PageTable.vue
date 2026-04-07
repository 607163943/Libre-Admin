<script setup lang="ts" generic="T extends object">
import { toRefs } from 'vue'
import { useLayoutStore } from '@/stores/modules/layout'
import { storeToRefs } from 'pinia'
import type { PageParams } from '@/types/common'
const props = defineProps<{
  columns: {
    title: string
    dataIndex?: string
    key: string
  }[]
  tableData: T[]
  total: number
}>()

// 表格
const layoutStore = useLayoutStore()
const { isMobile } = storeToRefs(layoutStore)
const { columns, tableData } = toRefs(props)

// 分页
const emit = defineEmits(['update:pageParams', 'pageQuery'])
const { total } = toRefs(props)

// 双向绑定pageParams值
const handlePageChange = () => {
  // 触发更新，解构旧值并覆盖新值
  emit('pageQuery')
}
const pageParams = defineModel<PageParams>('pageParams', {
  required: true
})
</script>
<template>
  <div>
    <div class="mt-4">
      <!-- 该表格通过卸载、重新渲染来解决PC端和移动端重复切换时，表格滚动条渲染后固定存在的问题 -->
      <!-- 每次切换都是重新渲染，性能优化时注意这个组件 -->
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :key="isMobile ? 'mobile-table' : 'pc-table'"
        :scroll="isMobile ? { x: 1500 } : undefined"
      >
        <template #bodyCell="{ column, record }">
          <slot name="tableBodyCell" :column="column" :record="record" />
        </template>
      </a-table>
    </div>

    <div class="flex justify-end mt-4">
      <a-pagination
        v-model:current="pageParams.page"
        v-model:pageSize="pageParams.pageSize"
        :total="total"
        :size="isMobile ? 'small' : 'default'"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>
