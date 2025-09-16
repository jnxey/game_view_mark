<template>
  <div class="quick-btn flex-row align-center cursor-pointer" v-perms="[perm]" @click="toRoutePath(perm)">
    <gv-icon class="btn-icon" :size="26" v-if="!!icon" :name="icon" />
    <span class="btn-text ml-4">{{ name }}</span>
  </div>
</template>
<script setup>
import GvIcon from '@/components/gv-icon/index.vue';
import { toRoutePath } from '@/router';

defineProps({ name: String, icon: String, perm: String });
</script>
<style lang="scss" scoped>
.quick-btn {
  padding: 5px 10px 5px 5px;
  border-radius: 16px;

  .btn-icon {
    padding: 5px;
    border-radius: 50%;
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }

  &:hover {
    background-color: var(--el-color-primary-light-9);

    .btn-icon {
      color: var(--el-primary-text-color);
      background-color: var(--el-color-primary);
    }

    .btn-text {
      color: var(--el-color-primary);
    }
  }
}
</style>
