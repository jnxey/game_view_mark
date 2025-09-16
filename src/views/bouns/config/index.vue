<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="bouns_config-list"
      :request="bounsConfigLists"
      :operate-width="160"
      :operate-perms="[permsMap.bonus.config.edit, permsMap.bonus.config.del]"
      :columns="columns"
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.bonus_id"
          :placeholder="$t('bonus.config.bonus_name')"
          :request="bonusListLists"
          :empty-page="{ perm: permsMap.bonus.list.view }"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.id"
          :placeholder="$t('bonus.config.name')"
          :request="bounsConfigLists"
          filterable
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.status"
          :placeholder="$t('bonus.config.status')"
          :options="STATUS_VALUE_DICT"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.bonus.config.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
        <el-button v-perms="[permsMap.bonus.list.view]" type="primary" @click="toRoutePath(permsMap.bonus.list.view)">
          {{ $t('bonus.config.bonus_name') }}
        </el-button>
      </template>
      <template #status="{ row }">
        <el-switch
          :model-value="row.status"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          :disabled="!checkPerm([permsMap.bonus.config.edit])"
          @click="changeStatus(row)"
        />
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.bonus.config.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.bonus.config.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { bounsConfigSet, bounsConfigDel, bounsConfigLists, bounsConfigStatus } from '@/api/bouns/config';
import { shallowRef } from 'vue';
import { STATUS_VALUE_DICT, OPERATE_TYPE, STATUS_VALUE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { parseDict } from '@/tools';
import { toRoutePath } from '@/router';
import { bonusListLists } from '@/api/bouns/list';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { getExchangeStatus } from '@/tools/status-value';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import { gameKindLists } from '@/api/game/kind';

const editRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('bonus.config.bonus_name'), dataIndex: 'bonus_name', minWidth: 120 },
  { title: $t('bonus.config.sort'), dataIndex: 'sort', minWidth: 100 },
  { title: $t('bonus.config.name'), dataIndex: 'name', minWidth: 120 },
  { title: $t('bonus.config.image'), dataIndex: 'image', minWidth: 100, image: true },
  { title: $t('bonus.config.base_number'), dataIndex: 'cardinality', minWidth: 100 },
  { title: $t('bonus.config.rate') + '%', dataIndex: 'cash_rate', minWidth: 100 },
  { title: $t('bonus.config.prize_pool'), dataIndex: 'prize_pool', minWidth: 100 },
  { title: $t('bonus.config.double_activity'), dataIndex: 'double_activity', minWidth: 100 },
  { title: $t('bonus.config.number_of_times'), dataIndex: 'number_draws', minWidth: 100 },
  { title: $t('bonus.config.accumulated_amount'), dataIndex: 'total_amount', minWidth: 120 },
  { title: $t('bonus.config.status'), dataIndex: 'status', minWidth: 100, dict: parseDict(STATUS_VALUE_DICT) }
]);

const refreshTable = () => tableRef.value?.refresh();

const handleAdd = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

const changeStatus = async (row) => {
  layer.loading();
  bounsConfigStatus({
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
  await bounsConfigDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
