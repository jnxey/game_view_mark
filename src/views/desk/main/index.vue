<template>
  <div class="desk-main" v-show="showPage">
    <div class="flex-row align-center mb-16">
      <el-radio-group v-model="active" @change="(value) => selectCache.setItem(value)">
        <el-radio class="custom-radio" :label="$t('desk.bonus.title')" :value="typeMap.bonus" />
        <el-radio class="custom-radio" :label="$t('desk.road.title')" :value="typeMap.road" />
      </el-radio-group>
      <!--      <el-checkbox v-model="isContinue">{{ $t('desk.main.continue') }}</el-checkbox>-->
    </div>
    <div class="table-wrap flex-row align-center flex-wrap">
      <div
        v-for="item in optionsData.table"
        :key="item.id"
        class="table-item flex-row align-center justify-center color-white cursor-pointer fz-24"
        @click="toDesk(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { $t } from '@/lang/i18n';
import { onBeforeMount, ref } from 'vue';
import { useDictOptions } from '@/hooks/dict';
import { financeTableLists } from '@/api/finance/table';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';
import { storage } from '@/tools/storage';
import { CACHE_DESK_DEF_ENTER } from '@/values/cache';
import { useRouter } from 'vue-router';
import layer from '@/tools/layer';
import { gameGet } from '@/api/game/list';
import { delayExec } from '@/tools';

const router = useRouter();

const typeMap = { bonus: 1, road: 2 };
const active = ref(typeMap.bonus);
const isContinue = ref(false);
const showPage = ref(false);

const { optionsData } = useDictOptions({ table: { api: financeTableLists } });

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.desk_main);

// 前往大屏
const toDesk = async (row) => {
  if (active.value === typeMap.bonus) {
    layer.loading();
    const info = await gameGet({ id: row.game_id });
    layer.closeLoading();
    if (!info.bonus_id) return layer.msgError($t('finance.table.tips_game_bind_bonus'));
    if (isContinue.value) {
      storage.set(CACHE_DESK_DEF_ENTER, { type: typeMap.bonus, id: info.bonus_id });
      router.replace({ path: '/desk/bonus', query: { id: info.bonus_id } });
    } else {
      router.push({ path: '/desk/bonus', query: { id: info.bonus_id } });
    }
  } else if (active.value === typeMap.road) {
    if (isContinue.value) {
      storage.set(CACHE_DESK_DEF_ENTER, { type: typeMap.road, id: row.id });
      router.replace({ path: '/desk/road', query: { id: row.id } });
    } else {
      router.push({ path: '/desk/road', query: { id: row.id } });
    }
  }
};

onBeforeMount(async () => {
  const ca = selectCache.getItem();
  if (!!ca) active.value = ca;
  // const cache = storage.get(CACHE_DESK_DEF_ENTER);
  // if (!!cache) {
  //   if (cache.type === typeMap.bonus) {
  //     router.push({ path: '/desk/bonus', query: { id: cache.id } });
  //   }
  //   if (cache.type === typeMap.road) {
  //     router.push({ path: '/desk/road', query: { id: cache.id } });
  //   }
  // }
  // await delayExec(300);
  showPage.value = true;
});
</script>
<style scoped lang="scss">
.desk-main {
  padding: 15px;
  min-height: 100%;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);

  .table-item {
    width: 100px;
    height: 100px;
    margin-right: 20px;
    margin-bottom: 20px;
    border-radius: var(--gv-border-radius-big);
    box-shadow: var(--el-box-shadow-light);
    background-color: var(--el-color-primary);

    &:hover {
      background-color: var(--el-color-primary-dark-2);
    }
  }
}
</style>
