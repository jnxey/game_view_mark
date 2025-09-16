<template>
  <el-dropdown>
    <el-avatar class="header-item cursor-pointer ml-8" :size="40" :src="avatarUrl" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="toAccount">{{ $t('layout.account') }}</el-dropdown-item>
        <el-dropdown-item divided @click="toLogout">{{ $t('layout.logout') }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import avatar from '@/assets/images/layout/avatar.png';
import { computed } from 'vue';
import { clearManageToken, managerState } from '@/store/manager.js';
import { useRouter } from 'vue-router';
import { logout } from '@/api/common.js';
import { config } from '@/config';
import layer from '@/tools/layer';
import { getAlbumDef } from '@/tools';
import { $t } from '@/lang/i18n';

const router = useRouter();

const avatarUrl = computed(() => {
  return managerState.user?.avatar ? getAlbumDef(managerState.user?.avatar) : avatar;
});

const toAccount = () => {
  router.push(config.route.accountPath);
};

const toLogout = async () => {
  await layer.confirm($t('layout.logout_confirm'));
  await logout();
  clearManageToken();
  router.push(config.route.loginPath);
};
</script>
<style scoped></style>
