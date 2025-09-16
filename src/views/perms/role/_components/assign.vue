<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :model="formData" label-width="100px">
      <el-checkbox-group v-model="formData.permission_ids">
        <template v-for="(item, index) in allDataPermsFormat" :key="index">
          <div v-if="!!item" class="mb-16">
            <div class="title fz-14 text-line-1_5">{{ item.name }}</div>
            <el-checkbox v-for="_item in item.items" :key="_item.id" :label="$ti(_item.name)" :value="_item.id" />
          </div>
        </template>
      </el-checkbox-group>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { roleDataPerms, roleDataPermsAssign, roleRoleDataPerms } from '@/api/perms/role';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, onBeforeMount, reactive, shallowRef } from 'vue';
import { QUERY_LIST_TYPE } from '@/values';
import layer from '@/tools/layer';
import { parseDict, syncObjectData } from '@/tools';
import { useDelay } from '@/hooks/delay';
import { DATA_PAGE_LIST } from '@/views/perms/data/_models';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const dataPageMap = parseDict(DATA_PAGE_LIST);

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();

const popupTitle = computed(() => $t('perms.role.assign_data_perms'));

const formTemp = { role_id: null, permission_ids: [] };
const formData = reactive({ ...formTemp });
const allDataPerms = shallowRef([]);

const allDataPermsFormat = computed(() => {
  const map = {};
  const list = allDataPerms.value ?? [];
  list.forEach((item) => {
    if (!map[item.apply_page]) map[item.apply_page] = { value: item.apply_page, name: dataPageMap[item.apply_page]?.name, items: [] };
    map[item.apply_page].items.push(item);
  });
  return [...DATA_PAGE_LIST].map((item) => {
    return map[item.value];
  });
});

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

// 打开
const open = async (row) => {
  layer.loading();
  const { selected_ids } = await roleRoleDataPerms({ role_id: row.id });
  layer.closeLoading();
  syncObjectData(formData, { role_id: row.id, permission_ids: selected_ids ?? [] });
  popupRef.value?.open();
  clearValidate();
};

// 获取所有数据权限
const getAllDataPerms = async () => {
  const { lists } = await roleDataPerms({ page_type: QUERY_LIST_TYPE.all });
  allDataPerms.value = lists;
};

// 提交
const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  await roleDataPermsAssign(formData);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

onBeforeMount(() => {
  getAllDataPerms();
});

defineExpose({ open });
</script>
