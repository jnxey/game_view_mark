<template>
  <div class="views-member">
    <member-login v-if="memberStep === STEP_MAP.login" />
    <member-menu v-if="memberStep === STEP_MAP.menu" />
    <member-bet-list v-if="memberStep === STEP_MAP.betList" />
  </div>
</template>
<script setup lang="ts">
import MemberLogin from './_components/member-login.vue';
import MemberMenu from './_components/member-menu.vue';
import MemberBetList from './_components/member-bet-list.vue';
import { STEP_MAP, memberStep } from './_store/index';
</script>
