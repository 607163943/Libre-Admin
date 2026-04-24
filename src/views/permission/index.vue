<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BankOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import EditDialog from '@/components/EditDialog.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Input from '@/components/Input.vue'
import type { PermissionForm, TablePermissionData, PermissionDialogForm } from '@/types/permission'
import type { PageParams, Key } from '@/types/common'
import {
  pageQueryPermission,
  deletePermission,
  addPermission,
  getPermission,
  editPermission,
  deleteBatchPermission
} from '@/api/permission'
import { message } from 'ant-design-vue'
// 搜索表单
const SearchFormObj = ref<PermissionForm>({
  permissionCode: ''
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<PermissionForm>({
  permissionCode: ''
})

const handleReset = () => {
  SearchFormObj.value = {
    permissionCode: ''
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
  pageQueryPermission(queryParams).then((res) => {
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
    title: '权限编码',
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
  deletePermission(id).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const handleBatchDelete = () => {
  deleteBatchPermission(selectedRowKeys.value.join(',')).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const tableData = ref<TablePermissionData[]>([])

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
    getPermission(id).then((res) => {
      dialogForm.value = res.data.data
    })
  }
  open.value = true
}

const handleAdd = () => {
  addPermission(dialogForm.value).then(() => {
    message.success('添加成功')
    pageQuery()
  })
}

const handleEdit = () => {
  editPermission(dialogForm.value).then(() => {
    message.success('编辑成功')
    pageQuery()
  })
}

const dialogForm = ref<PermissionDialogForm>({
  id: '',
  permissionCode: '',
  permissionDesc: ''
})

const dialogRule: Record<string, Rule[]> = {
  permissionCode: [{ required: true, message: '请输入权限编码!' }],
  permissionDesc: [{ required: true, message: '请输入权限描述!' }]
}
</script>
<template>
  <div>
    <SearchForm :searchForm="SearchFormObj" @search="handleSearch" @reset="handleReset">
      <a-form-item label="权限编码" name="permissionCode">
        <Input
          v-model:value="SearchFormObj.permissionCode"
          placeholder="请输入权限编码"
          :icon="BankOutlined"
        />
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
      addTitle="新增权限"
      editTitle="编辑权限"
      :mode="mode"
      :dialogForm="dialogForm"
      :dialogRule="dialogRule"
      :handleAdd="handleAdd"
      :handleEdit="handleEdit"
    >
      <a-form-item label="权限编码" name="permissionCode">
        <Input
          v-model:value="dialogForm.permissionCode"
          placeholder="请输入权限编码"
          :icon="BankOutlined"
        />
      </a-form-item>
      <a-form-item label="权限描述" name="permissionDesc">
        <Input
          v-model:value="dialogForm.permissionDesc"
          placeholder="请输入权限描述"
          :icon="BankOutlined"
        />
      </a-form-item>
    </EditDialog>
  </div>
</template>
<style></style>
