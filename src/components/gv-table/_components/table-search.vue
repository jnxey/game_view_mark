<template>
  <el-tooltip
    class="box-item"
    effect="dark"
    :content="isShow ? $t('components.gv_table.btn_search_hide') : $t('components.gv_table.btn_search_show')"
    placement="bottom"
  >
    <el-button class="ml-12" :type="!isShow ? 'info' : undefined" circle icon="Search" @click="change" />
  </el-tooltip>
</template>
<script setup>
import { inject, onBeforeMount } from 'vue';
import { storage } from '@/tools/storage';
import { CACHE_KEY_GV_TABLE_HIDE_SEARCH } from '@/values/cache';
import { $t } from '@/lang/i18n';

const props = defineProps({ isShow: Boolean });

const tableKey = inject('tableKey');

const emit = defineEmits(['change']);

const getHide = (show) => !show;

const change = () => {
  emit('change', !props.isShow);
  const cache = storage.get(CACHE_KEY_GV_TABLE_HIDE_SEARCH) ?? {};
  cache[tableKey] = getHide(!props.isShow);
  storage.set(CACHE_KEY_GV_TABLE_HIDE_SEARCH, cache);
};

onBeforeMount(() => {
  const cache = storage.get(CACHE_KEY_GV_TABLE_HIDE_SEARCH) ?? {};
  emit('change', getHide(!!cache[tableKey]));
});
</script>
