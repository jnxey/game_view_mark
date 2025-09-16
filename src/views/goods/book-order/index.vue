<template>
  <gv-full-height :bottom="20">
    <div class="book-order flex-row flex-wrap">
      <good-list class="flex-1 flex-w0" />
      <good-car />
    </div>
  </gv-full-height>
</template>
<script setup>
import GoodList from '@/views/goods/book-order/_components/good-list.vue';
import GvFullHeight from '@/components/gv-full-height/index.vue';
import GoodCar from '@/views/goods/book-order/_components/good-car.vue';
import { useGoodCar } from '@/views/goods/book-order/_hooks/good-car';
import { onBeforeMount, provide } from 'vue';

const { stockData, stockMap, selected, selectedMap, countAll, refresh, addGood, clearGood, setNumber } = useGoodCar();

onBeforeMount(() => {
  refresh();
});

provide('defAddress', null);
provide('defUsername', {});

provide('stockData', stockData);
provide('stockMap', stockMap);
provide('selected', selected);
provide('selectedMap', selectedMap);
provide('countAll', countAll);
provide('refresh', refresh);
provide('addGood', addGood);
provide('clearGood', clearGood);
provide('setNumber', setNumber);

provide('refreshRecordData', null);
</script>
<style lang="scss" scoped>
.book-order {
  padding: 15px;
  min-height: 100%;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);
}
</style>
