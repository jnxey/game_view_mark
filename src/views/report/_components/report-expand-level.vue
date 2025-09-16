<template>
  <div class="expand-wrap" :style="{ paddingLeft: getPX(leftSpace) }">
    <template v-if="!!expandValue[row.UID]?.loading">{{ $t('common.loading') }}</template>
    <template v-else>
      <div class="flex-row w-full" v-for="(item, index) in expandValue[row.UID]?.value ?? []" :key="index">
        <template v-for="col in splitColumns" :key="getMultipleKey(index, col.dataIndex)">
          <template v-if="col.dataIndex === 'username' && item.user_id !== row.user_id">
            <div
              class="expand-col link"
              :style="{ width: extendWidth[col.dataIndex], color: getLevelColor(item.level_path) }"
              @click.stop="setSelected(item)"
            >
              {{ item.username }}
            </div>
          </template>
          <template v-else>
            <div
              class="expand-col"
              v-if="!col.hide && (!col.perm || (!!col.perm && checkPerm(col.perm)))"
              :style="{ width: extendWidth[col.dataIndex] }"
            >
              {{ $ti(item[col.dataIndex]) }}
            </div>
          </template>
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
import { getLevelColor } from '@/views/report/user/_models';

const emits = defineEmits(['setSelected']);

const props = defineProps({ row: Object, splitColumns: Object, expandValue: Object, extendWidth: Object, leftSpace: Number });

const setSelected = (row) => {
  emits('setSelected', row);
};
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
