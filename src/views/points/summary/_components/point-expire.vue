<template>
  <gv-popup
    ref="popupRef"
    :title="`${$t('points.summary.label_invalid_set')}-【${username}】`"
    :async="true"
    width="400px"
    auto-focus
    @confirm="handleSubmit"
    @close="handleClose"
    :confirm-button-text="$t('points.summary.btn_confirm_invalid_set')"
  >
    <gv-input-amount v-model="formData.expire_at" :precision="0" :placeholder="$t('points.summary.expire_time')">
      <template #handler-suffix>
        <span class="text-placeholder">{{ $t('points.summary.day') }}</span>
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
import { pointsSummarySetExpire } from '@/api/points/summary';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const formTemp = { user_ids: null, expire_at: null };
const formData = reactive({ ...formTemp });
const username = ref();

const allKey = 'all';

const open = async (row) => {
  if (!!row) {
    username.value = row.username;
    syncObjectData(formData, { ...formTemp, expire_at: row.expire_at, user_ids: [row.user_id] });
  } else {
    username.value = '全部';
    syncObjectData(formData, { ...formTemp, user_ids: [allKey] });
  }
  popupRef.value?.open();
};

// 提交
const handleSubmit = async () => {
  if (!formData.expire_at) return layer.msgError($t('points.summary.tips_enter_invalid_set'));
  await layer.confirm($t('points.summary.tips_confirm_invalid_set', { username: username.value, expire_at: formData.expire_at }));
  layer.loading();
  await pointsSummarySetExpire({ ...formData });
  layer.closeLoading();
  layer.msgSuccess($t('points.summary.invalid_set_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
