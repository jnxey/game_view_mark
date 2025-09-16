<template>
  <div class="storage">
    <el-card class="mb-12" shadow="never">
      <el-alert type="warning" :title="$t('setting.storage.title_tips')" :closable="false" show-icon>
        <template #default>
          <div>{{ $t('setting.storage.tips_line_1') }}</div>
          <div>{{ $t('setting.storage.tips_line_2') }}</div>
          <div>{{ $t('setting.storage.tips_line_3') }}</div>
          <div>{{ $t('setting.storage.tips_line_4') }}</div>
        </template>
      </el-alert>
    </el-card>
    <el-card class="mb-12" shadow="never" v-loading="state.loading">
      <el-table size="large" :data="state.lists">
        <el-table-column :label="$t('setting.storage.name')" prop="name" min-width="120" />
        <el-table-column :label="$t('setting.storage.path')" prop="path" min-width="160" />
        <el-table-column :label="$t('common.status')" min-width="80">
          <template #default="{ row }">
            <el-tag v-if="row.status === OPENED_VALUE.open" type="primary">{{ $t('common.open') }}</el-tag>
            <el-tag v-if="row.status === OPENED_VALUE.close" type="danger">{{ $t('common.close') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operate_col')" min-width="80" fixed="right">
          <template #default="{ row }">
            <el-button v-perms="[storageSetup.perm]" type="primary" link @click="handleSet(row.engine)">{{ $t('setting.storage.set') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <edit-popup ref="editRef" @success="getLists" />
  </div>
</template>
<script setup>
import { storageLists, storageSetup } from '@/api/setting/storage';

import EditPopup from './_components/edit.vue';
import { reactive, shallowRef } from 'vue';
import { OPENED_VALUE } from '@/values';
import { $t } from '@/lang/i18n';

const editRef = shallowRef();

// 列表数据
const state = reactive({ loading: false, lists: [] });

// 获取存储引擎列表数据
const getLists = async () => {
  try {
    state.loading = true;
    state.lists = await storageLists();
    state.loading = false;
  } catch (error) {
    state.loading = false;
  }
};

const handleSet = (engine) => {
  editRef.value?.open(engine);
};

getLists();
</script>
