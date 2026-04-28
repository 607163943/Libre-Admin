<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutlined } from '@ant-design/icons-vue'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Input from '@/components/Input.vue'
import SendDialog from './SendDialog.vue'
import type { MessageSearchForm, TableMessageData } from '@/types/message'
import type { PageParams } from '@/types/common'
import type { Key } from '@/types/common'
import { pageQueryMessage, deleteMessage, deleteBatchMessage } from '@/api/message'
import { message } from 'ant-design-vue'

const router = useRouter()
// 搜索表单
const SearchFormObj = ref<MessageSearchForm>({
  title: ''
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<MessageSearchForm>({
  title: ''
})

const handleReset = () => {
  SearchFormObj.value = {
    title: ''
  }

  pageQuery()
}

const handleSearch = () => {
  pageParams.value.page = 1
  pageQuery()
}

const pageQuery = () => {
  // 复制一份搜索表单
  SearchFormObjUse.value = { ...SearchFormObj.value }
  // 构建查询参数
  const queryParams = { ...SearchFormObjUse.value, ...pageParams.value }
  pageQueryMessage(queryParams).then((res) => {
    tableData.value = res.data.data.data
    total.value = res.data.data.total
  })
}

// 表格
onMounted(() => {
  pageQuery()
})

const columns = [
  {
    title: '消息标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '状态',
    key: 'state'
  },
  {
    title: 'Action',
    key: 'action'
  }
]

const selectedRowKeys = ref<Key[]>([])

const onSelectChange = (newSelectedRowKeys: Key[]) => {
  selectedRowKeys.value = newSelectedRowKeys
}

const handleDelete = (id: number) => {
  deleteMessage(id).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const handleBatchDelete = () => {
  deleteBatchMessage(selectedRowKeys.value.join(',')).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const tableData = ref<TableMessageData[]>([])

// 分页
const total = ref(0)
const pageParams = ref<PageParams>({
  page: 1,
  pageSize: 10
})

const handleAddClick = () => {
  router.push({ path: '/message/edit', query: { mode: 'add' } })
}

const handleEditClick = (id: number) => {
  router.push({ path: '/message/edit', query: { mode: 'edit', id } })
}

const sendDialogRef = ref<InstanceType<typeof SendDialog> | null>(null)

const handleSend = (id: number) => {
  sendDialogRef.value?.show(id)
}
</script>
<template>
  <div>
    <SearchForm :searchForm="SearchFormObj" @search="handleSearch" @reset="handleReset">
      <a-form-item label="消息标题" name="title">
        <Input
          v-model:value="SearchFormObj.title"
          placeholder="请输入消息标题"
          :icon="SearchOutlined"
        />
      </a-form-item>
      <template #buttons>
        <ButtonGroup
          :deleteItemCount="selectedRowKeys.length"
          @add="handleAddClick"
          @delete="handleBatchDelete"
          @refresh="pageQuery"
        />
      </template>
    </SearchForm>

    <SendDialog ref="sendDialogRef" @success="pageQuery" />

    <PageTable
      v-model:pageParams="pageParams"
      v-model:selectedRowKeys="selectedRowKeys"
      :total="total"
      :columns="columns"
      :tableData="tableData"
      @pageQuery="pageQuery"
      @selectChange="onSelectChange"
    >
      <template #tableBodyCell="{ column, record }">
        <template v-if="column.key === 'state'">
          <a-tag v-if="record.state === 0">未发布</a-tag>
          <a-tag v-if="record.state === 1" color="green">已发布</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <span>
            <a-button type="link" @click="() => handleEditClick(record.id)">编辑</a-button>
            <a-button type="link" v-if="record.state === 0" @click="() => handleSend(record.id)"
              >发送</a-button
            >
            <a-button type="link" danger @click="() => handleDelete(record.id)">删除</a-button>
          </span>
        </template>
      </template>
    </PageTable>
  </div>
</template>
<style></style>
