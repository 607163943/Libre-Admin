<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { reviewLend } from '@/api/lendReview'
import type { TableLendReviewData } from '@/types/lendReview'

const props = defineProps<{
  open: boolean
  record: TableLendReviewData | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

const handleClose = () => {
  emit('update:open', false)
}

const loading = ref(false)

const handleReview = (state: number) => {
  if (!props.record) return
  loading.value = true
  reviewLend({
    id: props.record.id,
    state
  })
    .then(() => {
      message.success('处理成功')
      emit('success')
      handleClose()
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <a-modal :open="open" title="借阅审核" @cancel="handleClose" :footer="null" destroyOnClose>
    <div class="py-4">
      <a-descriptions bordered :column="1">
        <a-descriptions-item label="申请人">{{ record?.userName }}</a-descriptions-item>
        <a-descriptions-item label="图书名称">{{ record?.bookName }}</a-descriptions-item>
        <a-descriptions-item label="申请类型">
          <a-tag color="blue" v-if="record?.applyType === 1">借阅</a-tag>
          <a-tag color="purple" v-if="record?.applyType === 2">续借</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="预想天数">{{ record?.lendDays }} 天</a-descriptions-item>
        <a-descriptions-item label="申请时间">{{ record?.applyTime }}</a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <a-popconfirm
        title="确定驳回该申请吗？"
        ok-text="确定"
        cancel-text="取消"
        @confirm="() => handleReview(2)"
      >
        <a-button danger :loading="loading">驳回</a-button>
      </a-popconfirm>
      <a-popconfirm
        title="确定通过该申请吗？"
        ok-text="确定"
        cancel-text="取消"
        @confirm="() => handleReview(1)"
      >
        <a-button type="primary" :loading="loading">通过</a-button>
      </a-popconfirm>
    </div>
  </a-modal>
</template>

<style scoped></style>
