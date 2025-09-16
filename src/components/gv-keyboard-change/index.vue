<template>
  <div class="gv-keyboard-change">
    <gv-icon v-if="systemState.keyboard" name="local-icon-keyboard" class="fz-24 cursor-pointer" :class="color" @click="changeKeyboard" />
    <gv-icon v-else name="local-icon-keyboard-not-allow" class="fz-24 cursor-pointer" :class="color" @click="changeKeyboard" />
  </div>
</template>
<script>
export default { name: 'gv-keyboard-change' };
</script>
<script setup>
import GvIcon from '@/components/gv-icon/index.vue';
import { setSystemState, systemState } from '@/store/system';
import layer from '@/tools/layer';
import { $t } from '@/lang/i18n';

defineProps({ color: { type: String, default: 'color-white' } });

// 设置虚拟键盘
const changeKeyboard = () => {
  layer.msg(!systemState.keyboard ? $t('components.gv_keyboard_change.keyboard_open') : $t('components.gv_keyboard_change.keyboard_close'));
  setSystemState({ keyboard: !systemState.keyboard });
};
</script>
