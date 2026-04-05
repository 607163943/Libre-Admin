<script setup lang="ts">
import Container from './Container.vue'
import Menu from './Menu.vue'
import Breadcrumb from './Breadcrumb.vue'
import Footer from './Footer.vue'
</script>

<template>
  <Container>
    <!-- PC菜单侧边栏、移动端菜单抽屉 -->
    <template #menu-sidebar="{ handleToggle }">
      <Menu :handleToggle="handleToggle" />
    </template>
    <template #breadcrumb>
      <Breadcrumb />
    </template>
    <template #content>
      <router-view />
    </template>
    <template #footer>
      <Footer />
    </template>
  </Container>
</template>

<style></style>
