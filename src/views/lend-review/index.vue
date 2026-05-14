<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { message, type SelectProps } from 'ant-design-vue'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import EditDialog from '@/components/EditDialog.vue'
import ReviewHandler from './ReviewHandler.vue'

import type {
  LendReviewSearchForm,
  TableLendReviewData,
  LendReviewDialogForm
} from '@/types/lendReview'
import type { PageParams, Key } from '@/types/common'

import {
  pageQueryLendReview,
  getLendReview,
  addLendReview,
  editLendReview,
  deleteLendReview,
  deleteBatchLendReview
} from '@/api/lendReview'
import { getAllUser } from '@/api/user'
import { getAllBook } from '@/api/book'

// 搜索选项
const stateOptions = ref<SelectProps['options']>([
  { value: 1, label: '待审核' },
  { value: 2, label: '通过' },
  { value: 3, label: '驳回' }
])

const typeOptions = ref<SelectProps['options']>([
  { value: 1, label: '借阅' },
  { value: 2, label: '续借' }
])

const userOptions = ref<SelectProps['options']>([])
const bookOptions = ref<SelectProps['options']>([])

onMounted(() => {
  getAllUser().then((res) => {
    userOptions.value = res.data.data.map((item) => ({
      value: item.id,
      label: item.username
    }))
  })
  getAllBook().then((res) => {
    bookOptions.value = res.data.data.map((item) => ({
      value: item.id,
      label: item.bookName
    }))
  })
})

// 搜索表单
const applyTimeRange = ref<[string, string] | undefined>(undefined)

const onRangeChange = (_value: object, dateString: [string, string]) => {
  if (dateString && dateString[0] && dateString[1]) {
    SearchFormObj.value.applyStartTime = dateString[0]
    SearchFormObj.value.applyEndTime = dateString[1]
  } else {
    SearchFormObj.value.applyStartTime = undefined
    SearchFormObj.value.applyEndTime = undefined
  }
}

const SearchFormObj = ref<LendReviewSearchForm>({
  username: undefined,
  bookName: undefined,
  state: undefined,
  type: undefined,
  applyStartTime: undefined,
  applyEndTime: undefined
})

const SearchFormObjUse = ref<LendReviewSearchForm>({
  username: undefined,
  bookName: undefined,
  state: undefined,
  type: undefined,
  applyStartTime: undefined,
  applyEndTime: undefined
})

const handleReset = () => {
  applyTimeRange.value = undefined
  SearchFormObj.value = {
    username: undefined,
    bookName: undefined,
    state: undefined,
    type: undefined,
    applyStartTime: undefined,
    applyEndTime: undefined
  }
  pageQuery()
}

const handleSearch = () => {
  pageParams.value.page = 1
  pageQuery()
}

const pageQuery = () => {
  SearchFormObjUse.value = { ...SearchFormObj.value }
  const queryParams = { ...SearchFormObjUse.value, ...pageParams.value }
  pageQueryLendReview(queryParams).then((res) => {
    tableData.value = res.data.data.data
    total.value = res.data.data.total
  })
}

// 表格配置
onMounted(() => {
  pageQuery()
})

const columns = [
  {
    title: '申请人',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '图书',
    dataIndex: 'bookName',
    key: 'bookName'
  },
  {
    title: '申请类型',
    dataIndex: 'applyType',
    key: 'applyType'
  },
  {
    title: '预想天数',
    dataIndex: 'lendDays',
    key: 'lendDays'
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state'
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime',
    key: 'applyTime'
  },
  {
    title: '操作人',
    dataIndex: 'operatorName',
    key: 'operatorName'
  },
  {
    title: '操作',
    key: 'action'
  }
]

const selectedRowKeys = ref<Key[]>([])

const onSelectChange = (newSelectedRowKeys: Key[]) => {
  selectedRowKeys.value = newSelectedRowKeys
}

const tableData = ref<TableLendReviewData[]>([])
const total = ref(0)
const pageParams = ref<PageParams>({
  page: 1,
  pageSize: 10
})

// 对话框配置 (Review)
const reviewOpen = ref(false)
const currentRecord = ref<TableLendReviewData | null>(null)

const showReviewDialog = (record: TableLendReviewData) => {
  currentRecord.value = record
  reviewOpen.value = true
}

const handleReviewSuccess = () => {
  pageQuery()
}

// Add/Edit/Delete
const mode = ref<string>('add')
const open = ref<boolean>(false)

const showModal = (openMode: string, id?: number) => {
  mode.value = openMode
  if (mode.value === 'edit' && id) {
    getLendReview(id).then((res) => {
      dialogForm.value = res.data.data
    })
  } else {
    dialogForm.value = {
      id: '',
      userId: undefined,
      bookId: undefined,
      applyType: 1,
      lendDays: 7,
      state: 1,
      applyTime: ''
    }
  }
  open.value = true
}

const handleAdd = () => {
  addLendReview(dialogForm.value).then(() => {
    message.success('添加成功')
    pageQuery()
  })
}

const handleEdit = () => {
  editLendReview(dialogForm.value).then(() => {
    message.success('编辑成功')
    pageQuery()
  })
}

const handleDelete = (id: number) => {
  deleteLendReview(id).then(() => {
    message.success('删除成功')
    pageParams.value.page = 1
    pageQuery()
  })
}

const handleBatchDelete = () => {
  deleteBatchLendReview(selectedRowKeys.value.join(',')).then(() => {
    message.success('删除成功')
    pageParams.value.page = 1
    pageQuery()
  })
}

const dialogForm = ref<LendReviewDialogForm>({
  id: '',
  userId: undefined,
  bookId: undefined,
  applyType: 1,
  lendDays: 7,
  state: 1,
  applyTime: ''
})

const dialogRule: Record<string, Rule[]> = {
  userId: [{ required: true, message: '请选择借阅者!' }],
  bookId: [{ required: true, message: '请选择图书!' }],
  type: [{ required: true, message: '请选择申请类型!' }],
  lendDays: [{ required: true, message: '请输入预想天数!' }],
  state: [{ required: true, message: '请选择审核状态!' }]
}
</script>

<template>
  <div>
    <SearchForm :searchForm="SearchFormObj" @search="handleSearch" @reset="handleReset">
      <a-form-item label="申请人" name="username">
        <a-input
          v-model:value="SearchFormObj.username"
          style="width: 160px"
          placeholder="请输入申请人"
        />
      </a-form-item>
      <a-form-item label="图书名称" name="bookName">
        <a-input
          v-model:value="SearchFormObj.bookName"
          style="width: 160px"
          placeholder="请输入图书名称"
        />
      </a-form-item>
      <a-form-item label="类型" name="type">
        <a-select
          v-model:value="SearchFormObj.type"
          style="width: 160px"
          placeholder="请选择类型"
          :options="typeOptions"
        />
      </a-form-item>
      <a-form-item label="状态" name="state">
        <a-select
          v-model:value="SearchFormObj.state"
          style="width: 160px"
          placeholder="请选择状态"
          :options="stateOptions"
        />
      </a-form-item>
      <a-form-item label="申请时间" name="applyTimeRange">
        <a-range-picker
          v-model:value="applyTimeRange"
          value-format="YYYY-MM-DD HH:mm:ss"
          show-time
          @change="onRangeChange"
        />
      </a-form-item>
      <template #buttons>
        <ButtonGroup
          :deleteItemCount="selectedRowKeys.length"
          @add="() => showModal('add')"
          @delete="handleBatchDelete"
          @refresh="pageQuery"
        />
      </template>
    </SearchForm>

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
        <template v-if="column.key === 'applyType'">
          <span>
            <a-tag color="blue" v-if="record.applyType === 1">借阅</a-tag>
            <a-tag color="purple" v-if="record.applyType === 2">续借</a-tag>
          </span>
        </template>
        <template v-if="column.key === 'state'">
          <span>
            <a-badge status="default" text="待提交" v-if="record.state === 0" />
            <a-badge status="processing" text="待审核" v-if="record.state === 1" />
            <a-badge status="success" text="通过" v-if="record.state === 2" />
            <a-badge status="error" text="驳回" v-if="record.state === 3" />
          </span>
        </template>
        <template v-if="column.key === 'action'">
          <span v-if="record.state === 1">
            <a-button type="link" @click="() => showReviewDialog(record)">处理</a-button>
          </span>
          <span v-else class="text-gray-400 pl-4"> 已处理 </span>
          <span>
            <a-button type="link" @click="() => showModal('edit', record.id)">编辑</a-button>
            <a-button type="link" danger @click="() => handleDelete(record.id)">删除</a-button>
          </span>
        </template>
      </template>
    </PageTable>

    <ReviewHandler
      v-model:open="reviewOpen"
      :record="currentRecord"
      @success="handleReviewSuccess"
    />

    <EditDialog
      v-model:open="open"
      addTitle="新增借阅申请"
      editTitle="编辑借阅申请"
      :mode="mode"
      :dialogForm="dialogForm"
      :dialogRule="dialogRule"
      :handleAdd="handleAdd"
      :handleEdit="handleEdit"
    >
      <a-form-item label="借阅者" name="userId">
        <a-select
          v-model:value="dialogForm.userId"
          style="width: 100%"
          placeholder="请指定借阅者"
          :options="userOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="图书" name="bookId">
        <a-select
          v-model:value="dialogForm.bookId"
          style="width: 100%"
          placeholder="请指定图书"
          :options="bookOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="申请类型" name="applyType">
        <a-select
          v-model:value="dialogForm.applyType"
          style="width: 100%"
          placeholder="请指定申请类型"
          :options="typeOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="预想天数" name="lendDays">
        <a-input-number
          :min="1"
          :max="7"
          v-model:value="dialogForm.lendDays"
          placeholder="请输入预想借阅天数"
        />
      </a-form-item>
      <a-form-item label="审核状态" name="state">
        <a-select
          :disabled="mode === 'add'"
          v-model:value="dialogForm.state"
          style="width: 100%"
          placeholder="请指定审核状态"
          :options="stateOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="申请时间" name="applyTime">
        <a-date-picker
          v-model:value="dialogForm.applyTime"
          show-time
          placeholder="请指定申请时间"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </a-form-item>
    </EditDialog>
  </div>
</template>

<style scoped></style>
