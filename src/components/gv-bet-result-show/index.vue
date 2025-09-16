<template>
  <div class="gv-bet-result-show" :style="boxWrapStyle">
    <template v-if="!!betInfo">
      <template v-if="GAME_MODEL_TYPE_BACCARAT.includes(betInfo.game_model) && !!betInfo.bet_result">
        <gv-game-kind-icon :kinds="kindsMap" :compose="betInfo.bet_result" :size="size" />
      </template>
      <template v-else-if="betInfo.game_model === GAME_MODEL.niu_niu">
        <el-popover title="NIU" trigger="click">
          <template #reference>
            <div class="place-box" :title="$t('common.tips_click')">NIU</div>
          </template>
          <template #default>
            <div class="mb-4" v-for="(item, index) in getNiuniuResult(betInfo.bet_result, false)" :key="index">{{ item }}</div>
          </template>
        </el-popover>
      </template>
      <template v-else-if="betInfo.game_model === GAME_MODEL.general">
        <div class="place-box grey" :title="$t('common.no_match_data')">E</div>
      </template>
    </template>
  </div>
</template>
<script>
export default { name: 'gv-bet-result-show' };
</script>
<script setup>
import { computed, ref, watch } from 'vue';
import { betOpenDetail } from '@/api/game-data/bet';
import { getPX, mappingArrayToObject } from '@/tools';
import { GAME_MODEL, GAME_MODEL_TYPE_BACCARAT } from '@/values';
import { getNiuniuResult } from '@/tools/road';
import GvGameKindIcon from '@/components/gv-game-kind-icon/index.vue';
import { useDictOptions } from '@/hooks/dict';
import { gameKindLists } from '@/api/game/kind';
import { $t } from '@/lang/i18n';

const props = defineProps({ openId: Number, size: Number });
const betInfo = ref(null);

const { optionsData } = useDictOptions({ kinds: { api: gameKindLists } });

const kindsMap = computed(() => mappingArrayToObject(optionsData.kinds ?? []));

const boxWrapStyle = computed(() => ({ width: getPX(props.size), height: getPX(props.size), fontSize: getPX(props.size / 2) }));

const getBetResult = async () => {
  if (!props.openId) return (betInfo.value = null);
  const res = await betOpenDetail({ open_id: props.openId });
  betInfo.value = { ...res };
};

watch(
  () => props.openId,
  () => getBetResult(),
  { immediate: true }
);
</script>
<style scoped>
.place-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--el-primary-text-color);
  border-radius: 50%;
  background-color: var(--el-color-primary);

  &.grey {
    color: var(--el-text-color);
    border-radius: 50%;
    background-color: var(--el-fill-color-darker);
  }
}
</style>
