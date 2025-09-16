<template>
  <div class="material flex-row h-full" v-loading="pager.loading">
    <!--  左侧  -->
    <div class="material__left h-full flex-col w-200">
      <!--  分组    -->
      <div class="flex-1">
        <el-scrollbar>
          <div class="material-left__content mt-12 mb-12">
            <el-tree
              ref="treeRef"
              node-key="id"
              :data="cateLists"
              empty-text=""
              :highlight-current="true"
              :expand-on-click-node="false"
              :current-node-key="cateId"
              @node-click="handleCatSelect"
            >
              <template v-slot="{ data }">
                <div class="flex-row flex-1 align-center mr-4">
                  <img class="w-20 h-16 mr-4" src="@/assets/images/layout/icon_folder.png" alt="" />
                  <span class="flex-1 truncate mr-4">
                    <gv-overflow-tooltip :content="data.name" />
                  </span>
                  <el-dropdown v-if="data.id > 0" :hide-on-click="false">
                    <span class="muted mr-12">···</span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="openEditCate(data)">{{ $t('components.gv_material.cate_edit') }}</el-dropdown-item>
                        <el-dropdown-item @click="openAddCate(data.id)">{{ $t('components.gv_material.cate_add') }}</el-dropdown-item>
                        <el-dropdown-item @click="handleDeleteCate(data.id, data?.children?.length)">
                          {{ $t('components.gv_material.cate_del') }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </div>
      <div class="flex-row justify-end m-4">
        <el-button icon="Plus" @click="openAddCate()">{{ $t('components.gv_material.cate_add') }}</el-button>
      </div>
    </div>
    <!--  中心  -->
    <div class="material__center h-full flex-col ml-12 mr-12">
      <!--  工具栏    -->
      <div class="operate-btn flex-row">
        <div class="flex-1 flex-row">
          <gv-upload v-if="type === 'image'" class="mr-4" :data="{ cid: cateId }" :type="type" :show-progress="true" @change="refresh">
            <el-button type="primary" :disabled="cateId === ''">{{ $t('components.gv_material.file_upload_local') }}</el-button>
          </gv-upload>
          <gv-upload v-if="type === 'video'" class="mr-4" :data="{ cid: cateId }" :type="type" :show-progress="true" @allSuccess="refresh">
            <el-button type="primary" :disabled="cateId === ''">{{ $t('components.gv_material.file_upload_local') }}</el-button>
          </gv-upload>
          <gv-upload v-if="type === 'file'" class="mr-4" :data="{ cid: cateId }" :type="type" :show-progress="true" @allSuccess="refresh">
            <el-button type="primary" :disabled="cateId === ''">{{ $t('components.gv_material.file_upload_local') }}</el-button>
          </gv-upload>
          <el-button v-if="mode === 'page'" class="mr-4" :disabled="!select.length" @click.stop="batchFileDelete()">
            {{ $t('common.del_btn') }}
          </el-button>
          <gv-popup v-if="mode === 'page'" @confirm="batchFileMove" :disabled="!select.length" :title="$t('components.gv_material.file_move')">
            <template #trigger>
              <el-button class="mr-4" :disabled="!select.length">{{ $t('components.gv_material.file_move') }}</el-button>
            </template>
            <div class="mb-8">{{ $t('components.gv_material.file_move_to') }}</div>
            <el-select v-model="moveId" :placeholder="$t('components.gv_material.file_placeholder_select')" class="w-full">
              <template v-for="item in cateLists" :key="item.id">
                <el-option v-if="item.id !== ''" :label="item.name" :value="item.id"></el-option>
              </template>
            </el-select>
          </gv-popup>
          <el-input
            class="w-280 mr-4"
            :placeholder="$t('components.gv_material.file_placeholder_name')"
            v-trim
            v-model="fileParams.name"
            @keyup.enter="refresh"
          >
            <template #append>
              <el-button @click="refresh">
                <template #icon>
                  <gv-icon name="el-icon-Search" />
                </template>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
      <!--   文件   -->
      <div class="material-center__content flex-1 pt-4 scroll-custom">
        <!--          -->
        <div class="file-list pt-12 flex-row flex-wrap">
          <div class="file-item-wrap" v-for="item in pager.lists" :key="item.id" :style="{ width: fileSize }">
            <gv-del-wrap @close="batchFileDelete([item.id])">
              <file-item :uri="getBaseImagUrl(item.uri)" :file-size="fileSize" :type="type" @click="selectFile(item)">
                <div class="item-selected" v-if="isSelect(item.id)">
                  <gv-icon :size="24" name="el-icon-Check" color="#fff" />
                </div>
              </file-item>
            </gv-del-wrap>
            <gv-overflow-tooltip class="mt-4 text-center" :content="item.name" />
            <div class="operation-btns flex-row align-center">
              <gv-popover-input
                @confirm="handleFileRename($event, item.id)"
                size="default"
                :value="item.name"
                width="400px"
                :limit="250"
                show-limit
                teleported
              >
                <el-button type="primary" link>{{ $t('components.gv_material.file_rename') }}</el-button>
              </gv-popover-input>
              <el-button v-if="item.type === 10 || item.type === 20" type="primary" link @click="handlePreview(getBaseImagUrl(item.uri))">
                {{ $t('components.gv_material.file_view') }}
              </el-button>
              <el-button
                v-if="item.type === 10 || item.type === 20"
                type="primary"
                link
                @click="textCopy(getBaseImagUrl(item.uri))"
                style="margin-left: 1px"
              >
                {{ $t('components.gv_material.file_address') }}
              </el-button>
              <el-link v-else type="primary" :underline="false" style="margin-left: 25px" :href="getBaseImagUrl(item.uri)">
                {{ $t('components.gv_material.file_download') }}
              </el-link>
            </div>
          </div>
        </div>
        <div class="flex-row flex-1 justify-center align-center" v-if="!pager.loading && !pager.lists.length">
          {{ $t('components.gv_material.file_empty') }}~
        </div>
      </div>
      <!--   底部   -->
      <div class="material-center__footer flex-row justify-between align-center mt-4">
        <div class="flex-row align-center">
          <template v-if="mode === 'page'">
            <span class="mr-4">
              <el-checkbox :disabled="!pager.lists.length" v-model="isCheckAll" @change="selectAll" :indeterminate="isIndeterminate">
                {{ $t('components.gv_material.file_select_all') }}
              </el-checkbox>
            </span>
            <el-button link type="danger" :disabled="!select.length" @click="batchFileDelete()">{{ $t('common.del_btn') }}</el-button>
            <gv-popup class="ml-4 inline" @confirm="batchFileMove" :disabled="!select.length" :title="$t('components.gv_material.file_move')">
              <template #trigger>
                <el-button link type="primary" :disabled="!select.length">{{ $t('components.gv_material.file_move') }}</el-button>
              </template>
              <div class="mb-8">{{ $t('components.gv_material.file_move_to') }}</div>
              <el-select v-model="moveId" :placeholder="$t('components.gv_material.file_placeholder_select')">
                <template v-for="item in cateLists" :key="item.id">
                  <el-option v-if="item.id !== ''" :label="item.name" :value="item.id"></el-option>
                </template>
              </el-select>
            </gv-popup>
          </template>
        </div>
        <gv-pagination v-model="pager" @change="getFileList" layout="total, prev, pager, next" />
      </div>
    </div>
    <!--  右侧  -->
    <div class="material__right h-full flex-col" v-if="mode === 'picker'">
      <div class="flex-row justify-between m-4 flex-wrap">
        <div class="sm flex-row align-center">
          {{ $t('components.gv_material.file_selected') }} {{ select.length }}
          <span v-if="limit">/{{ limit }}</span>
        </div>
        <el-button type="primary" link @click="clearSelect">{{ $t('components.gv_material.file_clear') }}</el-button>
      </div>
      <div class="flex-1 flex-h0">
        <el-scrollbar>
          <ul class="select-lists flex-col mt-4">
            <li class="mb-4" v-for="item in select" :key="item.id">
              <div class="select-item">
                <gv-del-wrap @close="cancelSelete(item.id)">
                  <file-item :uri="getBaseImagUrl(item.uri)" file-size="100px" :type="type"></file-item>
                </gv-del-wrap>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <preview v-model="showPreview" :url="previewUrl" :type="type" />
    <cate ref="cateRef" :add-fn="handleAddCate" :edit-fn="handleEditCate" />
  </div>
</template>
<script>
export default { name: 'gv-material-index' };
</script>
<script setup>
import FileItem from './file.vue';
import { useCate, useFile } from './hook';
import Preview from './preview.vue';
import { computed, inject, onMounted, ref, shallowRef, toRefs, watch } from 'vue';
import GvOverflowTooltip from '@/components/gv-overflow-tooltip/index.vue';
import GvPopoverInput from '@/components/gv-popover-input/index.vue';
import GvUpload from '@/components/gv-upload/index.vue';
import GvPopup from '@/components/gv-popup/index.vue';
import GvIcon from '@/components/gv-icon/index.vue';
import GvDelWrap from '@/components/gv-del-wrap/index.vue';
import GvPagination from '@/components/gv-pagination/index.vue';
import { copyText, getBaseImagUrl } from '@/tools';
import layer from '@/tools/layer';
import Cate from './cate.vue';
import { OPERATE_TYPE } from '@/values';
import { $t } from '@/lang/i18n';

const props = defineProps({
  fileSize: { type: String, default: '100px' },
  limit: { type: Number, default: 1 },
  type: { type: String, default: 'image' },
  mode: { type: String, default: 'picker' },
  pageSize: { type: Number, default: 15 }
});

const emit = defineEmits(['change']);

const cateRef = shallowRef();

const { limit } = toRefs(props);

const typeValue = computed(() => {
  switch (props.type) {
    case 'image':
      return 10;
    case 'video':
      return 20;
    case 'file':
      return 30;
    default:
      return 0;
  }
});

const visible = inject('visible', ref(false));
const previewUrl = ref('');
const showPreview = ref(false);
const { treeRef, cateId, cateLists, handleAddCate, handleEditCate, handleDeleteCate, getCateLists, handleCatSelect } = useCate(typeValue.value);

const {
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
} = useFile(cateId, typeValue, limit, props.pageSize);

const getData = async () => {
  await getCateLists();
  treeRef.value?.setCurrentKey(cateId.value);
  getFileList();
};

const openAddCate = (pid) => {
  cateRef.value?.open(OPERATE_TYPE.insert, null, pid ?? 0);
};

const openEditCate = (row) => {
  cateRef.value?.open(OPERATE_TYPE.update, row);
};

const handlePreview = (url) => {
  previewUrl.value = url;
  showPreview.value = true;
};

const textCopy = (uri) => {
  copyText(uri);
  layer.msgSuccess($t('components.gv_material.file_copy_success'));
};

watch(
  () => visible.value,
  async (val) => {
    if (val) getData();
  },
  {
    immediate: true
  }
);
watch(cateId, () => {
  fileParams.name = '';
  refresh();
});

watch(
  select,
  (val) => {
    emit('change', val);
    if (val.length === pager.lists.length && val.length !== 0) {
      isIndeterminate.value = false;
      isCheckAll.value = true;
      return;
    }
    if (val.length > 0) {
      isIndeterminate.value = true;
    } else {
      isCheckAll.value = false;
      isIndeterminate.value = false;
    }
  },
  {
    deep: true
  }
);

onMounted(() => {
  props.mode === 'page' && getData();
});

defineExpose({
  clearSelect
});
</script>

<style scoped lang="scss">
.material {
  .material__left {
    :deep(.el-tree-node__content) {
      height: 36px;

      .el-tree-node__label {
        display: flex;
        flex: 1;
        min-width: 0;
      }
    }
  }

  .material__center {
    flex: 1;

    .list-icon {
      border-radius: 3px;
      display: flex;
      padding: 5px;
      cursor: pointer;

      &.select {
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);
        border-radius: var(--el-border-radius-base);
      }
    }

    .file-list {
      .file-item-wrap {
        margin-right: 16px;
        line-height: 1.3;
        cursor: pointer;

        .item-selected {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 4px;
          background-color: rgba(0, 0, 0, 0.5);
          box-sizing: border-box;
        }

        .operation-btns {
          height: 28px;
          visibility: hidden;
        }

        &:hover .operation-btns {
          visibility: visible;
        }
      }
    }
  }

  .material__right {
    width: 130px;

    .select-lists {
      padding: 10px;

      .select-item {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
