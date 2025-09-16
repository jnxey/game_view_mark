<template>
  <div ref="pageRef" class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="game_kind-list"
      :request="gameKindLists"
      :operate-width="160"
      :operate-perms="[permsMap.game.kind.edit, permsMap.game.kind.del]"
      :columns="columns"
      :is-page="false"
      :default-query="defaultQuery"
      :default-sort="defaultSort"
      has-dict-self
      @table-data-change="tableDataChange"
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="$t('game.kind.title')" @back="backTab($router)" />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.name"
          :placeholder="$t('common.kind_no')"
          :options="searchKindList"
          value-field="name"
          filterable
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left="{ query, search }">
        <el-radio-group v-model="query.game_model" @change="(value) => executeMethods(selectCache.setItem.bind(null, value), search)">
          <el-radio class="custom-radio" v-for="item in GAME_MODEL_DICT" :key="item.value" :label="item.name" :value="item.value" />
        </el-radio-group>
        <el-button v-perms="[permsMap.game.kind.edit]" icon="Plus" type="primary" @click="handleAdd">
          {{ $t('common.add_btn') }}
        </el-button>
        <el-button
          v-perms="[permsMap.game.kind.log]"
          type="primary"
          @click="toRoutePath(permsMap.game.kind.log, { request: gameKindLastLog.symbol, title: 'game.kind.title_log', del_user: true })"
        >
          {{ $t('common.operate_log') }}
        </el-button>
        <el-button
          v-perms="[permsMap.game.kind.edit]"
          icon="Files"
          type="primary"
          @click="handleCompose"
          v-show="GAME_MODEL_TYPE_BACCARAT.includes(query.game_model)"
        >
          {{ $t('game.kind.btn_compose') }}
        </el-button>
      </template>
      <!--      -->
      <template #popup-right v-if="checkPerm(permsMap.game.kind.log)">
        <gv-operate-record :request="gameKindLastLog" />
      </template>
      <template #name="{ row }">
        <div class="name-box flex-row align-center" :data-key="row.id">
          <gv-icon name="local-icon-drag-dot" class="drag-icon text-place-color fz-16" />
          <span class="ml-4">{{ $ti(row.name) }}</span>
        </div>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.game.kind.edit]" @click="handleEdit(row)">
          {{ $t('common.edit_btn') }}
        </el-button>
        <el-button link type="danger" v-perms="[permsMap.game.kind.del]" @click="handleDelete(row.id)">
          {{ $t('common.del_btn') }}
        </el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
    <compose-popup ref="composeRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { gameKindSet, gameKindDel, gameKindLists, gameKindComposeGet, gameKindSort, gameKindLastLog } from '@/api/game/kind';
import { computed, nextTick, onMounted, ref, shallowRef, unref } from 'vue';
import {
  ELEMENT_SORT,
  GAME_KIND_LEVEL_DICT,
  GAME_KIND_POSITION_DICT,
  GAME_MODEL,
  GAME_MODEL_DICT,
  GAME_MODEL_TYPE_BACCARAT,
  OPERATE_TYPE,
  QUERY_LIST_SORT,
  QUERY_LIST_TYPE
} from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import ComposePopup from './_components/compose.vue';
import layer from '@/tools/layer';
import { backTab } from '@/store/tabs';
import { executeMethods, parseDict } from '@/tools';
import { permsMap } from '@/api/perms';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';
import { $t } from '@/lang/i18n';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import GvIcon from '@/components/gv-icon/index.vue';
import { $ti } from '@/lang/input';
import { useTableSort } from '@/hooks/table-sort';
import { toRoutePath } from '@/router';
import { checkPerm } from '@/directives/perms';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';
import { useDictOptions } from '@/hooks/dict';

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.game_kind_model, () => GAME_MODEL_DICT, 'value');

const editRef = shallowRef();
const composeRef = shallowRef();
const tableRef = shallowRef();
const pageRef = shallowRef();
const currentGameModel = ref(selectCache.getItem());

const defaultSort = [{ prop: 'sort', order: ELEMENT_SORT.ascending }];

const defaultQuery = { game_model: unref(currentGameModel) };

const { initDragHandler } = useTableSort(
  () => pageRef.value,
  () => tableRef.value?.getSortParams()?.order_by,
  async (sorts) => {
    layer.loading();
    await gameKindSort({ dragSort: sorts });
    layer.closeLoading();
    refreshTable();
  }
);

const { optionsData, refresh } = useDictOptions({ kinds: { api: gameKindLists } });

const searchKindList = computed(() => {
  const list = optionsData.kinds ?? [];
  return list.filter((item) => item.game_model === currentGameModel.value);
});

const tableDataChange = () => {
  const query = tableRef.value?.getQuery();
  currentGameModel.value = query.game_model;
};

// 表格配置
const columns = shallowRef([
  { title: $t('game.kind.name'), dataIndex: 'name', minWidth: 100 },
  { title: $t('game.kind.game_model'), dataIndex: 'game_model', minWidth: 100, dict: parseDict(GAME_MODEL_DICT) },
  { title: $t('game.kind.icon'), dataIndex: 'icon', minWidth: 100, image: true },
  { title: $t('game.kind.level'), dataIndex: 'is_top', minWidth: 100, dict: parseDict(GAME_KIND_LEVEL_DICT) },
  {
    title: $t('game.kind.position'),
    dataIndex: 'sub_position',
    minWidth: 100,
    dict: parseDict(GAME_KIND_POSITION_DICT)
  },
  { title: $t('game.kind.bind'), dataIndex: 'sub_main_id', minWidth: 100, dictSelf: true }
]);

// 刷新列表
const refreshTable = () => tableRef.value?.refresh();

// 新增
const handleAdd = async () => {
  const { game_model } = tableRef.value?.getQuery();
  const list = tableRef.value?.getTableData();
  editRef.value?.open(OPERATE_TYPE.insert, null, list, game_model);
};

// 编辑
const handleEdit = async (data) => {
  const list = tableRef.value?.getTableData();
  editRef.value?.open(OPERATE_TYPE.update, data, list);
};

// 组合配置
const handleCompose = async () => {
  layer.loading();
  const { lists } = await gameKindLists({ page_type: QUERY_LIST_TYPE.all });
  layer.closeLoading();
  composeRef.value.open(lists);
};

// 删除
const handleDelete = async (id) => {
  const { value } = await layer.password();
  layer.loading();
  await gameKindDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

onMounted(() => {
  initDragHandler();
});
</script>
<style scoped lang="scss">
.name-box {
  user-select: none;

  .drag-icon {
    cursor: move;
  }
}
</style>
