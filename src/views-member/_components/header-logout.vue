<template>
  <div class="header-logout" @click="memberLogout">
    {{ $t('views_member.header_logout.title') }}
  </div>
</template>
<script setup>
import { memberLogout } from '../_store';
import { $t } from '@/lang/i18n';
</script>
<style scoped lang="scss">
.header-logout {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  background-color: #bc7710;
}
</style>
