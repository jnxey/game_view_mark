<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="120px">
      <el-form-item :label="$t('external.hotel_management.name')" prop="hotel_name">
        <el-input v-model="formData.hotel_name" :placeholder="$t('external.hotel_management.placeholder_name')" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.hotel_management.room_number')" prop="room_number">
        <el-input v-model="formData.room_number" :placeholder="$t('external.hotel_management.placeholder_room_number')" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.hotel_management.room_type')" prop="hotel_room_type_id">
        <gv-select-options
          v-model="formData.hotel_room_type_id"
          :placeholder="$t('external.hotel_management.placeholder_room_type')"
          :options="optionsData.roomType"
        />
      </el-form-item>
      <el-form-item :label="$t('external.hotel_management.room_rates')" prop="room_rates">
        <el-input-number
          v-model="formData.room_rates"
          :placeholder="$t('external.hotel_management.placeholder_room_rates')"
          clearable
          class="w-full"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item :label="$t('external.hotel_management.room_status')" prop="room_status">
        <el-radio-group v-model="formData.room_status">
          <el-radio class="custom-radio mb-4" v-for="item in ROOM_STATUS_DICT" :value="item.value" :disabled="getDisable(item)">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('external.hotel_management.room_images')" prop="room_images">
        <gv-material-picker custom-class="w-full" v-model="formData.room_images" :limit="6" />
        <div class="text-tips">{{ $t('external.hotel_management.tips_room_images') }}</div>
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { hotelManagementSet } from '@/api/external/hotel-management';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { OPERATE_TYPE, ROOM_STATUS, ROOM_STATUS_DICT } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { getJSON, syncObjectData } from '@/tools';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import { useDictOptions } from '@/hooks/dict';
import { hotelRoomTypeLists } from '@/api/external/hotel-room-type';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() =>
  mode.value === OPERATE_TYPE.update ? $t('external.hotel_management.title_edit') : $t('external.hotel_management.title_add')
);

const formTemp = {
  id: null,
  hotel_name: '',
  room_number: '',
  hotel_room_type_id: null,
  room_rates: null,
  room_status: ROOM_STATUS.free,
  room_images: ''
};

const formData = reactive({ ...formTemp });

const rules = {
  hotel_name: [{ required: true, message: $t('external.hotel_management.field_check_name'), trigger: ['blur'] }],
  room_number: [{ required: true, message: $t('external.hotel_management.field_check_room_number'), trigger: ['blur'] }],
  room_rates: [{ required: true, message: $t('external.hotel_management.field_check_room_rates'), trigger: ['blur'] }],
  hotel_room_type_id: [{ required: true, message: $t('external.hotel_management.field_check_room_type'), trigger: ['blur'] }]
};

const { optionsData, refresh } = useDictOptions(
  {
    roomType: { api: hotelRoomTypeLists }
  },
  true
);

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  refresh();
  mode.value = type;
  if (type === OPERATE_TYPE.update) syncObjectData(formData, { ...row, room_images: getJSON(row?.room_images, []) });
  else syncObjectData(formData, { ...formTemp, room_images: [] });
  popupRef.value?.open();
  clearValidate();
};

const getDisable = (item) => {
  if (mode.value === OPERATE_TYPE.insert) {
    return item.value === ROOM_STATUS.use;
  } else {
    return formData.status === ROOM_STATUS.use || item.value === ROOM_STATUS.use;
  }
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  const params = { ...formData, room_images: JSON.stringify(formData.room_images) };
  await hotelManagementSet(params);
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
