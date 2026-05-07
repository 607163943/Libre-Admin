<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import type { UserProfileInfo, UserPasswordForm, UserPasswordSubmit } from '@/types/user'
import type { Rule } from 'ant-design-vue/es/form'
import { useUserStore } from '@/stores/modules/user'
import type { UserInfo } from '@/types/user'
import { updateUserProfile, getUserProfile, updateUserPassword } from '@/api/user'
import { generateMD5 } from '@/utils/security-utils'
import { useRouter } from 'vue-router'

// 状态管理
const router = useRouter()
const selectedKeys = ref<string[]>(['info'])
const formState = ref<UserProfileInfo>({
  name: '系统管理员', // 对应 profile.txt 中的 name
  email: '',
  phone: ''
})

// 表单校验规则
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入用户名', trigger: 'change' }]
}

// 保存个人信息
const userStore = useUserStore()
const handleSave = () => {
  console.log('保存个人信息', formState.value)
  updateUserProfile(formState.value)
    .then(() => {
      message.success('保存成功')
      handleUserInfo()
      userStore.setUserInfo({ ...userStore.userInfo, name: formState.value.name } as UserInfo)
    })
    .catch((error) => console.log(error))
}

// 获取用户信息
const handleUserInfo = async () => {
  getUserProfile()
    .then((res) => {
      formState.value = res.data.data
    })
    .catch((error) => console.log(error))
}

onMounted(() => {
  handleUserInfo()
})

// 头像上传前的校验
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG/GIF 格式的图片!')
  }
  const isLt800K = file.size / 1024 < 800
  if (!isLt800K) {
    message.error('图片大小不能超过 800KB!')
  }
  return isJpgOrPng && isLt800K
}

// 处理头像上传变更
const handleAvatarChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    return
  }
  if (info.file.status === 'done') {
    // TODO: 调用后端接口上传文件到云存储 (如阿里云 OSS)
    // formState.avatar = info.file.response.url;
  }
}

// 密码表单状态
const passwordForm = ref<UserPasswordForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码表单检验规则
const passwordRules: Record<string, Rule[]> = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'change' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'change' }],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'change' },
    {
      validator: async (_rule: Rule, value: string) => {
        if (value !== passwordForm.value.newPassword) {
          return Promise.reject(new Error('两次输入的密码不一致'))
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ]
}

// 修改密码
const handlePasswordReset = () => {
  const submitForm: UserPasswordSubmit = {
    oldPassword: generateMD5(passwordForm.value.oldPassword),
    newPassword: generateMD5(passwordForm.value.newPassword)
  }
  updateUserPassword(submitForm)
    .then(() => {
      message.success('修改密码成功')
      userStore.setUserInfo(null)
      router.push({ name: 'Login' })
    })
    .catch((error) => console.log(error))
}
</script>
<template>
  <div class="p-6 bg-gray-50 min-h-full">
    <div class="flex flex-col md:flex-row gap-6">
      <a-card class="w-full md:w-64 flex-shrink-0 shadow-sm" :bodyStyle="{ padding: '12px 0' }">
        <div class="px-6 py-4 border-b border-gray-100 mb-2">
          <h2 class="text-lg font-medium text-gray-800">个人中心</h2>
        </div>

        <a-config-provider
          :theme="{
            components: {
              Menu: {
                itemSelectedBg: '#e6f4ff',
                itemSelectedColor: '#1677ff'
              }
            }
          }"
        >
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            :border-ed="false"
            class="border-none"
          >
            <a-menu-item key="info">
              <template #icon><UserOutlined /></template>
              个人信息
            </a-menu-item>
            <a-menu-item key="password">
              <template #icon><LockOutlined /></template>
              修改密码
            </a-menu-item>
            <a-divider class="my-2" />
            <a-menu-item key="logout" class="text-red-500">
              <template #icon><LogoutOutlined /></template>
              退出登录
            </a-menu-item>
          </a-menu>
        </a-config-provider>
      </a-card>

      <a-card
        class="flex-grow shadow-sm"
        :title="selectedKeys[0] === 'info' ? '个人信息' : '修改密码'"
      >
        <div class="max-w-3xl">
          <div v-show="selectedKeys[0] === 'info'">
            <div class="flex items-start gap-6 mb-8">
              <div class="text-center">
                <a-avatar :size="100" :src="''">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                <div class="mt-4">
                  <a-config-provider
                    :theme="{
                      components: {
                        Button: {
                          colorPrimary: '#1677ff'
                        }
                      }
                    }"
                  >
                    <a-upload
                      name="avatar"
                      :show-upload-list="false"
                      :before-upload="beforeUpload"
                      @change="handleAvatarChange"
                    >
                      <a-button type="primary">上传新图片</a-button>
                    </a-upload>
                  </a-config-provider>
                  <p class="mt-2 text-xs text-gray-400">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>
            </div>

            <a-form :rules="rules" layout="vertical" :model="formState" @finish="handleSave">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <a-form-item label="用户姓名" name="name" required>
                  <a-input v-model:value="formState.name" placeholder="请输入姓名" />
                </a-form-item>

                <a-form-item label="邮箱地址" name="email">
                  <a-input v-model:value="formState.email" placeholder="暂无此字段，需扩展" />
                </a-form-item>

                <a-form-item label="电话号码" name="phone" class="md:col-span-2">
                  <a-input v-model:value="formState.phone" placeholder="暂无此字段，需扩展" />
                </a-form-item>
              </div>

              <a-form-item class="mt-4">
                <a-config-provider
                  :theme="{
                    token: {
                      borderRadius: 4
                    }
                  }"
                >
                  <a-button type="primary" size="large" class="px-8" @click="handleSave">
                    保 存
                  </a-button>
                </a-config-provider>
              </a-form-item>
            </a-form>
          </div>

          <div v-show="selectedKeys[0] === 'password'">
            <a-form
              layout="vertical"
              :model="passwordForm"
              :rules="passwordRules"
              @finish="handlePasswordReset"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <a-form-item label="原密码" name="oldPassword" required class="md:col-span-2">
                  <a-input-password
                    v-model:value="passwordForm.oldPassword"
                    placeholder="请输入原密码"
                  />
                </a-form-item>

                <a-form-item label="新密码" name="newPassword" required class="md:col-span-2">
                  <a-input-password
                    v-model:value="passwordForm.newPassword"
                    placeholder="请输入新密码"
                  />
                </a-form-item>

                <a-form-item
                  label="确认新密码"
                  name="confirmPassword"
                  required
                  class="md:col-span-2"
                >
                  <a-input-password
                    v-model:value="passwordForm.confirmPassword"
                    placeholder="请再次输入新密码"
                  />
                </a-form-item>
              </div>

              <a-form-item class="mt-4">
                <a-config-provider
                  :theme="{
                    token: {
                      borderRadius: 4
                    }
                  }"
                >
                  <a-button html-type="submit" type="primary" size="large" class="px-8">
                    保 存
                  </a-button>
                </a-config-provider>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
/* 可以在此处添加微调样式，但大部分已由 Tailwind 处理 */
:deep(.ant-card-head-title) {
  font-weight: 600;
}
</style>
