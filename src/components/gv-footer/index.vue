<template>
  <div class="footer-btn">
    <div class="footer-btn__content flex-row justify-center align-center" :style="{ position: fixed ? 'fixed' : '', left: getPX(menuCollapseWidth) }">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default { name: 'gv-footer' };
</script>
<script setup>
import { menuCollapseWidth } from '@/views/layout/_store/collapse';
import { getPX } from '@/tools';

defineProps({
  fixed: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped lang="scss">
.footer-btn {
  height: 60px;
  &__content {
    bottom: 0;
    height: 60px;
    right: 0;
    z-index: 10;
    background-color: var(--el-bg-color);
    box-shadow: var(--gv-box-shadow-top);
  }
}
</style>
