<template>
  <gv-popup
    ref="popupRef"
    :title="$t('scene.enter.title_order')"
    :width="getPX(wrapWidth)"
    :confirm-button-text="null"
    :cancel-button-text="null"
    @close="cacheCallback = null"
  >
    <div class="book-order flex-row flex-wrap">
      <div class="flex-1 flex-w0 h-full">
        <el-scrollbar class="h-full">
          <el-radio-group v-model="activeName">
            <el-radio class="custom-radio mb-16" :label="$t('scene.enter.label_order_goods')" :value="tabName.goods" />
            <el-radio class="custom-radio mb-16" :label="$t('scene.enter.label_order_history')" :value="tabName.record" />
          </el-radio-group>
          <good-list v-if="activeName === tabName.goods" />
          <good-record v-if="activeName === tabName.record" />
        </el-scrollbar>
      </div>
      <div class="h-full">
        <el-scrollbar class="h-full">
          <good-car />
        </el-scrollbar>
      </div>
    </div>
  </gv-popup>
</template>
<script setup>
import { computed, inject, onBeforeMount, provide, ref, shallowRef } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import GoodCar from '@/views/goods/book-order/_components/good-car.vue';
import GoodList from '@/views/goods/book-order/_components/good-list.vue';
import { useGoodCar } from '@/views/goods/book-order/_hooks/good-car';
import { getPX, getWindowSize } from '@/tools';
import GoodRecord from '@/views/goods/book-order/_components/good-record.vue';
import { GUEST_TYPE } from '@/values';
import { $t } from '@/lang/i18n';

const tableInfo = inject('tableInfo');
const currentPlayer = inject('currentPlayer');

const tabName = { goods: 'goods', record: 'record' };
const props = defineProps({ options: Array });
const popupRef = shallowRef();
const activeName = ref(tabName.goods);

const wrapWidth = computed(() => Math.max(getWindowSize().width * 0.8, 800));

const { stockData, stockMap, selected, selectedMap, countAll, recordData, refresh, refreshRecordData, addGood, clearGood, setNumber } = useGoodCar();

const refreshRecordDataSelf = () => {
  refreshRecordData({ address: tableInfo.value?.name });
};

const usernames = computed(() => {
  const result = [];
  const map = {};
  currentPlayer.value?.forEach((item) => {
    if (item.check_user && !map[item.user_id]) {
      map[item.user_id] = true;
      result.push(item.username);
    }
  });
  return result;
});

const defAddress = computed(() => tableInfo.value?.name);

const defUsername = computed(() => {
  return {
    [GUEST_TYPE.normal]: ['Visitor', 'S1', 'S2', 'S3', 'S5', 'S6', 'S7', 'S8'],
    [GUEST_TYPE.member]: !!usernames.value?.length ? usernames.value : null
  };
});

onBeforeMount(() => {
  refresh();
  refreshRecordDataSelf();
});

const open = () => {
  popupRef.value?.open();
};

provide('defAddress', defAddress);
provide('defUsername', defUsername);

provide('stockData', stockData);
provide('stockMap', stockMap);
provide('selected', selected);
provide('selectedMap', selectedMap);
provide('countAll', countAll);
provide('refresh', refresh);
provide('addGood', addGood);
provide('clearGood', clearGood);
provide('setNumber', setNumber);

provide('recordData', recordData);
provide('refreshRecordData', refreshRecordDataSelf);
defineExpose({ open });
</script>
<style lang="scss" scoped>
.book-order {
  height: calc(70vh - 100px);
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);
}
</style>
