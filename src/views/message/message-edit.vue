<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import Input from '@/components/Input.vue'
import type { MessageDialogForm } from '@/types/message'
import { getMessage, addMessage, editMessage } from '@/api/message'

const route = useRoute()
const router = useRouter()

const mode = ref<string>('add')
const loading = ref<boolean>(false)

const dialogForm = ref<MessageDialogForm>({
  id: '',
  title: '',
  content: '',
  type: undefined
})

const dialogRule: Record<string, Rule[]> = {
  title: [{ required: true, message: '请输入消息标题!' }],
  content: [{ required: true, message: '请输入消息内容!' }],
  type: [{ required: true, message: '请选择消息类型!' }]
}

const formRef = ref()

onMounted(() => {
  mode.value = (route.query.mode as string) || 'add'
  const id = route.query.id as string
  if (mode.value === 'edit' && id) {
    loading.value = true
    getMessage(Number(id))
      .then((res) => {
        dialogForm.value = res.data.data
      })
      .finally(() => {
        loading.value = false
      })
  }
})

const handleSave = () => {
  formRef.value.validate().then(() => {
    loading.value = true
    if (mode.value === 'add') {
      addMessage(dialogForm.value)
        .then(() => {
          message.success('添加成功')
          router.push({ name: 'Message' })
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      editMessage(dialogForm.value)
        .then(() => {
          message.success('编辑成功')
          router.push({ name: 'Message' })
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

const handleCancel = () => {
  router.push({ name: 'Message' })
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg">
    <div class="mb-6">
      <h2 class="text-lg font-medium">{{ mode === 'add' ? '新增消息' : '编辑消息' }}</h2>
    </div>
    <a-spin :spinning="loading">
      <a-form
        ref="formRef"
        :model="dialogForm"
        :rules="dialogRule"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="消息标题" name="title">
          <Input v-model:value="dialogForm.title" placeholder="请输入消息标题" />
        </a-form-item>
        <a-form-item label="消息类型" name="type">
          <a-select v-model:value="dialogForm.type" placeholder="请选择消息类型">
            <a-select-option :value="0">系统通知</a-select-option>
            <a-select-option :value="1">借阅通知</a-select-option>
            <a-select-option :value="2">违规通知</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="消息内容" name="content">
          <a-textarea v-model:value="dialogForm.content" placeholder="请输入消息内容" :rows="6" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-button type="primary" @click="handleSave" :loading="loading" class="mr-4">
            保存
          </a-button>
          <a-button @click="handleCancel"> 取消 </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<style scoped></style>
