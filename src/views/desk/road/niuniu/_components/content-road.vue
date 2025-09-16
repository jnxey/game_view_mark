<template>
  <el-scrollbar>
    <div class="road-content">
      <div class="master-bg" :style="{ height: getPX(boxHeightSize) }" />
      <div class="road-wrap flex-row flex-nowrap" :style="{ width: getPX(placeWidth) }">
        <div class="road-col first flex-col">
          <template v-for="seat in ROAD_NIUNIU_SEAT_DICT" :key="seat.value">
            <div class="road-item" :style="{ width: getPX(boxWidthSize), height: getPX(boxHeightSize) }">
              <div class="name fz-18">{{ seat.name }}</div>
            </div>
          </template>
        </div>
        <div class="road-col flex-col" v-for="road in roadList" :Key="road.open_id">
          <template v-for="seat in ROAD_NIUNIU_SEAT_DICT" :key="seat.value">
            <div class="road-item cursor-pointer" :style="{ width: getPX(boxWidthSize), height: getPX(boxHeightSize) }">
              <img class="road-icon" :src="getRoadNiuImage(roadCardMap[road.bet_result?.[seat.value]]?.road)" alt="" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>
<script setup>
import { ROAD_NIUNIU_CARD_DICT, ROAD_NIUNIU_SEAT_DICT } from '@/values/road';
import { getPX, getRoadNiuImage, getWindowSize, parseDict } from '@/tools';
import { computed } from 'vue';

const props = defineProps({ roadList: Array });

const roadCardMap = parseDict(ROAD_NIUNIU_CARD_DICT);

const size = (getWindowSize().height - 80) * 0.35;

const defaultRows = 6;

const boxWidthSize = computed(() => Math.floor((size * 1.3) / defaultRows));
const boxHeightSize = computed(() => Math.floor(size / defaultRows));

const placeWidth = computed(() => Math.ceil(boxWidthSize.value * props.roadList.length));
</script>
<style scoped lang="scss">
.road-content {
  position: relative;
  padding: 20px;
  border-radius: var(--gv-border-radius-big);
  background-image: var(--desk-niuniu-content-bg);

  .master-bg {
    position: absolute;
    top: 20px;
    left: 10px;
    right: 10px;
    transform: translateY(-5%);
    border-radius: var(--gv-border-radius-mid);
    background-color: var(--desk-niuniu-master-bg);
  }

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
        background-color: var(--desk-niuniu-title-bg);
      }
    }
  }
}
</style>
