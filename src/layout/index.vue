<script setup lang="ts">
import Container from './Container.vue'
import Header from './Header.vue'
import Breadcrumb from './Breadcrumb.vue'
import Footer from './Footer.vue'
</script>

<template>
  <Container>
    <!-- 桌面端侧边栏 -->
    <template #header-sidebar>
      <Header />
    </template>
    <!-- 移动端抽屉 -->
    <template #header-drawer>
      <Header />
    </template>
    <template #breadcrumb>
      <Breadcrumb />
    </template>
    <template #content>
      <div>Bill is a cat.</div>
    </template>
    <template #footer>
      <Footer />
    </template>
  </Container>
</template>

<style></style>
