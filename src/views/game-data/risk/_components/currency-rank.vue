<template>
  <el-table :data="source.rank" header-cell-class-name="rank-table-header-cell">
    <el-table-column prop="user_id" :label="`${$ti(source.name)} ${titleFit} ${$t('game_data.risk.title_rank')}`" width="200">
      <template #default="{ row }">
        <span>{{ row.name }}:</span>
        <span class="ml-8">
          {{ source.icon }}
          <gv-profit :value="row.amount" />
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
import GvProfit from '@/components/gv-profit/index.vue';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

defineProps({ source: Object, titleFit: String });
</script>
<style scoped lang="scss">
.el-table {
  border-radius: var(--gv-border-radius-big);
  overflow: hidden;

  ::v-deep(.rank-table-header-cell) {
    color: var(--el-text-color-primary);
    background-color: var(--el-fill-color-light);
  }
}
</style>
