import { defineStore } from 'pinia'
import type { AuthorSearchForm, TableAuthorData } from '@/types/author'
import { ref } from 'vue'
import { pageQueryAuthor } from '@/api/author'
import type { PageParams } from '@/types/common'

export const useAuthorStore = defineStore('author', () => {
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
    // 构建查询参数
    const queryParams = { ...SearchFormObjUse.value, ...pageParams.value }
    pageQueryAuthor(queryParams).then((res) => {
      tableData.value = res.data.data.data
      total.value = res.data.data.total
    })
  }

  const tableData = ref<TableAuthorData[]>([])

  // 分页
  const total = ref(0)
  const pageParams = ref<PageParams>({
    page: 1,
    pageSize: 10
  })

  return {
    SearchFormObj,
    handleSearch,
    tableData,
    total,
    pageParams
  }
})
