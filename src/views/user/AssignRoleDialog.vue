<script setup lang="ts">
import { ref, watch } from 'vue'
import { getAllRole } from '@/api/role'
import { assignUserRoles, getRolesByUserId } from '@/api/user-role'
import type { RoleDialogForm } from '@/types/role'
import { message } from 'ant-design-vue'

interface TransferItem {
  key: string
  title: string
  description: string
}

const props = defineProps<{
  userId: number | string | undefined
}>()

const emit = defineEmits<{
  success: []
}>()

// 对话框开关
const open = defineModel<boolean>('open', { required: true })

// 穿梭框数据
const dataSource = ref<TransferItem[]>([])
const targetKeys = ref<string[]>([])
const confirmLoading = ref(false)

// 加载所有角色 + 当前用户已有角色（用于回显）
const loadData = async () => {
  if (!props.userId) return
  const [allRolesRes, userRolesRes] = await Promise.all([
    getAllRole(),
    getRolesByUserId(props.userId)
  ])
  const allRoles: RoleDialogForm[] = allRolesRes.data.data
  dataSource.value = allRoles.map((role) => ({
    key: String(role.id),
    title: role.roleName,
    description: role.roleName
  }))
  // 将已有角色回显到穿梭框右侧
  targetKeys.value = userRolesRes.data.data.map((item) => String(item.id))
}

// 监听对话框打开时加载数据
watch(open, (val) => {
  if (val) {
    loadData()
  }
})

// 穿梭框变更
const handleTransferChange = (nextTargetKeys: string[]) => {
  targetKeys.value = nextTargetKeys
}

// 确认
const handleOk = async () => {
  if (!props.userId) {
    message.warning('未选择用户')
    return
  }
  confirmLoading.value = true
  try {
    await assignUserRoles({
      userId: props.userId,
      roleIds: targetKeys.value.map(Number)
    })
    message.success('角色分配成功')
    emit('success')
    handleCancel()
  } catch {
    message.error('角色分配失败')
  } finally {
    confirmLoading.value = false
  }
}

// 取消
const handleCancel = () => {
  dataSource.value = []
  targetKeys.value = []
  open.value = false
}
</script>

<template>
  <a-modal
    v-model:open="open"
    title="分配用户角色"
    :confirm-loading="confirmLoading"
    :width="620"
    ok-text="确定"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="flex flex-col items-center py-4">
      <p class="mb-4 text-gray-500 text-sm">
        请将需要授予该用户的角色移入右侧列表，完成后点击确定提交。
      </p>
      <a-config-provider
        :theme="{
          token: {
            colorPrimary: '#1677ff'
          }
        }"
      >
        <a-transfer
          :data-source="dataSource"
          :target-keys="targetKeys"
          :titles="['全部角色', '已选角色']"
          :render="(item: TransferItem) => item.title"
          :list-style="{ width: '220px', height: '300px' }"
          show-search
          :filter-option="
            (inputValue: string, item: TransferItem) =>
              item.title.toLowerCase().includes(inputValue.toLowerCase())
          "
          @change="handleTransferChange"
        />
      </a-config-provider>
    </div>
  </a-modal>
</template>

<style scoped></style>
