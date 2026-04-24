<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import EditDialog from '@/components/EditDialog.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import type { LendDialogForm, LendSearchForm, TableLendData } from '@/types/lend'
import type { PageParams, Key } from '@/types/common'
import { pageQueryLend, deleteLend, addLend, getLend, editLend, deleteBatchLend } from '@/api/lend'
import { message, type SelectProps } from 'ant-design-vue'
import { getAllUser } from '@/api/user'
import { getAllBook } from '@/api/book'
// 全局参数
const userOptions = ref<SelectProps['options']>([])
const bookOptions = ref<SelectProps['options']>([])
const stateOptions = ref<SelectProps['options']>([
  {
    value: 1,
    label: '未归还'
  },
  {
    value: 2,
    label: '已归还'
  },
  {
    value: 3,
    label: '逾期'
  }
])

onMounted(() => {
  getAllUser().then((res) => {
    userOptions.value = res.data.data.map((item) => {
      return {
        value: item.id,
        label: item.username
      }
    })
  })
  getAllBook().then((res) => {
    bookOptions.value = res.data.data.map((item) => {
      return {
        value: item.id,
        label: item.bookName
      }
    })
  })
})

// 搜索表单
const SearchFormObj = ref<LendSearchForm>({
  userId: undefined,
  bookId: undefined,
  state: undefined
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<LendSearchForm>({
  userId: undefined,
  bookId: undefined,
  state: undefined
})

const handleReset = () => {
  SearchFormObj.value = {
    userId: undefined,
    bookId: undefined,
    state: undefined
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
  pageQueryLend(queryParams).then((res) => {
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
    title: '借阅者账户名',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '图书',
    dataIndex: 'bookName',
    key: 'bookName'
  },
  {
    title: '借阅状态',
    dataIndex: 'state',
    key: 'state'
  },
  {
    title: '续阅次数',
    dataIndex: 'renewCount',
    key: 'renewCount'
  },
  {
    title: '归还时间',
    dataIndex: 'returnTime',
    key: 'returnTime'
  },
  {
    title: '到期时间',
    dataIndex: 'dueTime',
    key: 'dueTime'
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
  deleteLend(id).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const handleBatchDelete = () => {
  deleteBatchLend(selectedRowKeys.value.join(',')).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const tableData = ref<TableLendData[]>([])

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
    getLend(id).then((res) => {
      dialogForm.value = res.data.data
    })
  }
  open.value = true
}

const handleAdd = () => {
  addLend(dialogForm.value).then(() => {
    message.success('添加成功')
    pageQuery()
  })
}

const handleEdit = () => {
  editLend(dialogForm.value).then(() => {
    message.success('编辑成功')
    pageQuery()
  })
}

const dialogForm = ref<LendDialogForm>({
  id: '',
  userId: undefined,
  bookId: undefined,
  state: undefined,
  renewCount: 0,
  returnTime: '',
  dueTime: ''
})

const dialogRule: Record<string, Rule[]> = {
  userId: [{ required: true, message: '请输入借阅者id!' }],
  bookId: [{ required: true, message: '请输入图书id!' }],
  state: [{ required: true, message: '请输入借阅状态!' }],
  renewCount: [{ required: true, message: '请输入续阅次数!' }],
  returnTime: [{ required: true, message: '请输入应还时间!' }],
  dueTime: [{ required: true, message: '请输入到期时间!' }]
}
</script>
<template>
  <div>
    <SearchForm :searchForm="SearchFormObj" @search="handleSearch" @reset="handleReset">
      <a-form-item label="借阅者账户名" name="userId">
        <a-select
          v-model:value="SearchFormObj.userId"
          style="width: 160px"
          placeholder="请指定借阅者账户名"
          :options="userOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="图书" name="bookId">
        <a-select
          v-model:value="SearchFormObj.bookId"
          style="width: 160px"
          placeholder="请指定图书"
          :options="bookOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="借阅状态" name="state">
        <a-select
          v-model:value="SearchFormObj.state"
          style="width: 160px"
          placeholder="请指定借阅状态"
          :options="stateOptions"
        >
        </a-select>
      </a-form-item>
    </SearchForm>

    <ButtonGroup
      :deleteItemCount="selectedRowKeys.length"
      @add="() => showModal('add')"
      @delete="handleBatchDelete"
      @refresh="pageQuery"
    />

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
          <span>
            <a-tag color="orange" v-if="record.state === 1">未归还</a-tag>
            <a-tag color="green" v-if="record.state === 2">已归还</a-tag>
            <a-tag color="red" v-if="record.state === 3">已逾期</a-tag>
          </span>
        </template>
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
      addTitle="新增借阅"
      editTitle="编辑借阅"
      :mode="mode"
      :dialogForm="dialogForm"
      :dialogRule="dialogRule"
      :handleAdd="handleAdd"
      :handleEdit="handleEdit"
    >
      <a-form-item label="借阅者id" name="userId">
        <a-select
          v-model:value="dialogForm.userId"
          style="width: 100%"
          placeholder="请指定借阅者id"
          :options="userOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="图书id" name="bookId">
        <a-select
          v-model:value="dialogForm.bookId"
          style="width: 100%"
          placeholder="请指定图书id"
          :options="bookOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="借阅状态" name="state">
        <a-select
          v-model:value="dialogForm.state"
          style="width: 100%"
          placeholder="请指定借阅状态"
          :options="stateOptions"
        >
        </a-select>
      </a-form-item>
    </EditDialog>
  </div>
</template>
<style></style>
