<script setup lang="ts" generic="T extends object">
import { ref, toRefs } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
const props = defineProps<{
  addTitle: string
  editTitle: string
  mode: string
  dialogForm: T
  dialogRule: Record<string, Rule[]>
  handleAdd: () => void
  handleEdit: () => void
}>()
// 对话框
const open = defineModel<boolean>('open', { required: true })
const { mode } = toRefs(props)
const confirmLoading = ref<boolean>(false)

const { handleAdd, handleEdit } = props
const handleOk = async () => {
  confirmLoading.value = true
  // 添加Promise类型提示
  formRef.value
    .validate()
    .then(() => {
      if (mode.value === 'add') {
        handleAdd()
      } else {
        handleEdit()
      }
      handleCancel()
    })
    .catch(() => {})
    .finally(() => {
      confirmLoading.value = false
    })
}

const handleCancel = () => {
  // 清空表单
  formRef.value.resetFields()
  open.value = false
}

const formRef = ref()
const { dialogForm, dialogRule } = toRefs(props)
</script>
<template>
  <div>
    <a-modal
      v-model:open="open"
      :title="mode === 'add' ? addTitle : editTitle"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      cancelText="取消"
      okText="确定"
      @cancel="handleCancel"
    >
      <a-form
        ref="formRef"
        :model="dialogForm"
        :rules="dialogRule"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
      >
        <slot />
      </a-form>
    </a-modal>
  </div>
</template>
