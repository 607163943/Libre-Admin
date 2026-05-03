<script setup lang="ts">
import { ref, onMounted, shallowRef, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import Input from '@/components/Input.vue'
import type { MessageDialogForm } from '@/types/message'
import { getMessage, addMessage, editMessage } from '@/api/message'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'
import type { IDomEditor } from '@wangeditor/editor'

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

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor | null>(null)

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
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
          <div class="border border-gray-200 rounded-md w-full relative z-0">
            <Toolbar
              class="border-b border-gray-200"
              :editor="editorRef!"
              :defaultConfig="toolbarConfig"
              mode="default"
            />
            <Editor
              style="height: 400px; overflow-y: hidden"
              v-model="dialogForm.content"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleCreated"
            />
          </div>
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

<style scoped>
:deep(.w-e-full-screen-container) {
  z-index: 9999;
}
:deep(.w-e-text-container) {
  z-index: 1 !important;
}
:deep(.w-e-toolbar) {
  z-index: 2 !important;
}
</style>
