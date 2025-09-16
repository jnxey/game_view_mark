<!-- 系统缓存 -->
<template>
  <div class="cache">
    <el-card shadow="never" class="mb-12">
      <el-alert type="warning" :title="$t('setting.system.title_tips')" :closable="false" show-icon></el-alert>
    </el-card>
    <el-card shadow="never">
      <el-table :data="cacheDate">
        <el-table-column :label="$t('setting.system.content')" prop="content" min-width="130"></el-table-column>
        <el-table-column :label="$t('setting.system.desc')" prop="desc" min-width="180"></el-table-column>
        <el-table-column :label="$t('common.operate_col')" width="130" fixed="right">
          <template #default="{ row }">
            <template v-if="row.value === 'cache'">
              <el-button type="primary" link v-perms="[systemCacheClear.perm]" @click="handleClean">
                {{ $t('setting.system.btn_clear_cache') }}
              </el-button>
            </template>
            <template v-if="row.value === 'data'">
              <el-button type="primary" link v-perms="[systemClearData.perm]" @click="handleData">
                {{ $t('setting.system.btn_clear_data') }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <clear-data ref="clearDataRef" />
  </div>
</template>

<script setup>
import { systemCacheClear, systemClearData } from '@/api/setting/system';
import { ref, shallowRef } from 'vue';
import layer from '@/tools/layer.js';
import { delayExec, pageReload } from '@/tools';
import { $t } from '@/lang/i18n';
import ClearData from '@/views/setting/system/_components/clear-data.vue';

const clearDataRef = shallowRef();

// 列表数据
const cacheDate = ref([
  { value: 'cache', content: $t('setting.system.content_cache'), desc: $t('setting.system.content_cache_desc') },
  {
    value: 'data',
    content: $t('setting.system.content_data'),
    desc: $t('setting.system.content_data_desc')
  }
]);

// 清理缓存
const handleClean = async () => {
  const { value } = await layer.password($t('setting.system.tips_confirm_clear_cache'));
  layer.loading();
  await systemCacheClear({ password: value });
  layer.closeLoading();
  layer.msgSuccess($t('setting.system.tips_clear_success'));
  await delayExec(500);
  pageReload();
};

// 清理数据
const handleData = async () => {
  clearDataRef.value?.open();
};
</script>
