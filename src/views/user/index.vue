<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BankOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import EditDialog from '@/components/EditDialog.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Input from '@/components/Input.vue'
import AssignRoleDialog from './AssignRoleDialog.vue'
import type { UserDialogForm, UserSearchForm, TableUserData } from '@/types/user'
import type { PageParams } from '@/types/common'
import type { Key } from '@/types/common'
import { pageQueryUser, deleteUser, getUser, editUser, addUser, deleteBatchUser } from '@/api/user'
import { message } from 'ant-design-vue'
import { generateMD5 } from '@/utils/security-utils'

// 搜索表单
const SearchFormObj = ref<UserSearchForm>({
  username: '',
  name: ''
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<UserSearchForm>({
  username: '',
  name: ''
})

const handleReset = () => {
  SearchFormObj.value = {
    username: '',
    name: ''
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
  pageQueryUser(queryParams).then((res) => {
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
    title: '用户名',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
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
  deleteUser(id).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const handleBatchDelete = () => {
  deleteBatchUser(selectedRowKeys.value.join(',')).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const tableData = ref<TableUserData[]>([])

// 分页
const total = ref(0)
const pageParams = ref<PageParams>({
  page: 1,
  pageSize: 10
})

// 编辑/新增对话框
const mode = ref<string>('add')
const open = ref<boolean>(false)

const showModal = (openMode: string, id?: number) => {
  mode.value = openMode
  if (mode.value === 'edit' && id) {
    getUser(id).then((res) => {
      dialogForm.value = res.data.data
    })
  }
  open.value = true
}

// 分配角色对话框
const assignRoleOpen = ref<boolean>(false)
const assignRoleUserId = ref<number | string | undefined>(undefined)

const showAssignRoleDialog = (userId: number) => {
  assignRoleUserId.value = userId
  assignRoleOpen.value = true
}

const handleAdd = () => {
  const tempForm: UserDialogForm = {
    ...dialogForm.value,
    password: generateMD5(dialogForm.value.password)
  }
  addUser(tempForm).then(() => {
    message.success('添加成功')
    pageQuery()
  })
}

const handleEdit = () => {
  const tempForm: UserDialogForm = {
    ...dialogForm.value,
    password: generateMD5(dialogForm.value.password)
  }
  editUser(tempForm).then(() => {
    message.success('编辑成功')
    pageQuery()
  })
}

const dialogForm = ref<UserDialogForm>({
  id: '',
  username: '',
  password: '',
  name: ''
})

const dialogRule: Record<string, Rule[]> = {
  username: [{ required: true, message: '请输入用户名!' }],
  password: [{ required: true, message: '请输入密码!' }]
}
</script>
<template>
  <div>
    <SearchForm :searchForm="SearchFormObj" @search="handleSearch" @reset="handleReset">
      <a-form-item label="用户名" name="username">
        <Input
          v-model:value="SearchFormObj.username"
          placeholder="请输入用户名"
          :icon="BankOutlined"
        />
      </a-form-item>
      <a-form-item label="姓名" name="name">
        <Input v-model:value="SearchFormObj.name" placeholder="请输入姓名" :icon="BankOutlined" />
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
        <template v-if="column.key === 'action'">
          <span>
            <a-button type="link" @click="() => showModal('edit', record.id)">编辑</a-button>
            <a-button type="link" @click="() => showAssignRoleDialog(record.id)">添加角色</a-button>
            <a-button type="link" danger @click="() => handleDelete(record.id)">删除</a-button>
          </span>
        </template>
      </template>
    </PageTable>

    <EditDialog
      v-model:open="open"
      addTitle="新增用户"
      editTitle="编辑用户"
      :mode="mode"
      :dialogForm="dialogForm"
      :dialogRule="dialogRule"
      :handleAdd="handleAdd"
      :handleEdit="handleEdit"
    >
      <a-form-item label="用户名" name="username">
        <Input v-model:value="dialogForm.username" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item v-if="mode === 'add'" label="密码" name="password">
        <a-input-password v-model:value="dialogForm.password" placeholder="请输入密码" />
      </a-form-item>
      <a-form-item label="姓名" name="name">
        <Input v-model:value="dialogForm.name" placeholder="请输入姓名" />
      </a-form-item>
    </EditDialog>

    <AssignRoleDialog
      v-model:open="assignRoleOpen"
      :userId="assignRoleUserId"
      @success="pageQuery"
    />
  </div>
</template>
<style></style>
