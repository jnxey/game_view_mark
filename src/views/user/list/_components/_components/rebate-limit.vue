<template>
  <div class="rebate-limit">
    <div class="single-title">{{ $t('user.list.label_rebate_limit_title') }}</div>
    <div class="g-table">
      <template v-for="currency in optionsData.currencyBase" :key="currency.id">
        <div class="g-table-item title">{{ $ti(currency.name) }}</div>
      </template>
      <div class="g-table-item title">{{ $t('user.list.label_rebate_limit_sync') }}</div>
    </div>
    <div class="g-table">
      <template v-for="currency in optionsData.currencyBase" :key="currency.id">
        <div class="g-table-item">
          <template v-if="configList[getConfigIndex(currency.id)]">
            <gv-input-amount-placeholder
              v-model="configList[getConfigIndex(currency.id)].rate"
              :min="0"
              :max="Number.MAX_SAFE_INTEGE"
              placeholder=""
              :controls="false"
              negative
              class="w-full"
              :data-command="GAME_CONFIG_MARK.rebateLimit"
            >
              <template #prefix><span>-</span></template>
              <template #suffix>
                <span>{{ currency.icon }}</span>
              </template>
            </gv-input-amount-placeholder>
          </template>
        </div>
      </template>
      <div class="g-table-item title">
        <el-switch :model-value="getFollow()" @click="setFollow()" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disabled" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject, reactive, shallowRef } from 'vue';
import { useDelay } from '@/hooks/delay';
import { SHARE_REBATE_VALUE, STATUS_VALUE } from '@/values';
import { userEditAttr } from '@/api/user/list';
import { mappingArrayToObject, syncObjectData } from '@/tools';
import { GAME_CONFIG_MARK } from '@/views/user/list/_components/_values';
import GvInputAmountPlaceholder from '@/components/gv-input-amount/placeholder.vue';
import { getExchangeStatus } from '@/tools/status-value';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const optionsData = inject('optionsData');
const userInfo = inject('userInfo');

const formRef = shallowRef();

// 默认配置模板
const configTemp = { id: null, currency_id: null, is_follow: STATUS_VALUE.disable, rate: 0 };

// 配置列表
const configList = reactive([]);

// 每个kind、currency对应的配置列表索引
const source = computed(() => {
  const result = {};
  configList.forEach((item, index) => {
    if (!result[item.currency_id]) result[item.currency_id] = {};
    result[item.currency_id] = index;
  });
  return result;
});

// 清楚校验
const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

// 初始化
const init = async (values) => {
  const _configList = checkConfigList(values.map((val) => syncObjectData({ ...configTemp }, val)));
  configList.splice(0);
  configList.push(..._configList);
};

// 检查是否有新增的货币
const checkConfigList = (_configList) => {
  const currency = optionsData.currencyBase ?? [];
  const currencyMap = mappingArrayToObject(currency);
  const config = {};
  const result = [];
  _configList.forEach((item) => {
    if (!currencyMap[item.currency_id]) return;
    if (!config[item.currency_id]) config[item.currency_id] = {};
    config[item.currency_id] = item;
    result.push(item);
  });
  currency.forEach((cur) => {
    if (!config[cur.id]) result.push({ ...configTemp, currency_id: cur.id });
  });
  return result;
};

// 根据gameId, currencyId获取索引
const getConfigIndex = (currencyId) => {
  return source.value[currencyId];
};

// 获取游戏跟随状态
const getFollow = () => {
  for (let i = 0; i < configList.length; i++) {
    return configList[i].is_follow;
  }
  return STATUS_VALUE.disable;
};

// 设置游戏跟随状态
const setFollow = (gameId) => {
  const current = getFollow(gameId);
  for (let i = 0; i < configList.length; i++) {
    configList[i].is_follow = getExchangeStatus(current);
  }
};

// 设置值到全部
const setValueToAll = (value) => {
  for (let i = 0; i < configList.length; i++) {
    configList[i].rate = value;
  }
};

// 提交表单
const handleSubmit = async (sharesType) => {
  const params = {
    user_id: userInfo.value?.id,
    attr_name: 'rebateLimit',
    is_shares: sharesType,
    data: sharesType === SHARE_REBATE_VALUE.rebate ? configList : []
  };
  await userEditAttr(params);
};

defineExpose({ open, init, setValueToAll, handleSubmit });
</script>
<style lang="scss" scoped>
@use '../_style/index.scss';
</style>
