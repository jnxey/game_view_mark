<template>
  <div class="cabinet-wrap flex-row align-center flex-wrap">
    <!--    -->
    <template v-if="showCabinet">
      <div class="cabinet-item" v-for="(item, index) in cabinetFormat" :key="index">
        <div
          class="title color-white fz-14 fw-bold mb-8 cursor-pointer"
          @click="
            toRoutePath(permsMap.finance.user_chip.log, {
              sub_type: CABINET_CHIP_FIELD,
              title: 'finance.user_chip.btn_cabinet_log',
              suffix: '-' + $ti(item.title),
              cabinet_chip_type_id: item.id
            })
          "
        >
          {{ $ti(item.title) }}
        </div>
        <el-scrollbar class="item-wrap" :height="getPX(boxHeight)">
          <div
            class="cabinet-box cursor-pointer"
            v-for="(_item, _index) in item.children"
            :key="getMultipleKey(index, _index)"
            @click="handlerAmount(_item)"
          >
            <span class="text-regular fz-12">
              {{ $ti(_item.currency_config_name) }}
            </span>
            <span class="text-warning fz-14 fw-bold ml-8">{{ formatThousand(_item.total_amount) }}</span>
          </div>
        </el-scrollbar>
      </div>
    </template>
    <!--    -->
    <div
      v-if="!!cabinetFormat.length"
      class="cabinet-item toggle flex-row align-center justify-center cursor-pointer pt-8"
      :style="{ height: getPX(boxHeight + 46) }"
      @click="toggleShowCabinet"
    >
      <gv-icon class="toggle-icon fz-24" :class="{ right: !showCabinet }" name="el-icon-DArrowLeft" />
    </div>
  </div>
  <cabinet-amount ref="cabinetAmountRef" @success="refresh" />
</template>
<script setup>
import { computed, ref, shallowRef } from 'vue';
import { formatThousand, getMultipleKey, getPX, mappingArrayToObject } from '@/tools';
import CabinetAmount from '@/views/finance/user-chip/_components/cabinet-amount.vue';
import { CABINET_CHIP_FIELD } from '@/views/finance/user-chip/_model';
import { toRoutePath } from '@/router';
import { permsMap } from '@/api/perms';
import { $ti } from '@/lang/input';
import { financeUserLog } from '@/api/finance/user-chip';
import { CURRENCY_TYPE, REGULAR_CABINET_TYPE_IDS, YES_NO_VALUE } from '@/values';
import GvIcon from '@/components/gv-icon/index.vue';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';

const emits = defineEmits(['refresh', 'resetHeight']);
const props = defineProps({ currency: Array, cabinetList: Array });

const currencyConfigMap = computed(() => mappingArrayToObject(props.currency));

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.user_chip_cabinet_show);

const showCabinet = ref(selectCache.getItem() ?? true);

const boxHeight = computed(() => {
  const len = props.currency?.filter((val) => val.virtual_status === YES_NO_VALUE.no)?.length ?? 0;
  return showCabinet.value ? len * 24 : 0;
});

const cabinetAmountRef = shallowRef();

const cabinetFormat = computed(() => {
  const cabinetMap = {};
  const list = [...props.cabinetList];
  const result = [];
  const sortMap = {};
  list.sort((a, b) => a.currency_config_id - b.currency_config_id);
  list.forEach((item) => {
    sortMap[item.cabinet_chip_type_id] = item.sort;
    const currency = currencyConfigMap.value[item.currency_config_id];
    if (currency.virtual_status === YES_NO_VALUE.yes && item.cabinet_chip_type_id !== REGULAR_CABINET_TYPE_IDS.remit) return; // 虚拟币种只能汇款柜子显示
    if (item.cabinet_chip_type_id === REGULAR_CABINET_TYPE_IDS.exchange && currency.type === CURRENCY_TYPE.chips) return; // 货币兑换柜子只显示现金
    if (!cabinetMap[item.cabinet_chip_type_id]) {
      cabinetMap[item.cabinet_chip_type_id] = { title: item.cabinet_chip_type_name, id: item.cabinet_chip_type_id, children: [] };
    }
    cabinetMap[item.cabinet_chip_type_id].children.push(item);
  });
  const names = Object.keys(cabinetMap);
  names.sort((a, b) => {
    const aSort = sortMap[Number(a)] ?? 0;
    const bSort = sortMap[Number(b)] ?? 0;
    return aSort - bSort;
  });
  names.forEach((key) => {
    result.push(cabinetMap[key]);
  });
  return result;
});

const handlerAmount = (row) => {
  cabinetAmountRef.value?.open($ti(row.currency_config_name), $ti(row.cabinet_chip_type_name), row.icon, { id: row.id });
};

const toggleShowCabinet = () => {
  showCabinet.value = !showCabinet.value;
  selectCache.setItem(showCabinet.value);
  emits('resetHeight');
};

const refresh = () => {
  emits('refresh');
};
</script>
<style scoped lang="scss">
.cabinet-wrap {
  .cabinet-item {
    min-width: 140px;
    min-height: 50px;
    margin-right: 15px;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-radius: var(--gv-border-radius-big);
    box-shadow: var(--el-box-shadow-light);
    background-color: var(--el-bg-color);
    overflow: hidden;

    &.toggle {
      min-width: 100px;

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }

      .toggle-icon.right {
        transform: rotate(180deg);
      }
    }

    .title {
      padding: 8px 10px;
      border-radius: 16px 16px 0 0;
      background-color: var(--el-color-primary-dark-2);
    }

    .cabinet-box {
      padding: 5px 10px;
      margin: 0 5px;
      border-radius: var(--el-border-radius-base);

      &:hover {
        background-color: var(--el-fill-color);
      }
    }
  }
}
</style>
