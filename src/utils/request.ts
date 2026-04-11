import axios from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/modules/user'
import router from '@/router'

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 添加token令牌
    const userStore = useUserStore()
    const tokenName = userStore.userInfo?.tokenName
    const tokenValue = userStore.userInfo?.tokenValue
    if (tokenName && tokenValue) {
      config.headers[tokenName] = tokenValue
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const res = error.response
    if (res?.data?.msg) {
      // 匿名访客访问需要认证页面则跳转到登录
      if (res.status === 401) {
        // 清除token
        const userStore = useUserStore()
        userStore.setUserInfo(null)
        // 跳转到登录页面
        router.push({ name: 'Login' })
      }
      message.error(res.data.msg)
    } else {
      message.error('系统错误，请联系管理员！')
    }
    return Promise.reject(error)
  }
)

export default instance
