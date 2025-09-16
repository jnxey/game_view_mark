<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
      <el-form-item :label="$t('perms.menu.type')" prop="type" required>
        <el-radio-group v-model="formData.type">
          <el-radio class="custom-radio" v-for="item in MENU_ENUM_TYPE_DICT" :value="item.value">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('perms.menu.parent')" prop="pid">
        <el-tree-select
          class="flex-1"
          v-model="formData.pid"
          :data="menuOptions"
          clearable
          node-key="id"
          :props="{ label: 'name' }"
          :default-expand-all="true"
          :placeholder="$t('perms.menu.placeholder_parent')"
          check-strictly
        >
          <template #label="{ label }">
            <span>{{ $t(label) }}</span>
          </template>
          <template #default="{ node }">
            <span>{{ $t(node.label) }}</span>
          </template>
        </el-tree-select>
      </el-form-item>
      <el-form-item :label="$t('perms.menu.name')" prop="name">
        <el-select class="flex-1" v-model="formData.name" clearable filterable :placeholder="$t('perms.menu.placeholder_name')">
          <el-option v-for="(item, index) in menuNameList" :key="index" :label="item.name" :value="item.value">
            {{ item.name }}
            <span class="text-placeholder">({{ item.value }})</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.type !== MENU_ENUM_TYPE.BUTTON" :label="$t('perms.menu.icon')" prop="icon">
        <gv-picker class="flex-1" v-model="formData.icon" />
      </el-form-item>
      <el-form-item v-if="formData.type !== MENU_ENUM_TYPE.BUTTON" :label="$t('perms.menu.path')" prop="paths">
        <div class="flex-1 flex-col justify-start">
          <el-input v-model="formData.paths" :placeholder="$t('perms.menu.placeholder_path')" clearable />
          <div class="text-tips">{{ $t('perms.menu.tips_path') }}</div>
        </div>
      </el-form-item>
      <el-form-item v-if="formData.type === MENU_ENUM_TYPE.MENU" :label="$t('perms.menu.component')" prop="component">
        <div class="flex-1 flex-col justify-start">
          <el-autocomplete
            class="w-full"
            v-model="formData.component"
            :fetch-suggestions="querySearch"
            clearable
            :placeholder="$t('perms.menu.placeholder_component')"
          />
          <div class="text-tips">{{ $t('perms.menu.tips_component') }}</div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('perms.menu.selected')" prop="selected" v-if="formData.type === MENU_ENUM_TYPE.MENU">
        <div class="flex-1 flex-col justify-start">
          <el-input v-model="formData.selected" :placeholder="$t('perms.menu.placeholder_selected')" clearable />
          <div class="text-tips">{{ $t('perms.menu.tips_selected') }}</div>
        </div>
      </el-form-item>
      <el-form-item v-if="formData.type !== MENU_ENUM_TYPE.CATALOGUE" :label="$t('perms.menu.perms')" prop="perms">
        <div class="flex-1 flex-col justify-start">
          <gv-select-perms class="w-full" v-model="formData.perms" />
          <div class="text-tips">{{ $t('perms.menu.tips_perms') }}</div>
        </div>
      </el-form-item>
      <el-form-item v-if="formData.type === MENU_ENUM_TYPE.MENU" :label="$t('perms.menu.params')" prop="params">
        <div class="flex-1 flex-col justify-start">
          <el-input v-model="formData.params" :placeholder="$t('perms.menu.placeholder_params')" clearable />
          <div class="text-tips">{{ $t('perms.menu.tips_params') }}</div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('common.sort')" prop="sort">
        <div class="flex-1 flex-col justify-start">
          <el-input-number class="w-full" v-model="formData.sort" :min="0" :max="Number.MAX_SAFE_INTEGER" controls-position="right" />
          <div class="text-tips">{{ $t('common.sort_tips') }}</div>
        </div>
      </el-form-item>
      <el-form-item v-if="formData.type !== MENU_ENUM_TYPE.BUTTON" :label="$t('perms.menu.is_show')" prop="is_show" required>
        <div class="flex-1 flex-col justify-start">
          <el-radio-group v-model="formData.is_show">
            <el-radio class="custom-radio" v-for="item in SHOW_VALUE_DICT" :value="item.value">{{ item.name }}</el-radio>
          </el-radio-group>
          <div class="text-tips">{{ $t('perms.menu.tips_is_show') }}</div>
        </div>
      </el-form-item>
      <el-form-item v-if="formData.type !== MENU_ENUM_TYPE.BUTTON" :label="$t('common.status')" prop="is_disable" required>
        <div class="flex-1 flex-col justify-start">
          <el-radio-group v-model="formData.is_disable">
            <el-radio class="custom-radio" v-for="item in STATUS_VALUE_DICT" :value="item.value">{{ item.name }}</el-radio>
          </el-radio-group>
          <div class="text-tips">{{ $t('perms.menu.tips_status') }}</div>
        </div>
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { menuAdd, menuDetail, menuEdit, menuLists } from '@/api/perms/menu';
import GvPopup from '@/components/gv-popup/index.vue';
import { getModulesKey } from '@/router';
import { arrayToTree, syncObjectData, treeToArray } from '@/tools';
import { MENU_ENUM_TYPE, MENU_ENUM_TYPE_DICT } from '@/values/menu';
import { computed, reactive, ref, shallowRef } from 'vue';
import { OPERATE_TYPE, SYSTEM_PARENT_TOP, QUERY_LIST_TYPE, SHOW_VALUE_DICT, CACHE_VALUE_DICT, STATUS_VALUE_DICT } from '@/values';
import { menuEditFormTemp } from './_models';
import GvPicker from '@/components/gv-icon/picker.vue';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import GvSelectPerms from '@/components/gv-select-perms/index.vue';
import { $t } from '@/lang/i18n';
import { language } from '@/lang';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);
const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('perms.menu.title_edit') : $t('perms.menu.title_add')));

const componentsOptions = ref(getModulesKey());

const menuOptions = ref([]);

const formData = reactive({ ...menuEditFormTemp });

const formRules = {
  pid: [{ required: true, message: $t('perms.menu.field_check_parent'), trigger: ['blur', 'change'] }],
  name: [{ required: true, message: $t('perms.menu.field_check_parent'), trigger: 'blur' }],
  paths: [{ required: true, message: $t('perms.menu.field_check_path'), trigger: 'blur' }],
  component: [{ required: true, message: $t('perms.menu.field_check_component'), trigger: 'blur' }]
};

const menuNameList = computed(() => {
  const result = [];
  const menuMap = language.menu ?? {};
  if (formData.type === MENU_ENUM_TYPE.CATALOGUE) {
    Object.keys(menuMap.directory).forEach((p) => {
      result.push({ name: menuMap.directory[p], value: `menu.directory.${p}` });
    });
  } else if (formData.type === MENU_ENUM_TYPE.MENU) {
    Object.keys(menuMap.page).forEach((p) => {
      result.push({ name: menuMap.page[p], value: `menu.page.${p}` });
    });
  } else if (formData.type === MENU_ENUM_TYPE.BUTTON) {
    Object.keys(menuMap.button).forEach((p) => {
      result.push({ name: menuMap.button[p], value: `menu.button.${p}` });
    });
  }
  return result;
});

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

// 打开
const open = async (type, row) => {
  mode.value = type;
  getMenu();
  if (type === OPERATE_TYPE.update) {
    layer.loading();
    const data = await menuDetail({ id: row.id });
    layer.closeLoading();
    syncObjectData(formData, data);
  } else {
    syncObjectData(formData, { ...menuEditFormTemp, ...row });
  }
  popupRef.value?.open();
  clearValidate();
};

// 搜索组件路径
const querySearch = (queryString, cb) => {
  const results = queryString
    ? componentsOptions.value.filter((item) => item.toLowerCase().includes(queryString.toLowerCase()))
    : componentsOptions.value;
  cb(results.map((item) => ({ value: item })));
};

// 获取菜单路径
const getMenu = async () => {
  const res = await menuLists({ page_type: QUERY_LIST_TYPE.all });
  const data = res || {};
  const menu = { id: SYSTEM_PARENT_TOP, name: $t('perms.menu.level_top'), children: [] };
  menu.children = arrayToTree(treeToArray(data.lists).filter((item) => item.type !== MENU_ENUM_TYPE.BUTTON));
  menuOptions.value.push(menu);
};

// 提交
const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  mode.value === OPERATE_TYPE.update ? await menuEdit(formData) : await menuAdd(formData);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => emit('close');

defineExpose({ open });
</script>
