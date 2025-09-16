<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="game_chip-list"
      :request="gameChipLists"
      :operate-width="160"
      :operate-perms="[permsMap.game.chip.edit, permsMap.game.chip.del]"
      :columns="columns"
      :default-sort="defaultSort"
      :default-query="defaultQuery"
      delay-request
    >
      <template #handler-left="{ query, search }">
        <el-button class="mr-8" v-perms="[permsMap.game.chip.edit]" icon="Plus" round type="primary" @click="handleAdd">
          {{ $t('common.add_btn') }}
        </el-button>
        <gv-select-currency-config-handler
          v-model="query.currency_config_id"
          @update:model-value="executeMethods(search, () => selectCache.setItem(query.currency_config_id))"
        />
        <div class="flex-row align-center" v-perms="[permsMap.report.close.bind]">
          <span class="mr-8">{{ $t('game.chip.label_bind_close') }}</span>
          <el-switch
            :model-value="isCloseBindInfo.is_bind_close"
            :active-value="STATUS_VALUE.normal"
            :inactive-value="STATUS_VALUE.disable"
            @click="setCloseBind"
          />
        </div>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.game.chip.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.game.chip.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { gameChipSet, gameChipDel, gameChipLists } from '@/api/game/chip';
import { computed, onBeforeMount, ref, shallowRef } from 'vue';
import { OPERATE_TYPE, CURRENCY_TYPE_DICT, CURRENCY_TYPE, ELEMENT_SORT, STATUS_VALUE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { executeMethods, parseDict } from '@/tools';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';
import GvSelectCurrencyConfigHandler from '@/components/gv-select-currency/config-handler.vue';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';
import { GLOBAL_DICT } from '@/store/global-dict';
import { reportGetCloseBind, reportSetCloseBind } from '@/api/report/game-check';
import { getExchangeStatus } from '@/tools/status-value';

const defaultSort = [
  { prop: 'currency_config_id', order: ELEMENT_SORT.ascending },
  { prop: 'value', order: ELEMENT_SORT.ascending }
];

const defaultQuery = {};

const editRef = shallowRef();
const tableRef = shallowRef();

const isCloseBindInfo = ref({});

const { optionsData, refresh } = useDictOptions({ currency: { api: currencyConfigLists } }, true);

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.game_chip_currency, () => optionsData.currency);

const columns = computed(() => {
  return [
    { title: $t('game.chip.name'), dataIndex: 'name', minWidth: 100 },
    { title: $t('game.chip.currency'), dataIndex: 'currency_config_id', minWidth: 100, dict: GLOBAL_DICT.value.currency_config.mark, sort: true },
    { title: $t('game.chip.face_value'), dataIndex: 'value', minWidth: 100, sort: true },
    { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 }
  ];
});

const refreshTable = () => tableRef.value?.refresh();

const handleAdd = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

// 删除
const handleDelete = async (id) => {
  const { value } = await layer.password();
  layer.loading();
  await gameChipDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

// 初始化参数
const initQuery = async () => {
  await refresh();
  defaultQuery.currency_config_id = selectCache.getItem(false);
  tableRef.value?.resetDefaultQuery();
};

// 获取增减码绑定相关
const getCloseBind = async () => {
  isCloseBindInfo.value = await reportGetCloseBind();
};

// 设置值增减码绑定相关
const setCloseBind = async () => {
  const { value } = await layer.password();
  const info = isCloseBindInfo.value;
  const bind = getExchangeStatus(info.is_bind_close);
  await reportSetCloseBind({ id: info.id, is_bind_close: bind, password: value });
  isCloseBindInfo.value.is_bind_close = bind;
};

onBeforeMount(async () => {
  getCloseBind();
  await initQuery();
  await refreshTable();
});
</script>
