<template>
  <div class="widgets-text-target" draggable="true" @dragstart="handlerStart">{{ $t('components.gv_low_code.comp_text') }}</div>
</template>
<script>
export default { name: 'glc-widget-text-target' };
</script>
<script setup>
import { WIDGET_MAP } from '../_models/index.js';
import { $t } from '@/lang/i18n';

const handlerStart = (e) => {
  e.dataTransfer.setData('text/plain', JSON.stringify({ mark: WIDGET_MAP.text.mark }));
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
