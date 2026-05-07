export interface LoginForm {
  username: string
  password: string
  captchaKey?: string
  captchaCode?: string
}

export interface CaptchaResponse {
  captchaKey: string
  captchaImgBase64: string
}

export interface CaptchaForm {
  captchaKey: string
}
