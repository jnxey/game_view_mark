<template>
  <gv-popup
    ref="popupRef"
    :title="$t('components.gv_selecte_admin.title')"
    :async="true"
    width="500px"
    custom-class="gv-select-admin"
    @confirm="handleSubmit"
  >
    <gv-input-memory
      class="gv-select-admin__memory-box"
      v-model="account"
      memory-key="gv-select-admin"
      :placeholder="$t('components.gv_selecte_admin.placeholder_search')"
      input-size="large"
      input-clear
      @input="searchDebounce"
      @select="search"
    >
      <template #suffix>
        <gv-icon name="el-icon-search" class="cursor-pointer" @click="search" />
      </template>
    </gv-input-memory>
    <div v-loading="loading">
      <template v-if="!!tableData.length">
        <div
          class="user-item flex-row align-center cursor-pointer mb-12"
          v-for="item in tableData"
          :key="item.id"
          :class="{ active: item.id === current?.id, disabled: disableValue[item.id] }"
          @click="selectItem(item)"
        >
          <el-avatar :size="40" :src="getAlbumDef(item.avatar)" />
          <div class="ml-12">
            <div class="flex-row align-center fz-14 text-regular">
              <span class="label text-right">{{ $t('components.gv_selecte_admin.work_no') }}</span>
              <span class="fz-16 text-main fw-bold pl-16">{{ item.account }}</span>
            </div>
            <div class="flex-row align-center fz-14 text-regular pt-12" v-if="item.name">
              <span class="label text-right">{{ $t('components.gv_selecte_admin.name') }}</span>
              <span class="pl-16">{{ item.name }}</span>
            </div>
          </div>
          <span class="select-icon flex-row align-center justify-center">
            <gv-icon name="el-icon-select" class="fz-12 text-placeholder" />
          </span>
        </div>
      </template>
      <template v-else>
        <el-empty />
      </template>
    </div>
  </gv-popup>
</template>
<script>
export default { name: 'gv-select-admin' };
</script>
<script setup>
import { computed, ref, shallowRef, unref } from 'vue';
import layer from '@/tools/layer';
import { debounce } from 'throttle-debounce';
import GvIcon from '@/components/gv-icon/index.vue';
import { QUERY_LIST_TYPE } from '@/values';
import GvPopup from '@/components/gv-popup/index.vue';
import { getAlbumDef, toAwait } from '@/tools';
import GvInputMemory from '@/components/gv-input-memory/index.vue';
import { adminBaseLists, adminLists } from '@/api/staff/admin';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success']);

const props = defineProps({ selected: Object });

const current = ref(null);
const popupRef = shallowRef();
const tableRef = shallowRef();
const account = ref('');
const tableData = ref([]);
const loading = ref(false);

const disableValue = computed(() => {
  return props.selected ?? {};
});

const open = async () => {
  popupRef.value?.open();
  current.value = null;
  account.value = '';
  tableData.value = [];
};

const search = async () => {
  if (!account.value) return;
  const limit = account.value.length > 5 ? 200 : 5;
  loading.value = true;
  const [{ lists }, err] = await toAwait(
    adminBaseLists({
      page_type: QUERY_LIST_TYPE.pager,
      page_no: 1,
      page_size: limit,
      account: account.value
    })
  );
  loading.value = false;
  if (err) return;
  tableData.value = lists;
};

const searchDebounce = debounce(500, () => {
  search();
});

const selectItem = (item) => {
  if (disableValue.value[item.id]) return;
  current.value = item;
};

const handleSubmit = () => {
  if (!current.value) return layer.msgError($t('components.gv_selecte_admin.tips_value_check'));
  emit('success', unref(current));
  popupRef.value?.close();
};

defineExpose({ open });
</script>
<style lang="scss">
.gv-select-admin__memory-box {
  width: 100%;
  margin-bottom: 12px;
}

.gv-select-admin {
  .el-input.search {
    .el-input__wrapper {
      border-radius: 20px;
    }
  }

  .user-item {
    position: relative;
    padding: 20px;
    border-radius: var(--gv-border-radius-big);
    border: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);
    overflow: hidden;

    .select-icon {
      position: absolute;
      top: 0;
      right: 0;
      padding: 6px;
      z-index: 0;
      border-radius: 0 0 0 var(--gv-border-radius-big);
      background-color: var(--el-fill-color-dark);
    }

    .label {
      min-width: 60px;
      text-align-last: justify;
    }

    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &.active {
      .select-icon {
        background-color: var(--el-color-primary);

        .el-icon {
          color: var(--el-primary-text-color);
        }
      }
    }
  }
}
</style>
