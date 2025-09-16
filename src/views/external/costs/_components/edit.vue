<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="580px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="150px">
      <el-form-item :label="$t('external.costs.images')" prop="images">
        <gv-material-picker custom-class="w-full" v-model="formData.images" :limit="6" />
        <div class="text-tips">{{ $t('external.costs.tips_images') }}</div>
      </el-form-item>
      <el-form-item :label="$t('external.costs.user')" prop="user_id">
        <div class="w-full flex-row align-center">
          <el-input :model-value="formData.username" :placeholder="$t('common.empty')" class="flex-1" readonly>
            <template #append v-if="!!formData.user_id">
              <el-button icon="Delete" @click="clearParent" />
            </template>
          </el-input>
          <el-button class="ml-12 w-80" type="primary" icon="User" @click="selectUser">{{ $t('common.select') }}</el-button>
        </div>
      </el-form-item>
      <el-form-item :label="$t('external.costs.telephone')" prop="telephone">
        <el-input v-model="formData.telephone" :placeholder="$t('external.costs.placeholder_telephone')" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.costs.number_people')" prop="number_people">
        <el-input-number
          v-model="formData.number_people"
          :placeholder="$t('external.costs.placeholder_number_people')"
          class="w-full"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item :label="$t('external.costs.consume_type')" prop="external_consume_type_id">
        <gv-select-options
          v-model="formData.external_consume_type_id"
          :placeholder="$t('external.costs.placeholder_consume_type')"
          :options="optionsData.consumeType"
        />
      </el-form-item>
      <el-form-item :label="$t('external.costs.address')" prop="address">
        <el-input v-model="formData.address" :placeholder="$t('external.costs.placeholder_address')" type="textarea" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.costs.shop_telephone')" prop="shop_telephone">
        <el-input v-model="formData.shop_telephone" :placeholder="$t('external.costs.placeholder_shop_telephone')" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.costs.currency_config')" prop="currency_config_id">
        <gv-select-currency-config
          v-model="formData.currency_config_id"
          :params="{ type: CURRENCY_TYPE.cash }"
          :placeholder="$t('external.costs.placeholder_currency_config')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('external.costs.money')" prop="money">
        <el-input-number
          v-model="formData.money"
          :placeholder="$t('external.costs.placeholder_money')"
          class="w-full"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item :label="$t('external.costs.accompanying')" prop="accompanying">
        <el-input v-model="formData.accompanying" :placeholder="$t('external.costs.placeholder_accompanying')" type="textarea" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.costs.type')" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio class="custom-radio" v-for="item in COST_TYPE_DICT" :disabled="item.value !== COST_TYPE.public" :value="item.value">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('external.costs.consume_time')" prop="consume_time">
        <gv-date-picker v-model="formData.consume_time" class="flex-1" />
      </el-form-item>
      <el-form-item :label="$t('external.costs.remark')" prop="remark">
        <el-input v-model="formData.remark" :placeholder="$t('external.costs.placeholder_remark')" type="textarea" clearable />
      </el-form-item>
    </el-form>
  </gv-popup>
  <gv-select-user ref="selectUserRef" @success="setUser" />
</template>
<script setup>
import { externalCostsSet } from '@/api/external/costs';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { COST_TYPE, COST_TYPE_DICT, CURRENCY_TYPE, OPERATE_TYPE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { getJSON, resolveServerTime, syncObjectData } from '@/tools';
import GvSelectUser from '@/components/gv-select-user/index.vue';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import { useDictOptions } from '@/hooks/dict';
import { externalConsumeTypeLists } from '@/api/external/consume-type';
import GvDatePicker from '@/components/gv-date-picker/index.vue';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import { $t } from '@/lang/i18n';
import GvSelectOptions from '@/components/gv-select-options/index.vue';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const selectUserRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('external.costs.title_edit') : $t('external.costs.title_add')));

const formTemp = {
  id: null,
  user_id: null,
  username: '',
  telephone: '',
  number_people: null,
  external_consume_type_id: null,
  address: '',
  shop_telephone: '',
  images: null,
  currency_config_id: null,
  money: 0,
  accompanying: '',
  type: COST_TYPE.public,
  consume_time: resolveServerTime(Date.now()),
  remark: ''
};

const formData = reactive({ ...formTemp });

const { optionsData, refresh } = useDictOptions(
  {
    consumeType: { api: externalConsumeTypeLists }
  },
  true
);

const rules = {
  user_id: [{ required: true, message: $t('external.costs.field_check_user'), trigger: ['blur'] }],
  currency_config_id: [{ required: true, message: $t('external.costs.field_check_currency_config'), trigger: ['blur'] }],
  money: [{ required: true, message: $t('external.costs.field_check_money'), trigger: ['blur'] }],
  consume_time: [{ required: true, message: $t('external.costs.field_check_consume_time'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  refresh();
  mode.value = type;
  if (type === OPERATE_TYPE.update) syncObjectData(formData, { ...row, images: getJSON(row.images, []) });
  else syncObjectData(formData, { ...formTemp, money: null, images: [] });
  popupRef.value?.open();
  clearValidate();
};

// 清空
const clearParent = () => {
  formData.user_id = null;
  formData.username = '';
};

// 选择
const selectUser = () => {
  selectUserRef.value?.open();
};

// 设置
const setUser = (row) => {
  formData.user_id = row.id;
  formData.username = row.username;
  formData.telephone = row.contact;
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  const params = { ...formData, images: JSON.stringify(formData.images) };
  layer.loading();
  await externalCostsSet(params);
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
