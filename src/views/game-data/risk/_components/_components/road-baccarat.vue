<template>
  <div class="road-wrap" :style="{ height: getPX(size) }" v-if="!!betResults.length">
    <el-scrollbar>
      <div class="road-content" :style="{ width: placeWidth }">
        <template v-for="(part, x) in roadList" :key="x">
          <template v-for="(record, y) in part" :key="getMultipleKey(x, y)">
            <div class="road-item flex-col justify-center align-center cursor-pointer" :style="getPositionBySize(x, y, boxSize)">
              <template v-if="!!record.bet_result">
                <gv-game-kind-icon :kinds="kinds" :compose="record.bet_result" :size="iconSize" />
              </template>
            </div>
          </template>
        </template>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import GvGameKindIcon from '@/components/gv-game-kind-icon/index.vue';
import { computed } from 'vue';
import { chunkArray, getMultipleKey, getPositionBySize, getPX } from '@/tools';

const props = defineProps({ size: Number, betResults: Array, kinds: Object });

const size = 160;

const defaultRows = 6;

const boxSize = computed(() => Math.floor(props.size / defaultRows));
const iconSize = computed(() => Math.floor(boxSize.value * 0.8));

const roadList = computed(() => chunkArray(props.betResults ?? [], defaultRows));
const placeWidth = computed(() => Math.ceil(boxSize.value * roadList.value.length));
</script>
<style lang="scss" scoped>
.road-wrap {
  position: relative;

  .road-item {
    position: absolute;
  }
}
</style>
