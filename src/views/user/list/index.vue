<template>
  <div class="admin">
    <gv-table
      ref="tableRef"
      table-key="user-list-list"
      delay-request
      :operate-width="220"
      :operate-perms="[permsMap.user.list.edit, permsMap.user.list.del]"
      :request="userLists"
      :columns="columns"
      :popup-left-title="$t('common.user_agent')"
      :popup-right-title="$t('common.operate_log')"
      @selection-change="selectionChange"
      :default-query="defaultQuery"
    >
      <!--      -->
      <template #search-box="{ query, search, reset }">
        <gv-select-user-inline class="search-item" place-top v-model="query.id" :placeholder="$t('common.user_no')" @change="clearParent" />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.level_id"
          :placeholder="$t('user.list.level')"
          :options="optionsData.dimension?.user_level"
          :empty-page="{ perm: permsMap.user.level.view }"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.user_type_id"
          :placeholder="$t('user.list.user_type')"
          :options="optionsData.dimension?.user_type"
          :empty-page="{ perm: permsMap.user.type.view }"
        />
        <gv-select-options class="search-item" place-top v-model="query.status" :placeholder="$t('user.list.status')" :options="STATUS_VALUE_DICT" />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.is_rake"
          :placeholder="$t('user.list.is_rake')"
          :options="YES_NO_VALUE_DICT"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.is_shares"
          :placeholder="$t('user.list.is_shares')"
          :options="SHARE_REBATE_VALUE_DICT"
        />
        <el-input class="search-item" v-trim v-model="query.contact" :placeholder="$t('user.list.contact')" clearable @keyup.enter="search" v-place />
        <gv-select-user-inline
          class="search-item"
          place-top
          v-model="query.pid"
          :placeholder="$t('user.list.parent')"
          @update:model-value="setParent"
        />
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.create_time_start"
          v-model:endTime="query.create_time_end"
          :placeholder="$t('common.create_time')"
          v-place
        />
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.update_time_start"
          v-model:endTime="query.update_time_end"
          :placeholder="$t('common.update_time')"
          v-place
        />
        <el-input class="search-item" v-trim v-model="query.staff" :placeholder="$t('user.list.staff')" clearable @keyup.enter="search" v-place />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="executeMethods(clearParent, reset)">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <!--      -->
      <template #popup-left="{ height, offset }">
        <gv-user-tree ref="userTreeRef" @selected="selectedParent" :height="height" :offset="offset" />
      </template>
      <!--      -->
      <template #popup-right v-if="checkPerm(permsMap.user.list.log)">
        <gv-operate-record :request="userLastLog" />
      </template>
      <template #handler-box="{ tableExtend }">
        <div class="flex-2 flex-row align-center">
          <el-button
            v-perms="[permsMap.user.list.log]"
            type="primary"
            @click="toRoutePath(permsMap.user.list.log, { request: userLastLog.symbol, title: 'user.list.title_log' })"
          >
            {{ $t('common.operate_log') }}
          </el-button>
          <el-button v-perms="[permsMap.user.type.view]" type="primary" @click="toRoutePath(permsMap.user.type.view)">
            {{ $t('user.type.title') }}
          </el-button>
          <el-button v-perms="[permsMap.user.level.view]" type="primary" @click="toRoutePath(permsMap.user.level.view)">
            {{ $t('user.level.title') }}
          </el-button>
        </div>
        <!--        -->
        <div class="flex-3 flex-col align-bottom justify-center" v-if="tableExtend && permsMap.user.list.edit">
          <div class="text-right text-regular mb-8">
            <template v-if="tableExtend.count_pid_level">
              <span class="mr-8" v-if="!!tableExtend.count_pid_level.level_1">
                {{ $t('user.list.label_info_agent_l1') }}:
                <span class="text-primary fw-bold">{{ tableExtend.count_pid_level.level_1 }}</span>
                <span class="fz-12 text-placeholder">{{ $t('user.list.label_info_person') }}</span>
              </span>
              <span class="mr-8" v-if="!!tableExtend.count_pid_level.level_2">
                {{ $t('user.list.label_info_agent_l2') }}:
                <span class="text-primary fw-bold">{{ tableExtend.count_pid_level.level_2 }}</span>
                <span class="fz-12 text-placeholder">{{ $t('user.list.label_info_person') }}</span>
              </span>
              <span class="mr-8" v-if="!!tableExtend.count_pid_level.level_3">
                {{ $t('user.list.label_info_agent_l3') }}:
                <span class="text-primary fw-bold">{{ tableExtend.count_pid_level.level_3 }}</span>
                <span class="fz-12 text-placeholder">{{ $t('user.list.label_info_person') }}</span>
              </span>
              <span class="mr-8" v-if="!!tableExtend.count_pid_level.level_4">
                {{ $t('user.list.label_info_agent_l4') }}:
                <span class="text-primary fw-bold">{{ tableExtend.count_pid_level.level_4 }}</span>
                <span class="fz-12 text-placeholder">{{ $t('user.list.label_info_person') }}</span>
              </span>
              <span class="mr-8" v-if="!!tableExtend.count_pid_level.level_5">
                {{ $t('user.list.label_info_agent_l5') }}:
                <span class="text-primary fw-bold">{{ tableExtend.count_pid_level.level_5 }}</span>
                <span class="fz-12 text-placeholder">{{ $t('user.list.label_info_person') }}</span>
              </span>
            </template>
            <span class="mr-8">
              {{ $t('user.list.label_info_count_rebates') }}:
              <span class="text-primary fw-bold">{{ tableExtend.count_rebates }}</span>
              <span class="fz-12 text-placeholder">{{ $t('user.list.label_info_person') }}</span>
            </span>
            <span class="mr-8">
              {{ $t('user.list.label_info_count_shares') }}:
              <span class="text-primary fw-bold">{{ tableExtend.count_shares }}</span>
              <span class="fz-12 text-placeholder">{{ $t('user.list.label_info_person') }}</span>
            </span>
            <span class="mr-8">
              {{ $t('user.list.label_info_count_member') }}:
              <span class="text-primary fw-bold">{{ tableExtend.count_member }}</span>
              <span class="fz-12 text-placeholder">{{ $t('user.list.label_info_person') }}</span>
            </span>
          </div>
          <div class="text-right text-regular">
            <span v-if="!!tableExtend.count_deposit?.length">
              <span>{{ $t('user.list.label_info_count_deposit') }}：</span>
              <span v-for="(item, index) in tableExtend.count_deposit" :key="index" class="mr-4 fs-italic" :style="{ color: item.color }">
                {{ item.icon }}{{ item.total_amount }}
              </span>
            </span>
            <span class="ml-12" v-if="!!tableExtend.count_buka?.length">
              <span>{{ $t('user.list.label_info_count_buka') }}：</span>
              <span v-for="(item, index) in tableExtend.count_buka" :key="index" class="mr-4 fs-italic" :style="{ color: item.color }">
                {{ item.icon }}{{ item.total_amount }}
              </span>
            </span>
          </div>
        </div>
      </template>
      <!--      -->
      <template #handler-left>
        <el-button v-perms="[permsMap.user.list.edit]" type="primary" icon="Plus" @click="handleAddAgent">
          {{ $t('user.list.btn_agent_add') }}
        </el-button>
        <el-button v-perms="[permsMap.user.list.edit]" type="primary" icon="Plus" @click="handleAddBelow" :disabled="selected?.length !== 1">
          {{ $t('user.list.btn_agent_sub_add') }}
        </el-button>
        <el-button v-perms="[permsMap.user.list.edit]" type="primary" icon="Plus" @click="handleBuka" :disabled="selected?.length !== 1">
          {{ $t('user.list.btn_buka_add') }}
        </el-button>
        <!--        <el-button v-perms="[userSetBatchPid.perm]" type="primary" icon="Plus" @click="handleAgentChange" :disabled="selected?.length <= 0">-->
        <!--          变更上级-->
        <!--        </el-button>-->
        <!--        <span class="ml-12 mr-12 text-regular fz-14">代理整体移动</span>-->
        <!--        <el-switch :model-value="isAgentMove" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disabled" @click="changeAgentMove" />-->
      </template>
      <!--      -->
      <template #username="{ row }">
        <span :style="{ color: LEVEL_COLOR_MAP[row.level_path] }">{{ row.username }}</span>
      </template>
      <template #status="{ row }">
        <el-switch
          :model-value="row.status"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row, 'status')"
          :disabled="!checkPerm([permsMap.user.list.edit])"
        />
      </template>
      <template #is_rake="{ row }">
        <el-switch
          :model-value="row.is_rake"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row, 'is_rake')"
          :disabled="!checkPerm([permsMap.user.list.edit])"
        />
      </template>
      <template #is_redeem="{ row }">
        <el-switch
          :model-value="row.is_redeem"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row, 'is_redeem')"
          :disabled="!checkPerm([permsMap.user.list.edit])"
        />
      </template>
      <template #is_code_washing_settlement="{ row }">
        <el-switch
          :model-value="row.is_code_washing_settlement"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row, 'is_code_washing_settlement')"
          :disabled="!checkPerm([permsMap.user.list.edit])"
        />
      </template>
      <template #is_translate_cash="{ row }">
        <el-switch
          :model-value="row.is_translate_cash"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row, 'is_translate_cash')"
          :disabled="!checkPerm([permsMap.user.list.edit])"
        />
      </template>
      <template #is_code_washing="{ row }">
        <el-switch
          :model-value="row.is_code_washing"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row, 'is_code_washing')"
          :disabled="!checkPerm([permsMap.user.list.edit])"
        />
      </template>
      <template #is_money_transfer="{ row }">
        <el-switch
          :model-value="row.is_money_transfer"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row, 'is_money_transfer')"
          :disabled="!checkPerm([permsMap.user.list.edit])"
        />
      </template>
      <template #is_signing_order="{ row }">
        <el-switch
          :model-value="row.is_signing_order"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row, 'is_signing_order')"
          :disabled="!checkPerm([permsMap.user.list.edit])"
        />
      </template>
      <template #is_score_exchange="{ row }">
        <el-switch
          :model-value="row.is_score_exchange"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row, 'is_score_exchange')"
          :disabled="!checkPerm([permsMap.user.list.edit])"
        />
      </template>
      <template #is_profit_settlement="{ row }">
        <el-switch
          :model-value="row.is_profit_settlement"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row, 'is_profit_settlement')"
          :disabled="!checkPerm([permsMap.user.list.edit])"
        />
      </template>
      <template #is_c_code_match="{ row }">
        <el-switch
          :model-value="row.is_c_code_match"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row, 'is_c_code_match')"
          :disabled="!checkPerm([permsMap.user.list.edit])"
        />
      </template>
      <!--      -->
      <template #operate-cell="{ row }">
        <div class="flex-row align-center">
          <el-button v-perms="[permsMap.user.list.edit]" type="primary" link @click="handleConfig(row)">
            {{ $t('user.list.btn_game_config') }}
          </el-button>
          <el-button v-perms="[permsMap.user.list.edit]" type="primary" link @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
          <el-dropdown>
            <el-button link type="info" class="ml-12">
              {{ $t('common.more') }}
              <gv-icon name="el-icon-arrow-down" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="checkPerm([permsMap.user.list.del]) && row.root !== 1" @click="handleDelete(row)">
                  <span class="text-danger">{{ $t('common.del_btn') }}</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="checkPerm([permsMap.user.list.edit])" @click="handlePassword(row)">
                  {{ $t('user.list.btn_modify_password') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </gv-table>
    <gv-select-user ref="selectUserRef" :selected="selectedUser" @success="setSelectParent" />
    <edit-popup ref="editRef" @success="refreshTable" />
    <config-popup ref="configRef" @close="refreshTable" />
    <buka-popup ref="bukaRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import {
  userSet,
  userDelete,
  userDimension,
  userLists,
  userSwitchButton,
  userEditAttr,
  userDetail,
  userSetBatchPid,
  userGetAgentMove,
  userSetAgentMove,
  userSetPassword,
  userLastLog
} from '@/api/user/list';
import { useDictOptions } from '@/hooks/dict';
import EditPopup from './_components/edit.vue';
import BukaPopup from './_components/buka.vue';
import ConfigPopup from './_components/config.vue';
import { computed, onActivated, onBeforeMount, ref, shallowRef } from 'vue';
import {
  OPERATE_TYPE,
  SEX_VALUE_DICT,
  YES_NO_VALUE_DICT,
  STATUS_VALUE,
  SHARE_REBATE_VALUE_DICT,
  STATUS_VALUE_DICT,
  USER_TREE_ALL_KEY,
  LEVEL_COLOR_MAP
} from '@/values';
import layer from '@/tools/layer.js';
import GvTable from '@/components/gv-table/index.vue';
import { toRoutePath } from '@/router';
import { delayExec, executeMethods, parseDict } from '@/tools';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { userTypeLists } from '@/api/user/type';
import { userLevelLists } from '@/api/user/level';
import GvUserTree from '@/components/gv-user-tree/index.vue';
import GvSelectUser from '@/components/gv-select-user/index.vue';
import GvIcon from '@/components/gv-icon/index.vue';
import { checkPerm } from '@/directives/perms';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { useRoute } from 'vue-router';
import { getExchangeStatus } from '@/tools/status-value';
import { permsMap } from '@/api/perms';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { $t } from '@/lang/i18n';

const editRef = shallowRef();
const configRef = shallowRef();
const tableRef = shallowRef();
const bukaRef = shallowRef();
const selected = shallowRef([]);
const selectUserRef = shallowRef();
const userTreeRef = shallowRef();
const selectedUser = ref({});
const isAgentMove = ref(STATUS_VALUE.disable);

const heightLightRow = ref();
const route = useRoute();

const defaultQuery = { username: route.query.username };

const { optionsData, refresh } = useDictOptions({ dimension: { api: userDimension } }, true);

const columns = computed(() => {
  return [
    { title: $t('user.list.username'), dataIndex: 'username', minWidth: 140 },
    { title: $t('user.list.nickname'), dataIndex: 'nickname', minWidth: 120 },
    { title: $t('user.list.avatar'), dataIndex: 'avatar', minWidth: 80, image: true },
    { title: $t('user.list.user_type'), dataIndex: 'user_type_id', minWidth: 130, dict: parseDict(optionsData.dimension?.user_type || []) },
    { title: $t('user.list.gender'), dataIndex: 'gender', minWidth: 130, dict: parseDict(SEX_VALUE_DICT) },
    { title: $t('user.list.contact'), dataIndex: 'contact', minWidth: 150 },
    { title: $t('user.list.address'), dataIndex: 'address', minWidth: 150 },
    { title: $t('user.list.level'), dataIndex: 'level_id', minWidth: 120, dict: parseDict(optionsData.dimension?.user_level || []) },
    { title: $t('user.list.status'), dataIndex: 'status', minWidth: 100, perms: ['user.user/edit'], dict: parseDict(STATUS_VALUE_DICT) },
    { title: $t('user.list.is_rake'), dataIndex: 'is_rake', minWidth: 100, perms: ['user.user/edit'], dict: parseDict(STATUS_VALUE_DICT) },
    { title: $t('user.list.is_redeem'), dataIndex: 'is_redeem', minWidth: 120, perms: ['user.user/edit'], dict: parseDict(STATUS_VALUE_DICT) },
    {
      title: $t('user.list.is_code_washing_settlement'),
      dataIndex: 'is_code_washing_settlement',
      minWidth: 120,
      perms: ['user.user/edit'],
      dict: parseDict(STATUS_VALUE_DICT)
    },
    {
      title: $t('user.list.is_translate_cash'),
      dataIndex: 'is_translate_cash',
      minWidth: 120,
      perms: ['user.user/edit'],
      dict: parseDict(STATUS_VALUE_DICT)
    },
    {
      title: $t('user.list.is_code_washing'),
      dataIndex: 'is_code_washing',
      minWidth: 120,
      perms: ['user.user/edit'],
      dict: parseDict(STATUS_VALUE_DICT)
    },
    {
      title: $t('user.list.is_money_transfer'),
      dataIndex: 'is_money_transfer',
      minWidth: 120,
      perms: ['user.user/edit'],
      dict: parseDict(STATUS_VALUE_DICT)
    },
    {
      title: $t('user.list.is_signing_order'),
      dataIndex: 'is_signing_order',
      minWidth: 120,
      perms: ['user.user/edit'],
      dict: parseDict(STATUS_VALUE_DICT)
    },
    {
      title: $t('user.list.is_score_exchange'),
      dataIndex: 'is_score_exchange',
      minWidth: 120,
      perms: ['user.user/edit'],
      dict: parseDict(STATUS_VALUE_DICT)
    },
    {
      title: $t('user.list.is_profit_settlement'),
      dataIndex: 'is_profit_settlement',
      minWidth: 120,
      perms: ['user.user/edit'],
      dict: parseDict(STATUS_VALUE_DICT)
    },
    {
      title: $t('user.list.is_c_code_match'),
      dataIndex: 'is_c_code_match',
      minWidth: 120,
      perms: ['user.user/edit'],
      dict: parseDict(STATUS_VALUE_DICT)
    },
    { title: $t('user.list.is_shares'), dataIndex: 'is_shares', minWidth: 150, dict: parseDict(SHARE_REBATE_VALUE_DICT) },
    { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true },
    { title: $t('user.list.prev_time'), dataIndex: 'prev_time', minWidth: 180, time: true },
    { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 180, time: true },
    { title: $t('user.list.permissions_desc'), dataIndex: 'permissions_desc', minWidth: 150 },
    { title: $t('user.list.information_desc'), dataIndex: 'information_desc', minWidth: 150 },
    { title: $t('user.list.staff'), dataIndex: 'staff', minWidth: 120 }
  ];
});

// 刷新表格
const refreshTable = (opt) => {
  tableRef.value?.refresh();
  if (opt?.mode === OPERATE_TYPE.insert) handleConfig(opt.data);
};

// 获取代理整体移动状态
const getAgentMove = async () => {
  const { is_agent_move } = await userGetAgentMove();
  isAgentMove.value = is_agent_move;
};

// 更改状态
const changeStatus = async (row, field) => {
  const text = row[field] === STATUS_VALUE.disable ? $t('common.open') : $t('common.close');
  await layer.confirm($t('common.status_switch_tips', { text }));
  layer.loading();
  userSwitchButton({
    id: row.id,
    switch_field: field,
    value: getExchangeStatus(row[field])
  }).finally(() => {
    layer.closeLoading();
    refreshTable();
  });
};

// +代理
const handleAddAgent = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

// +下级
const handleAddBelow = async () => {
  const selected = tableRef.value.getSelected();
  if (!selected.length) return layer.msgError($t('user.list.tips_select_user'));
  const row = { pid: selected[0].id, pid_user: { id: selected[0].id, username: selected[0].username } };
  editRef.value?.open(OPERATE_TYPE.insert, row);
};

// 变更代理
const handleAgentChange = () => {
  // const selected = tableRef.value.getSelected();
  // if (!selected.length) return layer.msgError('请选择至少一个会员');
  // const selectedMap = {};
  // selected.forEach((item) => (selectedMap[item.id] = item));
  // selectedUser.value = selectedMap;
  // selectUserRef.value?.open();
};

// 设置选中的会员，同时变更上级
const setSelectParent = async (row) => {
  // const ids = Object.keys(selectedUser.value);
  // const name = ids.map((id) => selectedUser.value[id].username);
  // await layer.confirm(`确认将【${name.join(', ')}】变更至【${row.username}】的下级`);
  // layer.loading();
  // await userSetBatchPid({ pid: row.id, ids: ids });
  // layer.closeLoading();
  // layer.msgSuccess('变更成功');
  // userTreeRef.value?.getTreeList();
  // layer.alertWarning('变更上级后该会员及其所有下级的【游戏配置】各比例将重置为0，请检查！');
};

// 设置代理整体移动
const changeAgentMove = async () => {
  // layer.loading();
  // await userSetAgentMove({ move_status: getExchangeStatus(isAgentMove.value) });
  // layer.closeLoading();
  // getAgentMove();
};

// 编辑
const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

// +补卡费
const handleBuka = async () => {
  const selected = tableRef.value?.getSelected();
  if (!selected.length) return layer.msgError($t('user.list.tips_select_user'));
  bukaRef.value?.open(selected[0]);
};

// 游戏配置
const handleConfig = async (row) => {
  configRef.value?.open(row);
};

// 删除
const handleDelete = async (row) => {
  const { value } = await layer.password();
  layer.loading();
  await userDelete({ id: row.id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

// 修改密码
const handlePassword = async (row) => {
  const { value } = await layer.password('', $t('user.list.tips_confirm_modify_password', { username: row.username }), { strict: true });
  layer.loading();
  await userSetPassword({ id: row.id, user_password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
};

// 选中行变更
const selectionChange = (rows) => {
  selected.value = rows;
};

// 选中父节点
const selectedParent = async ({ id }) => {
  tableRef.value?.setQuery('pid', id);
  if (!!id) tableRef.value?.setQuery('id', null); // 清空会员号
  heightLightRow.value = id;
  await delayExec(300); // 请求会影响搜索栏place动画
  tableRef.value?.search();
};

// 设置左侧选中节点
const setParent = () => {
  const { pid } = tableRef.value?.getQuery();
  userTreeRef.value?.setSelected(pid || USER_TREE_ALL_KEY);
};

// 清除右侧选中节点
const clearParent = () => {
  userTreeRef.value?.clearCurrent();
};

// 打开会员代理
const openPopupLeft = () => {
  tableRef.value?.openPopupLeft();
};

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
  refreshTable();
  getAgentMove();
});
</script>
