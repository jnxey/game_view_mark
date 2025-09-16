<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="140px">
      <el-form-item :label="$t('goods.store.image')" prop="image">
        <gv-material-picker custom-class="w-full" v-model="formData.image" :limit="6" />
        <div class="text-tips">{{ $t('goods.store.tips_image') }}</div>
      </el-form-item>
      <el-form-item :label="$t('goods.store.name')" prop="name">
        <el-input v-model="formData.name" :placeholder="$t('goods.store.placeholder_name')" clearable />
      </el-form-item>
      <el-form-item :label="$t('goods.store.desc')" prop="desc">
        <el-input v-model="formData.desc" :placeholder="$t('goods.store.placeholder_desc')" type="textarea" clearable />
      </el-form-item>
      <el-form-item :label="$t('goods.store.address')" prop="address">
        <el-input v-model="formData.address" :placeholder="$t('goods.store.placeholder_address')" type="textarea" clearable />
      </el-form-item>
      <el-form-item :label="$t('goods.store.leader')" prop="leader">
        <el-input v-model="formData.leader" :placeholder="$t('goods.store.placeholder_leader')" clearable />
      </el-form-item>
      <el-form-item :label="$t('goods.store.contact')" prop="contact">
        <el-input v-model="formData.contact" :placeholder="$t('goods.store.placeholder_contact')" clearable />
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input v-model="formData.remark" :placeholder="$t('common.remark_placeholder')" clearable />
      </el-form-item>
      <el-form-item :label="$t('goods.store.status')" prop="status">
        <el-switch v-model="formData.status" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disable" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { storeSet } from '@/api/goods/store';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { OPERATE_TYPE, STATUS_VALUE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { getJSON, syncObjectData } from '@/tools';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('goods.store.title_edit') : $t('goods.store.title_add')));

const formTemp = {
  id: null,
  name: '',
  image: '',
  address: '',
  contact: '',
  leader: '',
  remark: '',
  status: STATUS_VALUE.normal,
  desc: ''
};

const formData = reactive({ ...formTemp });

const rules = {
  name: [{ required: true, message: $t('goods.store.field_check_name'), trigger: ['blur'] }],
  image: [{ required: true, message: $t('goods.store.field_check_image'), trigger: ['blur'] }],
  address: [{ required: true, message: $t('goods.store.field_check_address'), trigger: ['blur'] }],
  contact: [{ required: true, message: $t('goods.store.field_check_contact'), trigger: ['blur'] }],
  leader: [{ required: true, message: $t('goods.store.field_check_leader'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  mode.value = type;
  if (type === OPERATE_TYPE.update) {
    syncObjectData(formData, { ...row, image: getJSON(row?.image, []) });
  } else {
    syncObjectData(formData, { ...formTemp });
  }
  popupRef.value?.open();
  clearValidate();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  const params = { ...formData, image: JSON.stringify(formData.image) };
  await storeSet(params);
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
