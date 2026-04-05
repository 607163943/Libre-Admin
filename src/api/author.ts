import request from '@/utils/request'
import type { AuthorSearchForm, TableAuthorData } from '@/types/author'
import type { Result, PageResult } from '@/types/common'

// 分页查询作者
export const pageQueryAuthor = (params: AuthorSearchForm) => {
  return request.get<Result<PageResult<TableAuthorData[]>>>('/author', { params })
}
