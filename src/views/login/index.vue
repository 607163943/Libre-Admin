<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { login } from '@/api/login'
import type { LoginForm } from '@/types/login'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import type { Rule } from 'ant-design-vue/es/form'
import loginBg from '@/assets/login-bg-left.svg'

// ─── 表单状态 ───────────────────────────────────────────────
const form = ref<LoginForm>({
  username: '',
  password: ''
})

const passwordVisible = ref(false)
const loading = ref(false)

// ─── 响应式断点 ─────────────────────────────────────────────
const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// ─── 登录处理 ───────────────────────────────────────────────
const formRule: Record<string, Rule[]> = {
  username: [{ required: true, message: '请输入用户名!' }],
  password: [{ required: true, message: '请输入密码!' }]
}

const userStore = useUserStore()
const router = useRouter()
const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    message.warning('请填写密码')
    return
  }
  loading.value = true
  login(form.value)
    .then((res) => {
      // 令牌存储
      userStore.setUserInfo(res.data.data)
      // 跳转至首页
      router.push({ name: 'Home' })
      message.success('登录成功')
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-50 font-sans">
    <!-- ════════════════ 左侧装饰区 ════════════════ -->
    <div
      v-if="!isMobile"
      class="relative hidden md:flex flex-col items-center justify-end w-1/2 bg-gradient-to-br from-slate-100 to-gray-200 overflow-hidden select-none"
    >
      <!-- 背景大圆 -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-white/60 pointer-events-none"
      />
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-white/40 pointer-events-none"
      />

      <!-- 品牌 Logo（左上角） -->
      <div class="absolute top-6 left-6 flex items-center gap-2">
        <span class="text-blue-500 text-2xl font-bold">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 14L14 4L24 14L14 24L4 14Z" fill="#3B82F6" />
            <path d="M9 14L14 9L19 14L14 19L9 14Z" fill="#93C5FD" />
          </svg>
        </span>
        <span class="text-gray-800 text-xl font-bold tracking-tight">Libre Admin</span>
      </div>

      <!-- 数据卡片：Profit -->
      <div
        class="absolute top-[22%] left-[12%] bg-white rounded-2xl shadow-lg px-5 py-4 w-44 animate-float"
      >
        <p class="text-xs text-gray-400 font-medium">Profit</p>
        <p class="text-[10px] text-gray-300 mb-2">Last Month</p>
        <!-- 迷你折线图占位 -->
        <svg viewBox="0 0 80 30" class="w-full h-7 mb-2">
          <polyline
            points="0,28 15,18 30,20 45,8 60,12 80,2"
            fill="none"
            stroke="#06B6D4"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="80" cy="2" r="3" fill="#06B6D4" />
        </svg>
        <div class="flex items-baseline gap-2">
          <span class="text-xl font-bold text-gray-800">624k</span>
          <span class="text-[10px] text-emerald-500 font-semibold bg-emerald-50 px-1 rounded"
            >+6.24%</span
          >
        </div>
      </div>

      <!-- 数据卡片：Order -->
      <div
        class="absolute top-[42%] right-[10%] bg-white rounded-2xl shadow-lg px-5 py-4 w-44 animate-float-delay"
      >
        <p class="text-xs text-gray-400 font-medium">Order</p>
        <p class="text-[10px] text-gray-300 mb-2">Last week</p>
        <!-- 迷你柱状图占位 -->
        <svg viewBox="0 0 80 30" class="w-full h-7 mb-2">
          <rect x="4" y="14" width="8" height="16" rx="2" fill="#818CF8" />
          <rect x="16" y="8" width="8" height="22" rx="2" fill="#818CF8" />
          <rect x="28" y="4" width="8" height="26" rx="2" fill="#6366F1" />
          <rect x="40" y="10" width="8" height="20" rx="2" fill="#818CF8" />
          <rect x="52" y="6" width="8" height="24" rx="2" fill="#6366F1" />
          <rect x="64" y="12" width="8" height="18" rx="2" fill="#818CF8" />
        </svg>
        <div class="flex items-baseline gap-2">
          <span class="text-xl font-bold text-gray-800">124k</span>
          <span class="text-[10px] text-emerald-500 font-semibold bg-emerald-50 px-1 rounded"
            >+2.6%</span
          >
        </div>
      </div>

      <!-- 虚拟人物插图（用 SVG 占位，可替换为真实图片） -->
      <div
        class="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center pointer-events-none"
      >
        <img
          :src="loginBg"
          alt="illustration"
          class="w-56 h-56 object-contain opacity-70 bottom-40 relative"
          draggable="false"
        />
      </div>
    </div>

    <!-- ════════════════ 右侧登录区 ════════════════ -->
    <div class="flex flex-col justify-center w-full md:w-1/2 px-8 sm:px-16 xl:px-24 py-12">
      <!-- 移动端 Logo -->
      <div v-if="isMobile" class="flex items-center gap-2 mb-8">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
          <path d="M4 14L14 4L24 14L14 24L4 14Z" fill="#3B82F6" />
          <path d="M9 14L14 9L19 14L14 19L9 14Z" fill="#93C5FD" />
        </svg>
        <span class="text-gray-800 text-lg font-bold">Libre Admin</span>
      </div>

      <!-- 标题区 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Welcome to Libre Admin! 👋</h1>
        <p class="text-sm text-gray-500">Please sign-in to your account and start the adventure</p>
      </div>

      <!-- 登录表单 -->
      <a-form
        :model="form"
        layout="vertical"
        class="w-full max-w-md"
        :rules="formRule"
        @finish="handleLogin"
      >
        <!-- 邮箱 / 用户名 -->
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="form.username"
            placeholder="请输入用户名"
            size="large"
            class="rounded-lg"
            allow-clear
          />
        </a-form-item>

        <!-- 密码 -->
        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="form.password"
            placeholder="请输入密码"
            size="large"
            class="rounded-lg"
            :visible="passwordVisible"
            @visibilityChange="(v: boolean) => (passwordVisible = v)"
          >
            <template #iconRender="visible">
              <EyeOutlined v-if="visible" />
              <EyeInvisibleOutlined v-else />
            </template>
          </a-input-password>
        </a-form-item>
        <!-- 登录按钮 -->
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            class="w-full rounded-lg font-semibold text-base tracking-wide"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped>
/* 浮动动画：左侧数据卡片 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
@keyframes float-delay {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}
.animate-float-delay {
  animation: float-delay 4.5s ease-in-out 0.8s infinite;
}

/* 覆盖 Ant Design 输入框圆角 */
:deep(.ant-input),
:deep(.ant-input-password),
:deep(.ant-input-affix-wrapper) {
  border-radius: 8px !important;
}

/* 登录按钮 hover 发光效果 */
:deep(.ant-btn-primary:hover) {
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>
