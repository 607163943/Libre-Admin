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
      <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
    </template>
    <template #footer>
      <Footer />
    </template>
  </Container>
</template>

<style>
.page-fade-enter-active {
  animation: pageFadeIn 0.35s ease-out;
}
.page-fade-leave-active {
  animation: pageFadeOut 0.2s ease-in;
}
@keyframes pageFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes pageFadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-6px);
  }
}
</style>
