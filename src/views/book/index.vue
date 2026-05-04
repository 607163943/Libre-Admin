<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BookOutlined, FontColorsOutlined, GlobalOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import SearchForm from '@/components/SearchForm.vue'
import PageTable from '@/components/PageTable.vue'
import EditDialog from '@/components/EditDialog.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Input from '@/components/Input.vue'
import type { BookDialogForm, BookSearchForm, TableBookData } from '@/types/book'
import type { PageParams, Key } from '@/types/common'
import { pageQueryBook, deleteBook, addBook, getBook, editBook, deleteBatchBook } from '@/api/book'
import { message } from 'ant-design-vue'
import { getAllAuthor } from '@/api/author'
import { getAllPublisher } from '@/api/publisher'
import type { SelectProps } from 'ant-design-vue'
// 全局参数
const authorOptions = ref<SelectProps['options']>([])
const publisherOptions = ref<SelectProps['options']>([])

onMounted(() => {
  getAllAuthor().then((res) => {
    authorOptions.value = res.data.data.map((item) => {
      return {
        value: item.id,
        label: item.authorName
      }
    })
  })
  getAllPublisher().then((res) => {
    publisherOptions.value = res.data.data.map((item) => {
      return {
        value: item.id,
        label: item.publisherName
      }
    })
  })
})

// 搜索表单
const publishTimeRange = ref<[string, string] | undefined>(undefined)

const onRangeChange = (_value: any, dateString: [string, string]) => {
  if (dateString && dateString[0] && dateString[1]) {
    SearchFormObj.value.publishStartTime = dateString[0]
    SearchFormObj.value.publishEndTime = dateString[1]
  } else {
    SearchFormObj.value.publishStartTime = undefined
    SearchFormObj.value.publishEndTime = undefined
  }
}

const SearchFormObj = ref<BookSearchForm>({
  bookName: '',
  authorId: undefined,
  publisherId: undefined,
  isbn: '',
  language: '',
  publishStartTime: undefined,
  publishEndTime: undefined
})
// 正在使用的搜索表单
const SearchFormObjUse = ref<BookSearchForm>({
  bookName: '',
  authorId: undefined,
  publisherId: undefined,
  isbn: '',
  language: '',
  publishStartTime: undefined,
  publishEndTime: undefined
})

const handleReset = () => {
  publishTimeRange.value = undefined
  SearchFormObj.value = {
    bookName: '',
    authorId: undefined,
    publisherId: undefined,
    isbn: '',
    language: '',
    publishStartTime: undefined,
    publishEndTime: undefined
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
  pageQueryBook(queryParams).then((res) => {
    tableData.value = res.data.data.data.map((item) => {
      return {
        ...item,
        price: (item.price * 1.0) / 100
      }
    })
    total.value = res.data.data.total
  })
}

// 表格
onMounted(() => {
  pageQuery()
})

const columns = [
  {
    title: '书名',
    dataIndex: 'bookName',
    key: 'bookName'
  },
  {
    title: '作者',
    dataIndex: 'authorName',
    key: 'authorName'
  },
  {
    title: '出版社',
    dataIndex: 'publisherName',
    key: 'publisherName'
  },
  {
    title: 'ISBN',
    dataIndex: 'isbn',
    key: 'isbn'
  },
  {
    title: '语言',
    dataIndex: 'language',
    key: 'language'
  },
  {
    title: '出版日期',
    dataIndex: 'publishDate',
    key: 'publishDate'
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '数量',
    dataIndex: 'number',
    key: 'number'
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
  deleteBook(id).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const handleBatchDelete = () => {
  deleteBatchBook(selectedRowKeys.value.join(',')).then(() => {
    message.success('删除成功')
    // 回到首页
    pageParams.value.page = 1
    pageQuery()
  })
}

const tableData = ref<TableBookData[]>([])

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
    getBook(id).then((res) => {
      dialogForm.value = res.data.data
    })
  }
  open.value = true
}

const handleAdd = () => {
  addBook(dialogForm.value).then(() => {
    message.success('添加成功')
    pageQuery()
  })
}

const handleEdit = () => {
  editBook(dialogForm.value).then(() => {
    message.success('编辑成功')
    pageQuery()
  })
}

const dialogForm = ref<BookDialogForm>({
  id: '',
  bookName: '',
  authorId: undefined,
  publisherId: undefined,
  isbn: '',
  language: '',
  coverUrl: '',
  introduction: '',
  publishDate: undefined,
  price: 0,
  number: 0
})

const dialogRule: Record<string, Rule[]> = {
  bookName: [{ required: true, message: '请输入书名!' }],
  authorId: [{ required: true, message: '请输入作者ID!' }],
  publisherId: [{ required: true, message: '请输入出版社ID!' }],
  isbn: [{ required: true, message: '请输入ISBN!' }],
  language: [{ required: true, message: '请输入语言!' }],
  publishDate: [{ required: true, message: '请输入出版日期!' }],
  price: [{ required: true, message: '请输入价格!' }],
  number: [{ required: true, message: '请输入数量!' }]
}
</script>
<template>
  <div>
    <SearchForm :searchForm="SearchFormObj" @search="handleSearch" @reset="handleReset">
      <a-form-item label="书名" name="bookName">
        <Input
          v-model:value="SearchFormObj.bookName"
          placeholder="请输入书名"
          :icon="BookOutlined"
        />
      </a-form-item>
      <a-form-item label="作者" name="authorId">
        <a-select
          v-model:value="SearchFormObj.authorId"
          style="width: 160px"
          placeholder="请指定作者"
          :options="authorOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="出版社" name="publisherId">
        <a-select
          v-model:value="SearchFormObj.publisherId"
          style="width: 160px"
          placeholder="请指定出版社"
          :options="publisherOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="ISBN" name="isbn">
        <Input v-model:value="SearchFormObj.isbn" placeholder="请输入ISBN" :icon="GlobalOutlined" />
      </a-form-item>
      <a-form-item label="语言" name="language">
        <Input
          v-model:value="SearchFormObj.language"
          placeholder="请输入语言"
          :icon="FontColorsOutlined"
        />
      </a-form-item>
      <a-form-item label="出版日期" name="publishTimeRange">
        <a-range-picker
          v-model:value="publishTimeRange"
          value-format="YYYY-MM-DD"
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
      addTitle="新增图书"
      editTitle="编辑图书"
      :mode="mode"
      :dialogForm="dialogForm"
      :dialogRule="dialogRule"
      :handleAdd="handleAdd"
      :handleEdit="handleEdit"
    >
      <a-form-item label="书名" name="bookName">
        <Input v-model:value="dialogForm.bookName" placeholder="请输入书名" :icon="BookOutlined" />
      </a-form-item>
      <a-form-item label="作者" name="authorId">
        <a-select
          v-model:value="dialogForm.authorId"
          style="width: 100%"
          placeholder="请指定作者"
          :options="authorOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="出版社" name="publisherId">
        <a-select
          v-model:value="dialogForm.publisherId"
          style="width: 100%"
          placeholder="请指定出版社"
          :options="publisherOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="ISBN" name="isbn">
        <Input v-model:value="dialogForm.isbn" placeholder="请输入ISBN" :icon="GlobalOutlined" />
      </a-form-item>
      <a-form-item label="语言" name="language">
        <Input
          v-model:value="dialogForm.language"
          placeholder="请输入语言"
          :icon="FontColorsOutlined"
        />
      </a-form-item>
      <!-- <a-form-item label="封面" name="coverUrl">
      <a-input v-model:value="dialogForm.coverUrl" />
    </a-form-item> -->
      <a-form-item label="简介" name="introduction">
        <a-textarea v-model:value="dialogForm.introduction" :rows="4" placeholder="请输入简介" />
      </a-form-item>
      <a-form-item label="出版日期" name="publishDate">
        <a-date-picker
          class="w-full"
          v-model:value="dialogForm.publishDate"
          value-format="YYYY-MM-DD"
          placeholder="请指定出版日期"
        />
      </a-form-item>
      <a-form-item label="价格" name="price">
        <a-input-number
          class="w-full"
          v-model:value="dialogForm.price"
          :min="0"
          placeholder="请输入价格"
        />
      </a-form-item>
      <a-form-item label="数量" name="number">
        <a-input-number
          class="w-full"
          v-model:value="dialogForm.number"
          :min="0"
          placeholder="请输入数量"
        />
      </a-form-item>
    </EditDialog>
  </div>
</template>
<style></style>
