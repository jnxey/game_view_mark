<template>
  <div class="exit-to-main" @click="exitToMain" />
</template>
<script setup>
import { storage } from '@/tools/storage';
import { CACHE_DESK_DEF_ENTER } from '@/values/cache';
import { useRouter } from 'vue-router';

const router = useRouter();

const exitToMain = () => {
  storage.remove(CACHE_DESK_DEF_ENTER);
  router.back();
};
</script>
<style lang="scss" scoped>
.exit-to-main {
  position: fixed;
  top: 10px;
  left: 10px;
  width: 60px;
  height: 60px;
  cursor: pointer;
  opacity: 0.2;
  background-image: url('@/assets/images/activity/exit.png');
  background-size: 100% 100%;
  z-index: 10;

  &:hover {
    opacity: 0.6;
  }
}
</style>
