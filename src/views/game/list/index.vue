<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="game-list"
      :request="gameLists"
      :operate-width="160"
      :popup-right-title="$t('common.operate_log')"
      :operate-perms="[permsMap.game.list.edit, permsMap.game.list.del]"
      :columns="columns"
    >
      <template #handler-left>
        <el-button v-perms="[permsMap.game.list.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
        <el-button
          v-perms="[permsMap.game.list.log]"
          type="primary"
          @click="toRoutePath(permsMap.game.list.log, { request: gameLastLog.symbol, title: 'game.list.title_log', del_user: true })"
        >
          {{ $t('common.operate_log') }}
        </el-button>
        <el-button v-perms="[permsMap.game.kind.view]" type="primary" @click="toRoutePath(permsMap.game.kind.view)">
          {{ $t('game.kind.title') }}
        </el-button>
        <el-button v-perms="[permsMap.game.list.check]" type="primary" @click="handleCheck">{{ $t('game.list.btn_enter_check') }}</el-button>
      </template>
      <!--      -->
      <template #popup-right v-if="checkPerm(permsMap.game.list.log)">
        <gv-operate-record :request="gameLastLog" />
      </template>
      <template #status="{ row }">
        <el-switch
          :model-value="row.status"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row)"
          :disabled="!checkPerm([permsMap.game.list.edit])"
        />
      </template>
      <template #game_kind="{ row }">
        <el-tag v-for="item in row.game_kind" :key="item.kind_id" class="mr-12">{{ $ti(item.kind_name) }}</el-tag>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.game.list.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="primary" v-perms="[permsMap.game.list.edit]" @click="handleConfig(row)">{{ $t('game.list.kind') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.game.list.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
    <add-popup ref="addRef" @success="refreshTable" />
    <check-popup ref="checkRef" />
  </div>
</template>

<script setup>
import { gameSet, gameConfigPreDetection, gameConfigSet, gameDel, gameLists, gameStatus, gameLastLog } from '@/api/game/list';
import { shallowRef } from 'vue';
import { STATUS_VALUE_DICT, STATUS_VALUE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import AddPopup from './_components/add.vue';
import CheckPopup from './_components/check.vue';
import layer from '@/tools/layer';
import { parseDict } from '@/tools';
import { gameKindLists } from '@/api/game/kind';
import { toRoutePath } from '@/router';
import { getExchangeStatus } from '@/tools/status-value';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const editRef = shallowRef();
const addRef = shallowRef();
const checkRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('game.list.name'), dataIndex: 'name', minWidth: 100 },
  { title: $t('game.list.kind'), dataIndex: 'game_kind', minWidth: 200, func: (val) => val?.map((_val) => $ti(_val.kind_name)) },
  { title: $t('common.status'), dataIndex: 'status', minWidth: 100, dict: parseDict(STATUS_VALUE_DICT) },
  { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 100, time: true },
  { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 100, time: true }
]);

const refreshTable = () => tableRef.value?.refresh();

const handleAdd = async () => {
  addRef.value?.openInfo();
};

const handleEdit = async (data) => {
  editRef.value?.openInfo(data);
};

const handleConfig = async (data) => {
  editRef.value?.openConfig(data);
};

const handleCheck = async () => {
  checkRef.value?.open();
};

const changeStatus = async (row) => {
  const text = row.status === STATUS_VALUE.disable ? $t('common.open') : $t('common.close');
  await layer.confirm($t('common.status_switch_tips', { text }));
  layer.loading();
  gameStatus({
    id: row.id,
    status: getExchangeStatus(row.status)
  }).finally(() => {
    layer.closeLoading();
    refreshTable();
  });
};

// 删除
const handleDelete = async (id) => {
  const { value } = await layer.password();
  layer.loading();
  await gameDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
