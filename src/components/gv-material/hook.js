import { ElMessage, ElTree } from 'element-plus';
import { reactive, ref, shallowRef } from 'vue';

import { fileCateAdd, fileCateDelete, fileCateEdit, fileCateLists, fileDelete, fileList, fileMove, fileRename } from '@/api/file';
import { usePaging } from '@/hooks/paging';
import layer from '@/tools/layer.js';
import { $t } from '@/lang/i18n';

// 左侧分组的钩子函数
export function useCate(type) {
  const treeRef = shallowRef();
  // 分组列表
  const cateLists = ref([]);

  // 选中的分组id
  const cateId = ref('');

  // 获取分组列表
  const getCateLists = async () => {
    const res = await fileCateLists({ page_type: 0, type });
    const item = [
      { name: $t('components.gv_material.cate_all'), id: '' },
      { name: $t('components.gv_material.cate_no'), id: 0 }
    ];
    cateLists.value = res.lists;
    cateLists.value.unshift(...item);
    setTimeout(() => {
      treeRef.value?.setCurrentKey(cateId.value);
    }, 0);
  };

  // 添加分组
  const handleAddCate = async (data) => {
    await fileCateAdd({ type, ...data });
    getCateLists();
  };

  // 编辑分组
  const handleEditCate = async (data) => {
    await fileCateEdit(data);
    getCateLists();
  };

  // 删除分组
  const handleDeleteCate = async (id, children) => {
    await layer.confirm($t('components.gv_material.cate_tips_confirm_delete'));
    await fileCateDelete({ id });
    cateId.value = '';
    getCateLists();
  };

  //选中分类
  const handleCatSelect = (item) => {
    cateId.value = item.id;
  };

  return { treeRef, cateId, cateLists, handleAddCate, handleEditCate, handleDeleteCate, getCateLists, handleCatSelect };
}

// 处理文件的钩子函数
export function useFile(cateId, type, limit, size) {
  const tableRef = shallowRef();
  const listShowType = ref('normal');
  const moveId = ref(0);
  const select = ref([]);
  const isCheckAll = ref(false);
  const isIndeterminate = ref(false);
  const fileParams = reactive({
    name: '',
    type: type,
    cid: cateId,
    source: ''
  });
  const { pager, getLists, reset } = usePaging({
    fetchFun: fileList,
    params: fileParams,
    firstLoading: true,
    size
  });

  const getFileList = () => {
    getLists();
  };
  const refresh = () => {
    reset();
  };

  const isSelect = (id) => {
    return !!select.value.find((item) => item.id === id);
  };

  const batchFileDelete = async (id) => {
    await layer.confirm($t('components.gv_material.file_tips_confirm_delete'));
    const ids = id ? id : select.value.map((item) => item.id);
    await fileDelete({ ids });
    getFileList();
    clearSelect();
  };

  const batchFileMove = async () => {
    const ids = select.value.map((item) => item.id);
    await fileMove({ ids, cid: moveId.value });
    moveId.value = 0;
    getFileList();
    clearSelect();
  };

  const selectFile = (item) => {
    const index = select.value.findIndex((items) => items.id === item.id);
    if (index !== -1) {
      select.value.splice(index, 1);
      return;
    }
    if (select.value.length === limit.value) {
      if (limit.value === 1) {
        select.value = [];
        select.value.push(item);
        return;
      }
      ElMessage.warning($t('components.gv_material.file_tips_selected_max'));
      return;
    }
    select.value.push(item);
  };

  const clearSelect = () => {
    select.value = [];
  };

  const cancelSelete = (id) => {
    select.value = select.value.filter((item) => item.id !== id);
  };

  const selectAll = (value) => {
    isIndeterminate.value = false;
    tableRef.value?.toggleAllSelection();
    if (value) {
      select.value = [...pager.lists];
      return;
    }
    clearSelect();
  };

  const handleFileRename = async (name, id) => {
    await fileRename({ id, name });
    getFileList();
  };
  return {
    listShowType,
    tableRef,
    moveId,
    pager,
    fileParams,
    select,
    isCheckAll,
    isIndeterminate,
    getFileList,
    refresh,
    batchFileDelete,
    batchFileMove,
    selectFile,
    isSelect,
    clearSelect,
    cancelSelete,
    selectAll,
    handleFileRename
  };
}
