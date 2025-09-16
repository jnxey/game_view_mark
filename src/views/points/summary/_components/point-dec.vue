<template>
  <gv-popup
    ref="popupRef"
    :title="`${$t('points.summary.label_deduct')}-【${username}】`"
    :async="true"
    width="400px"
    auto-focus
    @confirm="handleSubmit"
    @close="handleClose"
    :confirm-button-text="$t('points.summary.btn_confirm_deduct')"
  >
    <gv-input-amount v-model="formData.amount" :precision="0" :placeholder="$t('points.summary.points')">
      <template #handler-suffix>
        <el-button type="primary" link @click="setAll">{{ $t('common.all') }}</el-button>
      </template>
    </gv-input-amount>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { reactive, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { syncObjectData } from '@/tools';
import GvInputAmount from '@/components/gv-input-amount/index.vue';
import { pointsSummaryDeduct } from '@/api/points/summary';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const formTemp = { user_id: null, amount: null, is_clean: 1 };
const formData = reactive({ ...formTemp });
const username = ref();
const totalAmount = ref(0);

const open = async (row) => {
  username.value = row.username;
  totalAmount.value = row.total_points;
  syncObjectData(formData, { ...formTemp, user_id: row.user_id });
  popupRef.value?.open();
};

// 设置全部
const setAll = () => {
  formData.amount = totalAmount.value;
};

// 提交
const handleSubmit = async () => {
  if (!formData.amount) return layer.msgError($t('points.summary.tips_enter_points'));
  await layer.confirm($t('points.summary.tips_confirm_deduct', { amount: formData.amount, username: username.value }));
  layer.loading();
  await pointsSummaryDeduct({ ...formData });
  layer.closeLoading();
  layer.msgSuccess($t('points.summary.deduct_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
