<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="external_costs-list"
      :request="externalCostsLists"
      :operate-width="160"
      :operate-perms="[permsMap.external.costs.edit, permsMap.external.costs.del]"
      :columns="columns"
      :popup-right-title="$t('common.operate_log')"
      show-summary
      :handle-summary="useSummary('username')"
      delay-request
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-user-inline class="search-item" place-top v-model="query.user_id" :placeholder="$t('common.user_no')" />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.external_consume_type_id"
          :placeholder="$t('external.costs.consume_type')"
          :options="optionsData.consumeType"
          :empty-page="{ perm: permsMap.external.consume_type.view }"
        />
        <gv-select-currency-config
          class="search-item"
          place-top
          v-model="query.currency_config_id"
          :placeholder="$t('external.costs.currency_config')"
          :options="optionsData.currency"
          multiple
        />
        <gv-select-options class="search-item" place-top v-model="query.type" :placeholder="$t('external.costs.type')" :options="COST_TYPE_DICT" />
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.consume_time_start"
          v-model:endTime="query.consume_time_end"
          :placeholder="$t('external.costs.consume_time')"
          v-place
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.external.costs.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
        <el-button
          v-perms="[permsMap.external.costs.log]"
          type="primary"
          @click="toRoutePath(permsMap.external.costs.log, { request: externalCostsLog.symbol, title: 'external.costs.title_log' })"
        >
          {{ $t('common.operate_log') }}
        </el-button>
        <el-button v-perms="[permsMap.external.consume_type.view]" type="primary" @click="toRoutePath(permsMap.external.consume_type.view)">
          {{ $t('external.costs.consume_type') }}
        </el-button>
      </template>
      <!--      -->
      <template #popup-right v-if="checkPerm(permsMap.external.costs.log)">
        <gv-operate-record :request="externalCostsLog" />
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.external.costs.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.external.costs.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { externalCostsSet, externalCostsDel, externalCostsLists, externalCostsLog } from '@/api/external/costs';
import { computed, onActivated, onBeforeMount, shallowRef } from 'vue';
import { OPERATE_TYPE, COST_TYPE_DICT, CURRENCY_TYPE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { toRoutePath } from '@/router';
import { externalConsumeTypeLists } from '@/api/external/consume-type';
import { useDictOptions } from '@/hooks/dict';
import { parseDict } from '@/tools';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { currencyConfigLists } from '@/api/currency/config';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';
import { useSummary } from '@/hooks/summary';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { GLOBAL_DICT } from '@/store/global-dict';

const editRef = shallowRef();
const tableRef = shallowRef();

const { optionsData, refresh } = useDictOptions(
  {
    currency: { api: currencyConfigLists, params: { type: CURRENCY_TYPE.cash } },
    consumeType: { api: externalConsumeTypeLists }
  },
  true
);

const columns = computed(() => {
  return [
    { title: $t('external.costs.user'), dataIndex: 'username', minWidth: 100 },
    { title: $t('external.costs.nickname'), dataIndex: 'nickname', minWidth: 120 },
    { title: $t('external.costs.telephone'), dataIndex: 'telephone', minWidth: 120 },
    { title: $t('external.costs.number_people'), dataIndex: 'number_people', minWidth: 120 },
    {
      title: $t('external.costs.consume_type'),
      dataIndex: 'external_consume_type_id',
      minWidth: 120,
      dict: parseDict(optionsData.consumeType ?? [])
    },
    { title: $t('external.costs.address'), dataIndex: 'address', minWidth: 150 },
    { title: $t('external.costs.shop_telephone'), dataIndex: 'shop_telephone', minWidth: 150 },
    { title: $t('external.costs.images'), dataIndex: 'images', minWidth: 80, image: true },
    { title: $t('external.costs.currency_config'), dataIndex: 'currency_config_id', minWidth: 100, dict: GLOBAL_DICT.value.currency_config.mark },
    { title: $t('external.costs.money'), dataIndex: 'money', minWidth: 120 },
    // { title: $t('external.costs.user_money'), dataIndex: 'user_money', minWidth: 120 },
    // { title: $t('external.costs.firm_money'), dataIndex: 'firm_money', minWidth: 120 },
    { title: $t('external.costs.accompanying'), dataIndex: 'accompanying', minWidth: 150 },
    { title: $t('external.costs.type'), dataIndex: 'type', minWidth: 100, dict: parseDict(COST_TYPE_DICT) },
    { title: $t('external.costs.consume_time'), dataIndex: 'consume_time', minWidth: 180, time: true },
    { title: $t('external.costs.remark'), dataIndex: 'remark', minWidth: 150 }
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
  await externalCostsDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
  refreshTable();
});
</script>
