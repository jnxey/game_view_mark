<template>
  <el-scrollbar>
    <div class="road-content">
      <div class="road-wrap flex-row flex-nowrap" :style="{ width: getPX(placeWidth) }">
        <div class="road-col first flex-col">
          <div class="road-item" :style="{ width: getPX(boxWidthSize), height: getPX(boxHeightSize) }">
            <div class="item-box fz-18 fw-bold" />
          </div>
          <template v-for="seat in ROAD_NIUNIU_SEAT_DICT" :key="seat.value">
            <div class="road-item" :style="{ width: getPX(boxWidthSize), height: getPX(boxHeightSize) }">
              <div class="item-box fz-18 fw-bold">{{ seat.name }}</div>
            </div>
          </template>
        </div>
        <div class="road-col flex-col" v-for="item in ROAD_NIUNIU_CARD_DICT" :key="item.value">
          <div class="road-item cursor-pointer" :style="{ width: getPX(boxWidthSize), height: getPX(boxHeightSize) }">
            <div class="item-box fz-18 fw-bold">{{ item.name }}</div>
          </div>
          <template v-for="seat in ROAD_NIUNIU_SEAT_DICT" :key="seat.value">
            <div class="road-item" :style="{ width: getPX(boxWidthSize), height: getPX(boxHeightSize) }">
              <div class="item-box gradient fz-24 fw-bold">{{ count[seat.value]?.[item.value] ?? '' }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>
<script setup>
import { ROAD_NIUNIU_CARD_DICT, ROAD_NIUNIU_SEAT_DICT } from '@/values/road';
import { getPX, getWindowSize } from '@/tools';
import { computed, watch } from 'vue';
import { isObject } from '@vue/shared';

const props = defineProps({ roadList: Array });

const size = (getWindowSize().height - 80) * 0.35;

const defaultRows = 6;

const boxWidthSize = computed(() => Math.floor((size * 1.3) / defaultRows));
const boxHeightSize = computed(() => Math.floor(size / defaultRows));

const placeWidth = computed(() => Math.ceil(boxWidthSize.value * props.roadList.length));

const count = computed(() => {
  const result = {};
  props.roadList.forEach((item) => {
    if (!isObject(item.bet_result)) return;
    Object.keys(item.bet_result).forEach((name) => {
      console.log(name);
      const pResult = item.bet_result[name];
      if (!result[name]) result[name] = {};
      result[name][pResult] = (result[name][pResult] ?? 0) + 1;
    });
  });
  return result;
});
</script>
<style scoped lang="scss">
.road-content {
  position: relative;
  padding: 20px;
  border-radius: var(--gv-border-radius-big);
  background-color: var(--desk-niuniu-count-bg);

  .road-wrap {
    position: relative;
    .road-col {
      &.first {
        position: sticky;
        left: 0;
      }
    }

    .road-item {
      .item-box {
        width: 90%;
        height: 90%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
        color: var(--desk-niuniu-master-color);
        box-sizing: var(--el-box-shadow-light);
        background-color: var(--desk-niuniu-item-bg);

        &.gradient {
          color: var(--desk-niuniu-item-gradient-color);
          background-image: var(--desk-niuniu-item-gradient-bg);
        }
      }
    }
  }
}
</style>
