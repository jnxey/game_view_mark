<template>
  <gv-popup
    ref="popupRef"
    :title="$t('report.table.title_user')"
    custom-class="near-top"
    max-height="calc(92vh - 100px)"
    :async="true"
    :width="popupWidth"
    :show-footer="false"
  >
    <report-user-list ref="reportUserListRef" :is-popup="true" :layout-bottom="layoutBottom" />
  </gv-popup>
</template>
<script setup>
import { computed, nextTick, shallowRef } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import ReportUserList from '@/views/report/user/index.vue';
import { getPX, getWindowSize } from '@/tools';
import { $t } from '@/lang/i18n';

const popupRef = shallowRef();
const reportUserListRef = shallowRef();

const popupWidth = computed(() => {
  const width = Math.floor(getWindowSize().width * 0.8);
  return getPX(Math.max(width, 900));
});

const layoutBottom = computed(() => {
  const height = Math.floor(getWindowSize().height * 0.06);
  return 75 + height;
});

const open = async (row, query, active) => {
  popupRef.value?.open();
  await nextTick();
  reportUserListRef.value?.searchTable({ ...query, table_id: row.table_id }, active);
};

defineExpose({ open });
</script>
<style lang="scss" scoped></style>
