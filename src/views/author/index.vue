<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import PageTable from '@/components/PageTable.vue'
import EditDialog from '@/components/EditDialog.vue'
import type { AuthorDialogForm } from '@/types/author'
import { deleteAuthor, addAuthor, getAuthor, editAuthor } from '@/api/author'
import { message } from 'ant-design-vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Input from '@/components/Input.vue'
import AuthorSearch from './search.vue'
import { useAuthorStore } from '@/stores/modules/author'
import { storeToRefs } from 'pinia'

const authorStore = useAuthorStore()
const { pageQuery } = authorStore

// 表格
onMounted(() => {
  pageQuery()
})

const columns = [
  {
    title: '作者名',
    dataIndex: 'authorName',
    key: 'authorName'
  },
  {
    title: 'Action',
    key: 'action'
  }
]

const { tableData } = storeToRefs(authorStore)

const handleDelete = (id: number) => {
  deleteAuthor(id).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const { total, pageParams } = storeToRefs(authorStore)

// 对话框
const mode = ref<string>('add')
const open = ref<boolean>(false)

const showModal = (openMode: string, id?: number) => {
  mode.value = openMode
  if (mode.value === 'edit' && id) {
    getAuthor(id).then((res) => {
      dialogForm.value = res.data.data
    })
  }
  open.value = true
}

const handleAdd = () => {
  addAuthor(dialogForm.value).then(() => {
    message.success('添加成功')
    pageQuery()
  })
}

const handleEdit = () => {
  editAuthor(dialogForm.value).then(() => {
    message.success('编辑成功')
    pageQuery()
  })
}

const dialogForm = ref<AuthorDialogForm>({
  id: '',
  authorName: ''
})

const dialogRule: Record<string, Rule[]> = {
  authorName: [{ required: true, message: '请输入作者名!' }]
}
</script>
<template>
  <AuthorSearch />

  <ButtonGroup @add="() => showModal('add')" @refresh="pageQuery" />

  <PageTable
    v-model:pageParams="pageParams"
    :total="total"
    :columns="columns"
    :tableData="tableData"
    @pageQuery="pageQuery"
  >
    <template #tableBodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <a-button type="link" @click="() => showModal('edit', record.id)">编辑</a-button>
          <a-button type="link" danger @click="() => handleDelete(record.id)">删除</a-button>
        </span>
      </template>
    </template>
  </PageTable>

  <EditDialog
    v-model:open="open"
    addTitle="新增作者"
    editTitle="编辑作者"
    :mode="mode"
    :dialogForm="dialogForm"
    :dialogRule="dialogRule"
    :handleAdd="handleAdd"
    :handleEdit="handleEdit"
  >
    <a-form-item label="作者名" name="authorName">
      <Input v-model:value="dialogForm.authorName" placeholder="请输入作者名" />
    </a-form-item>
  </EditDialog>
</template>
<style></style>
