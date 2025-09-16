<template>
  <gv-popup ref="popupRef" :title="title" :async="true" width="400px" @confirm="handleSubmit" @close="handleClose">
    <gv-input-amount v-model="formData.number" :placeholder="$t('goods.stock.placeholder_number_modify')">
      <template #handler-suffix>{{ unit }}</template>
    </gv-input-amount>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { reactive, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { syncObjectData } from '@/tools';
import GvInputAmount from '@/components/gv-input-amount/index.vue';
import { NUMBER_HANDLER } from '@/values';
import { stockSetNumber } from '@/api/goods/stock-type';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const formTemp = { id: null, number: null, dec_inc: NUMBER_HANDLER.inc };
const formData = reactive({ ...formTemp });
const title = ref();
const unit = ref();

const open = async (_title, _unit, row) => {
  title.value = _title;
  unit.value = _unit;
  syncObjectData(formData, { ...formTemp, ...row });
  popupRef.value?.open();
};

// 提交
const handleSubmit = async () => {
  if (!formData.number) return layer.msgError($t('goods.stock.field_check_number_modify'));
  await layer.confirm(`${$t('common.confirm_btn')} ${title.value}${formData.number}${unit.value}`);
  layer.loading();
  await stockSetNumber({ ...formData });
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
