<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BankOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import EditDialog from '@/components/EditDialog.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Input from '@/components/Input.vue'
import type { ModuleForm, TableModuleData, ModuleDialogForm } from '@/types/module'
import type { PageParams, Key } from '@/types/common'
import {
  pageQueryModule,
  deleteModule,
  addModule,
  getModule,
  editModule,
  deleteBatchModule
} from '@/api/module'
import { message } from 'ant-design-vue'
// 搜索表单
const SearchFormObj = ref<ModuleForm>({
  moduleName: '',
  clientType: undefined
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<ModuleForm>({
  moduleName: '',
  clientType: undefined
})

const handleReset = () => {
  SearchFormObj.value = {
    moduleName: '',
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
  pageQueryModule(queryParams).then((res) => {
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
    title: '模块名称',
    dataIndex: 'moduleName',
    key: 'moduleName'
  },
  {
    title: '模块编码',
    dataIndex: 'moduleKey',
    key: 'moduleKey'
  },
  {
    title: '客户端类型',
    key: 'clientType'
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

const handleDelete = (id: number) => {
  deleteModule(id).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const handleBatchDelete = () => {
  deleteBatchModule(selectedRowKeys.value.join(',')).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const tableData = ref<TableModuleData[]>([])

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
    getModule(id).then((res) => {
      dialogForm.value = res.data.data
    })
  }
  open.value = true
}

const handleAdd = () => {
  addModule(dialogForm.value).then(() => {
    message.success('添加成功')
    pageQuery()
  })
}

const handleEdit = () => {
  editModule(dialogForm.value).then(() => {
    message.success('编辑成功')
    pageQuery()
  })
}

const dialogForm = ref<ModuleDialogForm>({
  id: '',
  moduleName: '',
  moduleKey: '',
  clientType: 1
})

const dialogRule: Record<string, Rule[]> = {
  moduleName: [{ required: true, message: '请输入模块名称!' }],
  moduleKey: [{ required: true, message: '请输入模块编码!' }],
  clientType: [{ required: true, message: '请输入客户端类型!' }]
}
</script>
<template>
  <div>
    <SearchForm :searchForm="SearchFormObj" @search="handleSearch" @reset="handleReset">
      <a-form-item label="模块名称" name="moduleName">
        <Input
          v-model:value="SearchFormObj.moduleName"
          placeholder="请输入模块名称"
          :icon="BankOutlined"
        />
      </a-form-item>
      <a-form-item label="客户端类型" name="clientType">
        <a-select
          v-model:value="SearchFormObj.clientType"
          style="width: 150px"
          placeholder="请选择客户端类型"
        >
          <a-select-option value="1">管理端</a-select-option>
          <a-select-option value="2">app端</a-select-option>
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
          {{ record.clientType === 1 ? '管理端' : 'app端' }}
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a-button type="link" @click="() => showModal('edit', record.id)">编辑</a-button>
            <a-button type="link" danger @click="() => handleDelete(record.id)">删除</a-button>
          </span>
        </template>
      </template>
    </PageTable>

    <EditDialog
      v-model:open="open"
      addTitle="新增模块"
      editTitle="编辑模块"
      :mode="mode"
      :dialogForm="dialogForm"
      :dialogRule="dialogRule"
      :handleAdd="handleAdd"
      :handleEdit="handleEdit"
    >
      <a-form-item label="模块名称" name="moduleName">
        <Input
          v-model:value="dialogForm.moduleName"
          placeholder="请输入模块名称"
          :icon="BankOutlined"
        />
      </a-form-item>
      <a-form-item label="模块编码" name="moduleKey">
        <Input
          v-model:value="dialogForm.moduleKey"
          placeholder="请输入模块编码"
          :icon="BankOutlined"
        />
      </a-form-item>
      <a-form-item label="客户端类型" name="clientType">
        <a-select v-model:value="dialogForm.clientType" placeholder="请选择客户端类型">
          <a-select-option :value="1">管理端</a-select-option>
          <a-select-option :value="2">app端</a-select-option>
        </a-select>
      </a-form-item>
    </EditDialog>
  </div>
</template>
<style></style>
