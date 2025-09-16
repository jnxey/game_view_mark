<template>
  <el-scrollbar ref="scrollbarRef" class="pannel-right-road" :style="{ width: getPX(size), height: getPX(size) }">
    <div class="road-wrap" :style="{ width: getPX(placeWidth), height: getPX(placeHeight) }">
      <template v-for="(part, x) in roadList" :key="x">
        <template v-for="(record, y) in part" :key="getMultipleKey(x, y)">
          <div class="road-item" :class="{ last: checkLast(x, y) }" :style="getPositionBySize(x, y, boxSize)">
            <template v-if="!!record.bet_result">
              <gv-game-kind-icon :kinds="gameKindMap" :compose="record.bet_result" :size="iconSize" />
            </template>
            <template v-else-if="checkLast(x, y) && !!previewResult">
              <gv-game-kind-icon :kinds="gameKindMap" :compose="previewResult" :size="iconSize" />
            </template>
          </div>
        </template>
      </template>
    </div>
  </el-scrollbar>
</template>
<script setup>
import { computed, inject, nextTick, shallowRef, watch } from 'vue';
import { chunkArray, elementScrollToRight, getMultipleKey, getPositionBySize, getPX } from '@/tools';
import GvGameKindIcon from '@/components/gv-game-kind-icon/index.vue';

const currentBootRecord = inject('currentBootRecord');
const formatCheckSubCalc = inject('formatCheckSubCalc');
const gameKindMap = inject('gameKindMap');

const defaultRows = 6;

const props = defineProps({ size: Number });

const scrollbarRef = shallowRef();

const boxSize = computed(() => Math.floor(props.size / defaultRows));

const iconSize = computed(() => Math.floor(boxSize.value * 0.8));

const previewResult = computed(() => {
  const result = formatCheckSubCalc.value?.betResult ?? [];
  return !!result.length ? result : null;
});

const recordList = computed(() => [...(currentBootRecord.value ?? []), {}]);

const roadList = computed(() => chunkArray(recordList.value, defaultRows));

const placeWidth = computed(() => Math.ceil(boxSize.value * roadList.value.length));

const placeHeight = computed(() => Math.ceil(boxSize.value * defaultRows));

// 检查是否是最后一个
const checkLast = (x, y) => {
  const list1 = roadList.value;
  const list2 = list1[x];
  const r1 = x === list1.length - 1;
  const r2 = y === list2.length - 1;
  return r1 && r2;
};

watch(
  () => roadList.value,
  async () => {
    await nextTick();
    elementScrollToRight(scrollbarRef.value);
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.pannel-right-road {
  .road-wrap {
    position: relative;

    .road-item {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;

      &.last {
        border: 2px solid var(--scene-enter-road-last-border-color);
      }
    }
  }
}
</style>
