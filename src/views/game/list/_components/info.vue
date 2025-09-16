<template>
  <el-form class="form-wrap" ref="formRef" :rules="rules" :model="formData" label-width="120px">
    <el-form-item :label="$t('game.list.name')" prop="name">
      <gv-input-language v-model="formData.name" :placeholder="$t('game.list.placeholder_name')" clearable :type="GV_INPUT_LANGUAGE_TYPE.game_name" />
    </el-form-item>
    <el-form-item :label="$t('game.list.bonus')" prop="bonus_id">
      <gv-select-options ref="bonusRef" v-model="formData.bonus_id" :request="bonusListLists" :placeholder="$t('game.list.placeholder_bonus')" />
    </el-form-item>
    <el-form-item :label="$t('game.list.game_model')" prop="game_model">
      <el-radio-group v-model="formData.game_model" :disabled="disabledUpdate">
        <el-radio class="custom-radio" v-for="item in GAME_MODEL_DICT" :value="item.value">{{ item.name }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('common.remark')" prop="remark">
      <el-input v-model="formData.remark" :placeholder="$t('common.remark_placeholder')" clearable type="textarea" />
    </el-form-item>
    <el-form-item :label="$t('common.status')" prop="status">
      <el-switch v-model="formData.status" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disable" />
    </el-form-item>
  </el-form>
</template>
<script setup>
import { gameSet } from '@/api/game/list';
import { computed, reactive, ref, shallowRef } from 'vue';
import { GAME_MODEL, GAME_MODEL_DICT, GV_INPUT_LANGUAGE_TYPE, OPERATE_TYPE, STATUS_VALUE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { bonusListLists } from '@/api/bouns/list';
import { $t } from '@/lang/i18n';
import GvInputLanguage from '@/components/gv-input-language/index.vue';

const emit = defineEmits(['success']);

const formRef = shallowRef();
const bonusRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const formTemp = {
  id: null,
  name: '',
  remark: '',
  bonus_id: null,
  game_model: GAME_MODEL.general,
  status: STATUS_VALUE.normal
};

const formData = reactive({ ...formTemp });

const disabledUpdate = computed(() => mode.value === OPERATE_TYPE.update);

const rules = {
  name: [{ required: true, message: $t('game.list.field_check_name'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const init = async (type, row) => {
  bonusRef.value?.refresh();
  mode.value = type;
  if (type === OPERATE_TYPE.update) {
    syncObjectData(formData, row);
  } else {
    syncObjectData(formData, { ...formTemp });
  }
  clearValidate();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  const res = await gameSet(formData);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  emit('success', res);
};

defineExpose({ open, init, handleSubmit });
</script>
<style lang="scss" scoped>
.form-wrap {
  max-width: 550px;
  margin: 0 auto;
}
</style>
