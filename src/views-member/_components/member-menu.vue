<template>
  <div class="member-login member-page-wrap">
    <div class="header-left-wrap">
      <header-account />
    </div>
    <div class="header-right-wrap">
      <header-logout />
    </div>
    <div class="content-wrap">
      <div class="menu-item-box" v-hover="'menu-hover'" @click="memberBetList">查看投注记录</div>
    </div>
  </div>
</template>
<script setup>
import HeaderAccount from './header-account.vue';
import HeaderLogout from './header-logout.vue';
import { memberBetList } from '../_store';
</script>
<style lang="scss">
@use '../_style/index.scss';
</style>
