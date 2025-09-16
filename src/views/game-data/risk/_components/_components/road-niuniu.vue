<template>
  <div class="road-wrap" :style="{ height: getPX(size) }" v-if="!!betResults.length">
    <el-scrollbar>
      <div class="road-wrap flex-row flex-nowrap" :style="{ width: getPX(placeWidth) }">
        <div class="road-col first flex-col">
          <template v-for="seat in ROAD_NIUNIU_SEAT_DICT" :key="seat.value">
            <div class="road-item" :style="{ width: getPX(boxWidthSize), height: getPX(boxHeightSize) }">
              <div class="name">{{ seat.name }}</div>
            </div>
          </template>
        </div>
        <div class="road-col flex-col" v-for="road in betResults" :Key="road.open_id">
          <template v-for="seat in ROAD_NIUNIU_SEAT_DICT" :key="seat.value">
            <div class="road-item cursor-pointer" :style="{ width: getPX(boxWidthSize), height: getPX(boxHeightSize) }">
              <img class="road-icon" :src="getRoadNiuImage(roadCardMap[road.bet_result?.[seat.value]]?.road)" alt="" />
            </div>
          </template>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { getPX, getRoadNiuImage, parseDict } from '@/tools';
import { ROAD_NIUNIU_CARD_DICT, ROAD_NIUNIU_SEAT_DICT } from '@/values/road';

const props = defineProps({ size: Number, betResults: Array });
const roadCardMap = parseDict(ROAD_NIUNIU_CARD_DICT);

const defaultRows = 6;

const boxWidthSize = computed(() => Math.floor((props.size * 1.3) / defaultRows));
const boxHeightSize = computed(() => Math.floor(props.size / defaultRows));
const placeWidth = computed(() => Math.ceil(boxWidthSize.value * props.betResults.length));
</script>
<style lang="scss" scoped>
.road-wrap {
  position: relative;
  .road-col {
    &.first {
      position: sticky;
      left: 0;
    }
  }

  .road-item {
    .road-icon {
      width: 90%;
      height: 90%;
    }

    .name {
      width: 90%;
      height: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      color: var(--el-primary-text-color);
      box-sizing: var(--el-box-shadow-light);
      background-color: var(--el-color-primary-light-3);
    }
  }
}
</style>
