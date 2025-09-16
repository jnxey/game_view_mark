<!-- 系统日志 -->
<template>
  <div class="journal">
    <gv-table table-key="setting_system_journal-list" :request="systemLogLists" :columns="columns" :default-query="defaultQuery">
      <!--      -->
      <template #search-box="{ query, search, reset }">
        <el-input
          class="search-item"
          :placeholder="$t('setting.system.label_journal_admin')"
          v-trim
          v-model="query.admin_name"
          clearable
          @keyup.enter="search"
          v-place
        />
        <el-select class="search-item" v-model="query.type" :placeholder="$t('setting.system.label_journal_type')" clearable v-place>
          <el-option v-for="(item, index) in visitType" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <el-input
          class="search-item"
          v-trim
          v-model="query.ip"
          clearable
          @keyup.enter="search"
          :placeholder="$t('setting.system.label_journal_ip')"
          v-place
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.url"
          clearable
          @keyup.enter="search"
          :placeholder="$t('setting.system.label_journal_url')"
          v-place
        />
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.start_time"
          v-model:endTime="query.end_time"
          :placeholder="$t('setting.system.label_journal_visit_time')"
          v-place
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
    </gv-table>
  </div>
</template>

<script setup>
import { systemLogLists } from '@/api/setting/system';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { ref, shallowRef } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import { $t } from '@/lang/i18n';

const defaultQuery = { admin_name: '', url: '', ip: '', type: '', start_time: '', end_time: '' };

const columns = shallowRef([
  { title: $t('common.operate_col'), dataIndex: 'action', minWidth: 100 },
  { title: $t('setting.system.label_journal_admin'), dataIndex: 'admin_name', minWidth: 100 },
  { title: $t('setting.system.label_journal_admin_id'), dataIndex: 'admin_id', minWidth: 100 },
  { title: $t('setting.system.label_journal_url'), dataIndex: 'url', minWidth: 100 },
  { title: $t('setting.system.label_journal_type'), dataIndex: 'type', minWidth: 100 },
  { title: $t('setting.system.label_journal_params'), dataIndex: 'params', minWidth: 100 },
  { title: $t('setting.system.label_journal_ip'), dataIndex: 'ip', minWidth: 100 },
  { title: $t('setting.system.label_journal_visit_time'), dataIndex: 'create_time', minWidth: 180, time: true }
]);

// 访问方式
const visitType = ref([
  { label: $t('common.all'), value: '' },
  { label: 'get', value: 'get' },
  { label: 'post', value: 'post' },
  { label: 'put', value: 'put' },
  { label: 'delete', value: 'delete' },
  { label: 'option', value: 'option' }
]);
</script>

<style lang="scss" scoped></style>
