<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Form, message } from 'ant-design-vue'
import type { SendMessageDto } from '@/types/message'
import { sendMessage } from '@/api/message'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const visible = ref(false)
const confirmLoading = ref(false)

const formState = reactive<SendMessageDto>({
  id: 0,
  target: 0
})

const useForm = Form.useForm
const { resetFields, validate, validateInfos } = useForm(
  formState,
  reactive({
    target: [{ required: true, message: '请选择发送对象' }]
  })
)

const show = (id: number) => {
  resetFields()
  formState.id = id
  formState.target = 0
  visible.value = true
}

const handleOk = () => {
  validate()
    .then(() => {
      confirmLoading.value = true
      sendMessage(formState)
        .then(() => {
          message.success('发送成功')
          visible.value = false
          emit('success')
        })
        .finally(() => {
          confirmLoading.value = false
        })
    })
    .catch((err) => {
      console.log('error', err)
    })
}

const handleCancel = () => {
  visible.value = false
}

defineExpose({
  show
})
</script>

<template>
  <a-modal
    v-model:open="visible"
    title="发送消息"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item label="发送对象" v-bind="validateInfos.target">
        <a-radio-group v-model:value="formState.target">
          <a-radio :value="0">全体</a-radio>
          <a-radio :value="1">读者</a-radio>
          <a-radio :value="2">管理端</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped></style>
