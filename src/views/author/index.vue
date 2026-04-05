<script setup lang="ts">
import { reactive, ref } from 'vue'
import { UserOutlined, PlusOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons-vue'
import { useLayoutStore } from '@/stores/modules/layout'
import { storeToRefs } from 'pinia'
import type { Rule } from 'ant-design-vue/es/form'
import SearchForm from '@/components/SearchForm.vue'
import type { AuthorSearchForm } from '@/types/author'
import { pageQueryAuthor } from '@/api/author'
// 搜索表单
const SearchFormObj = ref<AuthorSearchForm>({
  authorName: ''
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<AuthorSearchForm>({
  authorName: ''
})

const handleSearch = () => {
  // 复制一份搜索表单
  SearchFormObjUse.value = { ...SearchFormObj.value }
  pageQueryAuthor(SearchFormObjUse.value).then((res) => {
    console.log(res)
  })
}

// 表格
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
const layoutStore = useLayoutStore()
const { isMobile } = storeToRefs(layoutStore)

const columns = [
  {
    name: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags'
  },
  {
    title: 'Action',
    key: 'action'
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  },
  {
    key: '4',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '5',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '6',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  },
  {
    key: '7',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '8',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '9',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  },
  {
    key: '10',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '11',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '12',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]

// 分页
const current = ref(6)

// 对话框
const modalText = ref<string>('Content of the modal')
const open = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)

const showModal = () => {
  open.value = true
}

const handleOk = async () => {
  modalText.value = 'The modal will be closed after two seconds'
  confirmLoading.value = true
  formRef.value.validate().catch(() => {})
  setTimeout(() => {
    open.value = false
    confirmLoading.value = false
  }, 2000)
}

interface DialogFormState {
  username: string
}

const dialogForm = reactive<DialogFormState>({
  username: ''
})

const formRef = ref()
const dialogRule: Record<string, Rule[]> = {
  username: [{ required: true, message: 'Please input your username!' }]
}
</script>
<template>
  <SearchForm :searchForm="SearchFormObj" @search="handleSearch">
    <a-form-item label="作者名" name="authorName">
      <a-input v-model:value="SearchFormObj.authorName">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>
  </SearchForm>
  <div class="mt-2 space-x-3">
    <a-button type="primary"> <PlusOutlined />新增 </a-button>
    <a-button type="primary" danger> <DeleteOutlined />删除 </a-button>
    <a-button><SyncOutlined /> 刷新</a-button>
  </div>

  <div>
    <div class="mt-4">
      <!-- 该表格通过卸载、重新渲染来解决PC端和移动端重复切换时，表格滚动条渲染后固定存在的问题 -->
      <!-- 每次切换都是重新渲染，性能优化时注意这个组件 -->
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :key="isMobile ? 'mobile-table' : 'pc-table'"
        :scroll="isMobile ? { x: 1500 } : undefined"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'name'">
            <span>
              <smile-outlined />
              Name
            </span>
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a>
              {{ record.name }}
            </a>
          </template>
          <template v-else-if="column.key === 'tags'">
            <span>
              <a-tag
                v-for="tag in record.tags"
                :key="tag"
                :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
              >
                {{ tag.toUpperCase() }}
              </a-tag>
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <span>
              <a>Invite 一 {{ record.name }}</a>
              <a-divider type="vertical" />
              <a>Delete</a>
              <a-divider type="vertical" />
              <a class="ant-dropdown-link">
                More actions
                <down-outlined />
              </a>
            </span>
          </template>
        </template>
      </a-table>
    </div>

    <div class="flex justify-end mt-4">
      <a-pagination v-model:current="current" :total="500" :size="isMobile ? 'small' : 'default'" />
    </div>
  </div>

  <div>
    <a-button type="primary" @click="showModal">Open Modal with async logic</a-button>
    <a-modal v-model:open="open" title="Title" :confirm-loading="confirmLoading" @ok="handleOk">
      <a-form
        ref="formRef"
        :model="dialogForm"
        :rules="dialogRule"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
      >
        <a-form-item label="Username" name="username">
          <a-input v-model:value="dialogForm.username" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<style></style>
