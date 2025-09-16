<template>
  <teleport to="#app">
    <div v-if="command.show" class="command-wrap fz-12 text-main" :style="command.style" @click.stop>
      <slot />
    </div>
  </teleport>
</template>
<script>
export default { name: 'gv-command' };
</script>
<script setup>
import { reactive } from 'vue';
import { getPX } from '@/tools';
import { useWindowClick } from '@/hooks/click';

const emit = defineEmits(['open', 'close']);
const props = defineProps({ offsetY: { type: Number, default: 0 } });
const command = reactive({ show: false, style: {} });

const open = (event) => {
  if (event.touches?.[0]) event = event.touches[0];
  command.show = true;
  command.style = { left: getPX(event.pageX), top: getPX(event.pageY + props.offsetY) };
  emit('open');
};

const close = () => {
  command.show = false;
  emit('close');
};

useWindowClick(() => close());

defineExpose({ open, close });
</script>
<style lang="scss" scoped>
.command-wrap {
  position: fixed;
  min-width: 120px;
  padding: 10px 0;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
  z-index: var(--gv-command-z-index);
  ::v-deep(.command-item) {
    padding: 10px;
    cursor: pointer;
    &:hover {
      background-color: var(--el-color-primary-light-9);
    }
  }
}
</style>
