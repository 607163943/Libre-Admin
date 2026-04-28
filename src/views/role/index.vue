<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BankOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import EditDialog from '@/components/EditDialog.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Input from '@/components/Input.vue'
import AssignPermissionDialog from './AssignPermissionDialog.vue'
import type { RoleSearchForm, TableRoleData, RoleDialogForm } from '@/types/role'
import type { PageParams, Key } from '@/types/common'
import { pageQueryRole, deleteRole, addRole, getRole, editRole, deleteBatchRole } from '@/api/role'
import { message } from 'ant-design-vue'
// 搜索表单
const SearchFormObj = ref<RoleSearchForm>({
  roleName: ''
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<RoleSearchForm>({
  roleName: ''
})

const handleReset = () => {
  SearchFormObj.value = {
    roleName: ''
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
  pageQueryRole(queryParams).then((res) => {
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
    title: '角色名',
    dataIndex: 'roleName',
    key: 'roleName'
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
  deleteRole(id).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const handleBatchDelete = () => {
  deleteBatchRole(selectedRowKeys.value.join(',')).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const tableData = ref<TableRoleData[]>([])

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
    getRole(id).then((res) => {
      dialogForm.value = res.data.data
    })
  }
  open.value = true
}

const handleAdd = () => {
  addRole(dialogForm.value).then(() => {
    message.success('添加成功')
    pageQuery()
  })
}

const handleEdit = () => {
  editRole(dialogForm.value).then(() => {
    message.success('编辑成功')
    pageQuery()
  })
}

const dialogForm = ref<RoleDialogForm>({
  id: '',
  roleName: ''
})

const dialogRule: Record<string, Rule[]> = {
  roleName: [{ required: true, message: '请输入角色名!' }]
}

// 授权对话框
const assignPermissionOpen = ref(false)
const assignRoleId = ref<number | undefined>(undefined)
const assignRoleName = ref<string | undefined>(undefined)

const showAssignPermission = (record: TableRoleData) => {
  assignRoleId.value = record.id
  assignRoleName.value = record.roleName
  assignPermissionOpen.value = true
}
</script>
<template>
  <div>
    <SearchForm :searchForm="SearchFormObj" @search="handleSearch" @reset="handleReset">
      <a-form-item label="角色名" name="roleName">
        <Input
          v-model:value="SearchFormObj.roleName"
          placeholder="请输入角色名"
          :icon="BankOutlined"
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
        <template v-if="column.key === 'action'">
            <span>
              <a-button type="link" @click="() => showAssignPermission(record)">授权</a-button>
              <a-button type="link" @click="() => showModal('edit', record.id)">编辑</a-button>
              <a-button type="link" danger @click="() => handleDelete(record.id)">删除</a-button>
            </span>
          </template>
      </template>
    </PageTable>

    <EditDialog
      v-model:open="open"
      addTitle="新增角色"
      editTitle="编辑角色"
      :mode="mode"
      :dialogForm="dialogForm"
      :dialogRule="dialogRule"
      :handleAdd="handleAdd"
      :handleEdit="handleEdit"
    >
      <a-form-item label="角色名" name="roleName">
        <Input v-model:value="dialogForm.roleName" placeholder="请输入角色名" />
      </a-form-item>
    </EditDialog>

    <AssignPermissionDialog
      v-model:open="assignPermissionOpen"
      :role-id="assignRoleId"
      :role-name="assignRoleName"
      @success="pageQuery"
    />
  </div>
</template>
<style></style>
