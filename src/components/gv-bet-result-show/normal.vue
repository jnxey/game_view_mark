<template>
  <div class="gv-bet-result-show" :style="boxWrapStyle">
    <template v-if="!!betInfo">
      <template v-if="GAME_MODEL_TYPE_BACCARAT.includes(betInfo.game_model) && !!betInfo.bet_result">
        <gv-game-kind-icon
          :class="{ 'cursor-pointer': editAble }"
          :kinds="kindsMap"
          :compose="betInfo.bet_result"
          :size="size"
          @click.stop="handlerClick"
        />
      </template>
      <template v-else-if="betInfo.game_model === GAME_MODEL.niu_niu">
        <el-popover title="NIU" trigger="click">
          <template #reference>
            <div class="place-box cursor-pointer" :title="$t('common.tips_click')">NIU</div>
          </template>
          <template #default>
            <div :class="{ link: editAble }" @click.stop="handlerClick">
              <div class="mb-4" v-for="(item, index) in getNiuniuResult(betInfo.bet_result, false)" :key="index">{{ item }}</div>
            </div>
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
export default { name: 'gv-bet-result-normal' };
</script>
<script setup>
import { GAME_MODEL, GAME_MODEL_TYPE_BACCARAT } from '@/values';
import { getNiuniuResult } from '@/tools/road';
import GvGameKindIcon from '@/components/gv-game-kind-icon/index.vue';
import { computed } from 'vue';
import { getPX } from '@/tools';
import { $t } from '@/lang/i18n';

const emits = defineEmits(['editClick']);
const props = defineProps({ betInfo: Object, kindsMap: Object, size: Number, editAble: Boolean });

const boxWrapStyle = computed(() => ({ width: getPX(props.size), height: getPX(props.size), fontSize: getPX(props.size / 2) }));

const handlerClick = () => {
  emits('editClick');
};
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
  box-shadow:
    inset -2px -2px 4px rgba(0, 0, 0, 0.1),
    inset 2px 2px 4px rgba(255, 255, 255, 0.7);

  &.grey {
    color: var(--el-text-color);
    border-radius: 50%;
    background-color: var(--el-fill-color-darker);
  }
}
</style>
