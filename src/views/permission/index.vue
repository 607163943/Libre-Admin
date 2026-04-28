<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BankOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import EditDialog from '@/components/EditDialog.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Input from '@/components/Input.vue'
import type { PermissionForm, TablePermissionData, PermissionDialogForm } from '@/types/permission'
import type { ModuleDialogForm } from '@/types/module'
import type { PageParams, Key } from '@/types/common'
import {
  pageQueryPermission,
  deletePermission,
  addPermission,
  getPermission,
  editPermission,
  deleteBatchPermission
} from '@/api/permission'
import { getAllModule } from '@/api/module'
import { message } from 'ant-design-vue'
// 搜索表单
const SearchFormObj = ref<PermissionForm>({
  permissionCode: '',
  moduleId: undefined,
  clientType: undefined
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<PermissionForm>({
  permissionCode: '',
  moduleId: undefined,
  clientType: undefined
})

// 模块列表
const moduleList = ref<ModuleDialogForm[]>([])

onMounted(() => {
  getAllModule().then((res) => {
    moduleList.value = res.data.data
  })
})

const searchCascaderValue = ref<number[]>([])

const handleReset = () => {
  SearchFormObj.value = {
    permissionCode: '',
    moduleId: undefined,
    clientType: undefined
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

// 级联选择器绑定值 [clientType, moduleId]
const cascaderValue = ref<number[]>([])

// 表格
onMounted(() => {
  pageQuery()
})

const columns = [
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
    title: '所属模块',
    dataIndex: 'moduleName',
    key: 'moduleName'
  },
  {
    title: '客户端类型',
    key: 'clientType'
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
      // 回填级联选择器：找到该模块对应的客户端类型
      const mod = moduleList.value.find((m) => m.id === res.data.data.moduleId)
      cascaderValue.value = mod ? [mod.clientType as number, res.data.data.moduleId as number] : []
    })
  } else {
    cascaderValue.value = []
  }
  open.value = true
}

// 客户端名称映射
const clientTypeLabel: Record<number, string> = {
  1: '管理端',
  2: 'App端'
}

// 二级级联选项：外层客户端，内层模块
const cascaderOptions = computed(() => {
  const groups: Record<
    number,
    { label: string; value: number; children: { label: string; value: number }[] }
  > = {}
  for (const m of moduleList.value) {
    const ct = m.clientType as number
    if (!groups[ct]) {
      groups[ct] = { label: clientTypeLabel[ct] ?? `客户端${ct}`, value: ct, children: [] }
    }
    groups[ct].children.push({ label: m.moduleName, value: m.id as number })
  }
  return Object.values(groups)
})

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
  actionCode: '',
  permissionDesc: '',
  moduleId: undefined
})

const dialogRule: Record<string, Rule[]> = {
  actionCode: [{ required: true, message: '请输入操作编码!' }],
  permissionDesc: [{ required: true, message: '请输入权限描述!' }],
  moduleId: [{ required: true, message: '请选择所属模块!' }]
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
      <a-form-item label="所属模块" name="moduleId">
        <a-cascader
          v-model:value="searchCascaderValue"
          :options="cascaderOptions"
          placeholder="请选择客户端 / 模块"
          :field-names="{ label: 'label', value: 'value', children: 'children' }"
          expand-trigger="hover"
          @change="(value: number[]) => (SearchFormObj.moduleId = value[1])"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="客户端类型" name="clientType">
        <a-select
          v-model:value="SearchFormObj.clientType"
          placeholder="请选择客户端类型"
          style="width: 140px"
        >
          <a-select-option :value="1">管理端</a-select-option>
          <a-select-option :value="2">app端</a-select-option>
        </a-select>
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
        <template v-if="column.key === 'clientType'">
          {{ clientTypeLabel[record.clientType] }}
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
      addTitle="新增权限"
      editTitle="编辑权限"
      :mode="mode"
      :dialogForm="dialogForm"
      :dialogRule="dialogRule"
      :handleAdd="handleAdd"
      :handleEdit="handleEdit"
    >
      <a-form-item label="操作编码" name="actionCode">
        <Input
          v-model:value="dialogForm.actionCode"
          placeholder="请输入操作编码"
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
      <a-form-item label="所属模块" name="moduleId">
        <a-cascader
          v-model:value="cascaderValue"
          :options="cascaderOptions"
          placeholder="请选择客户端 / 模块"
          :field-names="{ label: 'label', value: 'value', children: 'children' }"
          expand-trigger="hover"
          @change="(value: number[]) => (dialogForm.moduleId = value[1])"
          allow-clear
        />
      </a-form-item>
    </EditDialog>
  </div>
</template>
<style></style>
