<template>
  <gv-popup
    ref="popupRef"
    :title="`${$t('points.summary.label_top_up')}-【${username}】`"
    :async="true"
    width="400px"
    auto-focus
    @confirm="handleSubmit"
    @close="handleClose"
    :confirm-button-text="$t('points.summary.btn_confirm_top_up')"
  >
    <gv-input-amount v-model="formData.amount" :precision="0" :placeholder="$t('points.summary.points')" />
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { reactive, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { syncObjectData } from '@/tools';
import GvInputAmount from '@/components/gv-input-amount/index.vue';
import { pointsSummarySet } from '@/api/points/summary';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const formTemp = { user_id: null, amount: null };
const formData = reactive({ ...formTemp });
const username = ref();

const open = async (row) => {
  username.value = row.username;
  syncObjectData(formData, { ...formTemp, user_id: row.user_id });
  popupRef.value?.open();
};

// 提交
const handleSubmit = async () => {
  if (!formData.amount) return layer.msgError($t('points.summary.tips_enter_points'));
  await layer.confirm($t('points.summary.tips_confirm_top_up', { amount: formData.amount, username: username.value }));
  layer.loading();
  await pointsSummarySet({ ...formData });
  layer.closeLoading();
  layer.msgSuccess($t('points.summary.top_up_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
