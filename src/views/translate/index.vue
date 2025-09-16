<template>
  <div class="translate-page">
    <div class="flex-row align-center p-4">
      <div class="flex-1">
        <el-radio-group :model-value="active" class="flex flex-row items-center">
          <el-radio
            class="custom-radio"
            v-for="lang in languageSupport"
            :key="lang.code"
            :value="lang.code"
            :label="lang.name"
            @click="setLanguage(lang.code)"
          />
        </el-radio-group>
      </div>
      <div class="flex-1 flex-row justify-end align-center">
        <el-button type="primary" @click="handlerSubmit">{{ $t('common.save_btn') }}</el-button>
      </div>
    </div>
    <div class="content-wrap p-4">
      <el-tabs :model-value="current" @tab-click="setTab">
        <el-tab-pane v-for="module in tabsModule" :key="module.code" :name="module.code" :label="module.name" />
        <gv-full-height :bottom="50">
          <el-scrollbar height="100%">
            <div v-for="item in currentTemplate" :key="item.code" class="translate-edit-item-wrap">
              <!--      无子项      -->
              <template v-if="!isArray(item.children)">
                <div :key="item.code" class="translate-edit-item-text pt-4 pb-4">
                  <el-input clearable v-model="valueTemplate[item.code]" :placeholder="item.display" class="text-main" @change="isEdited = true">
                    <template #prepend>
                      <div class="prepend w-280 text-ellipsis text-main">
                        <span class="label">{{ $t('common.current_display') }}:</span>
                        <span class="text ml-4 cursor-pointer text-primary" :title="item.display" @click="copyDisplay(item.display)">
                          {{ item.display }}
                        </span>
                      </div>
                    </template>
                  </el-input>
                </div>
              </template>
              <template v-else>
                <el-divider content-position="left">
                  {{ item.title }}
                </el-divider>
                <template v-for="_item in item.children" :Key="_item.code">
                  <div class="translate-edit-item-text pt-4 pb-4">
                    <el-input clearable v-model="valueTemplate[_item.code]" :placeholder="_item.display" class="text-main" @change="isEdited = true">
                      <template #prepend>
                        <div class="prepend w-280 text-ellipsis text-main">
                          <span class="label">{{ $t('common.current_display') }}:</span>
                          <span class="text ml-4 cursor-pointer text-primary" :title="_item.display" @click="copyDisplay(_item.display)">
                            {{ _item.display }}
                          </span>
                        </div>
                      </template>
                    </el-input>
                  </div>
                </template>
              </template>
            </div>
          </el-scrollbar>
        </gv-full-height>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import GvFullHeight from '@/components/gv-full-height/index.vue';
import { languageAll, languageCurrent, languageSupport } from '@/lang';
import { $t } from '@/lang/i18n';
import { copyText, delayExec, generateRandomString, getJSON, isArray, isString } from '@/tools';
import { isObject } from '@vue/shared';
import { toolsTranslateSet } from '@/api/common';
import { GV_INPUT_LANGUAGE_TYPE, QUERY_LIST_MAX_NUMBER } from '@/values';
import { initInputLanguage, inputLanguage, inputLanguageMap, inputLanguageMark } from '@/lang/input';
import layer from '@/tools/layer';

const firstModule = 'account';

// 当前选中要编辑的语言
const active = ref(languageCurrent);

// 当前选中的模块
const current = ref(firstModule);

// 当前mark
const currentMark = computed(() => `${inputLanguageMark}.${active.value}.${current.value}`);

// 当前设置的模板值
const valueTemplate = ref({});

// 是否编辑过了
const isEdited = ref(false);

// 模块列表
const tabsModule = computed(() => {
  const language = languageAll[active.value];
  const names = Object.keys(language);
  const result = [];
  const exclude = ['element_ui', 'views_member'];
  names.forEach((p) => {
    if (exclude.includes(p)) return;
    result.push({ code: p, name: language[p]?.title ? $t(`${p}.title`) : p });
  });
  return result;
});

// 模板列表
const currentTemplate = computed(() => {
  const language = languageAll[active.value][current.value];
  const result = [];
  Object.keys(language).forEach((p) => {
    if (isObject(language[p])) {
      const children = [];
      Object.keys(language[p]).forEach((_p) => {
        if (isObject(language[p][_p])) return;
        children.push({ code: `${current.value}.${p}.${_p}`, display: language[p][_p] });
      });
      if (!children.length) return;
      result.push({ code: `${current.value}.${p}`, title: language[p]?.title ?? p, children: children });
    } else {
      result.push({ code: `${current.value}.${p}`, display: language[p] });
    }
  });
  return result;
});

// 获取保存的翻译内容
const getInputLanguage = (code) => {
  return getJSON(inputLanguageMap.value[code]?.content, {});
};

// 设置语言切换
const setLanguage = async (value) => {
  if (isEdited.value) await layer.confirm($t('common.tips_edited'));
  isEdited.value = false;
  valueTemplate.value = getInputLanguage(`${inputLanguageMark}.${value}.${current.value}`);
  active.value = value;
};

// 设置模块切换
const setTab = async (tab) => {
  if (isEdited.value) await layer.confirm($t('common.tips_edited'));
  isEdited.value = false;
  valueTemplate.value = getInputLanguage(`${inputLanguageMark}.${active.value}.${tab.paneName}`);
  current.value = tab.paneName;
};

// 保存国际化翻译
const handlerSubmit = async () => {
  if (inputLanguage.length >= QUERY_LIST_MAX_NUMBER) return layer.msgError($t('components.gv_input_language.tips_max_length'));
  const params = {
    code: currentMark.value,
    type: GV_INPUT_LANGUAGE_TYPE.translate,
    content: JSON.stringify(valueTemplate.value)
  };
  layer.loading();
  await toolsTranslateSet(params);
  await initInputLanguage();
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  isEdited.value = false;
};

// 复制内容
const copyDisplay = (value) => {
  copyText(value);
  layer.msgSuccess($t('common.copy_success'));
};

onBeforeMount(async () => {
  await delayExec(500);
  valueTemplate.value = getInputLanguage(currentMark.value);
});
</script>
<style lang="scss">
.theme-light {
  .translate-page {
    .el-input {
      --el-input-placeholder-color: var(--el-color-info);
    }
  }
}
</style>
<style scoped lang="scss">
.translate-page {
  padding: 15px;
  min-height: 100%;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);

  .translate-edit-item-wrap {
    ::v-deep(.el-input) {
      .el-input-group__prepend {
        background-color: var(--el-bg-color);
      }
    }

    .prepend {
      .text {
        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>
