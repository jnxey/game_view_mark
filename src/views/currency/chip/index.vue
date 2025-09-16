<template>
  <div class="page-wrap">
    <gv-table ref="tableRef" table-key="currency_chip-list" :request="currencyChipLists" :operate-width="160" :columns="columns" delay-request>
      <template #search-box="{ query, search, reset }">
        <el-input
          class="search-item"
          v-trim
          v-model="query.unique_code"
          :placeholder="$t('currency.chip.unique_code')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.chip_value"
          :placeholder="$t('currency.chip.chip_value')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.bind_user"
          :placeholder="$t('currency.chip.bind_user')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
    </gv-table>
  </div>
</template>

<script setup>
import { currencyChipLists } from '@/api/currency/chip';
import { computed, onActivated, onBeforeMount, shallowRef } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import { useDictOptions } from '@/hooks/dict';
import { currencyBaseLists } from '@/api/currency/base';
import { parseDict } from '@/tools';
import { $t } from '@/lang/i18n';

const tableRef = shallowRef();

const { optionsData, refresh } = useDictOptions({ base: { api: currencyBaseLists } }, true);

const columns = computed(() => {
  return [
    { title: $t('currency.chip.unique_code'), dataIndex: 'unique_code', minWidth: 100 },
    { title: $t('currency.chip.image'), dataIndex: 'image', minWidth: 100 },
    { title: $t('currency.chip.chip_value'), dataIndex: 'chip_value', minWidth: 100 },
    { title: $t('currency.chip.currency'), dataIndex: 'currency_id', minWidth: 100, dict: parseDict(optionsData.base) },
    { title: $t('currency.chip.bind_user'), dataIndex: 'bind_user', minWidth: 120 },
    { title: $t('currency.chip.create_time'), dataIndex: 'create_time', minWidth: 180, time: true },
    { title: $t('currency.chip.update_time'), dataIndex: 'update_time', minWidth: 180, time: true }
  ];
});

const refreshTable = () => tableRef.value?.refresh();

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
  refreshTable();
});
</script>
