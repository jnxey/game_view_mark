<template>
  <div class="header-account">
    <div class="avatar">
      <img :src="avatarUrl" alt="" />
    </div>
    <div class="name">{{ memberInfo.username }}</div>
  </div>
</template>
<script setup>
import avatar from '@/assets/images/layout/avatar.png';
import { computed } from 'vue';
import { getAlbumDef } from '@/tools';
import { memberInfo } from '../_store';

const avatarUrl = computed(() => {
  return memberInfo?.avatar ? getAlbumDef(memberInfo?.avatar) : avatar;
});
</script>
<style scoped lang="scss">
.header-account {
  display: flex;
  align-items: center;
  padding: 15px;

  .avatar {
    width: 48px;
    height: 48px;
    border: 2px solid #eeeeee;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .name {
    margin-left: 12px;
    font-size: 24px;
    font-weight: bold;
  }
}
</style>
