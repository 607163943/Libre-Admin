export interface ModuleForm {
  moduleName: string
  clientType: number | undefined
}

export interface ModuleDialogForm {
  id: number | string
  moduleName: string
  moduleKey: string
  clientType: 1 | 2
}

export interface TableModuleData {
  id: number
  moduleName: string
  moduleKey: string
  clientType: number
}
