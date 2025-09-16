<template>
  <el-tooltip class="box-item" effect="dark" :content="$t('components.gv_table.btn_refresh')" placement="bottom">
    <el-button class="ml-12" circle icon="Refresh" @click="refresh" />
  </el-tooltip>
</template>
<script setup>
import { $t } from '@/lang/i18n';

const emit = defineEmits(['refresh']);

const refresh = () => {
  emit('refresh');
};
</script>
