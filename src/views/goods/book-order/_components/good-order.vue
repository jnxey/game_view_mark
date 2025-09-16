<template>
  <gv-popup ref="popupRef" :title="$t('goods.book_order.title_order')" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="100px">
      <el-form-item :label="$t('goods.book_order.label_type')" prop="guest_type" required>
        <el-radio-group v-model="formData.guest_type" @change="clearUser">
          <el-radio class="custom-radio" v-for="item in GUEST_TYPE_DICT" :value="item.value">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('goods.book_order.label_person')" prop="username">
        <!--        -->
        <template v-if="!!defUsername[formData.guest_type]">
          <el-radio-group v-model="formData.username">
            <el-radio class="custom-radio mb-8" v-for="item in defUsername[formData.guest_type]" :value="item">{{ item }}</el-radio>
          </el-radio-group>
        </template>
        <!---->
        <template v-else>
          <div v-if="formData.guest_type === GUEST_TYPE.member" class="flex-1 flex-row align-center">
            <el-input :model-value="formData.username" :placeholder="$t('common.empty')" class="flex-1" readonly>
              <template #append v-if="!!formData.username">
                <el-button icon="Delete" @click="clearUser" />
              </template>
            </el-input>
            <el-button class="ml-12 w-80" type="primary" icon="User" v-trim @click="selectUser">{{ $t('common.select') }}</el-button>
          </div>
          <el-input v-else v-model="formData.username" :placeholder="$t('goods.book_order.placeholder_person')" clearable />
        </template>
      </el-form-item>
      <el-form-item :label="$t('goods.book_order.label_address')" prop="address">
        <el-input v-model="formData.address" :placeholder="$t('goods.book_order.placeholder_address')" v-trim clearable />
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input v-model="formData.remark" :placeholder="$t('common.remark_placeholder')" v-trim type="textarea" />
      </el-form-item>
    </el-form>
  </gv-popup>
  <gv-select-user ref="selectUserRef" @success="setUser" />
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { inject, reactive, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import { stockOrderSet } from '@/api/goods/stock-order';
import { GUEST_TYPE, GUEST_TYPE_DICT } from '@/values';
import GvSelectUser from '@/components/gv-select-user/index.vue';
import { $t } from '@/lang/i18n';

const selected = inject('selected');
const refresh = inject('refresh');
const refreshRecordData = inject('refreshRecordData');
const clearGood = inject('clearGood');
const defUsername = inject('defUsername');
const defAddress = inject('defAddress');

const formRef = shallowRef();
const popupRef = shallowRef();
const selectUserRef = shallowRef();

const formTemp = { guest_type: GUEST_TYPE.normal, username: '', address: '', remark: '' };

const formData = reactive({ ...formTemp });

const rules = {
  username: [{ required: true, message: $t('goods.book_order.field_check_user'), trigger: ['blur'] }],
  address: [{ required: true, message: $t('goods.book_order.field_check_address'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async () => {
  const defParams = {};
  if (!!defAddress) defParams.address = defAddress.value;
  syncObjectData(formData, { ...formTemp, ...defParams });
  popupRef.value?.open();
  clearValidate();
};

// 选择上级
const selectUser = () => {
  selectUserRef.value?.open();
};

// 设置上级
const setUser = (row) => {
  formData.username = row.username;
};

// 清空用户选项
const clearUser = () => {
  formData.username = '';
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  const params = selected.map((item) => {
    return {
      username: formData.username,
      address: formData.address,
      remark: formData.remark,
      guest_type: formData.guest_type,
      number: item.number,
      stock_id: item.stock_id
    };
  });
  await stockOrderSet(params);
  layer.closeLoading();
  layer.msgSuccess($t('goods.book_order.order_success'));
  refresh();
  if (!!refreshRecordData) refreshRecordData();
  clearGood();
  popupRef.value?.close();
};

const handleClose = () => {};

defineExpose({ open });
</script>
