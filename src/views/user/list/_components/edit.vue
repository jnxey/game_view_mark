<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="650px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="150px">
      <el-form-item :label="$t('user.list.avatar')" prop="avatar">
        <gv-material-picker custom-class="w-full" v-model="formData.avatar" :limit="6" />
        <div class="text-tips">{{ $t('user.list.tips_avatar') }}</div>
      </el-form-item>
      <el-form-item :label="$t('user.list.username')" prop="username">
        <el-input
          class="flex-1"
          v-trim
          v-model="formData.username"
          :placeholder="$t('user.list.placeholder_username')"
          :readonly="mode === OPERATE_TYPE.update"
        >
          <template #append v-if="mode !== OPERATE_TYPE.update">
            <el-button v-if="isChecking" icon="Loading" />
            <el-tooltip v-else :content="$t('user.list.btn_random_username')">
              <el-button icon="Refresh" @click="randomGeneration" />
            </el-tooltip>
          </template>
        </el-input>
        <gv-icon
          v-if="checkingStatus === CHECK_STATUS_DICT.success"
          class="fz-20 ml-12"
          style="color: var(--el-color-success)"
          name="el-icon-success-filled"
        />
        <gv-icon
          v-if="checkingStatus === CHECK_STATUS_DICT.error"
          class="fz-20 ml-12"
          style="color: var(--el-color-danger)"
          name="el-icon-circle-close-filled"
        />
      </el-form-item>
      <el-form-item :label="$t('user.list.nickname')" prop="nickname">
        <el-input v-trim v-model="formData.nickname" :placeholder="$t('user.list.placeholder_nickname')" clearable />
      </el-form-item>
      <template v-if="mode !== OPERATE_TYPE.update">
        <el-form-item :label="$t('user.list.password')" prop="user_password">
          <el-input v-trim v-model="formData.user_password" show-password :placeholder="$t('user.list.placeholder_password')" />
        </el-form-item>
        <el-form-item :label="$t('user.list.password2')" prop="user_password2">
          <el-input v-trim v-model="formData.user_password2" show-password :placeholder="$t('user.list.placeholder_password2')" />
        </el-form-item>
      </template>
      <el-form-item :label="$t('user.list.parent')" prop="pid">
        <div class="w-full flex-row align-center">
          <el-input :model-value="formData.pid_user?.username" :placeholder="$t('common.empty')" class="flex-1" readonly>
            <template #append v-if="!!formData.pid && mode === OPERATE_TYPE.insert">
              <el-button icon="Delete" @click="clearParent" />
            </template>
          </el-input>
          <el-button class="ml-12 w-120" type="primary" icon="User" @click="selectParent" v-if="mode === OPERATE_TYPE.insert">
            {{ $t('common.select') }}
          </el-button>
        </div>
        <div class="w-full text-tips">{{ $t('user.list.tips_pid') }}</div>
      </el-form-item>
      <el-form-item :label="$t('user.list.level')" prop="level_id">
        <gv-select-options
          class="w-full"
          v-model="formData.level_id"
          :placeholder="$t('user.list.placeholder_user_level')"
          :options="optionsData.dimension?.user_level"
          :empty-page="{ perm: permsMap.user.level.view, title: $t('user.list.level') }"
        />
      </el-form-item>
      <el-form-item :label="$t('user.list.user_type')" prop="user_type_id">
        <gv-select-options
          class="w-full"
          v-model="formData.user_type_id"
          :placeholder="$t('user.list.placeholder_user_type')"
          :options="optionsData.dimension?.user_type"
          :empty-page="{ perm: permsMap.user.type.view, title: $t('user.list.user_type') }"
        />
      </el-form-item>
      <el-form-item :label="$t('user.list.gender')" prop="gender">
        <el-radio-group v-model="formData.gender">
          <el-radio class="custom-radio" v-for="item in SEX_VALUE_DICT" :value="item.value">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('user.list.birthday')" prop="birthday">
        <el-date-picker
          v-model="formData.birthday"
          class="flex-1"
          type="date"
          :value-format="getTimeFormat('day')"
          :placeholder="$t('user.list.placeholder_birthday')"
        />
      </el-form-item>
      <el-form-item :label="$t('user.list.contact')" prop="contact">
        <el-input v-trim v-model="formData.contact" :placeholder="$t('user.list.placeholder_contact')" clearable />
      </el-form-item>
      <el-form-item :label="$t('user.list.address')" prop="address">
        <el-input v-trim v-model="formData.address" :placeholder="$t('user.list.placeholder_address')" clearable type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('user.list.permissions_desc')" prop="permissions_desc">
        <el-input v-trim v-model="formData.permissions_desc" :placeholder="$t('user.list.placeholder_permissions_desc')" clearable type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('user.list.information_desc')" prop="information_desc">
        <el-input v-trim v-model="formData.information_desc" :placeholder="$t('user.list.placeholder_information_desc')" clearable type="textarea" />
      </el-form-item>
      <!--      <el-form-item :label="$t('user.list.cost_rate')" prop="cost_rate">-->
      <!--        <div class="flex-1 flex-col justify-start">-->
      <!--          <el-input-number v-model="formData.cost_rate" :min="0" :max="100" controls-position="right" class="w-full">-->
      <!--            <template #suffix>%</template>-->
      <!--          </el-input-number>-->
      <!--          <div class="text-tips">{{ $t('user.list.tips_cost_rate') }}</div>-->
      <!--        </div>-->
      <!--      </el-form-item>-->
      <el-form-item :label="$t('user.list.deposit')" prop="deposit">
        <div class="g-table w-full">
          <template v-for="currency in optionsData.currency" :key="currency.id">
            <div class="g-table-item title">{{ $ti(currency.name) }}</div>
          </template>
        </div>
        <div class="g-table w-full">
          <template v-for="(currency, index) in optionsData.currency" :key="currency.id">
            <div class="g-table-item" v-if="!!formData.deposit[index]">
              <gv-input-amount-placeholder
                v-model="formData.deposit[index].deposit"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                placeholder=""
                :controls="false"
                class="w-full"
              >
                <template #suffix>
                  <span>{{ currency.icon }}</span>
                </template>
              </gv-input-amount-placeholder>
            </div>
          </template>
        </div>
      </el-form-item>
      <el-form-item :label="$t('user.list.buka')" v-if="mode === OPERATE_TYPE.update">
        <div class="g-table w-full">
          <template v-for="currency in optionsData.currency" :key="currency.id">
            <div class="g-table-item title">{{ $ti(currency.name) }}</div>
          </template>
        </div>
        <div class="g-table w-full">
          <template v-for="(currency, index) in optionsData.currency" :key="currency.id">
            <div class="g-table-item" v-if="!!bukaList[index]">{{ currency.icon }} {{ bukaList[index].fee }}</div>
          </template>
        </div>
      </el-form-item>
      <el-form-item :label="$t('user.list.code_washing_type')" prop="code_washing_type">
        <el-radio-group v-model="formData.code_washing_type">
          <el-radio class="custom-radio" v-for="item in WASHING_TYPE_DICT" :value="item.value">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </gv-popup>
  <gv-select-user ref="selectUserRef" :selected="currentUser" @success="setParent" />
</template>
<script setup>
import { userCheckRepeat, userDimension, userDetail, userSet } from '@/api/user/list';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, nextTick, reactive, ref, shallowRef } from 'vue';
import { OPERATE_TYPE, SEX_VALUE_DICT, SYSTEM_PARENT_TOP, WASHING_TYPE, WASHING_TYPE_DICT } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { generateRandomString, getJSON, getTimeFormat, syncObjectData, toAwait } from '@/tools';
import GvIcon from '@/components/gv-icon/index.vue';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import { useDictOptions } from '@/hooks/dict';
import { currencyBaseLists } from '@/api/currency/base';
import GvSelectUser from '@/components/gv-select-user/index.vue';
import { useCheckSecPassword } from '@/hooks/password';
import GvInputAmountPlaceholder from '@/components/gv-input-amount/placeholder.vue';
import { userLevelLists } from '@/api/user/level';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { userTypeLists } from '@/api/user/type';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const CHECK_STATUS_DICT = { success: 'success', error: 'error' };
const DEFAULT_PASSWORD = '888888';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const selectUserRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);
const checkingStatus = ref();
const isChecking = ref(false);
const bukaList = ref([]);

const formTemp = {
  id: null,
  username: '',
  user_password: null,
  user_password2: null,
  nickname: '',
  avatar: '',
  gender: 0,
  birthday: '',
  contact: '',
  address: '',
  user_type_id: null,
  level_id: null,
  pid: SYSTEM_PARENT_TOP,
  pid_user: null,
  permissions_desc: '',
  information_desc: '',
  deposit: [],
  cost_rate: null,
  code_washing_type: WASHING_TYPE.loser
};

const formData = reactive({ ...formTemp });

const popupTitle = computed(() =>
  mode.value === OPERATE_TYPE.update ? $t('user.list.title_edit', { username: formData.username }) : $t('user.list.title_add')
);

// 校验二次密码
const passwordConfirmValidator = useCheckSecPassword(() => formData.user_password);

const rules = {
  username: [
    { required: true, message: $t('user.list.field_check_username'), trigger: ['blur'] },
    {
      validator: async (rule, value, callback) => {
        if (mode.value === OPERATE_TYPE.update) return callback();
        if (!value) callback(new Error($t('user.list.field_check_username')));
        isChecking.value = true;
        const [res, err] = await toAwait(userCheckRepeat({ repeat_field: 'username', value: value }));
        isChecking.value = false;
        if (err) {
          checkingStatus.value = CHECK_STATUS_DICT.error;
          return callback(new Error($t('user.list.field_check_username_fail')));
        } else if (!!res) {
          checkingStatus.value = CHECK_STATUS_DICT.error;
          return callback(new Error($t('user.list.field_check_username_used')));
        } else {
          checkingStatus.value = CHECK_STATUS_DICT.success;
          return callback();
        }
      },
      trigger: ['blur']
    }
  ],
  user_password: [{ required: true, message: $t('user.list.field_check_password'), trigger: ['blur'] }],
  user_password2: [{ validator: passwordConfirmValidator, trigger: ['blur'] }]
};

const currentUser = computed(() => {
  if (formData.id) {
    return { [formData.id]: true };
  } else {
    return {};
  }
});

const { optionsData, refresh } = useDictOptions({ dimension: { api: userDimension }, currency: { api: currencyBaseLists } }, true);

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  layer.loading();
  await refresh();
  initContext();
  mode.value = type;
  if (type === OPERATE_TYPE.update) {
    const data = await userDetail({ user_id: row.id, attr_name: 'all' });
    layer.closeLoading();
    const deposit = initDeposit(data.deposit);
    bukaList.value = initBukaList(data.buka);
    syncObjectData(formData, { ...data, deposit: deposit, avatar: getJSON(data?.avatar, []) });
  } else {
    layer.closeLoading();
    const password = { user_password: DEFAULT_PASSWORD, user_password2: DEFAULT_PASSWORD };
    const deposit = initDeposit();
    bukaList.value = initBukaList();
    syncObjectData(formData, { ...formTemp, ...password, deposit: deposit, avatar: [], ...row });
  }
  popupRef.value?.open();
  clearValidate();
};

// 初始化部分上下文
const initContext = () => {
  isChecking.value = false;
  checkingStatus.value = null;
};

// 初始化 押金列表
const initDeposit = (old = []) => {
  const currency = optionsData.currency ?? [];
  const oldMap = {};
  old.forEach((item) => (oldMap[item.currency_id] = item));
  return currency.map((item) => {
    const newValue = { deposit: 0, currency_id: item.id };
    if (oldMap[item.id]) {
      return syncObjectData({ ...newValue, id: null }, { ...oldMap[item.id] });
    } else {
      return { ...newValue };
    }
  });
};

// 初始化 补卡费
const initBukaList = (old = []) => {
  const currency = optionsData.currency ?? [];
  const oldMap = {};
  old.forEach((item) => {
    if (!!oldMap[item.currency_id]) {
      oldMap[item.currency_id].fee = Number(oldMap[item.currency_id].fee) + Number(item.fee);
    } else {
      oldMap[item.currency_id] = item;
    }
  });
  return currency.map((item) => {
    const newValue = { fee: 0, currency_id: item.id };
    if (oldMap[item.id]) {
      return syncObjectData(newValue, { ...oldMap[item.id] });
    } else {
      return { ...newValue };
    }
  });
};

// 清空上级
const clearParent = () => {
  formData.pid = SYSTEM_PARENT_TOP;
  formData.pid_user = {};
};

// 选择上级
const selectParent = () => {
  selectUserRef.value?.open();
};

// 设置上级
const setParent = (row) => {
  formData.pid = row.id;
  formData.pid_user = { id: row.id, username: row.username };
};

// 随机生成卡号
const randomGeneration = async () => {
  formData.username = generateRandomString(6, '0123456789');
  await nextTick();
  formRef.value?.validateField(['username']);
};

// 提交
const handleSubmit = async () => {
  await formRef.value?.validate();
  const params = { ...formData, avatar: JSON.stringify(formData.avatar) };
  layer.loading();
  const res = await userSet(params);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success', { mode: mode.value, data: res });
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.g-table {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .g-table-item {
    box-sizing: border-box;
    width: 80px;
    padding: 5px;
    text-align: center;

    ::v-deep(.el-input__wrapper) {
      padding-left: 5px;
      padding-right: 5px;
    }

    &.title {
      padding: 0 5px;
      font-weight: bold;
    }
  }
}
</style>
