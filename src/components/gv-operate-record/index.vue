<template>
  <div class="gv-operate-record" v-loading="loading">
    <el-scrollbar height="100%">
      <div class="pt-16">
        <el-card class="card mb-12 ml-12 mr-12" v-for="item in tableList">
          <template #header>
            <div class="flex-row align-center">
              <span class="text-primary fz-14 fw-bold">{{ item.id }}:</span>
              <span class="text-regular fz-12 ml-12 fs-italic">{{ dayjs(formatServerTime(item.create_time)).format(getTimeFormat()) }}</span>
            </div>
          </template>
          <div class="info-item fz-12" v-if="item.username">
            <span class="label">{{ $t('common.user_no') }}</span>
            <span class="content">{{ item.username }}</span>
          </div>
          <div class="info-item fz-12">
            <span class="label">{{ $t('common.operate_type') }}</span>
            <span class="content">{{ actionMap[item.action]?.name }}</span>
          </div>
          <div class="info-item fz-12">
            <span class="label">{{ $t('log.change_name') }}</span>
            <span class="content">{{ item.change_field_name }}</span>
          </div>
          <div class="info-item fz-12">
            <span class="label">{{ $t('common.log_before_value') }}</span>
            <span class="content">{{ $ti(item.before_value) }}</span>
          </div>
          <div class="info-item fz-12">
            <span class="label">{{ $t('common.log_after_value') }}</span>
            <span class="content">{{ $ti(item.after_value) }}</span>
          </div>
          <!--     financeUserLog.symbol     -->
          <template v-if="request.symbol === financeUserLog.symbol && !!item.cabinet_chip_type_name">
            <div class="info-item fz-12">
              <span class="label">{{ $t('log.cabinet_name') }}</span>
              <span class="content">{{ $ti(item.cabinet_chip_type_name) }}</span>
            </div>
            <div class="info-item fz-12">
              <span class="label">{{ $t('common.currency_config_no') }}</span>
              <span class="content">{{ $ti(item.currency_config_name) }}</span>
            </div>
          </template>
          <div class="info-item fz-12">
            <span class="label">{{ $t('common.operate_person') }}</span>
            <span class="content">{{ item.operator }}</span>
          </div>
        </el-card>
      </div>
    </el-scrollbar>
    <div class="refresh-btn cursor-pointer" @click="refresh">
      <gv-icon name="el-icon-refresh" class="fz-18" />
    </div>
  </div>
</template>
<script>
export default { name: 'gv-operate-record' };
</script>
<script setup>
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { LOG_OPERATOR_TYPE_DICT, QUERY_LIST_TYPE } from '@/values';
import GvIcon from '@/components/gv-icon/index.vue';
import { formatServerTime, getTimeFormat, parseDict, toAwait } from '@/tools';
import dayjs from 'dayjs';
import { financeUserLog } from '@/api/finance/user-chip';
import { $t } from '@/lang/i18n';
import eventManager from '@/tools/event-manager';
import { EVENTS_LOG_POPUP_REFRESH } from '@/values/events';
import { $ti } from '@/lang/input';

const props = defineProps({
  request: Function,
  query: Object,
  title: { type: String, default: $t('common.operate_log') },
  delay: { type: Boolean }
});

const actionMap = parseDict(LOG_OPERATOR_TYPE_DICT);

const loading = ref(false);

const tableList = ref([]);

const refresh = async () => {
  loading.value = true;
  const [res] = await toAwait(props.request({ page_no: 1, page_size: 20, page_type: QUERY_LIST_TYPE.pager }));
  loading.value = false;
  tableList.value = res.lists;
};

onBeforeMount(() => {
  if (!props.delay) refresh();
  eventManager.on(EVENTS_LOG_POPUP_REFRESH, refresh);
});

onBeforeUnmount(() => {
  eventManager.off(EVENTS_LOG_POPUP_REFRESH, refresh);
});

defineExpose({ refresh });
</script>
<style lang="scss">
.zh-CN {
  .gv-operate-record {
    .info-item {
      .label {
        text-align: justify;
        text-align-last: justify;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.gv-operate-record {
  position: relative;
  height: 100%;

  .card {
    border-radius: var(--gv-border-radius-big);
  }

  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      min-width: 70px;
      margin-right: 12px;
      color: var(--el-color-info);
    }

    .content {
      word-break: break-all;
    }
  }

  ::v-deep(.el-card) {
    .el-card__body,
    .el-card__header {
      padding: 10px;
    }
  }
  .refresh-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-light);
    transition: opacity 0.3s linear;
    opacity: 0;
  }

  &:hover {
    .refresh-btn {
      opacity: 1;
    }
  }
}
</style>
