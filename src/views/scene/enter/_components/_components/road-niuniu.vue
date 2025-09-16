<template>
  <gv-popup
    ref="popupRef"
    :title="$t('scene.enter.title_select_road')"
    width="900px"
    :cancel-button-text="$t('common.close_btn')"
    :confirm-button-text="$t('scene.enter.btn_bet_confirm')"
    @confirm="handleConfirm"
  >
    <div class="road-niuniu pb-16">
      <div class="edit-wrap">
        <template v-for="item in ROAD_NIUNIU_SEAT_DICT" :key="item.value">
          <div class="edit-row flex-row align-center" :class="{ dealer: item.value === ROAD_NIUNIU_SEAT.dealer }">
            <div class="edit-item box fz-14">
              {{ item.name }}
            </div>
            <template v-for="_item in ROAD_NIUNIU_CARD_DICT" :key="getMultipleKey(item.value, _item.value)">
              <template v-if="!_item.noDealer || item.value !== ROAD_NIUNIU_SEAT.dealer">
                <div class="edit-item cursor-pointer" @click="setCurrent(item, _item)">
                  <img v-show="current[item.value] === _item.value" class="img-icon" :src="getRoadNiuImage(_item.active)" alt="" />
                  <img v-show="current[item.value] !== _item.value" class="img-icon" :src="getRoadNiuImage(_item.image)" alt="" />
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
    </div>
  </gv-popup>
</template>
<script setup>
import { reactive, shallowRef, toRaw } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import { getMultipleKey, getRoadNiuImage, syncObjectData } from '@/tools';
import { ROAD_NIUNIU_SEAT, ROAD_NIUNIU_SEAT_DICT, ROAD_NIUNIU_CARD_DICT, ROAD_NIUNIU_EMPTY_KEY } from '@/values/road';
import layer from '@/tools/layer';
import { $t } from '@/lang/i18n';

const props = defineProps({ options: Array });
const popupRef = shallowRef();

const temp = { dealer: null, player1: null, player2: null, player3: null, player5: null, player6: null };
const current = reactive({ ...temp });

const cacheCallback = { confirm: null };

const open = (confirm) => {
  syncObjectData(current, { ...temp });
  cacheCallback.confirm = confirm;
  popupRef.value?.open();
};

// 设置当前选中
const setCurrent = (seat, card) => {
  current[seat.value] = card.value;
};

// 确认操作
const handleConfirm = async () => {
  await layer.confirm($t('scene.enter.tips_confirm_bet'));
  const value = toRaw(current);
  Object.keys(value).forEach((p) => {
    if (!value[p]) value[p] = ROAD_NIUNIU_EMPTY_KEY;
  });
  if (cacheCallback.confirm) cacheCallback.confirm(value);
  popupRef.value?.close();
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.road-niuniu {
  --edit-main-color: rgb(212, 148, 244);
  --edit-main-lighter-color: rgb(246, 236, 251);
  --edit-main-dark-color: rgb(135, 5, 198);
  --edit-main-text-color: rgb(255, 255, 255);

  .edit-wrap {
    background-color: var(--edit-main-lighter-color);

    .edit-row {
      padding: 2px;
      &.dealer {
        background-color: var(--edit-main-color);
      }
    }

    .edit-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      margin: 0 2px;
      background-size: 100% 100%;

      &.box {
        color: var(--edit-main-text-color);
        border-radius: var(--gv-border-radius-mid);
        background-color: var(--edit-main-dark-color);
      }

      .img-icon {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
