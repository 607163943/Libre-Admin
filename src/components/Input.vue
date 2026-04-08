<script setup lang="ts">
import { toRefs } from 'vue'
import type { Component } from 'vue'
defineOptions({
  name: 'TextInput'
})
const props = defineProps<{
  placeholder: string
  icon?: Component
}>()

const value = defineModel('value')
const { placeholder, icon } = toRefs(props)
</script>
<template>
  <a-input v-model:value="value" :placeholder="placeholder">
    <template #prefix>
      <component v-if="icon" :is="icon" class="site-form-item-icon" />
    </template>
  </a-input>
</template>
