<template>
  <div class="pannel-left" :style="panelLeftStyle">
    <el-scrollbar>
      <gv-scene-card class="work-operate mb-12" :title="$t('common.operate_col')">
        <div class="flex-row align-center pt-8 mb-16">
          <gv-scene-button class="flex-1" type="dark" round @click="openTableChip(NUMBER_HANDLER.inc)">
            {{ $t('scene.enter.operate_chip_inc') }}
          </gv-scene-button>
          <gv-scene-button class="flex-1 ml-12" type="dark" round @click="openTableChip(NUMBER_HANDLER.dec)">
            {{ $t('scene.enter.operate_chip_dec') }}
          </gv-scene-button>
        </div>
        <div class="flex-row align-center mb-16">
          <gv-scene-button class="flex-1" type="dark" round @click="openTableBuy">{{ $t('scene.enter.operate_chip_buy') }}</gv-scene-button>
          <gv-scene-button class="flex-1 ml-12" type="dark" round @click="openTableTransfer">
            {{ $t('scene.enter.operate_chip_transfer') }}
          </gv-scene-button>
        </div>
        <div class="flex-row align-center mb-16">
          <gv-scene-button class="flex-1" type="dark" round @click="openTableOrder">{{ $t('scene.enter.operate_chip_order') }}</gv-scene-button>
          <gv-scene-button class="flex-1 ml-12" type="dark" round @click="openTableTip">{{ $t('scene.enter.operate_chip_tip') }}</gv-scene-button>
        </div>
        <div class="flex-row align-center mb-16">
          <gv-scene-button class="flex-1" type="dark" round @click="refreshTablePage">{{ $t('scene.enter.operate_refresh_page') }}</gv-scene-button>
          <gv-scene-button class="flex-1 ml-12" type="dark" round @click="toggle">
            {{ tooltip }}
          </gv-scene-button>
        </div>
        <div class="flex-row align-center mb-16">
          <gv-scene-button class="flex-1" type="dark" round @click="changeKeyboard">
            {{ !systemState.keyboard ? $t('scene.enter.operate_keyboard_change_in') : $t('scene.enter.operate_keyboard_change_out') }}
          </gv-scene-button>
        </div>
      </gv-scene-card>
      <div class="work-btn flex-row align-center mb-12 ml-8 mr-8">
        <gv-scene-button-parallel class="flex-1" @click="openTableCheck">{{ $t('scene.enter.operate_check') }}</gv-scene-button-parallel>
        <gv-scene-button-parallel class="flex-1 ml-12" @click="openTableClose">{{ $t('scene.enter.operate_close') }}</gv-scene-button-parallel>
      </div>
      <div class="work-btn flex-row align-center mb-12 ml-8 mr-8">
        <gv-scene-button-parallel class="flex-1" @click="openBetRecord">{{ $t('scene.enter.btn_bet_record') }}</gv-scene-button-parallel>
        <template v-if="isBaccarat">
          <gv-scene-button-parallel class="flex-1 ml-12" @click="openBaccaratBetRoad">
            {{ $t('scene.enter.btn_next_road_edit') }}
          </gv-scene-button-parallel>
        </template>
        <template v-if="isRoadNiuniu">
          <gv-scene-button-parallel class="flex-1 ml-12" @click="openNiuniuBetRoad">
            {{ $t('scene.enter.btn_next_road_edit') }}
          </gv-scene-button-parallel>
        </template>
      </div>
      <gv-scene-card class="work-bonus mb-12" :title="$t('scene.enter.title_award')" v-if="hasBonusList">
        <pannel-left-bouns />
      </gv-scene-card>
      <gv-scene-card class="work-bonus-amount" :title="$t('scene.enter.title_prize')" v-if="hasBonusList">
        <gv-scene-number class="pt-12" :value="showTotalAmount" :width="268" />
      </gv-scene-card>
    </el-scrollbar>
    <table-chip-edit ref="tableChipEditRef" @success="refreshCurrentTableBase" />
    <table-order ref="tableOrderRef" />
    <table-buy ref="tableBuyRef" @success="refreshCurrentTableBase" />
    <table-transfer ref="tableTransferRef" @success="refreshCurrentTableBase" />
    <table-tip ref="tableTipRef" @success="refreshCurrentTableBase" />
  </div>
</template>
<script setup>
import GvSceneCard from '@/views/scene/enter/_components/gv-scene-card/index.vue';
import PannelLeftBouns from '@/views/scene/enter/_components/pannel-left-bouns.vue';
import GvSceneNumber from '@/views/scene/enter/_components/gv-scene-number/index.vue';
import { panelLeftStyle } from '@/views/scene/enter/_models/enter-layout';
import GvSceneButton from '@/views/scene/enter/_components/gv-scene-button/index.vue';
import TableChipEdit from '@/views/scene/enter/_components/_components/table-chip-edit.vue';
import { computed, inject, shallowRef, unref } from 'vue';
import { NUMBER_HANDLER, OPERATE_TYPE } from '@/values';
import TableOrder from '@/views/scene/enter/_components/_components/table-order.vue';
import TableBuy from '@/views/scene/enter/_components/_components/table-buy.vue';
import TableTransfer from '@/views/finance/user-chip/_components/transfer.vue';
import TableTip from '@/views/finance/tip/_components/edit.vue';
import { $t } from '@/lang/i18n';
import layer from '@/tools/layer';
import { storage } from '@/tools/storage';
import { getMultipleKey, pageReload, toAwait } from '@/tools';
import { CACHE_SCENE_ENTER_PLAYER } from '@/values/cache';
import GvSceneButtonParallel from '@/views/scene/enter/_components/gv-scene-button/parallel.vue';
import { setSystemState, systemState } from '@/store/system';
import { useListenerFullscreen } from '@/hooks/fullscreen';
import { BALANCE_TYPE } from '@/views/finance/user-chip/_model';

const tableInfo = inject('tableInfo');
const refreshCurrentTableBase = inject('refreshCurrentTableBase');
const openingInfo = inject('openingInfo');
const bonusSetting = inject('bonusSetting');
const bonusList = inject('bonusList');
const isBaccarat = inject('isBaccarat');
const isRoadNiuniu = inject('isRoadNiuniu');
const handleNextBoot = inject('handleNextBoot');
const openBetRecord = inject('openBetRecord');
const openBaccaratBetRoad = inject('openBaccaratBetRoad');
const openNiuniuBetRoad = inject('openNiuniuBetRoad');
const openTableCheck = inject('openTableCheck');
const openTableClose = inject('openTableClose');

const tableChipEditRef = shallowRef();
const tableOrderRef = shallowRef();
const tableBuyRef = shallowRef();
const tableTransferRef = shallowRef();
const tableTipRef = shallowRef();
const hasBonusList = computed(() => !!bonusList.value?.length);

const showTotalAmount = computed(() => {
  const icon = unref(bonusSetting)?.icon ?? '';
  const amount = parseInt(unref(openingInfo)?.win_bonus_total ?? 0);
  return String(icon + amount);
});

const { tooltip, toggle } = useListenerFullscreen();

const openTableChip = (type) => {
  tableChipEditRef.value?.open(type, { table_id: tableInfo.value.id });
};

const openTableOrder = () => {
  tableOrderRef.value?.open();
};

const openTableBuy = () => {
  tableBuyRef.value?.open(unref(tableInfo));
};

const openTableTransfer = () => {
  tableTransferRef.value?.open(BALANCE_TYPE.chip_transfer_type.desk);
};

const openTableTip = () => {
  tableTipRef.value?.open(OPERATE_TYPE.insert, null, tableInfo.value?.id);
};

const refreshTablePage = async () => {
  const [res, err] = await toAwait(
    layer.confirm($t('scene.enter.tips_refresh_page'), {
      confirmButtonText: $t('scene.enter.btn_refresh_page'),
      cancelButtonText: $t('scene.enter.btn_refresh_page_clear')
    })
  );
  if (!!res) {
    pageReload();
  } else if (err === 'cancel') {
    storage.remove(getMultipleKey(CACHE_SCENE_ENTER_PLAYER, tableInfo.value.id));
    pageReload();
  }
};

// 设置虚拟键盘
const changeKeyboard = () => {
  layer.msg(!systemState.keyboard ? $t('components.gv_keyboard_change.keyboard_open') : $t('components.gv_keyboard_change.keyboard_close'));
  setSystemState({ keyboard: !systemState.keyboard });
};
</script>
<style lang="scss" scoped>
.pannel-left {
  position: absolute;
  top: var(--scene-enter-main-padding-panel);
  bottom: var(--scene-enter-main-padding-panel);
  z-index: 10;

  .work-operate {
    width: 100%;
    height: 360px;
  }

  .work-bonus {
    width: 100%;
    height: 300px;
  }

  .work-bonus-amount {
    width: 100%;
    height: 120px;
  }
}
</style>
