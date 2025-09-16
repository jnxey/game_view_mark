<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="finance_table-list"
      :request="financeTableLists"
      :operate-width="180"
      :operate-perms="[
        permsMap.finance.table.edit,
        permsMap.finance.table.del,
        permsMap.scene.enter.view,
        permsMap.desk.road.view,
        permsMap.desk.bonus.view
      ]"
      :popup-right-title="$t('common.operate_log')"
      :columns="columns"
    >
      <template #handler-left>
        <el-button
          v-perms="[permsMap.finance.table.log]"
          type="primary"
          @click="toRoutePath(permsMap.finance.table.log, { request: financeTableLastLog.symbol, title: 'finance.table.title_log', del_user: true })"
        >
          {{ $t('common.operate_log') }}
        </el-button>
        <el-button v-perms="[permsMap.finance.table.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
        <el-button v-perms="[permsMap.finance.table_type.view]" type="primary" @click="toRoutePath(permsMap.finance.table_type.view)">
          {{ $t('finance.table_type.title') }}
        </el-button>
        <el-button v-perms="[permsMap.finance.video_recorder.view]" type="primary" @click="toRoutePath(permsMap.finance.video_recorder.view)">
          {{ $t('finance.video_recorder.title') }}
        </el-button>
      </template>
      <!--      -->
      <template #popup-right v-if="checkPerm(permsMap.finance.table.log)">
        <gv-operate-record :request="financeTableLastLog" />
      </template>
      <template #status="{ row }">
        <el-switch
          :model-value="row.status"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row)"
          :disabled="!checkPerm(permsMap.finance.table.edit)"
        />
      </template>
      <template #is_cash_compensation="{ row }">
        <el-switch
          :model-value="row.is_cash_compensation"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeCashStatus(row)"
          :disabled="!checkPerm(permsMap.finance.table.edit)"
        />
      </template>
      <template #camera_info="{ row }">
        <div v-if="!!row.camera_info" class="link flex-row align-center" @click="handleCameraDesign(row)">
          <gv-icon name="local-icon-design" />
          <span class="ml-8">{{ getJSON(row.camera_info, {}).channelName }}</span>
        </div>
      </template>
      <template #operate-cell="{ row }">
        <div class="flex-row align-center">
          <el-button link type="primary" v-perms="[permsMap.finance.table.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
          <el-button link type="danger" v-perms="[permsMap.finance.table.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
          <el-dropdown>
            <el-button link type="info" class="ml-12">
              {{ $t('common.more') }}
              <gv-icon name="el-icon-arrow-down" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleDownload(row)">{{ $t('finance.table.btn_download_app') }}</el-dropdown-item>
                <el-dropdown-item v-if="checkPerm([permsMap.finance.table.edit])" :disabled="!row.device_number" @click="handleUnbind(row)">
                  {{ $t('finance.table.btn_unbind_device') }}
                </el-dropdown-item>
                <el-dropdown-item v-if="checkPerm([permsMap.finance.table.edit])" @click="handleCameraBind(row)">
                  {{ $t('finance.table.btn_camera_bind') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="checkPerm([permsMap.desk.road.view])"
                  :disabled="row.status === STATUS_VALUE.disable"
                  @click="handleRoad(row)"
                >
                  {{ $t('finance.table.btn_desk_road') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="checkPerm([permsMap.desk.bonus.view])"
                  :disabled="row.status === STATUS_VALUE.disable"
                  @click="handleBonus(row)"
                >
                  {{ $t('finance.table.btn_desk_bonus') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="checkPerm([permsMap.scene.enter.view])"
                  @click="handleEnter(row)"
                  :disabled="row.status === STATUS_VALUE.disable"
                >
                  {{ $t('finance.table.btn_scene_enter') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
    <gv-download-app ref="downloadAppRef" />
    <gv-video-recorder-select ref="videoRecorderSelectRef" @bind="refreshTable" @unbind="refreshTable" />
    <gv-video-camera-design ref="videoCameraDesignRef" @save-success="refreshTable" />
  </div>
</template>

<script setup>
import {
  financeTableSet,
  financeTableDel,
  financeTableLists,
  financeTableSetStatus,
  financeTableSetCashStatus,
  financeTableLastLog,
  financeTableUnbindDevice
} from '@/api/finance/table';
import { shallowRef } from 'vue';
import { STATUS_VALUE_DICT, OPERATE_TYPE, STATUS_VALUE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { getJSON, parseDict } from '@/tools';
import { toRoutePath } from '@/router';
import { getExchangeStatus } from '@/tools/status-value';
import { checkPerm } from '@/directives/perms';
import GvIcon from '@/components/gv-icon/index.vue';
import { permsMap } from '@/api/perms';
import { useRouter } from 'vue-router';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';
import { gameGet } from '@/api/game/list';
import { $t } from '@/lang/i18n';
import GvDownloadApp from '@/components/gv-download-app/index.vue';
import { useAppConfig } from '@/hooks/app-config';
import GvVideoRecorderSelect from '@/components/gv-video-recorder-select/index.vue';
import GvVideoCameraDesign from '@/components/gv-video-camera-design/index.vue';

const router = useRouter();

const editRef = shallowRef();
const tableRef = shallowRef();
const downloadAppRef = shallowRef();
const videoRecorderSelectRef = shallowRef();
const videoCameraDesignRef = shallowRef();

const columns = shallowRef([
  { title: $t('finance.table.name'), dataIndex: 'name', minWidth: 120 },
  { title: $t('finance.table.type'), dataIndex: 'table_type_name', minWidth: 120 },
  { title: $t('finance.table.game'), dataIndex: 'game_name', minWidth: 120 },
  { title: $t('finance.table.shares_rate'), dataIndex: 'shares_rate', minWidth: 180 },
  { title: $t('finance.table.cash_compensation'), dataIndex: 'is_cash_compensation', minWidth: 120, dict: parseDict(STATUS_VALUE_DICT) },
  { title: $t('common.status'), dataIndex: 'status', minWidth: 120, dict: parseDict(STATUS_VALUE_DICT) },
  { title: $t('finance.table.device_number'), dataIndex: 'device_number', minWidth: 120 },
  { title: $t('finance.table.bind_camera'), dataIndex: 'camera_info', minWidth: 120, func: (_, val) => getJSON(_, {}).channelName },
  { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 120 },
  { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true },
  { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 180, time: true }
]);

const refreshTable = () => tableRef.value?.refresh();

const handleAdd = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

const handleEnter = async (data) => {
  toRoutePath(permsMap.scene.enter.view, { id: data.id, name: data.name });
};

// 更改状态
const changeStatus = async (row) => {
  const text = row.status === STATUS_VALUE.disable ? $t('common.open') : $t('common.close');
  await layer.confirm($t('common.status_switch_tips', { text }));
  layer.loading();
  await financeTableSetStatus({ id: row.id, status: getExchangeStatus(row.status) });
  layer.closeLoading();
  refreshTable();
};

// 更改现金理赔状态
const changeCashStatus = async (row) => {
  const text = row.is_cash_compensation === STATUS_VALUE.disable ? $t('common.open') : $t('common.close');
  await layer.confirm($t('common.status_switch_tips', { text }));
  layer.loading();
  await financeTableSetCashStatus({
    id: row.id,
    is_cash_compensation: getExchangeStatus(row.is_cash_compensation)
  });
  layer.closeLoading();
  refreshTable();
};

// 下载
const handleDownload = async (row) => {
  downloadAppRef.value?.open(useAppConfig({ install_name: `game_table_${row.name}`, table_id: row.id, table_name: row.name }));
};

// 路单大屏
const handleRoad = async (row) => {
  router.push({ path: '/desk/road', query: { id: row.id } });
};

// 彩金大屏
const handleBonus = async (row) => {
  layer.loading();
  const info = await gameGet({ id: row.game_id });
  layer.closeLoading();
  if (!info.bonus_id) return layer.msgError($t('finance.table.tips_game_bind_bonus'));
  router.push({ path: '/desk/bonus', query: { id: info.bonus_id } });
};

// 解绑设备
const handleUnbind = async (row) => {
  await layer.confirm($t('finance.table.tips_device_unbind_confirm', { name: row.name, device: row.device_number }));
  layer.loading();
  await financeTableUnbindDevice({ id: row.id, device_number: '' });
  layer.closeLoading();
  layer.msgSuccess($t('finance.table.tips_device_unbind_success'));
  refreshTable();
};

// 删除
const handleDelete = async (id) => {
  const { value } = await layer.password();
  layer.loading();
  await financeTableDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

// 打开摄像头绑定
const handleCameraBind = (row) => {
  videoRecorderSelectRef.value?.show(row);
};

// 打开摄像头设计
const handleCameraDesign = (row) => {
  videoCameraDesignRef.value?.show(row);
};
</script>
