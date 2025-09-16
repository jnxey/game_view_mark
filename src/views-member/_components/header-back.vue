<template>
  <div class="header-back" @click="memberMenu">
    {{ $t('views_member.header_back.title') }}
  </div>
</template>
<script setup>
import { memberMenu } from '../_store';
import { $t } from '@/lang/i18n';
</script>
<style scoped lang="scss">
.header-back {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  background-color: #409eff;
}
</style>
