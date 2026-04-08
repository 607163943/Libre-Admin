<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BankOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import EditDialog from '@/components/EditDialog.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Input from '@/components/Input.vue'
import type {
  PublisherDialogForm,
  PublisherSearchForm,
  TablePublisherData
} from '@/types/publisher'
import type { PageParams } from '@/types/common'
import {
  pageQueryPublisher,
  deletePublisher,
  addPublisher,
  getPublisher,
  editPublisher
} from '@/api/publisher'
import { message } from 'ant-design-vue'
// 搜索表单
const SearchFormObj = ref<PublisherSearchForm>({
  publisherName: ''
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<PublisherSearchForm>({
  publisherName: ''
})

const handleReset = () => {
  SearchFormObj.value = {
    publisherName: ''
  }

  handleSearch()
}

const handleSearch = () => {
  // 复制一份搜索表单
  SearchFormObjUse.value = { ...SearchFormObj.value }
  // 构建查询参数
  const queryParams = { ...SearchFormObjUse.value, ...pageParams.value }
  pageQueryPublisher(queryParams).then((res) => {
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
    title: '出版社名',
    dataIndex: 'publisherName',
    key: 'publisherName'
  },
  {
    title: 'Action',
    key: 'action'
  }
]

const handleDelete = (id: number) => {
  deletePublisher(id).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    handleSearch()
  })
}

const tableData = ref<TablePublisherData[]>([])

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
    getPublisher(id).then((res) => {
      dialogForm.value = res.data.data
    })
  }
  open.value = true
}

const handleAdd = () => {
  addPublisher(dialogForm.value).then(() => {
    message.success('添加成功')
    handleSearch()
  })
}

const handleEdit = () => {
  editPublisher(dialogForm.value).then(() => {
    message.success('编辑成功')
    handleSearch()
  })
}

const dialogForm = ref<PublisherDialogForm>({
  id: '',
  publisherName: ''
})

const dialogRule: Record<string, Rule[]> = {
  publisherName: [{ required: true, message: '请输入出版社名!' }]
}
</script>
<template>
  <SearchForm :searchForm="SearchFormObj" @search="handleSearch" @reset="handleReset">
    <a-form-item label="出版社名" name="publisherName">
      <Input
        v-model:value="SearchFormObj.publisherName"
        placeholder="请输入出版社名"
        :icon="BankOutlined"
      />
    </a-form-item>
  </SearchForm>

  <ButtonGroup @add="() => showModal('add')" @refresh="handleSearch" />

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
    addTitle="新增出版社"
    editTitle="编辑出版社"
    :mode="mode"
    :dialogForm="dialogForm"
    :dialogRule="dialogRule"
    :handleAdd="handleAdd"
    :handleEdit="handleEdit"
  >
    <a-form-item label="出版社名" name="publisherName">
      <Input v-model:value="dialogForm.publisherName" placeholder="请输入出版社名" />
    </a-form-item>
  </EditDialog>
</template>
<style></style>
