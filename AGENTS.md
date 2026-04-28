# AGENTS.md

本规范旨在定义项目内 Vue 组件的开发标准，确保代码结构的一致性、可维护性以及样式处理的规范化。

## 1. 核心技术栈

- **框架**: Vue 3.x
- **语言**: TypeScript (TS)
- **组件库**: Ant-Design-Vue 4.2.6
- **样式库**: Tailwind CSS 3.x

---

## 2. 代码组织规范

所有 `.vue` 单文件组件必须严格遵守以下标签排列顺序：

1.  **`<script>`**: 逻辑层（使用 `setup` 语法糖）。
2.  **`<template>`**: 视图层。
3.  **`<style>`**: 样式层（局部样式建议开启 `scoped`）。

---

## 3. 样式处理准则

### Tailwind CSS 优先

- 应优先使用 **Tailwind CSS 3.x** 的原子化类名进行页面布局与基础样式修饰。

### Ant-Design-Vue 样式定制

- **局部定制化**: 当需要修改 Ant-Design-Vue 组件内部样式或主题变量时，必须优先使用 `<a-config-provider>` 标签。
- **接近原则**: `<a-config-provider>` 应尽可能包裹在目标组件的最外层，而非直接在页面根标签上使用。
- **多次声明**: 允许根据组件需求多次使用 `<a-config-provider>`，以实现精准的局部样式覆盖。

---

## 4. 示例代码参考

```vue
<script setup lang="ts">
// 逻辑代码放置在最上方
import { ref } from 'vue'
const value = ref<string>('')
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <a-config-provider
      :theme="{
        token: {
          colorPrimary: '#1677ff'
        }
      }"
    >
      <a-input v-model:value="value" placeholder="请输入内容" />
    </a-config-provider>
  </div>
</template>

<style scoped>
/* 必要的局部样式覆盖 */
</style>
```

## 5. 项目目录结构说明

在开发过程中，请确保新增文件放置在对应的职能目录下，以维护项目的整洁性。

### 核心目录概览

- **`src/api/`**: **后端请求定义**。所有 Axios 请求函数按业务模块拆分存放（如 `book.ts`, `user.ts`）。
- **`src/types/`**: **TypeScript 类型声明**。存放全局及业务相关的 Interface 和 Type 定义。建议与 `api` 目录下的文件名保持对应。
- **`src/views/`**: **页面视图组件**。业务页面的主要存放地，按功能模块建立子文件夹（如 `book/`, `permission/`）。
- **`src/stores/`**: **状态管理 (Pinia)**。全局状态逻辑存放于 `modules/` 目录下，并由 `index.ts` 统一导出。
- **`src/components/`**: **公共业务组件**。跨页面复用的组件存放于此。
- **`src/layout/`**: **页面布局组件**。定义系统的整体框架结构（如侧边栏、顶栏）。
- **`src/styles/`**: **全局样式**。存放 Tailwind CSS 的入口文件及全局 CSS 变量。
- **`src/utils/`**：**工具文件**。存放一些通用工具类。

---

### 开发常用修改路径清单

| 需求类型         | 修改/新建路径                           | 说明                                                         |
| :--------------- | :-------------------------------------- | :----------------------------------------------------------- |
| **新增页面**     | `src/views/{module}/{Page}.vue`         | 同时需在 `src/router` 中配置路由、`src/layout/Menu.vue`中添加菜单、`src/layout/Breadcrumb.vue`中添加面包屑文本 |
| **对接新接口**   | `src/api/{module}.ts`                   | 必须同步更新 `src/types/` 下的类型定义                       |
| **定义数据模型** | `src/types/{module}.ts`                 | 确保数据类型和要求一致                                       |
| **全局状态变更** | `src/stores/modules/{module}.ts`        | 如用户信息、权限菜单等持久化数据                             |
| **配置调整**     | `tailwind.config.js` / `vite.config.ts` | 涉及样式插件或 Vite 编译插件时修改                           |

---
