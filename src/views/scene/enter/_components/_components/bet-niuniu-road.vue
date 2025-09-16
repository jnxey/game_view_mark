<template>
  <gv-popup ref="popupRef" :title="$t('scene.enter.btn_next_road_edit')" :async="true" width="600px" :show-footer="false">
    <div class="pb-16">
      <el-scrollbar class="scroll-wrap" :style="{ width: getPX(size * 1.5), height: getPX(size) }">
        <div class="road-wrap flex-row flex-nowrap" :style="{ width: getPX(placeWidth) }">
          <div class="road-col first flex-col">
            <template v-for="seat in ROAD_NIUNIU_SEAT_DICT" :key="seat.value">
              <div class="road-item" :style="{ width: getPX(boxWidthSize), height: getPX(boxHeightSize) }">
                <div class="name">{{ seat.name }}</div>
              </div>
            </template>
          </div>
          <div class="road-col flex-col" v-for="road in roadList" :Key="road.open_id">
            <template v-for="seat in ROAD_NIUNIU_SEAT_DICT" :key="seat.value">
              <div
                class="road-item cursor-pointer"
                :style="{ width: getPX(boxWidthSize), height: getPX(boxHeightSize) }"
                @click="handleEdit(road, seat)"
              >
                <img class="road-icon" :src="getRoadNiuImage(roadCardMap[road.bet_result?.[seat.value]]?.road)" alt="" />
              </div>
            </template>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </gv-popup>
  <road-niuniu-card ref="roadNiuniuCardRef" />
</template>
<script setup>
import { computed, inject, ref, shallowRef } from 'vue';
import { getPX, getRoadNiuImage, parseDict } from '@/tools';
import { ROAD_NIUNIU_CARD_DICT, ROAD_NIUNIU_SEAT_DICT } from '@/values/road';
import GvPopup from '@/components/gv-popup/index.vue';
import RoadNiuniuCard from '@/views/scene/enter/_components/_components/road-niuniu-card.vue';
import layer from '@/tools/layer';
import { betOpenSet } from '@/api/game-data/bet-open';
import { $t } from '@/lang/i18n';

const currentBootRecord = inject('currentBootRecord');

const emit = defineEmits(['success']);

const popupRef = shallowRef();
const roadNiuniuCardRef = shallowRef();
const roadInfo = ref({});

const roadCardMap = parseDict(ROAD_NIUNIU_CARD_DICT);

const size = 360;

const defaultRows = 6;

const boxWidthSize = computed(() => Math.floor((size * 1.3) / defaultRows));
const boxHeightSize = computed(() => Math.floor(size / defaultRows));

const roadList = computed(() => currentBootRecord.value ?? []);
const placeWidth = computed(() => Math.ceil(boxWidthSize.value * roadList.value.length));

const open = async (info) => {
  roadInfo.value = info;
  popupRef.value?.open();
};

const handleEdit = async (road, seat) => {
  roadNiuniuCardRef.value?.open(async (row) => {
    layer.loading();
    const result = road.bet_result;
    result[seat.value] = row.value;
    const params = { id: road.open_id, bet_result: result };
    await betOpenSet(params);
    layer.closeLoading();
    layer.msgSuccess($t('common.save_success'));
    emit('success');
  });
};

defineExpose({ open });
</script>
<style scoped lang="scss">
.scroll-wrap {
  margin: 0 auto;
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
      background-color: var(--el-color-primary-light-3);
    }
  }
}
</style>
