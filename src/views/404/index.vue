<template>
  <div class="error-page">
    <img src="@/assets/images/layout/404.png" alt="" />
    <div class="flex-row justify-center">
      <el-button type="primary" @click="backHome">返回首页</el-button>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const backHome = () => {
  router.replace('/');
};
</script>
<style lang="scss" scoped>
.error-page {
  padding-top: 50px;
  text-align: center;
  img {
    width: 30%;
  }
}
</style>
