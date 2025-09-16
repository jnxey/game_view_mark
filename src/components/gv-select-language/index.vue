<template>
  <el-dropdown class="gv-select-language">
    <gv-icon name="local-icon-language" class="fz-24 cursor-pointer" :class="color" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in languageSupport" :key="item.code" @click="languageSet(item.code)">
          <span :class="{ 'text-primary': languageCurrent === item.code }">{{ item.name }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script>
export default { name: 'gv-select-language' };
</script>
<script setup>
import GvIcon from '@/components/gv-icon/index.vue';
import { setSystemState, systemState } from '@/store/system';
import layer from '@/tools/layer';
import { $t } from '@/lang/i18n';
import { languageCurrent, languageSet, languageSupport } from '@/lang';

defineProps({ color: { type: String, default: 'color-white' } });

// 设置虚拟键盘
const changeKeyboard = () => {
  layer.msg(!systemState.keyboard ? $t('components.gv_keyboard_change.keyboard_open') : $t('components.gv_keyboard_change.keyboard_close'));
  setSystemState({ keyboard: !systemState.keyboard });
};
</script>
