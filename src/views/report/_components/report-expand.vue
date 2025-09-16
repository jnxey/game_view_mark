<template>
  <div class="expand-wrap" :style="{ paddingLeft: getPX(leftSpace) }">
    <template v-if="!!expandValue[row.UID]?.loading">{{ $t('common.loading') }}</template>
    <template v-else>
      <div class="flex-row w-full" v-for="(item, index) in expandValue[row.UID]?.value ?? []" :key="index">
        <template v-for="col in splitColumns" :key="getMultipleKey(index, col.dataIndex)">
          <div
            class="expand-col"
            v-if="!col.hide && (!col.perm || (!!col.perm && checkPerm(col.perm)))"
            :style="{ width: extendWidth[col.dataIndex] }"
          >
            {{ col.subHide ? null : $ti(item[col.dataIndex]) }}
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script setup>
import { $ti } from '@/lang/input';
import { checkPerm } from '@/directives/perms';
import { getMultipleKey, getPX } from '@/tools';
import { $t } from '@/lang/i18n';

const props = defineProps({ row: Object, splitColumns: Object, expandValue: Object, extendWidth: Object, leftSpace: Number });
</script>
<style scoped lang="scss">
.expand-wrap {
  width: 100%;
  padding-left: 88px;
  overflow: hidden;

  .expand-col {
    padding: 8px 12px;
  }
}
</style>
