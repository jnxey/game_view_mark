<!-- 系统环境 -->
<template>
  <div class="system-environment">
    <el-card shadow="never" class="mb-12">
      <div class="mb-12">{{ $t('setting.system.title_env_server') }}</div>
      <el-table :data="info.server">
        <el-table-column prop="param" :label="$t('setting.system.label_env_param')"></el-table-column>
        <el-table-column prop="value" :label="$t('setting.system.label_env_value')"></el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never" class="mb-12">
      <div class="mb-12">{{ $t('setting.system.title_env_php_env') }}</div>
      <el-table :data="info.env">
        <el-table-column prop="option" :label="$t('setting.system.label_env_option')"></el-table-column>
        <el-table-column prop="require" :label="$t('setting.system.label_env_require')"></el-table-column>
        <el-table-column :label="$t('common.status')">
          <template #default="scope">
            <gv-icon v-if="scope.row.status" name="el-icon-Select" class="text-success" />
            <gv-icon v-else name="el-icon-CloseBold" class="text-danger" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" :label="$t('setting.system.label_env_remark')"></el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never" class="mb-12">
      <div class="mb-12">{{ $t('setting.system.title_env_auth') }}</div>
      <el-table :data="info.auth">
        <el-table-column prop="dir" :label="$t('setting.system.label_env_option')"></el-table-column>
        <el-table-column prop="require" :label="$t('setting.system.label_env_require')"></el-table-column>
        <el-table-column :label="$t('common.status')">
          <template #default="scope">
            <gv-icon v-if="scope.row.status" name="el-icon-Select" class="text-success" />
            <gv-icon v-else name="el-icon-CloseBold" class="text-danger" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" :label="$t('setting.system.label_env_remark')"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { systemInfo } from '@/api/setting/system';
import GvIcon from '@/components/gv-icon/index.vue';
import { onMounted, reactive } from 'vue';
import { $t } from '@/lang/i18n';

const info = reactive({
  server: [], // 服务器信息
  env: [], // PHP环境要求
  auth: [] // 目录权限
});

const getSystemInfo = () => {
  systemInfo().then((res) => {
    info.server = res.server;
    info.env = res.env;
    info.auth = res.auth;
  });
};

onMounted(() => {
  getSystemInfo();
});
</script>

<style lang="scss" scoped></style>
