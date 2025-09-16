<template>
  <el-form class="form-wrap" ref="formRef" label-width="140px">
    <el-form-item :label="$t('game.list.name')">
      <span class="text-placeholder">{{ $ti(formData.game_name) }}</span>
    </el-form-item>
    <el-form-item :label="$t('game.list.open_kind')">
      <el-checkbox-group v-model="selected" @change="kindSelectChange">
        <el-checkbox class="custom-checkbox mb-8" v-for="(item, index) in kindList" :key="index" :value="item.id">
          <el-avatar :src="getBaseImagUrl(item.icon)" :size="20" />
          <span class="ml-4">{{ $ti(item.name) }}</span>
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item :label="$t('game.list.open_kind_config')"></el-form-item>
    <template v-for="kind in kindList" :key="kind.id">
      <div class="kind-wrap mb-16" v-if="!!source[kind.id]">
        <div class="kind-title flex-col align-bottom pr-12">
          <div class="w-full text-center">
            <el-avatar class="mb-12" :src="getBaseImagUrl(kind.icon)" :size="32" />
          </div>
          <div class="w-full fz-12 text-center">{{ $ti(kind.name) }}</div>
        </div>
        <template v-if="kind.sub_calc === GAME_KIND_CALC.sub">
          <div class="flex-row align-center pt-16">
            <gv-icon name="local-icon-empty" class="fz-24" />
            <span class="ml-12 text-regular">{{ $t('game.list.tips_config_sub_calc') }}</span>
          </div>
        </template>
        <template v-if="kind.sub_calc === GAME_KIND_CALC.self">
          <div class="g-table">
            <div class="g-table-item title">{{ $t('game.list.label_config_currency') }}</div>
            <div class="g-table-item title">{{ $t('game.list.label_config_odds') }}</div>
            <div class="g-table-item title">{{ $t('game.list.label_config_rake') }}</div>
            <div class="g-table-item title">{{ $t('game.list.label_config_rake_rounding') }}</div>
            <div class="g-table-item title">{{ $t('game.list.label_config_code_washing_rounding') }}</div>
            <div class="g-table-item title">{{ $t('game.list.label_config_is_code_washing') }}</div>
            <div class="g-table-item title">{{ $t('game.list.label_config_is_integral') }}</div>
            <div class="g-table-item title">{{ $t('game.list.label_config_is_shares') }}</div>
            <div class="g-table-item title">{{ $t('game.list.label_config_is_rake_cei') }}</div>
          </div>
          <template v-for="currency in optionsData.currency" :key="getMultipleKey(kind.id, +currency.id)">
            <template v-if="configList[getConfigIndex(kind.id, currency.id)]">
              <div class="g-table">
                <div class="g-table-item">{{ $ti(currency.name) }}</div>
                <div class="g-table-item">
                  <gv-input-amount-placeholder
                    v-model="configList[getConfigIndex(kind.id, currency.id)].odds"
                    :min="0"
                    :max="Number.MAX_SAFE_INTEGER"
                    :controls="false"
                    placeholder=""
                    class="w-full"
                  >
                    <template #suffix><span>%</span></template>
                  </gv-input-amount-placeholder>
                </div>
                <div class="g-table-item">
                  <gv-input-amount-placeholder
                    v-model="configList[getConfigIndex(kind.id, currency.id)].rake"
                    :min="0"
                    :max="100"
                    :controls="false"
                    placeholder=""
                    class="w-full"
                  >
                    <template #suffix><span>%</span></template>
                  </gv-input-amount-placeholder>
                </div>
                <div class="g-table-item">
                  <gv-input-amount-placeholder
                    v-model="configList[getConfigIndex(kind.id, currency.id)].rake_rounding"
                    :min="0"
                    :max="Number.MAX_SAFE_INTEGER"
                    :controls="false"
                    placeholder=""
                    class="w-full"
                  >
                    <template #suffix>
                      <span>{{ currency.icon }}</span>
                    </template>
                  </gv-input-amount-placeholder>
                </div>
                <div class="g-table-item">
                  <gv-input-amount-placeholder
                    v-model="configList[getConfigIndex(kind.id, currency.id)].code_washing_rounding"
                    :min="0"
                    :max="Number.MAX_SAFE_INTEGER"
                    :controls="false"
                    placeholder=""
                    class="w-full"
                  >
                    <template #suffix>
                      <span>{{ currency.icon }}</span>
                    </template>
                  </gv-input-amount-placeholder>
                </div>
                <div class="g-table-item">
                  <el-switch
                    v-model="configList[getConfigIndex(kind.id, currency.id)].is_code_washing"
                    :active-value="STATUS_VALUE.normal"
                    :inactive-value="STATUS_VALUE.disable"
                  />
                </div>
                <div class="g-table-item">
                  <el-switch
                    v-model="configList[getConfigIndex(kind.id, currency.id)].is_integral"
                    :active-value="STATUS_VALUE.normal"
                    :inactive-value="STATUS_VALUE.disable"
                  />
                </div>
                <div class="g-table-item">
                  <el-switch
                    v-model="configList[getConfigIndex(kind.id, currency.id)].is_shares"
                    :active-value="STATUS_VALUE.normal"
                    :inactive-value="STATUS_VALUE.disable"
                  />
                </div>
                <div class="g-table-item">
                  <el-switch
                    v-model="configList[getConfigIndex(kind.id, currency.id)].is_rake_ceil"
                    :active-value="STATUS_VALUE.normal"
                    :inactive-value="STATUS_VALUE.disable"
                  />
                </div>
              </div>
            </template>
          </template>
        </template>
      </div>
    </template>
    <template v-if="!configList.length">
      <el-empty />
    </template>
  </el-form>
</template>
<script setup>
import { gameConfigLists, gameConfigSet } from '@/api/game/list';
import { computed, reactive, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { getBaseImagUrl, getMultipleKey, mappingArrayToObject, syncObjectData } from '@/tools';
import { GAME_KIND_CALC, QUERY_LIST_TYPE, STATUS_VALUE } from '@/values';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';
import { gameKindLists } from '@/api/game/kind';
import GvIcon from '@/components/gv-icon/index.vue';
import GvInputAmountPlaceholder from '@/components/gv-input-amount/placeholder.vue';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const emit = defineEmits(['success']);
const formRef = shallowRef();

// 默认配置模板
const configTemp = {
  id: null,
  game_kind_id: null,
  currency_config_id: null,
  odds: 100,
  odds_rounding: 0,
  rake: 0,
  rake_rounding: 0,
  code_washing_rounding: 0,
  is_code_washing: STATUS_VALUE.normal,
  is_integral: STATUS_VALUE.normal,
  is_shares: STATUS_VALUE.normal,
  is_rake_ceil: STATUS_VALUE.normal
};

// 游戏信息
const formData = reactive({ game_id: null, game_name: '' });

// 配置列表
const configList = reactive([]);

// 投注项列表
const kindList = shallowRef([]);

// 已选中的配置项
const selected = ref([]);

// 字典数据
const { optionsData } = useDictOptions({ currency: { api: currencyConfigLists } });

// 每个kind、currency对应的配置列表索引
const source = computed(() => {
  const result = {};
  configList.forEach((item, index) => {
    if (!result[item.game_kind_id]) result[item.game_kind_id] = {};
    result[item.game_kind_id][item.currency_config_id] = index;
  });
  return result;
});

// 清楚校验
const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

// 打开编辑弹窗
const init = async (row) => {
  layer.loading();
  const kindRes = await gameKindLists({ game_model: row.game_model, page_type: QUERY_LIST_TYPE.all });
  kindList.value = kindRes.lists;
  const { lists } = await gameConfigLists({ game_id: row.id, page_type: QUERY_LIST_TYPE.all });
  layer.closeLoading();
  formData.game_id = row.id;
  formData.game_name = row.name;
  configList.splice(0);
  const _configList = checkCurrency(lists.map((val) => syncObjectData({ ...configTemp }, val)));
  configList.push(..._configList);
  initSelect();
};

// 初始化选中
const initSelect = () => {
  const value = [];
  configList.forEach((item) => {
    if (!value.includes(item.game_kind_id)) value.push(item.game_kind_id);
  });
  selected.value = value;
};

// 检查是否有新增的货币
const checkCurrency = (_configList) => {
  const currency = optionsData.currency ?? [];
  const currencyMap = mappingArrayToObject(currency);
  const kindConfig = {};
  const result = [];
  _configList.forEach((item) => {
    if (!currencyMap[item.currency_config_id]) return;
    if (!kindConfig[item.game_kind_id]) kindConfig[item.game_kind_id] = {};
    kindConfig[item.game_kind_id][item.currency_config_id] = item;
    result.push(item);
  });
  Object.keys(kindConfig).forEach((kindId) => {
    currency.forEach((cur) => {
      if (!kindConfig[kindId][cur.id]) result.push({ ...configTemp, game_kind_id: Number(kindId), currency_config_id: cur.id });
    });
  });
  return result;
};

// 根据kindId, currencyId获取索引
const getConfigIndex = (kindId, currencyId) => {
  return source.value[kindId]?.[currencyId];
};

// 处理配置选项变更
const kindSelectChange = (selected) => {
  const currency = optionsData.currency ?? [];
  const map = {};
  selected.forEach((kindId) => (map[kindId] = true));
  const hasKind = {};
  for (let i = configList.length - 1; i >= 0; i--) {
    const config = configList[i];
    if (!map[config.game_kind_id]) configList.splice(i, 1);
    else hasKind[config.game_kind_id] = true;
  }
  selected.forEach((kindId) => {
    if (!hasKind[kindId]) {
      currency.forEach((cur) => {
        configList.push({ ...configTemp, game_kind_id: kindId, currency_config_id: cur.id });
      });
    }
  });
};

// 提交表单
const handleSubmit = async () => {
  const params = { game_id: formData.game_id, data: configList };
  layer.loading();
  await gameConfigSet(params);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  emit('success');
};

defineExpose({ open, init, handleSubmit });
</script>
<style lang="scss" scoped>
.form-wrap {
  min-height: 30vh;
}

.kind-wrap {
  position: relative;
  min-height: 80px;
  margin-left: 120px;
  .kind-title {
    position: absolute;
    top: 0;
    left: -120px;
    width: 120px;
  }
}

.custom-checkbox {
  min-width: 100px;
}

.g-table {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  .g-table-item {
    box-sizing: border-box;
    width: 100px;
    padding: 5px;
    text-align: center;

    ::v-deep(.el-input__wrapper) {
      padding-left: 5px;
      padding-right: 5px;
    }

    &.big {
      width: 160px;
    }

    &.title {
      font-weight: bold;
    }
  }
}
</style>
