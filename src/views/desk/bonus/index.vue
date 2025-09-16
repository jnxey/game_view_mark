<template>
  <div class="bonus-page">
    <glc-panel-page ref="glcPageRef" />
    <div v-if="showTips" class="p-16 fz-24 text-placeholder">
      {{ $t('desk.bonus.empty_tips') }}
      <el-button v-perms="[permsMap.bonus.list.view]" type="primary" @click="toRoutePath(permsMap.bonus.list.view)">
        {{ $t('desk.bonus.to_set_btn') }}
      </el-button>
    </div>
    <play-broadcast ref="playBroadcastRef" />
    <play-voice />
    <exit-to-main />
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue';
import layer from '@/tools/layer';
import { generateUUID, getJSON, isArray, mappingArrayToObject, pageReload } from '@/tools';
import { bounsConfigLists } from '@/api/bouns/config';
import { QUERY_LIST_TYPE } from '@/values';
import { bonusDiyUIList, bonusListGet } from '@/api/bouns/list';
import GlcPanelPage from '@/components/gv-low-code/panel-page.vue';
import { useWebsocket } from '@/hooks/websocket';
import { permsMap } from '@/api/perms';
import { toRoutePath } from '@/router';
import PlayBroadcast from '@/views/desk/bonus/_commponents/play-broadcast.vue';
import PlayVoice from '@/views/desk/bonus/_commponents/play-voice.vue';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';
import { $t } from '@/lang/i18n';
import ExitToMain from '@/views/desk/_components/exit-to-main.vue';

const route = useRoute();
const query = computed(() => route.query);
const bonusId = computed(() => Number(query.value.id));

const glcPageRef = shallowRef();
const playBroadcastRef = shallowRef();
const showTips = ref(false);

const { optionsData } = useDictOptions({ currencyConfig: { api: currencyConfigLists } });

const currencyConfigMap = computed(() => mappingArrayToObject(optionsData.currencyConfig ?? []));

// 获取UI设置
const initBonusUI = async (loading = true) => {
  if (loading) layer.loading();
  const { lists } = await bounsConfigLists({ bonus_id: bonusId.value, page_type: QUERY_LIST_TYPE.all });
  const bonus = await bonusListGet({ id: bonusId.value });
  const info = await bonusDiyUIList({ bonus_id: bonusId.value });
  const schema = isArray(info) && !info.length ? null : getJSON(info?.content, null);
  showTips.value = !schema;
  if (loading) layer.closeLoading();
  await nextTick();
  if (!!schema) glcPageRef.value.setConfig(schema, { bonus: lists, bonus_symbol: bonus.currency_icon });
};

const wsRisk = { room: 'broadcast', action: 'broadcastBonusResultList' };
useWebsocket(wsRisk.room, (message) => {
  if (message.type !== wsRisk.action) return;
  initBonusUI(false);
  if (!message.users.length) return;
  const awards = [];
  const cMap = currencyConfigMap.value ?? {};
  message.users?.forEach((l2) => {
    l2?.forEach(({ username, currency_config_id, bonus_profit_loss }) => {
      const symbol = cMap[currency_config_id]?.icon ?? '';
      awards.push({ id: generateUUID(), name: username, profit: symbol + bonus_profit_loss });
    });
  });
  playBroadcastRef.value?.close();
  playBroadcastRef.value?.open(awards);
});

watch(
  () => query.value,
  () => pageReload()
);

onMounted(async () => {
  await initBonusUI();
});
</script>
<style lang="scss" scoped></style>
