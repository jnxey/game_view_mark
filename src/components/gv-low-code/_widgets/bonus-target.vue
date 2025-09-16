<template>
  <div class="widgets-text-target" draggable="true" @dragstart="handlerStart">{{ $ti(showName) }}</div>
</template>
<script>
export default { name: 'glc-widget-bonus-target' };
</script>
<script setup>
import { WIDGET_MAP } from '../_models/index.js';
import { $ti } from '@/lang/input';

const props = defineProps({ id: Number, showName: String });

const handlerStart = (e) => {
  e.dataTransfer.setData(
    'text/plain',
    JSON.stringify({
      mark: WIDGET_MAP.bonus.mark,
      extend: { bonus_config_id: props.id }
    })
  );
};
</script>
<style scoped lang="scss">
.widgets-text-target {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 60px;
  margin: 20px;
  border: 2px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}
</style>
