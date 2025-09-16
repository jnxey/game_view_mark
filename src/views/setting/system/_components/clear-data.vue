<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="800px" @confirm="handleSubmit" @close="handleClose">
    <el-checkbox-group v-model="selected" @change="handleChange">
      <el-checkbox :label="$t('setting.system.clear_data_type_all')" :value="ALL_KEY" />
      <el-divider class="size-small" />
      <el-checkbox :label="$t('setting.system.clear_data_type_dept')" value="dept" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_type_staff')" value="staff" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_type_apartment')" value="apartment" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_type_user_base')" value="user_base" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_type_user_data')" value="user_data" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_type_game_config')" value="game_config" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_type_game_data')" value="game_data" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_type_table_config')" value="table_config" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_type_currency_config')" value="currency_config" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_type_user_points')" value="user_points" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_type_stock')" value="stock" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_external_costs')" value="external_costs" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_chat_room')" value="minChat" :disabled="isSelectedAll" />
      <br />
      <el-checkbox :label="$t('setting.system.clear_data_material')" value="material" :disabled="isSelectedAll" />
    </el-checkbox-group>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { $t } from '@/lang/i18n';
import { systemChoiceClearData } from '@/api/setting/system';
import { checkIndexArray, delayExec, pageReload } from '@/tools';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();

const ALL_KEY = 'all';

const selected = ref([]);

const isSelectedAll = computed(() => {
  const sList = selected.value ?? [];
  return sList.length === 1 && sList[0] === ALL_KEY;
});

const popupTitle = computed(() => $t('setting.system.btn_clear_data'));

// 打开
const open = async () => {
  selected.value = [];
  popupRef.value?.open();
};

// 选中项变化
const handleChange = (value) => {
  const key = value.findIndex((val) => val === ALL_KEY);
  if (checkIndexArray(key)) selected.value = [ALL_KEY];
};

// 提交
const handleSubmit = async () => {
  const sList = selected.value ?? [];
  if (!sList) return layer.msgError($t('setting.system.tips_confirm_clear_data_no'));
  const { value } = await layer.password($t('setting.system.tips_confirm_clear_data'));
  layer.loading();
  await sList.reduce(async (prevPromise, sItem) => {
    await prevPromise; // 等待前一个请求完成
    return await systemChoiceClearData({ clear_type: sItem, password: value });
  }, Promise.resolve());
  layer.closeLoading();
  popupRef.value?.close();
  layer.msgSuccess($t('setting.system.tips_clear_success'));
  await delayExec(500);
  pageReload();
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
