// 批量设置用户角色请求体
export interface AssignRolesForm {
  userId: number | string
  roleIds: number[]
}
