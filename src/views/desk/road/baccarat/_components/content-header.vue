<template>
  <div class="content-header flex-row align-center" :style="style">
    <!--  台号信息  -->
    <div class="table-box flex-row align-center flex-wrap h-full">
      <div class="table-info-color fz-24 fw-bold">
        {{ $t('desk.road.table_name') }}
        {{ tableInfo.name }}
      </div>
    </div>
    <div class="table-box flex-row align-center flex-wrap h-full ml-16">
      <div class="table-info-color fz-18">
        <span>
          {{ $t('desk.road.boot_number') }} {{ openingInfo.boot_number }}， {{ $t('desk.road.round_number') }} {{ openingInfo.round_number }}
        </span>
      </div>
    </div>
    <!--  限红  -->
    <div v-if="!!tableLimitInfo.length" class="limit-box blue flex-row align-center fw-bold h-full ml-16">
      <div class="label fz-24">MIN</div>
      <div class="ml-4 mb-4">
        <div v-for="(item, index) in tableLimitInfo" :key="index" :style="limitAmountStyle">
          {{ item.currency_icon }}{{ formatThousand(item.min) }}
        </div>
      </div>
    </div>
    <div v-if="!!tableLimitInfo.length" class="limit-box flex-row align-center fw-bold h-full ml-16">
      <div class="label fz-24">MAX</div>
      <div class="ml-4 mb-4">
        <div v-for="(item, index) in tableLimitInfo" :key="index" :style="limitAmountStyle">
          {{ item.currency_icon }}{{ formatThousand(item.max) }}
        </div>
      </div>
    </div>
    <div class="logo-box flex-row align-center">
      <img :src="webLogo" alt="" />
    </div>
  </div>
</template>
<script setup>
import { computed, inject } from 'vue';
import { formatThousand } from '@/tools';
import logo from '@/assets/images/layout/logo.png';
import { $t } from '@/lang/i18n';
import { systemState } from '@/store/system';

const tableInfo = inject('tableInfo');
const gameInfo = inject('gameInfo');
const gameKind = inject('gameKind');
const openingInfo = inject('openingInfo');

const webLogo = computed(() => systemState.config.web_logo || logo);

const tableLimitInfo = computed(() => {
  const list = tableInfo.value?.table_limit_info ?? [];
  return list.filter((val) => !!val.min && !!val.max);
});

const limitAmountStyle = computed(() => {
  if (tableLimitInfo.value.length <= 1) {
    return { fontSize: '24px' };
  } else if (tableLimitInfo.value.length === 2) {
    return { fontSize: '18px' };
  } else if (tableLimitInfo.value.length === 3) {
    return { fontSize: '14px' };
  } else {
    return { fontSize: '12px' };
  }
});

const props = defineProps({ style: Object });
</script>
<style scoped lang="scss">
.content-header {
  position: relative;
  padding: 20px;

  .table-box {
    padding: 5px 15px;
    border-radius: var(--gv-border-radius-big);
    background-color: var(--desk-baccarat-table-info-bg-color);

    .table-info-color {
      color: var(--desk-baccarat-table-limit-text-color);
    }
  }
  .limit-box {
    padding: 5px 15px;
    border-radius: var(--gv-border-radius-big);
    border: 4px solid var(--desk-baccarat-layout-border-color);
    color: var(--desk-baccarat-table-limit-text-color);
    background-image: var(--desk-baccarat-table-limit-bg-color);

    &.blue {
      background-image: var(--desk-baccarat-table-limit-min-bg-color);
    }

    .label {
      color: var(--desk-baccarat-bg-text-color);
    }
  }

  .logo-box {
    position: absolute;
    top: 20px;
    right: 20px;
    height: 60px;
    width: 60px;
    border-radius: 50%;
    border: 4px solid var(--desk-baccarat-layout-border-color);
    overflow: hidden;
    background-color: var(--el-bg-color);
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
