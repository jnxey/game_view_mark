<template>
  <gv-popup
    ref="popupRef"
    :title="popupTitle"
    :async="true"
    :width="popupWidth"
    :confirm-button-text="$t('user.list.btn_save_all')"
    @confirm="handleSubmit"
    @close="handleClose"
  >
    <template v-if="userInfo">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('user.list.label_config_shares')" :name="GAME_CONFIG_MARK.shares" />
        <el-tab-pane :label="$t('user.list.label_config_washing')" :name="GAME_CONFIG_MARK.washing" />
        <el-tab-pane :label="$t('user.list.label_config_redeem')" :name="GAME_CONFIG_MARK.redeem" />
      </el-tabs>
      <gv-anchor-point ref="anchorPointRef" max-height="50vh" @scroll-anchor="scrollAnchor">
        <div class="content-wrap" @click.right.prevent="rightClick">
          <gv-tips class="mb-16" :title="$t('user.list.tips_config_right')" cache-key="user-list-config-tips" />
          <shares-popup ref="sharesRef" :data-anchor-point="GAME_CONFIG_MARK.shares" />
          <washing-popup ref="washingRef" :data-anchor-point="GAME_CONFIG_MARK.washing" />
          <redeem-popup ref="redeemRef" :data-anchor-point="GAME_CONFIG_MARK.redeem" />
        </div>
      </gv-anchor-point>
    </template>
  </gv-popup>
  <gv-command ref="commandRef">
    <div class="value-item text-center">
      {{ $t('user.list.label_config_select_value') }}：
      <span class="fz-20 fw-bold">{{ commandCache.value }}</span>
    </div>
    <div class="command-item link text-center" @click="commandApplyToAll">{{ $t('user.list.label_config_apply_all') }}</div>
  </gv-command>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, nextTick, provide, reactive, ref, shallowRef, unref } from 'vue';
import { useDictOptions } from '@/hooks/dict';
import { currencyBaseLists } from '@/api/currency/base';
import { currencyConfigLists } from '@/api/currency/config';
import layer from '@/tools/layer';
import { userDetail } from '@/api/user/list';
import WashingPopup from './_components/washing.vue';
import RedeemPopup from './_components/redeem.vue';
import SharesPopup from './_components/shares.vue';
import { gameLists } from '@/api/game/list';
import { calcAmount, getAppointDOM, getPX, isEmpty } from '@/tools';
import GvAnchorPoint from '@/components/gv-anchor-point/index.vue';
import { GAME_CONFIG_MARK } from '@/views/user/list/_components/_values';
import GvTips from '@/components/gv-tips/index.vue';
import GvCommand from '@/components/gv-command/index.vue';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['close']);

const popupRef = shallowRef();
const anchorPointRef = shallowRef();
const sharesRef = shallowRef();
const washingRef = shallowRef();
const redeemRef = shallowRef();
const commandRef = shallowRef();
const userInfo = ref();
const activeTab = ref(GAME_CONFIG_MARK.shares);

const commandCache = reactive({ value: null, point: null });

const { optionsData, refresh } = useDictOptions(
  {
    gameList: { api: gameLists },
    currencyConfig: { api: currencyConfigLists },
    currencyBase: { api: currencyBaseLists }
  },
  true
);

const popupTitle = computed(() => $t('user.list.title_config', { username: userInfo.value?.username }));

// 弹窗宽度
const popupWidth = computed(() => {
  const len1 = optionsData.currencyConfig?.length ?? 0;
  const len2 = optionsData.currencyBase?.length ?? 0;
  return getPX(Math.max(250 + len1 * 120, 200 + len2 * 120, 600));
});

// 打开
const open = async (row) => {
  layer.loading();
  await refresh();
  const res = await userDetail({ user_id: row.id, attr_name: 'all' });
  layer.closeLoading();
  popupRef.value?.open();
  userInfo.value = unref(res);
  await nextTick();
  sharesRef.value?.init(res.shares ?? [], res.rebateLimit ?? [], res.volume ?? [], row.cost_rate);
  washingRef.value?.init(res.washing ?? []);
  redeemRef.value?.init(res.integral ?? []);
};

// 获取command标识
const getCommandMark = (node) => {
  return node?.getAttribute('data-command');
};

// 获取command值
const getCommandValue = (node) => {
  return node?.getAttribute('data-command-value');
};

// 右击输入框
const rightClick = (event) => {
  const target = event.target;
  if (target.tagName !== 'INPUT') return;
  const parent = getAppointDOM(target, (node) => !!getCommandMark(node));
  const point = getCommandMark(parent);
  if (!point) return layer.msg($t('user.list.tips_apply_all_no_support'));
  const cValue = getCommandValue(parent);
  commandCache.value = isEmpty(cValue) ? 0 : calcAmount(cValue);
  commandCache.point = point;
  commandRef.value?.open(event);
};

// 应用到全部
const commandApplyToAll = () => {
  if (commandCache.point === GAME_CONFIG_MARK.shares) {
    sharesRef.value?.setValueToAll(commandCache.value);
  }
  if (commandCache.point === GAME_CONFIG_MARK.washing) {
    washingRef.value?.setValueToAll(commandCache.value);
  }
  if (commandCache.point === GAME_CONFIG_MARK.redeem) {
    redeemRef.value?.setValueToAll(commandCache.value);
  }
  if (commandCache.point === GAME_CONFIG_MARK.rebateLimit) {
    sharesRef.value?.setRebateToAll(commandCache.value);
  }
  commandRef.value?.close();
};

// 切换跳转
const handleTabClick = (value) => {
  anchorPointRef.value?.scroll(value.props.name);
};

// 滚动切换
const scrollAnchor = (tab) => {
  activeTab.value = tab;
};

// 提交
const handleSubmit = async () => {
  await layer.confirm($t('user.list.tips_confirm_config_save'));
  layer.loading();
  await sharesRef.value?.handleSubmit(false);
  await washingRef.value?.handleSubmit(false);
  await redeemRef.value?.handleSubmit(false);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
};

// 关闭
const handleClose = () => {
  emit('close');
  userInfo.value = null;
  activeTab.value = GAME_CONFIG_MARK.shares;
};

provide('optionsData', optionsData);
provide('userInfo', userInfo);
defineExpose({ open });
</script>
<style lang="scss" scoped>
.content-wrap {
  padding: 10px 10px 300px 10px;
}
.command-wrap {
  .value-item {
    padding: 10px;
  }
}
</style>
