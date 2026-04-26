<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { getAllPermissionWithCode } from '@/api/permission'
import { getAllModule } from '@/api/module'
import { getPermissionsByRoleId, assignRolePermissions } from '@/api/role-permission'
import type { PermissionCodeForm } from '@/types/permission'
import type { ModuleDialogForm } from '@/types/module'
import { message } from 'ant-design-vue'

// -------- Props / Emits / Model --------
const props = defineProps<{
  roleId: number | string | undefined
  roleName?: string
}>()

const emit = defineEmits<{
  success: []
}>()

const open = defineModel<boolean>('open', { required: true })

// -------- State --------
const confirmLoading = ref(false)
const allPermissions = ref<PermissionCodeForm[]>([])
const allModules = ref<ModuleDialogForm[]>([])
const checkedPermissionIds = ref<Set<number>>(new Set())

// 当前激活的 Tab：'1' = 管理端，'2' = App 端
const activeTab = ref<string>('1')

// -------- Types --------
interface MatrixRow {
  key: string
  moduleName: string
  moduleKey: string
  permissions: PermissionCodeForm[]
}

// 权限码格式：端前缀:模块Key:操作，例如 admin:user:add / app:book:view
// 端前缀映射：admin → clientType 1（管理端），app → clientType 2（App 端）
const clientPrefixMap: Record<string, number> = {
  admin: 1,
  app: 2
}

// 从权限码提取模块 Key（第二段）
const getModuleKey = (permissionCode: string) => permissionCode.split(':')[1] ?? permissionCode

// 从权限码提取所属端 clientType
const getClientType = (permissionCode: string): number => {
  const prefix = permissionCode.split(':')[0] ?? ''
  return clientPrefixMap[prefix] ?? 1
}

// -------- 按端类型 + 模块分组的矩阵行计算 --------
const buildMatrixRows = (clientType: number): MatrixRow[] => {
  // moduleKey → module 信息（仅当前端类型的模块）
  const moduleMap = new Map<string, ModuleDialogForm>()
  allModules.value
    .filter((m) => m.clientType === clientType)
    .forEach((m) => moduleMap.set(m.moduleKey, m))

  // 仅保留属于该端的权限，按模块分组
  const grouped = new Map<string, PermissionCodeForm[]>()
  allPermissions.value
    .filter((p) => getClientType(p.permissionCode) === clientType)
    .forEach((p) => {
      const key = getModuleKey(p.permissionCode)
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key)!.push(p)
    })

  const rows: MatrixRow[] = []
  grouped.forEach((perms, key) => {
    const mod = moduleMap.get(key)
    rows.push({
      key,
      moduleName: mod?.moduleName ?? key,
      moduleKey: key,
      permissions: perms
    })
  })
  return rows
}

const adminRows = computed<MatrixRow[]>(() => buildMatrixRows(1))
const appRows = computed<MatrixRow[]>(() => buildMatrixRows(2))

// -------- 表格列定义 --------
const columns = [
  {
    title: '模块',
    dataIndex: 'moduleName',
    key: 'moduleName',
    width: 160
  },
  {
    title: '权限',
    key: 'permissions'
  }
]

// -------- 数据加载 --------
const loadData = async () => {
  if (!props.roleId) return
  try {
    const [allPermsRes, allModsRes, rolePermsRes] = await Promise.all([
      getAllPermissionWithCode(),
      getAllModule(),
      getPermissionsByRoleId(props.roleId)
    ])
    allPermissions.value = allPermsRes.data.data
    allModules.value = allModsRes.data.data
    checkedPermissionIds.value = new Set(rolePermsRes.data.data)
  } catch {
    message.error('加载权限数据失败')
  }
}

watch(open, (val) => {
  if (val) {
    activeTab.value = '1'
    checkedPermissionIds.value = new Set()
    allPermissions.value = []
    allModules.value = []
    loadData()
  }
})

// -------- 复选框辅助 --------
const isChecked = (id: number) => checkedPermissionIds.value.has(id)

const togglePermission = (id: number, checked: boolean) => {
  const next = new Set(checkedPermissionIds.value)
  if (checked) next.add(id)
  else next.delete(id)
  checkedPermissionIds.value = next
}

const isRowAllChecked = (row: MatrixRow) =>
  row.permissions.length > 0 &&
  row.permissions.every((p) => checkedPermissionIds.value.has(Number(p.id)))

const isRowIndeterminate = (row: MatrixRow) =>
  !isRowAllChecked(row) && row.permissions.some((p) => checkedPermissionIds.value.has(Number(p.id)))

const toggleRowAll = (row: MatrixRow, checked: boolean) => {
  const next = new Set(checkedPermissionIds.value)
  row.permissions.forEach((p) => {
    if (checked) next.add(Number(p.id))
    else next.delete(Number(p.id))
  })
  checkedPermissionIds.value = next
}

// -------- 提交 / 取消 --------
const handleOk = async () => {
  if (!props.roleId) {
    message.warning('未选择角色')
    return
  }
  confirmLoading.value = true
  try {
    await assignRolePermissions({
      roleId: props.roleId,
      permissionIds: Array.from(checkedPermissionIds.value)
    })
    message.success('权限授权成功')
    emit('success')
    open.value = false
  } catch {
    message.error('权限授权失败')
  } finally {
    confirmLoading.value = false
  }
}

const handleCancel = () => {
  open.value = false
}
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="`授权 — ${roleName ?? '角色'}`"
    :confirm-loading="confirmLoading"
    :width="760"
    ok-text="确定"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <p class="mb-3 text-gray-500 text-sm">
      勾选该角色应拥有的权限，管理端与 App 端权限独立管理，完成后点击确定提交。
    </p>

    <a-config-provider
      :theme="{
        token: {
          colorPrimary: '#1677ff'
        }
      }"
    >
      <a-tabs v-model:activeKey="activeTab" type="card">
        <!-- 管理端 Tab -->
        <a-tab-pane key="1" tab="管理端">
          <a-table
            :columns="columns"
            :data-source="adminRows"
            :pagination="false"
            size="middle"
            bordered
            :scroll="{ y: 360 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'moduleName'">
                <a-checkbox
                  :checked="isRowAllChecked(record)"
                  :indeterminate="isRowIndeterminate(record)"
                  @change="(e: any) => toggleRowAll(record, e.target.checked)"
                >
                  <span class="font-medium">{{ record.moduleName }}</span>
                </a-checkbox>
              </template>
              <template v-else-if="column.key === 'permissions'">
                <div class="flex flex-wrap gap-x-6 gap-y-2 py-1">
                  <a-checkbox
                    v-for="perm in record.permissions"
                    :key="perm.id"
                    :checked="isChecked(Number(perm.id))"
                    @change="(e: any) => togglePermission(Number(perm.id), e.target.checked)"
                  >
                    {{ perm.permissionDesc }}
                  </a-checkbox>
                </div>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- App 端 Tab -->
        <a-tab-pane key="2" tab="App 端">
          <a-table
            :columns="columns"
            :data-source="appRows"
            :pagination="false"
            size="middle"
            bordered
            :scroll="{ y: 360 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'moduleName'">
                <a-checkbox
                  :checked="isRowAllChecked(record)"
                  :indeterminate="isRowIndeterminate(record)"
                  @change="(e: any) => toggleRowAll(record, e.target.checked)"
                >
                  <span class="font-medium">{{ record.moduleName }}</span>
                </a-checkbox>
              </template>
              <template v-else-if="column.key === 'permissions'">
                <div class="flex flex-wrap gap-x-6 gap-y-2 py-1">
                  <a-checkbox
                    v-for="perm in record.permissions"
                    :key="perm.id"
                    :checked="isChecked(Number(perm.id))"
                    @change="(e: any) => togglePermission(Number(perm.id), e.target.checked)"
                  >
                    {{ perm.permissionDesc }}
                  </a-checkbox>
                </div>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-config-provider>
  </a-modal>
</template>

<style scoped></style>
