<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserOutlined, PlusOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import EditDialog from '@/components/EditDialog.vue'
import type { AuthorDialogForm, AuthorSearchForm, TableAuthorData } from '@/types/author'
import type { PageParams } from '@/types/common'
import { pageQueryAuthor, deleteAuthor, addAuthor, getAuthor, editAuthor } from '@/api/author'
import { message } from 'ant-design-vue'
// 搜索表单
const SearchFormObj = ref<AuthorSearchForm>({
  authorName: ''
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<AuthorSearchForm>({
  authorName: ''
})

const handleSearch = () => {
  // 复制一份搜索表单
  SearchFormObjUse.value = { ...SearchFormObj.value }
  // 构建查询参数
  const queryParams = { ...SearchFormObjUse.value, ...pageParams.value }
  pageQueryAuthor(queryParams).then((res) => {
    tableData.value = res.data.data.data
    total.value = res.data.data.total
  })
}

// 表格
onMounted(() => {
  handleSearch()
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

const handleDelete = (id: number) => {
  deleteAuthor(id).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    handleSearch()
  })
}

const tableData = ref<TableAuthorData[]>([])

// 分页
const total = ref(0)
const pageParams = ref<PageParams>({
  page: 1,
  pageSize: 10
})

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
    handleSearch()
  })
}

const handleEdit = () => {
  editAuthor(dialogForm.value).then(() => {
    message.success('编辑成功')
    handleSearch()
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
  <SearchForm :searchForm="SearchFormObj" @search="handleSearch">
    <a-form-item label="作者名" name="authorName">
      <a-input v-model:value="SearchFormObj.authorName" placeholder="请输入作者名">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>
  </SearchForm>
  <div class="mt-2 space-x-3">
    <a-button type="primary" @click="() => showModal('add')"> <PlusOutlined />新增 </a-button>
    <a-button type="primary" danger> <DeleteOutlined />删除 </a-button>
    <a-button @click="handleSearch"><SyncOutlined /> 刷新</a-button>
  </div>

  <PageTable
    v-model:pageParams="pageParams"
    :total="total"
    :columns="columns"
    :tableData="tableData"
    @pageQuery="handleSearch"
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
      <a-input v-model:value="dialogForm.authorName" />
    </a-form-item>
  </EditDialog>
</template>
<style></style>
