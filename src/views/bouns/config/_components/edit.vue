<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="100px">
      <el-form-item :label="$t('bonus.config.image')" prop="image">
        <gv-material-picker custom-class="w-full" v-model="formData.image" :limit="6" />
      </el-form-item>
      <el-form-item :label="$t('bonus.config.name')" prop="name">
        <gv-input-language
          v-model="formData.name"
          :placeholder="$t('bonus.config.placeholder_name')"
          clearable
          :type="GV_INPUT_LANGUAGE_TYPE.bonus_config_name"
        />
      </el-form-item>
      <el-form-item :label="$t('bonus.config.bonus_name')" prop="bonus_id">
        <gv-select-options
          v-model="formData.bonus_id"
          :placeholder="$t('bonus.config.placeholder_bonus_name')"
          :options="optionsData.bonus"
          :request="bonusListLists"
        />
      </el-form-item>
      <!--    牌型    -->
      <el-form-item required :label="$t('bonus.config.card_pattern')" prop="card_pattern">
        <div class="flex-1 flex-col justify-start">
          <el-radio-group v-model="formData.card_pattern">
            <el-radio class="custom-radio mb-4" v-for="(item, index) in BONUS_CARD_TYPE_DICT" :key="index" :label="item.name" :value="item.value" />
          </el-radio-group>
          <div class="text-tips">{{ $t('game.kind.tips_card_pattern') }}</div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('bonus.config.base_number')" prop="cardinality">
        <el-input-number
          v-model="formData.cardinality"
          :placeholder="$t('bonus.config.placeholder_base_number')"
          clearable
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
          class="w-full"
        >
          <template #suffix>
            <span>{{ currencySymbol }}</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item :label="$t('bonus.config.rate')" prop="cash_rate">
        <div class="flex-1 flex-col justify-start">
          <el-input-number
            v-model="formData.cash_rate"
            :placeholder="$t('bonus.config.placeholder_rate')"
            clearable
            :min="0"
            :max="100"
            controls-position="right"
            class="w-full"
          >
            <template #suffix><span>%</span></template>
          </el-input-number>
          <div class="text-tips">{{ $t('bonus.config.tips_rate') }}</div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('bonus.config.double_activity')" prop="double_activity">
        <el-input-number
          v-model="formData.double_activity"
          :placeholder="$t('bonus.config.placeholder_double_activity')"
          clearable
          :min="0"
          :max="100"
          controls-position="right"
          class="w-full"
        >
          <template #suffix>
            <span>{{ $t('bonus.config.multiple') }}</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item :label="$t('bonus.config.sort')" prop="sort">
        <div class="flex-1 flex-col justify-start">
          <el-input-number v-model="formData.sort" :min="0" :max="Number.MAX_SAFE_INTEGER" controls-position="right" class="w-full" />
          <div class="text-tips">{{ $t('bonus.config.tips_sort') }}</div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('bonus.config.status')" prop="status">
        <el-switch v-model="formData.status" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disable" />
      </el-form-item>
      <el-form-item :label="$t('bonus.config.remark')" prop="remark">
        <el-input v-trim v-model="formData.remark" :placeholder="$t('bonus.config.placeholder_remark')" type="textarea" clearable />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { bounsConfigSet } from '@/api/bouns/config';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { GV_INPUT_LANGUAGE_TYPE, OPERATE_TYPE, STATUS_VALUE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { getJSON, syncObjectData } from '@/tools';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import { useDictOptions } from '@/hooks/dict';
import { bonusListLists } from '@/api/bouns/list';
import { $t } from '@/lang/i18n';
import GvInputLanguage from '@/components/gv-input-language/index.vue';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { BONUS_CARD_TYPE_DICT } from '@/values/card';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('bonus.config.title_edit') : $t('bonus.config.title_add')));

const formTemp = {
  id: null,
  name: '',
  sort: 0,
  bonus_id: null,
  status: STATUS_VALUE.normal,
  remark: '',
  image: '',
  cardinality: null,
  cash_rate: null,
  double_activity: 1
};

const formData = reactive({ ...formTemp });

const { optionsData, refresh } = useDictOptions({ bonus: { api: bonusListLists } }, true);

const rules = {
  name: [{ required: true, message: $t('bonus.config.field_check_name'), trigger: ['blur'] }],
  sort: [{ required: true, message: $t('bonus.config.field_check_sort'), trigger: ['blur'] }],
  bonus_id: [{ required: true, message: $t('bonus.config.field_check_bonus_name'), trigger: ['blur'] }],
  image: [{ required: true, message: $t('bonus.config.field_check_image'), trigger: ['blur'] }],
  cardinality: [{ required: true, message: $t('bonus.config.field_check_base_number'), trigger: ['blur'] }],
  cash_rate: [{ required: true, message: $t('bonus.config.field_check_rate'), trigger: ['blur'] }],
  double_activity: [{ required: true, message: $t('bonus.config.field_check_double_activity'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const currencySymbol = computed(() => {
  const list = optionsData.bonus ?? [];
  const item = list.find((val) => val.id === formData.bonus_id);
  return item?.currency_icon ?? '';
});

const open = async (type, row) => {
  refresh();
  mode.value = type;
  if (type === OPERATE_TYPE.update) syncObjectData(formData, { ...row, image: getJSON(row.image, []) });
  else syncObjectData(formData, { ...formTemp });
  popupRef.value?.open();
  clearValidate();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  const params = { ...formData, image: JSON.stringify(formData.image) };
  layer.loading();
  await bounsConfigSet(params);
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
