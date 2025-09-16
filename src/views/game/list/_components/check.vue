<template>
  <gv-popup ref="popupRef" :title="$t('game.list.btn_enter_check')" width="400px" @confirm="handleSubmit" @close="handleClose">
    <el-form label-width="120px">
      <el-form-item :label="$t('game.list.label_check_user_no')">
        <el-switch v-model="formData.is_check_user" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disable" />
      </el-form-item>
      <el-form-item :label="$t('game.list.label_check_balance_match')">
        <el-switch v-model="formData.is_balance_match" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disable" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { reactive, shallowRef } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import layer from '@/tools/layer';
import { gameConfigGetDetection, gameConfigPreDetection } from '@/api/game/list';
import { STATUS_VALUE } from '@/values';
import { syncObjectData } from '@/tools';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formData = reactive({ is_check_user: STATUS_VALUE.normal, is_balance_match: STATUS_VALUE.normal });
const popupRef = shallowRef();

const open = async () => {
  layer.loading();
  const data = await gameConfigGetDetection();
  layer.closeLoading();
  syncObjectData(formData, data || {});
  popupRef.value?.open();
};

// 提交表单
const handleSubmit = async () => {
  layer.loading();
  await gameConfigPreDetection(formData);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  close();
};

const close = () => {
  popupRef.value?.close();
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.step-wrap {
  margin-bottom: 30px;
}
</style>
