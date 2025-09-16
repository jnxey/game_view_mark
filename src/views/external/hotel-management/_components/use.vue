<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="700px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="140px">
      <el-form-item :label="$t('external.hotel_room_record.check_time')" prop="check_out_time">
        <gv-daterange-picker
          v-model:start-time="formData.check_in_time"
          v-model:end-time="formData.check_out_time"
          showFormat="YYYY-MM-DD HH:mm"
          time-format="HH:mm"
          :default-time="defaultTime"
          big
          class="flex-1"
          @change="dayChange"
        />
        <div class="w-full fz-12 text-placeholder" v-if="days">
          <span class="fz-12 text-placeholder">{{ $t('external.hotel_room_record.days') }}</span>
          <span class="fz-16 text-warning fw-bold ml-12">{{ days }}</span>
        </div>
      </el-form-item>
      <el-form-item :label="$t('external.hotel_room_record.guest_add')" prop="guest" label-position="top">
        <div class="guest-wrap flex-1">
          <div class="guest-item mb-16" v-for="(_, index) in formData.guest" :key="_.UNIKEY">
            <!--            -->
            <div class="label fz-12 pl-8 pr-8 mb-8 text-right">{{ $t('external.hotel_room_record.guest_type') }}</div>
            <div class="content mb-8">
              <el-radio-group v-model="formData.guest[index].guest_type" @change="clearUser(index)" size="small">
                <el-radio class="custom-radio" v-for="item in GUEST_TYPE_DICT" :value="item.value">{{ item.name }}</el-radio>
              </el-radio-group>
            </div>
            <!--            -->
            <template v-if="formData.guest[index].guest_type === GUEST_TYPE.member">
              <div class="label fz-12 pl-8 pr-8 mb-8 text-right">{{ $t('external.hotel_room_record.guest_user') }}</div>
              <div class="content mb-8">
                <div class="w-full flex-row align-center">
                  <el-input
                    :model-value="formData.guest[index].guest_username"
                    :placeholder="$t('common.empty')"
                    class="flex-1"
                    readonly
                    size="small"
                  >
                    <template #append v-if="!!formData.guest[index].guest_username">
                      <el-button icon="Delete" @click="clearUser(index)" />
                    </template>
                  </el-input>
                  <el-button class="ml-12 w-80" type="primary" icon="User" @click="selectUser(index)" size="small">
                    {{ $t('common.select') }}
                  </el-button>
                </div>
              </div>
            </template>
            <!--            -->
            <div class="label fz-12 pl-8 pr-8 mb-8 text-right">{{ $t('external.hotel_room_record.guest_name') }}</div>
            <div class="content mb-8">
              <el-input
                v-model="formData.guest[index].guest_nickname"
                :placeholder="$t('external.hotel_room_record.placeholder_name')"
                clearable
                size="small"
              />
            </div>
            <!--            -->
            <div class="label fz-12 pl-8 pr-8 mb-8 text-right">{{ $t('external.hotel_room_record.id_number') }}</div>
            <div class="content mb-8">
              <el-input
                v-model="formData.guest[index].guest_id_number"
                :placeholder="$t('external.hotel_room_record.placeholder_id_number')"
                clearable
                size="small"
              />
            </div>
            <!--            -->
            <div class="label fz-12 pl-8 pr-8 mb-8 text-right">{{ $t('external.hotel_room_record.telephone') }}</div>
            <div class="content mb-8">
              <el-input
                v-model="formData.guest[index].guest_telephone"
                :placeholder="$t('external.hotel_room_record.placeholder_telephone')"
                clearable
                size="small"
              />
            </div>
            <!--            -->
            <template v-if="!index">
              <div class="label fz-12 pl-8 pr-8 mb-8 text-right">{{ $t('external.hotel_room_record.deposit') }}</div>
              <div class="content mb-8">
                <el-input-number
                  v-model="formData.guest[index].deposit"
                  @change="setDeposit"
                  :placeholder="$t('external.hotel_room_record.placeholder_deposit')"
                  clearable
                  class="w-full"
                  :min="0"
                  :max="Number.MAX_SAFE_INTEGER"
                  controls-position="right"
                  size="small"
                />
              </div>
            </template>
            <!--            -->
            <template v-if="!index">
              <div class="label fz-12 pl-8 pr-8 mb-8 text-right">{{ $t('external.hotel_room_record.room_rates_true') }}</div>
              <div class="content mb-8">
                <el-input-number
                  v-model="formData.guest[index].room_rates_true"
                  :placeholder="$t('external.hotel_room_record.placeholder_room_rates_true')"
                  clearable
                  class="w-full"
                  :min="0"
                  :max="Number.MAX_SAFE_INTEGER"
                  controls-position="right"
                  size="small"
                />
              </div>
            </template>
            <!--            -->
            <div class="label fz-12 pl-8 pr-8 mb-8 text-right">{{ $t('external.hotel_room_record.images') }}</div>
            <div class="content mb-8">
              <gv-material-picker custom-class="w-full" v-model="formData.guest[index].images" :limit="1" />
            </div>
            <!--            -->
            <gv-icon v-if="canDelGuest" name="el-icon-circle-close" class="del-btn cursor-pointer fz-14" @click="delGuest(index)" />
            <!--            -->
            <div v-if="lastGuestIndex === index" class="add-line w-full cursor-pointer" @click="addGuest">
              <gv-icon name="el-icon-circle-plus-filled" class="icon-btn fz-16" />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('external.hotel_room_record.remark')" prop="remark">
        <el-input v-model="formData.remark" :placeholder="$t('external.hotel_room_record.placeholder_remark')" clearable type="textarea" />
      </el-form-item>
    </el-form>
  </gv-popup>
  <gv-select-user ref="selectUserRef" @success="setUser" />
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { GUEST_TYPE, GUEST_TYPE_DICT } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { calculateStayDays, generateUUID, isEmpty, syncObjectData } from '@/tools';
import GvSelectUser from '@/components/gv-select-user/index.vue';
import GvIcon from '@/components/gv-icon/index.vue';
import { hotelManagementCheckIn } from '@/api/external/hotel-management';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { storage } from '@/tools/storage';
import { CACHE_HOTEL_USE_DEPOSIT } from '@/values/cache';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const selectUserRef = shallowRef();
const cacheIndex = ref();
const cacheRoomRates = ref(0);

const defaultTime = [new Date(2000, 1, 1, 12, 0, 0), new Date(2000, 1, 1, 14, 0, 0)];

const popupTitle = computed(() => $t('external.hotel_room_record.title_add'));

const guestTemp = {
  guest_username: '',
  guest_nickname: '',
  guest_telephone: '',
  guest_id_number: '',
  images: '',
  room_rates_true: 0,
  deposit: 0,
  guest_type: GUEST_TYPE.normal
};
const formTemp = {
  hotel_management_id: null,
  guest: [],
  check_in_time: null,
  check_out_time: null,
  remark: ''
};

const formData = reactive({ ...formTemp });

const rules = {
  check_out_time: [{ required: true, message: $t('external.hotel_room_record.field_check_check_time'), trigger: ['blur'] }]
};

const days = computed(() => {
  if (!formData.check_out_time || !formData.check_out_time) return 0;
  return calculateStayDays(formData.check_in_time, formData.check_out_time);
});

const lastGuestIndex = computed(() => formData.guest.length - 1);

const canDelGuest = computed(() => formData.guest.length > 1);

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (row) => {
  const deposit = storage.get(CACHE_HOTEL_USE_DEPOSIT) ?? 0;
  cacheRoomRates.value = Number(row.room_rates);
  syncObjectData(formData, {
    ...formTemp,
    hotel_management_id: row.id,
    guest: [{ ...guestTemp, UNIKEY: generateUUID(), deposit: deposit }]
  });
  popupRef.value?.open();
};

// 入住时间变更
const dayChange = () => {
  formData.guest[0].room_rates_true = cacheRoomRates.value * days.value;
};

// 添加入住人
const addGuest = () => {
  formData.guest.push({ ...guestTemp, UNIKEY: generateUUID() });
};

// 删除入住人
const delGuest = (index) => {
  formData.guest.splice(index, 1);
};

// 选择上级
const selectUser = (index) => {
  cacheIndex.value = index;
  selectUserRef.value?.open();
};

// 设置上级
const setUser = (row) => {
  formData.guest[cacheIndex.value].guest_username = row.username;
  formData.guest[cacheIndex.value].guest_nickname = row.nickname;
};

// 清空用户选项
const clearUser = (index) => {
  formData.guest[index].guest_username = '';
  formData.guest[index].guest_nickname = '';
};

// 设置押金
const setDeposit = (val) => {
  storage.set(CACHE_HOTEL_USE_DEPOSIT, val);
};

// 校验入住人信息
const checkInfo = () => {
  let errMsg = '';
  formData.guest.forEach((item, index) => {
    if (!item.guest_nickname) errMsg = $t('external.hotel_room_record.field_check_name');
    if (!!index) return;
    if (isEmpty(item.room_rates_true)) errMsg = $t('external.hotel_room_record.field_check_room_rates_true');
    if (isEmpty(item.deposit)) errMsg = $t('external.hotel_room_record.field_check_deposit');
  });
  return errMsg;
};

// 提交
const handleSubmit = async () => {
  await formRef.value?.validate();
  const validMsg = checkInfo();
  if (!!validMsg) return layer.msgError(validMsg);
  layer.loading();
  const params = { ...formData };
  params.room_rates_true = params.guest[0]?.room_rates_true;
  params.deposit = params.guest[0]?.deposit;
  await hotelManagementCheckIn(params);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.guest-wrap {
  .guest-item {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 25px 15px;
    margin-left: 15px;
    margin-right: 15px;
    border-radius: var(--el-border-radius-base);
    background-color: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-light);
    line-height: 24px;

    .label {
      width: 12%;
      text-align-last: justify;
      color: var(--el-text-color-secondary);
    }
    .content {
      width: 38%;
    }

    .del-btn {
      position: absolute;
      right: 5px;
      top: 5px;
      color: var(--el-text-color-regular);
      z-index: 10;

      &:hover {
        color: var(--el-color-danger);
      }
    }

    .add-line {
      position: absolute;
      left: 0;
      bottom: -10px;
      height: 20px;

      .icon-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background-color: var(--el-bg-color);
        color: var(--el-text-color-regular);
        z-index: 10;
      }

      &:hover {
        .icon-btn {
          color: var(--el-color-primary);
        }

        &:after {
          content: '';
          position: absolute;
          top: 50%;
          left: var(--el-border-radius-base);
          width: calc(100% - var(--el-border-radius-base) * 2);
          height: 1px;
          background-color: var(--el-color-primary);
          opacity: 0.6;
          z-index: 5;
        }
      }
    }
  }
}
</style>
