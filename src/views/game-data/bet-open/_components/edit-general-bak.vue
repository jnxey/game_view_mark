<template>
  <gv-popup ref="popupRef" :title="$t('game_data.bet_open.title_record')" :async="true" width="800px" click-modal-close :show-footer="false">
    <el-empty v-if="!tableData.length" />
    <div class="pb-16">
      <record-item
        v-for="item in tableData"
        class="mb-8"
        :source="item"
        :currency-config="optionsData.currency"
        :game-kind="optionsData.kind"
        @refresh="getRecord"
      />
    </div>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import RecordItem from './_components/record-item.vue';
import { ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { betGetBetWithOpenId } from '@/api/game-data/bet';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';
import { gameKindLists } from '@/api/game/kind';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const betInfo = ref({});
const tableData = shallowRef([]);

// 字典数据
const { optionsData } = useDictOptions({ currency: { api: currencyConfigLists }, kind: { api: gameKindLists } });

const open = async (info) => {
  betInfo.value = info;
  tableData.value = [];
  await getRecord();
  popupRef.value?.open();
};

const getRecord = async () => {
  layer.loading();
  tableData.value = await betGetBetWithOpenId({ open_id: betInfo.value?.id });
  layer.closeLoading();
};

defineExpose({ open });
</script>
