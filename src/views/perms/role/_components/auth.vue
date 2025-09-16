<template>
  <gv-popup ref="popupRef" :title="$t('perms.role.assign_perms')" :async="true" width="500px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :model="formData" v-loading="loading">
      <el-scrollbar>
        <el-form-item prop="menu_id">
          <div class="w-full ml-16 mr-16">
            <el-checkbox :label="$t('perms.role.label_expand_fold')" @change="handleExpand" />
            <el-checkbox :label="$t('perms.role.label_selected_all')" @change="handleSelectAll" />
            <el-checkbox v-model="checkStrictly" :label="$t('perms.role.label_parent_child')" />
            <div>
              <el-tree
                ref="treeRef"
                :data="menuTree"
                :props="treeProps"
                :check-strictly="!checkStrictly"
                node-key="id"
                :default-expand-all="isExpand"
                show-checkbox
              >
                <template #default="{ node, data }">
                  <span>{{ $t(node.label) }}</span>
                </template>
              </el-tree>
            </div>
          </div>
        </el-form-item>
      </el-scrollbar>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { menuAll } from '@/api/perms/menu';
import { roleEdit } from '@/api/perms/role';
import GvPopup from '@/components/gv-popup/index.vue';
import { syncObjectData, treeToArray } from '@/tools';
import { nextTick, reactive, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { $t } from '@/lang/i18n';

const treeProps = { label: 'name', children: 'children' };
const emit = defineEmits(['success', 'close']);
const treeRef = shallowRef();
const formRef = shallowRef();
const popupRef = shallowRef();
const isExpand = ref(false);
const checkStrictly = ref(true);
const loading = ref(false);
const menuArray = shallowRef([]);
const menuTree = shallowRef([]);
const formTemp = { id: null, name: '', desc: '', sort: 0, menu_id: [] };
const formData = reactive({ ...formTemp });

const open = async (row) => {
  getOptions();
  syncObjectData(formData, row);
  popupRef.value?.open();
};

// 获取选项参数
const getOptions = async () => {
  loading.value = true;
  const res = await menuAll();
  menuTree.value = res;
  menuArray.value = treeToArray(res);
  await nextTick();
  setDeptAllCheckedKeys();
  loading.value = false;
};

// 获取所有选择的节点包括半选中节点
const getDeptAllCheckedKeys = () => {
  const checkedKeys = treeRef.value?.getCheckedKeys();
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys();
  checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
};

// 设置选项
const setDeptAllCheckedKeys = () => {
  formData.menu_id.forEach((v) => {
    nextTick(() => {
      treeRef.value?.setChecked(v, true, false);
    });
  });
};

// 打开树
const handleExpand = (check) => {
  const treeList = menuTree.value;
  for (let i = 0; i < treeList.length; i++) {
    treeRef.value.store.nodesMap[treeList[i].id].expanded = check;
  }
};

// 选择所有
const handleSelectAll = (check) => {
  if (check) {
    treeRef.value?.setCheckedKeys(menuArray.value.map((item) => item.id));
  } else {
    treeRef.value?.setCheckedKeys([]);
  }
};

// 提交
const handleSubmit = async () => {
  await formRef.value?.validate();
  formData.menu_id = getDeptAllCheckedKeys();
  layer.loading();
  await roleEdit(formData);
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
