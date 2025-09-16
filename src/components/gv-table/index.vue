<template>
  <div class="gv-table">
    <div v-if="isShowSearch && $slots['search-box']" class="search-box mb-12">
      <slot name="search-box" :query="query" :search="search" :reset="reset" :tableExtend="tableExtend" />
    </div>
    <div class="table-box flex-row" :style="{ padding: getPX(tableBoxPadding) }">
      <table-popup-left
        v-if="$slots['popup-left']"
        ref="popupLeft"
        :title="popupLeftTitle"
        :height="tableBoxHeight"
        :offset="paginationHeight"
        :width="popupLeftWidth"
        :button-bottom="tableElHeight"
        :icon="popupLeftIcon"
        :default-show="popupLeftShow"
        @status-change="resetTableHeight"
      >
        <slot name="popup-left" :height="tableBoxHeight" :offset="tableBoxPadding * 2" :width="popupLeftWidth" />
      </table-popup-left>
      <table-popup-right
        v-if="$slots['popup-right']"
        ref="popupRight"
        :title="popupRightTitle"
        :height="tableBoxHeight"
        :offset="paginationHeight"
        :width="popupRightWidth"
        :button-bottom="tableElHeight"
        :icon="popupRightIcon"
        :default-show="popupRightShow"
      >
        <slot name="popup-right" :height="tableBoxHeight" :offset="tableBoxPadding * 2" :width="popupRightWidth" />
      </table-popup-right>
      <div class="flex-1 flex-w0">
        <div ref="tableContentRef">
          <div class="handle-box mb-12 flex-row align-center flex-wrap" v-if="$slots['handler-box']">
            <slot name="handler-box" :query="query" :search="search" :reset="reset" :tableExtend="tableExtend" />
          </div>
          <div class="handler-box mb-12 flex-row align-center">
            <div class="flex-1 flex-row align-center">
              <slot name="handler-left" :query="query" :search="search" :reset="reset" :tableExtend="tableExtend" />
            </div>
            <div class="flex-row align-center justify-end" v-if="showHandlerRight">
              <slot name="handler-right" :query="query" :search="search" :reset="reset" :tableExtend="tableExtend" />
              <table-refresh @refresh="refresh" />
              <table-search v-if="$slots['search-box']" :is-show="isShowSearch" @change="toggleShowSearch" />
              <table-export />
              <table-print />
              <table-setting />
            </div>
          </div>
          <gv-full-height ref="fullHeightRef" :bottom="layoutBottom" :exec="layoutFixed" @resize="setTableBoxHeight">
            <el-table
              ref="tableRef"
              :data="virtualList"
              :row-key="rowKey"
              v-loading="loading"
              :row-class-name="setTableRowClass"
              highlight-current-row
              :height="tableHeight"
              :border="showBorder"
              :stripe="stripe"
              :class="{ single: selectSingle, 'hide-summary': hideSummary, 'hide-expand-btn': hideExtendButton }"
              :empty-text="tableEmptyText"
              :summary-method="getSummaries"
              :show-summary="showSummary"
              :table-layout="tableLayout"
              header-cell-class-name="gv-table-header-cell"
              @scroll="tableScrollHandler"
              @header-click="headerClick"
              @cell-click="cellClick"
              @header-dragend="headerDragend"
              @expand-change="expandChange"
              scrollbar-always-on
            >
              <el-table-column type="expand" :width="hideExtendButton ? 1 : null" v-if="isExtend">
                <template #default="{ row }">
                  <slot name="expand-column" :row="row" />
                </template>
              </el-table-column>
              <slot name="prev-column" />
              <el-table-column v-if="showSelect" :width="selectedColWidth" fixed="left" :resizable="false">
                <template #header>
                  <el-checkbox v-if="!selectSingle" :model-value="checkAll" :indeterminate="checkIndeterminate" @click.stop="toggleSelectedAll" />
                </template>
                <template #default="scope">
                  <el-checkbox
                    v-if="!!tableDataDict[scope.row[rowKey]]"
                    :model-value="!!selectedMap[scope.row[rowKey]]"
                    @click.stop="toggleSelected(scope.row)"
                    :disabled="!enableListMap[scope.row[rowKey]]"
                  />
                </template>
              </el-table-column>
              <template v-for="(col, index) in formatColumns" :key="index">
                <template v-if="!col.hide && (!col.perm || (!!col.perm && checkPerm(col.perm)))">
                  <el-table-column
                    :prop="col.dataIndex"
                    :label="col.title"
                    :align="col.align ?? defaultAlign"
                    :width="col.width"
                    :min-width="col.minWidth ?? defaultMinWidth"
                    :class-name="getCellClass(col.dataIndex)"
                    :label-class-name="handleSortClass(col.dataIndex, orderSortInfo)"
                    :fixed="col.fixed"
                    :show-overflow-tooltip="!col.noTooltip"
                    :type="col.type"
                    :flex="col.flex"
                  >
                    <template #header>
                      {{ col.title }}
                      <template v-if="col.sort">
                        <span class="caret-wrapper" @click="handleChangeSort(col.dataIndex, refresh)">
                          <i class="sort-caret ascending"></i>
                          <i class="sort-caret descending"></i>
                        </span>
                      </template>
                    </template>
                    <!--                    -->
                    <template v-if="$slots[col.dataIndex]" #default="scope">
                      <slot :name="col.dataIndex" v-bind="{ ...scope }" />
                    </template>
                    <!--                    -->
                    <template v-else-if="col.dict" #default="scope">
                      <template
                        v-if="
                          col.dict === GLOBAL_DICT.currency_config.mark || col.dict === GLOBAL_DICT.table.mark || col.dict === GLOBAL_DICT.game.mark
                        "
                      >
                        <span :style="{ color: GLOBAL_DICT[col.dict].map[scope.row[col.dataIndex]]?.color }">
                          {{ $ti(GLOBAL_DICT[col.dict].map[scope.row[col.dataIndex]]?.name) }}
                        </span>
                      </template>
                      <template v-else-if="col.dict[scope.row[col.dataIndex]]?.tag">
                        <el-tag :type="col.dict[scope.row[col.dataIndex]]?.tag">
                          {{ $ti(col.dict[scope.row[col.dataIndex]]?.name) }}
                        </el-tag>
                      </template>
                      <template v-else>
                        <span :style="{ color: col.dict[scope.row[col.dataIndex]]?.color }">
                          {{ $ti(col.dict[scope.row[col.dataIndex]]?.name) }}
                        </span>
                      </template>
                    </template>
                    <!--                    -->
                    <template v-else-if="col.dictSelf" #default="scope">
                      <span>
                        {{ $ti(tableDataDict[scope.row[col.dataIndex]]?.name) }}
                      </span>
                    </template>
                    <!--                    -->
                    <template v-else-if="col.time" #default="scope">
                      <span v-if="!!scope.row[col.dataIndex]">
                        {{ dayjs(formatServerTime(scope.row[col.dataIndex])).format(isString(col.time) ? col.time : getTimeFormat()) }}
                      </span>
                      <span v-else>-</span>
                    </template>
                    <!--                    -->
                    <template v-else-if="col.image" #default="scope">
                      <el-avatar
                        class="cursor-pointer"
                        :size="40"
                        :src="getAlbumDef(col.func ? col.func(scope.row[col.dataIndex], scope.row) : scope.row[col.dataIndex])"
                        @click.stop="showPreviewImage(scope.row[col.dataIndex])"
                      />
                    </template>
                    <!--                    -->
                    <template v-else-if="col.func" #default="scope">
                      <template v-if="col.func_html">
                        <span v-html="col.func(scope.row[col.dataIndex], scope.row)" />
                      </template>
                      <template v-else>
                        {{ col.func(scope.row[col.dataIndex], scope.row) }}
                      </template>
                    </template>
                    <!--                    -->
                    <template v-else-if="col.click" #default="scope">
                      <div class="link-click link" @click="col.click(scope.row)">
                        {{ $ti(scope.row[col.dataIndex]) }}
                      </div>
                    </template>
                    <!--                    -->
                    <template v-else-if="col.color" #default="scope">
                      <span :style="{ color: scope.row[col.dataIndex] }">{{ scope.row[col.dataIndex] }}</span>
                    </template>
                    <!--                    -->
                    <template v-else-if="col.profit" #default="scope">
                      <gv-profit :value="scope.row[col.dataIndex]" />
                    </template>
                    <!--                    -->
                    <template v-else #default="scope">
                      {{ $ti(scope.row[col.dataIndex]) }}
                    </template>
                  </el-table-column>
                </template>
              </template>
              <el-table-column
                v-if="$slots['operate-cell'] && operatePermsShow"
                prop="operate-cell"
                :label="$t('common.operate_col')"
                fixed="right"
                :align="defaultAlign ?? 'center'"
                :min-width="operateWidth ?? defaultMinWidth"
              >
                <template #default="scope">
                  <span @click.stop>
                    <slot name="operate-cell" v-bind="{ ...scope }" />
                  </span>
                </template>
              </el-table-column>
              <template #empty>
                <div class="flex-row align-center justify-center">
                  <gv-icon v-if="tableEmptyNoQuery" name="el-icon-search" class="fz-24 mr-8" />
                  <span class="fz-18">{{ tableEmptyText }}</span>
                </div>
              </template>
            </el-table>
          </gv-full-height>
          <div class="pagination-wrap" :style="{ height: getPX(paginationHeight) }">
            <el-pagination
              v-if="!isTree && isPage"
              class="flex-row justify-end"
              v-model:current-page="pagination.page_no"
              v-model:page-size="pagination.page_size"
              :page-sizes="pageSizes"
              :layout="paginationLayout"
              :total="pagination.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default { name: 'gv-table' };
</script>
<script setup>
import {
  reactive,
  ref,
  provide,
  defineExpose,
  onBeforeMount,
  shallowRef,
  nextTick,
  unref,
  computed,
  onMounted,
  toRaw,
  watch,
  onActivated
} from 'vue';
import { useFieldSetting } from '@/components/gv-table/_hook/field-setting.js';
import {
  toAwait,
  isString,
  getAlbumDef,
  getPX,
  deepClone,
  generateUUID,
  isFunction,
  parseDict,
  formatServerTime,
  getTimeFormat,
  getJSON,
  getBaseImagUrl,
  isEmpty,
  isArray,
  mappingArrayToObject,
  checkIndexArray
} from '@/tools';
import { ELEMENT_SORT, QUERY_LIST_SORT, QUERY_LIST_TYPE } from '@/values';
import dayjs from 'dayjs';
import GvFullHeight from '@/components/gv-full-height/index.vue';
import TablePrint from '@/components/gv-table/_components/table-print.vue';
import TableRefresh from '@/components/gv-table/_components/table-refresh.vue';
import TableSetting from '@/components/gv-table/_components/table-setting.vue';
import TableExport from '@/components/gv-table/_components/table-export.vue';
import TableSearch from '@/components/gv-table/_components/table-search.vue';
import { useWindowClick } from '@/hooks/click';
import TablePopupLeft from '@/components/gv-table/_components/table-popup-left.vue';
import TablePopupRight from '@/components/gv-table/_components/table-popup-right.vue';
import { useVirtual } from '@/components/gv-table/_hook/virtual';
import { useSelection } from '@/components/gv-table/_hook/selection';
import { useTableScroll } from '@/components/gv-table/_hook/table-scroll';
import { imagePreviewOpen } from '@/store/image-viewer';
import { storage } from '@/tools/storage';
import { CACHE_KEY_GV_TABLE_PAGE_SIZE } from '@/values/cache';
import GvIcon from '@/components/gv-icon/index.vue';
import { checkPerm } from '@/directives/perms';
import { $t } from '@/lang/i18n';
import { useFieldSort } from '@/components/gv-table/_hook/field-sort';
import GvProfit from '@/components/gv-profit/index.vue';
import { $ti } from '@/lang/input';
import { GLOBAL_DICT } from '@/store/global-dict';

const cachePageSize = storage.get(CACHE_KEY_GV_TABLE_PAGE_SIZE) ?? {};

// 接收参数
const props = defineProps({
  // 表格唯一标识
  tableKey: { type: String, required: true },
  // 请求列表方法
  request: Function,
  // 进入表格默认不加载数据
  delayRequest: { type: Boolean, default: false },
  // 行唯一key，如果未UID，则自动生成
  rowKey: { type: String, default: 'id' },
  // 是否显示选择项
  showSelect: { type: Boolean, default: true },
  // 是否显示索引
  showIndex: { type: Boolean, default: false },
  // 是否显示斑马纹
  stripe: { type: Boolean, default: false },
  // 默认请求数据
  defaultQuery: Object,
  // 列配置数据
  columns: Array,
  // 操作栏宽度
  operateWidth: { type: Number, default: 120 },
  // 默认最小宽度
  defaultMinWidth: { type: Number, default: 100 },
  // 默认对齐方式
  defaultAlign: String,
  // 是否是树形结构
  isTree: { type: Boolean, default: false },
  // 是否分页
  isPage: { type: Boolean, default: true },
  // 树形配置
  treeProps: { type: Object, default: () => ({ children: 'children', hasChildren: 'hasChildren' }) },
  // 高度
  layoutBottom: { type: Number, default: 75 },
  // 是否需要适配高度
  layoutFixed: { type: Boolean, default: true },
  // 显示表格操作栏
  showHandlerRight: { type: Boolean, default: true },
  // 选项为单选
  selectSingle: { type: Boolean, default: false },
  // 简化页签布局
  simplePaginationLayout: { type: Boolean, default: false },
  // 复选框是否禁用
  selectable: Function,
  // 是否显示边框
  showBorder: { type: Boolean, default: true },
  // 默认每页大小
  defaultPageSize: { type: Number, default: 100 },
  // 表格高度
  tableHeight: { type: [String, Number], default: '100%' },
  // 点击表格选中
  clickCellSelect: { type: Boolean, default: false },
  // Cell点击高亮
  clickCellLight: { type: Boolean, default: true },
  // 左侧浮窗标题
  popupLeftTitle: String,
  // 左侧浮窗图标
  popupLeftIcon: { type: String, default: 'local-icon-connection' },
  // 左侧浮窗宽度
  popupLeftWidth: { type: Number, default: 220 },
  // 左侧浮窗默认是否显示
  popupLeftShow: Boolean,
  // 右侧浮窗标题
  popupRightTitle: String,
  // 右侧浮窗默认是否显示
  popupRightShow: Boolean,
  // 右侧浮窗图标
  popupRightIcon: { type: String, default: 'local-icon-record' },
  // 右侧浮窗标题
  popupRightWidth: { type: Number, default: 300 },
  // 默认请求排序
  defaultSort: Object,
  // 处理返回的列表数据
  handlerList: Function,
  // 处理返回的扩展数据
  handlerExtend: Function,
  // 存在自身为字典的清空
  hasDictSelf: { type: Boolean, default: false },
  // 是否显示合计
  showSummary: { type: Boolean, default: false },
  // 合计Extend字段
  handleSummary: Function,
  // 选择列宽度
  selectedColWidth: { type: Number, default: 40 },
  // 操作栏权限
  operatePerms: Array,
  // 是否显示展开列
  isExtend: { type: Boolean, default: false },
  // 隐藏展开列按钮
  hideExtendButton: { type: Boolean, default: false },
  // 表格布局
  tableLayout: String,
  // 额外的参数
  otherQuery: Function
});

// 页脚高度
const paginationHeight = 44;

// 表格padding
const tableBoxPadding = 15;

// 是否展开
let isExpand = false;

// 是否显示搜索
const isShowSearch = ref(true);

// 事件
const emits = defineEmits(['selectionChange', 'expandChange', 'formatColumnsChange', 'refresh', 'tableDataChange']);

// 分页数据
const pageSizes = [10, 20, 100, 500, 1000];

// 页签布局
const paginationLayout = computed(() => (props.simplePaginationLayout ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'));

// 表格分页数据
const pagination = reactive({
  page_no: 1,
  page_size: cachePageSize[props.tableKey] ?? props.defaultPageSize,
  total: 0
});

// 表格请求参数
const query = reactive({ ...(props.defaultQuery ?? {}) });

// full高度ref
const fullHeightRef = shallowRef();

// 表格主体
const tableContentRef = shallowRef();

// 表格高度
const tableBoxHeight = ref(0);

// 表格EL内容高度
const tableElHeight = ref(0);

// 表格ref
const tableRef = shallowRef();

// 表格数据
const tableData = shallowRef([]);

// 表格扩展数据
const tableExtend = shallowRef({});

// 表格弹窗实体
const popupLeft = shallowRef();

// 表格高亮列
const colLight = ref(null);

// 表格高亮行
const rowLight = ref(null);

// 表格loading
const loading = ref(false);

// 查询过数据
const hasQueryData = ref(false);

// 隐藏合计栏
const hideSummary = ref(false);

// 缓存排序信息
const { orderSortInfo, handleChangeSort, handleSortClass, getSortParams } = useFieldSort([...(props.defaultSort ?? [])]);

// 表格空提示
const tableEmptyNoQuery = computed(() => {
  return props.delayRequest && !hasQueryData.value;
});

// 表格空提示
const tableEmptyText = computed(() => {
  return tableEmptyNoQuery.value ? $t('components.gv_table.tips_search_click') : $t('components.gv_table.tips_search_empty');
});

// 表格数据字典
const tableDataDict = computed(() => {
  return mappingArrayToObject(unref(tableData), props.rowKey);
});

// 操作栏权限是否显示
const operatePermsShow = computed(() => {
  if (isArray(props.operatePerms)) {
    return checkPerm(props.operatePerms);
  } else {
    return true;
  }
});

// 滚动位置
const { saveScrollPosition, restoreScrollPosition } = useTableScroll(props.tableKey, () => tableRef.value);

// 表格设置
const { formatColumns, handleSetting, setHandleSetting } = useFieldSetting(() => props.columns, props.tableKey);

// 虚拟滚动
const { scrollVirtual, setItemClass, virtualList } = useVirtual({
  getData: () => tableData.value,
  getScroll: () => tableContentRef.value?.querySelector('.el-table .el-scrollbar__wrap'),
  setWrapStyle: (style) => {
    const scrollContent = tableContentRef.value?.querySelector('.el-table .el-scrollbar__view');
    if (!scrollContent) return;
    scrollContent.style.minHeight = style.minHeight;
    scrollContent.style.paddingTop = style.paddingTop;
  }
});

// 表格滚动处理
const tableScrollHandler = (position) => {
  saveScrollPosition(position);
  scrollVirtual(position);
};

// 选中项
const { selected, selectedMap, enableListMap, toggleSelected, clearSelected, checkAll, checkIndeterminate, toggleSelectedAll } = useSelection({
  rowKey: props.rowKey,
  single: props.selectSingle,
  selectable: props.selectable,
  getData: () => tableData.value,
  change: () => {
    emits('selectionChange', selected);
  }
});

// 设置表格行样式
const setTableRowClass = ({ row }) => {
  const classList = [setItemClass()];
  if (!!unref(selectedMap)[row[props.rowKey]]) {
    classList.push('selected-mark');
  }
  return classList.join(' ');
};

// 拉取表格数据
const queryTableData = async (refresh) => {
  if (refresh) pagination.page_no = 1;
  loading.value = true;
  const others = !!props.otherQuery ? props.otherQuery({ ...query }) : {};
  const params = {
    page_no: pagination.page_no,
    page_size: pagination.page_size,
    page_type: props.isTree || !props.isPage ? QUERY_LIST_TYPE.all : QUERY_LIST_TYPE.pager,
    ...query,
    ...others,
    ...getSortParams()
  };

  const [res, err] = await toAwait(props.request(params));
  loading.value = false;
  if (err) return;
  setTable(res);
  resetTableHeight();
  emits('tableDataChange');
};

// 重置表格高度
const resetTableHeight = () => {
  fullHeightRef.value?.resizeHandler();
};

// 获取表格主题高度
const setTableBoxHeight = async (elHeight) => {
  await nextTick();
  tableBoxHeight.value = tableContentRef.value?.clientHeight;
  tableElHeight.value = !!elHeight ? elHeight + paginationHeight : tableBoxHeight.value - 200;
  return tableBoxHeight.value;
};

// 处理表格数据
const setTable = (res) => {
  const list = props.isTree || !props.isPage ? (res.lists ?? res ?? []) : (res.lists ?? []);
  const total = res.count ?? 0;
  if (props.rowKey === 'UID') list.forEach((item) => (item.UID = generateUUID()));
  tableData.value = isFunction(props.handlerList) ? props.handlerList(list) : list;
  pagination.total = total;
  tableExtend.value = isFunction(props.handlerExtend) ? props.handlerExtend(res.extend ?? {}) : (res.extend ?? {});
  hasQueryData.value = true;
};

// 获取合计数
const getSummaries = (params) => {
  const sums = props.handleSummary(params, unref(tableData), unref(tableExtend));
  hideSummary.value = !sums?.length;
  return sums;
};

// 页数大小变更
const handleSizeChange = () => {
  const cache = storage.get(CACHE_KEY_GV_TABLE_PAGE_SIZE) ?? {};
  cache[props.tableKey] = pagination.page_size;
  storage.set(CACHE_KEY_GV_TABLE_PAGE_SIZE, cache);
  return queryTableData(true);
};

// 当前页码变更
const handleCurrentChange = () => {
  return queryTableData(false);
};

// 更新默认参数
const resetDefaultQuery = () => {
  const def = props.defaultQuery ?? {};
  const all = { ...def, ...query };
  Object.keys(all).forEach((name) => {
    if (isEmpty(def[name])) {
      delete query[name];
    } else {
      query[name] = def[name];
    }
  });
};

// 搜索表格
const search = () => {
  saveScrollPosition({ scrollLeft: 0, scrollTop: 0 });
  return queryTableData(true);
};

// 重置搜索
const reset = () => {
  resetDefaultQuery();
  search();
};

// 刷新表格
const refresh = async () => {
  const hasLen = !!tableData.value?.length;
  await queryTableData(false);
  if (hasLen) restoreScrollPosition();
  emits('refresh');
};

// 获取表格数据
const getTableData = () => {
  return tableData.value;
};

// 展开列表
const handleExpand = () => {
  if (!props.isTree) return;
  isExpand = !isExpand;
  toggleExpand(tableData.value, isExpand);
};

// 展开列表-切换
const toggleExpand = (children, unfold = true) => {
  for (const key in children) {
    tableRef.value?.toggleRowExpansion(children[key], unfold);
    if (children[key].children) {
      toggleExpand(children[key][props.treeProps.children], unfold);
    }
  }
};

// 切换是否显示搜索
const toggleShowSearch = (value) => {
  isShowSearch.value = value;
  resetTableHeight();
};

// 表头高亮1列
const headerClick = (column, event) => {
  event.stopPropagation();
  colLight.value = column.property;
  clearRowLight();
};

// 行高亮1行
const cellClick = (row, column, cell, event) => {
  event.stopPropagation();
  rowLight.value = column.property;
  clearColLight();
  // 点击行-selected
  if (props.selectable && !props.selectable(row)) return;
  if (!props.showSelect || !props.clickCellSelect) return;
  toggleSelected(row);
};

// 获取单元格样式
const getCellClass = (key) => {
  if (!props.clickCellLight) return '';
  if (colLight.value === key) {
    return 'cell-light';
  } else if (rowLight.value === key) {
    return 'row-light';
  }
};

// 列的宽度被改变
const headerDragend = (now, old, col) => {
  const map = handleSetting.value ? { ...handleSetting.value } : {};
  if (!map[col.property]) map[col.property] = {};
  map[col.property].width = now;
  setHandleSetting(map);
};

// 清除高亮
const clearColLight = () => {
  colLight.value = null;
};

// 清除高亮
const clearRowLight = () => {
  rowLight.value = null;
  tableRef.value?.setCurrentRow();
};

// 获取选中的行
const getSelected = () => {
  return selected ?? [];
};

// 获取表格扩展数据
const getExtend = () => {
  return unref(tableExtend);
};

// 展开行触发
const expandChange = (row) => {
  emits('expandChange', row);
};

// 设置筛选项
const setQuery = (field, value) => {
  query[field] = value;
};

// 获取筛选项
const getQuery = () => {
  return { ...query };
};

// 打开左侧弹窗
const openPopupLeft = () => {
  popupLeft.value?.open();
};

// 预览图片
const showPreviewImage = (str) => {
  if (!str) return;
  const list = getJSON(str, null);
  const previews = !!list ? list : [str];
  imagePreviewOpen(previews.map((val) => getBaseImagUrl(val)));
};

// 获取配置后的column
const getFormatColumns = () => {
  return formatColumns.value;
};

// 获取表格实体
const getTableInstance = () => {
  return tableRef.value;
};

// 展开表格
const toggleRowExpansion = (row, expanded) => {
  return tableRef.value?.toggleRowExpansion(row, expanded);
};

watch(
  () => formatColumns.value,
  () => {
    emits('formatColumnsChange');
  }
);

watch(
  () => query,
  () => resetTableHeight(),
  { deep: true }
);

onActivated(() => resetTableHeight());

useWindowClick(() => {
  clearColLight();
  clearRowLight();
});

onBeforeMount(() => {
  if (!props.delayRequest) refresh();
});

onMounted(() => {
  setTableBoxHeight();
});

provide('tableKey', props.tableKey);
provide('formatColumns', formatColumns);
provide('getTableData', getTableData);
provide('getSelected', getSelected);
provide('handleSetting', handleSetting);
provide('setHandleSetting', setHandleSetting);
provide('search', search);
provide('rowKey', props.rowKey);
provide('setTableBoxHeight', setTableBoxHeight);

defineExpose({
  search,
  reset,
  refresh,
  handleExpand,
  getSelected,
  clearSelected,
  getExtend,
  setQuery,
  getQuery,
  getSortParams,
  openPopupLeft,
  getTableData,
  resetDefaultQuery,
  resetTableHeight,
  getFormatColumns,
  getTableInstance,
  toggleRowExpansion
});
</script>
<style scoped lang="scss">
.gv-table {
  .search-box {
    padding: 15px 15px 0 15px;
    border-radius: var(--el-border-radius-base);
    background-color: var(--el-bg-color);

    ::v-deep(.search-item) {
      --el-select-width: fit-content;
      --el-input-width: 200px;
      min-width: 200px;
      margin-right: 15px;
      margin-bottom: 15px;

      &.gv-daterange-picker,
      &.gv-input-memory {
        width: 200px;
      }

      &.auto {
        min-width: fit-content;
        width: auto;
      }

      &.box {
        display: inline-block;
        vertical-align: top;
      }

      &:last-child {
        margin-right: 0;
      }

      &.small {
        min-width: fit-content;
        width: 120px;
      }
    }

    ::v-deep(.search-button) {
      margin-bottom: 15px;
    }
  }

  .table-box {
    position: relative;
    overflow: hidden;
    border-radius: var(--el-border-radius-base);
    background-color: var(--el-bg-color);

    .el-table {
      ::v-deep(.el-table__header) {
        min-height: 40px;
      }

      ::v-deep(.gv-table-header-cell) {
        font-weight: 500;
        color: var(--el-text-color-primary);
        background-color: var(--el-fill-color-light);

        .cell {
          line-height: 1;
        }

        &.el-table-fixed-column--right,
        &.el-table-fixed-column--left {
          background-color: var(--el-fill-color-light);
        }

        &.cell-light.el-table__cell {
          background-color: var(--el-fill-color-dark);
        }
      }

      ::v-deep(.el-table__body .el-table__row td.cell-light.el-table__cell),
      ::v-deep(.el-table__body .el-table__row.current-row),
      ::v-deep(.el-table__body .el-table__row.current-row .el-table__cell) {
        background-color: var(--el-color-primary-light-9);
      }

      ::v-deep(.el-table__body .el-table__row.current-row td.row-light.el-table__cell) {
        position: relative;

        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: calc(100% - 4px);
          height: calc(100% - 4px);
          background-color: var(--el-color-primary-light-7) !important;
          border: 2px solid var(--el-color-primary);
          z-index: -1;
        }
      }

      ::v-deep(.el-table__footer-wrapper .el-table__cell) {
        padding: 12px 0;
        color: var(--el-text-color-primary);
      }

      &.hide-summary {
        ::v-deep(.el-table__footer-wrapper) {
          display: none;
        }
      }

      &.hide-expand-btn {
        ::v-deep(.el-table__expand-column) {
          border: none !important;
          overflow: hidden;
        }
      }

      ::v-deep(.el-scrollbar__thumb) {
        background-color: var(--el-color-primary);
      }

      ::v-deep(.el-scrollbar__bar.is-horizontal) {
        height: 16px; /* 横向滚动条高度 */
        border-radius: 8px;
      }

      ::v-deep(.el-scrollbar__bar.is-vertical) {
        width: 16px; /* 纵向滚动条宽度 */
        border-radius: 8px;
      }

      /* 行选中样式 */
      ::v-deep(.el-table__body tr.selected-mark > td.el-table__cell) {
        background-color: var(--el-color-primary-light-9) !important;
      }
    }
  }

  ::v-deep(.el-table__expanded-cell) {
    background-color: var(--el-fill-color-dark);

    &:hover {
      background-color: var(--el-fill-color-dark) !important;
    }
  }

  .pagination-wrap {
    padding-top: 10px;
  }
}
</style>
