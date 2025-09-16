<template>
  <div class="good-car pl-8 text-main">
    <!--    -->
    <div class="title fz-24 fw-bold mb-16">{{ $t('goods.book_order.title_car') }}</div>
    <!--    -->
    <div class="car-item flex-row align-center p-8 mb-16" v-for="(item, index) in selected" :key="item.stock_id">
      <el-avatar shape="square" :size="40" fit="cover" :src="getAlbumDef(stockMap[item.stock_id]?.image)" />
      <div class="flex-1 flex-w0 ml-8">
        <div class="fz-16 mb-4 fw-bold">{{ stockMap[item.stock_id]?.name }}</div>
        <div class="fz-16 text-warning fw-bold">{{ stockMap[item.stock_id]?.unit }}{{ stockMap[item.stock_id]?.price }}</div>
      </div>
      <el-input-number
        class="count-btn center ml-4"
        :model-value="item.number"
        @change="(value) => setNumber(index, value)"
        :min="0"
        :max="stockMap[item.stock_id]?.maxNumber"
        :step="1"
        step-strictly
      />
    </div>
    <!--    -->
    <el-empty v-if="isEmpty" :image-size="80" :description="$t('goods.book_order.tips_select_goods')" />
    <!--    -->
    <div class="count-all mb-16" v-if="!isEmpty">
      <span class="title fz-18 fw-bold">{{ $t('goods.book_order.label_count') }}：</span>
      <span class="amount fz-18 fw-bold text-warning">{{ countAll }}</span>
    </div>
    <el-button type="primary" :disabled="isEmpty" size="large" class="w-full" @click="openGoodOrder">
      {{ $t('goods.book_order.label_order') }}
    </el-button>
    <good-order ref="goodOrderRef" />
  </div>
</template>
<script setup>
import { computed, inject, shallowRef } from 'vue';
import { getAlbumDef } from '@/tools';
import GoodOrder from '@/views/goods/book-order/_components/good-order.vue';
import { $t } from '@/lang/i18n';

const selected = inject('selected');
const countAll = inject('countAll');
const stockMap = inject('stockMap');
const setNumber = inject('setNumber');

const goodOrderRef = shallowRef();

const isEmpty = computed(() => !selected.length);

const openGoodOrder = () => {
  goodOrderRef.value?.open();
};
</script>
<style scoped lang="scss">
.good-car {
  width: 300px;

  .car-item {
    border-bottom: 1px solid var(--el-border-color);

    .count-btn {
      width: 100px;

      ::v-deep(.el-input-number__decrease) {
        border-right: none;
        border-radius: 50%;
      }

      ::v-deep(.el-input-number__increase) {
        border-left: none;
        border-radius: 50%;
      }

      ::v-deep(.el-input) {
        .el-input__wrapper {
          border: none;
          box-shadow: none;
        }
      }
    }
  }
}
</style>
