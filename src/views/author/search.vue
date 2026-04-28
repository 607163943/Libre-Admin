<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import SearchForm from '@/components/SearchForm.vue'
import { useAuthorStore } from '@/stores/modules/author'
import Input from '@/components/Input.vue'
import { storeToRefs } from 'pinia'
defineOptions({
  name: 'AuthorSearch'
})

const authorStore = useAuthorStore()
const { SearchFormObj } = storeToRefs(authorStore)
const { pageQuery, handleSearch } = authorStore

const handleReset = () => {
  SearchFormObj.value = {
    authorName: ''
  }

  pageQuery()
}
</script>
<template>
  <div>
    <SearchForm :searchForm="SearchFormObj" @search="handleSearch" @reset="handleReset">
      <a-form-item label="作者名" name="authorName">
        <Input
          v-model:value="SearchFormObj.authorName"
          placeholder="请输入作者名"
          :icon="UserOutlined"
        />
      </a-form-item>
      <template #buttons>
        <slot name="button"></slot>
      </template>
    </SearchForm>
  </div>
</template>
