<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="120px">
      <el-form-item :label="$t('goods.stock.image')" prop="image">
        <gv-material-picker custom-class="w-full" v-model="formData.image" :limit="6" />
        <div class="text-tips">{{ $t('goods.stock.tips_image') }}</div>
      </el-form-item>
      <el-form-item :label="$t('goods.stock.store')" prop="store_id">
        <el-select class="w-full" v-model="formData.store_id" :placeholder="$t('goods.stock.placeholder_store')" clearable>
          <el-option v-for="(item, index) in optionsData.storeList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('goods.stock.type')" prop="stock_type_id">
        <el-select class="w-full" v-model="formData.stock_type_id" :placeholder="$t('goods.stock.placeholder_type')" clearable>
          <el-option v-for="(item, index) in optionsData.typeList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('goods.stock.name')" prop="name">
        <el-input v-model="formData.name" :placeholder="$t('goods.stock.placeholder_name')" clearable />
      </el-form-item>
      <el-form-item :label="$t('goods.stock.purchase_price')" prop="purchase_price">
        <el-input-number
          class="w-full"
          v-model="formData.purchase_price"
          :placeholder="$t('goods.stock.placeholder_purchase_price')"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('goods.stock.price')" prop="price">
        <el-input-number
          class="w-full"
          v-model="formData.price"
          :placeholder="$t('goods.stock.placeholder_price')"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('goods.stock.unit')" prop="unit">
        <el-input v-model="formData.unit" :placeholder="$t('goods.stock.placeholder_unit')" clearable />
      </el-form-item>
      <el-form-item :label="$t('goods.stock.number')" prop="number">
        <el-input-number
          class="w-full"
          v-model="formData.number"
          :placeholder="$t('goods.stock.placeholder_number')"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          clearable
          controls-position="right"
        />
      </el-form-item>
      <el-form-item :label="$t('goods.stock.points')" prop="points">
        <el-input-number
          class="w-full"
          v-model="formData.points"
          :placeholder="$t('goods.stock.placeholder_points')"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('goods.stock.exchange_status')" prop="exchange_status">
        <el-switch v-model="formData.exchange_status" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disabled" />
      </el-form-item>
      <el-form-item :label="$t('goods.stock.status')" prop="status">
        <el-switch v-model="formData.status" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disabled" />
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input v-model="formData.remark" :placeholder="$t('common.remark_placeholder')" type="textarea" clearable />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { stockSet } from '@/api/goods/stock';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { OPERATE_TYPE, STATUS_VALUE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { getJSON, syncObjectData } from '@/tools';
import { useDictOptions } from '@/hooks/dict';
import { storeLists } from '@/api/goods/store';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import { stockTypeLists } from '@/api/goods/stock-type';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('goods.stock.title_edit') : $t('goods.stock.title_add')));

const formTemp = {
  id: null,
  unique_number: '',
  stock_type_id: null,
  name: '',
  image: '',
  purchase_price: null,
  price: null,
  points: null,
  store_id: null,
  exchange_status: STATUS_VALUE.normal,
  unit: '',
  number: null,
  status: STATUS_VALUE.normal,
  remark: ''
};

const formData = reactive({ ...formTemp });

const { optionsData, refresh } = useDictOptions({ storeList: { api: storeLists }, typeList: { api: stockTypeLists } }, true);

const rules = {
  stock_type_id: [{ required: true, message: $t('goods.stock.field_check_type'), trigger: ['blur'] }],
  name: [{ required: true, message: $t('goods.stock.field_check_name'), trigger: ['blur'] }],
  image: [{ required: true, message: $t('goods.stock.field_check_image'), trigger: ['blur'] }],
  purchase_price: [{ required: true, message: $t('goods.stock.field_check_purchase_price'), trigger: ['blur'] }],
  price: [{ required: true, message: $t('goods.stock.field_check_price'), trigger: ['blur'] }],
  points: [{ required: true, message: $t('goods.stock.field_check_points'), trigger: ['blur'] }],
  store_id: [{ required: true, message: $t('goods.stock.field_check_store'), trigger: ['blur'] }],
  unit: [{ required: true, message: $t('goods.stock.field_check_unit'), trigger: ['blur'] }],
  number: [{ required: true, message: $t('goods.stock.field_check_number'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  refresh();
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
  await stockSet(params);
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
