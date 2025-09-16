<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="650px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="180px">
      <el-form-item :label="$t('finance.table.name')" prop="name">
        <el-input v-model="formData.name" :placeholder="$t('finance.table.placeholder_name')" clearable />
      </el-form-item>
      <el-form-item :label="$t('finance.table.type')" prop="table_type_id">
        <gv-select-options
          v-model="formData.table_type_id"
          :placeholder="$t('finance.table.placeholder_type')"
          :options="optionsData.tableType"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('finance.table.game')" prop="game_id">
        <gv-select-options v-model="formData.game_id" :placeholder="$t('finance.table.placeholder_game')" :options="optionsData.gameList" clearable />
      </el-form-item>
      <el-form-item :label="$t('finance.table.shares_rate')" prop="shares_rate">
        <el-input-number
          v-model="formData.shares_rate"
          :placeholder="$t('finance.table.placeholder_shares_rate')"
          class="w-full"
          :min="0"
          :max="100"
          controls-position="right"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('finance.table.cash_compensation')" prop="is_cash_compensation">
        <el-switch v-model="formData.is_cash_compensation" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disable" />
      </el-form-item>
      <el-form-item :label="$t('common.status')" prop="status">
        <el-switch v-model="formData.status" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disable" />
      </el-form-item>
      <el-form-item :label="$t('finance.table.base_info')" prop="table_base_info" required>
        <div class="g-table w-full">
          <template v-for="currency in optionsData.currencyConfig" :key="currency.id">
            <div class="g-table-item title">{{ $ti(currency.name) }}</div>
          </template>
        </div>
        <div class="g-table w-full">
          <template v-for="(currency, index) in optionsData.currencyConfig" :key="currency.id">
            <div class="g-table-item" v-if="formData.table_base_info && !!formData.table_base_info[index]">
              <gv-input-amount-placeholder
                v-model="formData.table_base_info[index].base_number"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :controls="false"
                class="w-full"
              >
                <template #suffix>
                  <span>{{ currency.icon }}</span>
                </template>
              </gv-input-amount-placeholder>
            </div>
          </template>
        </div>
      </el-form-item>
      <el-form-item :label="$t('finance.table.limit_amount')" prop="limit_info" required>
        <div class="g-table w-full">
          <template v-for="currency in optionsData.currencyBase" :key="currency.id">
            <div class="g-table-item title">{{ $ti(currency.name) }}</div>
          </template>
        </div>
        <div class="g-table w-full">
          <template v-for="(currency, index) in optionsData.currencyBase" :key="currency.id">
            <div class="g-table-item" v-if="formData.limit_info && !!formData.limit_info[index]">
              <gv-input-amount-placeholder
                v-model="formData.limit_info[index].min"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :controls="false"
                class="w-full mb-4"
              >
                <template #prefix><span class="pr-4 fz-10">min</span></template>
                <template #suffix>
                  <span>{{ currency.icon }}</span>
                </template>
              </gv-input-amount-placeholder>
              <gv-input-amount-placeholder
                v-model="formData.limit_info[index].max"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :controls="false"
                class="w-full mb-4"
              >
                <template #prefix><span class="pr-4 fz-10">max</span></template>
                <template #suffix>
                  <span>{{ currency.icon }}</span>
                </template>
              </gv-input-amount-placeholder>
            </div>
          </template>
        </div>
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { financeTableGet, financeTableSet } from '@/api/finance/table';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { OPERATE_TYPE, STATUS_VALUE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { deepClone, isNumber, syncObjectData } from '@/tools';
import { useDictOptions } from '@/hooks/dict';
import { financeTableTypeLists } from '@/api/finance/table-type';
import { gameLists } from '@/api/game/list';
import { currencyConfigLists } from '@/api/currency/config';
import GvInputAmountPlaceholder from '@/components/gv-input-amount/placeholder.vue';
import { currencyBaseLists } from '@/api/currency/base';
import { $t } from '@/lang/i18n';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { $ti } from '@/lang/input';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('finance.table.title_edit') : $t('finance.table.title_add')));

const formTemp = {
  id: null,
  name: '',
  status: STATUS_VALUE.normal,
  table_type_id: null,
  game_id: null,
  shares_rate: null,
  is_cash_compensation: STATUS_VALUE.disable,
  table_base_info: null,
  limit_info: null
};

const cacheGameId = { value: null };

const formData = reactive(deepClone(formTemp));

const rules = {
  name: [{ required: true, message: $t('finance.table.field_check_name'), trigger: ['blur'] }],
  table_type_id: [{ required: true, message: $t('finance.table.field_check_type'), trigger: ['blur'] }],
  game_id: [{ required: true, message: $t('finance.table.field_check_game'), trigger: ['blur'] }],
  shares_rate: [{ required: true, message: $t('finance.table.field_check_shares_rate'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const { optionsData, refresh } = useDictOptions(
  {
    tableType: { api: financeTableTypeLists },
    gameList: { api: gameLists },
    currencyConfig: { api: currencyConfigLists },
    currencyBase: { api: currencyBaseLists }
  },
  true
);

const open = async (type, row) => {
  layer.loading();
  await refresh();
  mode.value = type;
  if (type === OPERATE_TYPE.update) {
    const data = await financeTableGet({ id: row.id });
    const tableBaseInfo = initTableBase(data.table_base_info);
    const limitInfo = initTableLimit(data.table_limit_info);
    layer.closeLoading();
    cacheGameId.value = data.game_id;
    syncObjectData(formData, { ...data, table_base_info: tableBaseInfo, limit_info: limitInfo });
  } else {
    layer.closeLoading();
    const tableBaseInfo = initTableBase();
    const limitInfo = initTableLimit();
    syncObjectData(formData, { ...formTemp, table_base_info: tableBaseInfo, limit_info: limitInfo });
  }
  popupRef.value?.open();
  clearValidate();
};

// 初始化 点码基数列表
const initTableBase = (old = []) => {
  const currency = optionsData.currencyConfig ?? [];
  const oldMap = {};
  old.forEach((item) => (oldMap[item.currency_config_id] = item));
  return currency.map((item) => {
    const newValue = { base_number: 0, currency_config_id: item.id };
    if (oldMap[item.id]) {
      return syncObjectData({ ...newValue, id: null }, { ...oldMap[item.id] });
    } else {
      return { ...newValue };
    }
  });
};

// 初始化 点码基数列表
const initTableLimit = (old = []) => {
  const currency = optionsData.currencyBase ?? [];
  const oldMap = {};
  old.forEach((item) => (oldMap[item.currency_id] = item));
  return currency.map((item) => {
    const newValue = { min: 0, max: 0, currency_id: item.id };
    if (oldMap[item.id]) {
      return syncObjectData({ ...newValue, id: null }, { ...oldMap[item.id] });
    } else {
      return { ...newValue };
    }
  });
};

// 提交
const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  const params = { ...formData };
  if (mode.value === OPERATE_TYPE.update && params.game_id !== cacheGameId.value) params.camera_info = '';
  await financeTableSet(params);
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
<style lang="scss" scoped>
.g-table {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .g-table-item {
    box-sizing: border-box;
    width: 100px;
    padding: 5px;
    text-align: center;

    ::v-deep(.el-input__wrapper) {
      padding-left: 5px;
      padding-right: 5px;
    }

    &.title {
      padding: 0 5px;
      font-weight: bold;
    }
  }
}
</style>
