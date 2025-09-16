<template>
  <div class="page-wrap material-wrap">
    <gv-full-height :bottom="35">
      <gv-material-index mode="page" :limit="100" />
    </gv-full-height>
  </div>
</template>
<script setup>
import GvMaterialIndex from '@/components/gv-material/index.vue';
import GvFullHeight from '@/components/gv-full-height/index.vue';
</script>
<style lang="scss" scoped>
.material-wrap {
  padding: 20px;
  background-color: var(--el-bg-color);
}
</style>
