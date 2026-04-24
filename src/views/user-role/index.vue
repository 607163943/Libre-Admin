<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import EditDialog from '@/components/EditDialog.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import type { UserRoleDialogForm, UserRoleSearchForm, TableUserRoleData } from '@/types/user-role'
import type { Key } from '@/types/common'
import type { PageParams } from '@/types/common'
import { message, type SelectProps } from 'ant-design-vue'
import { getAllRole } from '@/api/role'
import { getAllUser } from '@/api/user'
import {
  pageQueryUserRole,
  getUserRole,
  addUserRole,
  editUserRole,
  deleteUserRole,
  deleteBatchUserRole
} from '@/api/user-role'
// 全局参数
const userOptions = ref<SelectProps['options']>([])
const roleOptions = ref<SelectProps['options']>([])

onMounted(() => {
  getAllUser().then((res) => {
    userOptions.value = res.data.data.map((item) => {
      return {
        value: item.id,
        label: item.username
      }
    })
  })
  getAllRole().then((res) => {
    roleOptions.value = res.data.data.map((item) => {
      return {
        value: item.id,
        label: item.roleName
      }
    })
  })
})

// 搜索表单
const SearchFormObj = ref<UserRoleSearchForm>({
  roleId: undefined
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<UserRoleSearchForm>({
  roleId: undefined
})

const handleReset = () => {
  SearchFormObj.value = {
    roleId: undefined
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
  pageQueryUserRole(queryParams).then((res) => {
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
  deleteUserRole(id).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const handleBatchDelete = () => {
  deleteBatchUserRole(selectedRowKeys.value.join(',')).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const tableData = ref<TableUserRoleData[]>([])

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
    getUserRole(id).then((res) => {
      dialogForm.value = res.data.data
    })
  }
  open.value = true
}

const handleAdd = () => {
  addUserRole(dialogForm.value).then(() => {
    message.success('添加成功')
    pageQuery()
  })
}

const handleEdit = () => {
  editUserRole(dialogForm.value).then(() => {
    message.success('编辑成功')
    pageQuery()
  })
}

const dialogForm = ref<UserRoleDialogForm>({
  id: '',
  userId: undefined,
  roleId: undefined
})

const dialogRule: Record<string, Rule[]> = {
  userId: [{ required: true, message: '请输入用户名!' }],
  roleId: [{ required: true, message: '请输入角色名!' }]
}
</script>
<template>
  <div>
    <SearchForm :searchForm="SearchFormObj" @search="handleSearch" @reset="handleReset">
      <a-form-item label="角色名" name="roleId">
        <a-select
          v-model:value="SearchFormObj.roleId"
          style="width: 160px"
          placeholder="请指定角色名"
          :options="roleOptions"
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
      <a-form-item label="用户" name="userId">
        <a-select
          v-model:value="dialogForm.userId"
          style="width: 100%"
          placeholder="请指定用户"
          :options="userOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="角色" name="roleId">
        <a-select
          v-model:value="dialogForm.roleId"
          style="width: 100%"
          placeholder="请指定角色"
          :options="roleOptions"
        >
        </a-select>
      </a-form-item>
    </EditDialog>
  </div>
</template>
<style></style>
