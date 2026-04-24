<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import EditDialog from '@/components/EditDialog.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import type {
  RolePermissionDialogForm,
  RolePermissionSearchForm,
  TableRolePermissionData
} from '@/types/role-permission'
import type { Key } from '@/types/common'
import type { PageParams } from '@/types/common'
import { message, type SelectProps } from 'ant-design-vue'
import { getAllRole } from '@/api/role'
import { getAllPermission } from '@/api/permission'
import {
  pageQueryRolePermission,
  getRolePermission,
  addRolePermission,
  editRolePermission,
  deleteRolePermission,
  deleteBatchRolePermission
} from '@/api/role-permission'
// 全局参数
const permissionOptions = ref<SelectProps['options']>([])
const roleOptions = ref<SelectProps['options']>([])

onMounted(() => {
  getAllPermission().then((res) => {
    permissionOptions.value = res.data.data.map((item) => {
      return {
        value: item.id,
        label: item.permissionCode
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
const SearchFormObj = ref<RolePermissionSearchForm>({
  roleId: undefined,
  permissionId: undefined
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<RolePermissionSearchForm>({
  roleId: undefined,
  permissionId: undefined
})

const handleReset = () => {
  SearchFormObj.value = {
    roleId: undefined,
    permissionId: undefined
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
  pageQueryRolePermission(queryParams).then((res) => {
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
    title: '权限码',
    dataIndex: 'permissionCode',
    key: 'permissionCode'
  },
  {
    title: '权限描述',
    dataIndex: 'permissionDesc',
    key: 'permissionDesc'
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
  deleteRolePermission(id).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const handleBatchDelete = () => {
  deleteBatchRolePermission(selectedRowKeys.value.join(',')).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const tableData = ref<TableRolePermissionData[]>([])

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
    getRolePermission(id).then((res) => {
      dialogForm.value = res.data.data
    })
  }
  open.value = true
}

const handleAdd = () => {
  addRolePermission(dialogForm.value).then(() => {
    message.success('添加成功')
    pageQuery()
  })
}

const handleEdit = () => {
  editRolePermission(dialogForm.value).then(() => {
    message.success('编辑成功')
    pageQuery()
  })
}

const dialogForm = ref<RolePermissionDialogForm>({
  id: '',
  roleId: undefined,
  permissionId: undefined
})

const dialogRule: Record<string, Rule[]> = {
  roleId: [{ required: true, message: '请输入角色名!' }],
  permissionId: [{ required: true, message: '请输入权限码!' }]
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
      <a-form-item label="权限码" name="permissionId">
        <a-select
          v-model:value="SearchFormObj.permissionId"
          style="width: 160px"
          placeholder="请指定权限码"
          :options="permissionOptions"
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
      addTitle="新增角色权限"
      editTitle="编辑角色权限"
      :mode="mode"
      :dialogForm="dialogForm"
      :dialogRule="dialogRule"
      :handleAdd="handleAdd"
      :handleEdit="handleEdit"
    >
      <a-form-item label="角色" name="roleId">
        <a-select
          v-model:value="dialogForm.roleId"
          style="width: 100%"
          placeholder="请指定角色"
          :options="roleOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="权限" name="permissionId">
        <a-select
          v-model:value="dialogForm.permissionId"
          style="width: 100%"
          placeholder="请指定权限"
          :options="permissionOptions"
        >
        </a-select>
      </a-form-item>
    </EditDialog>
  </div>
</template>
<style></style>
