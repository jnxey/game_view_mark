import { computed, reactive } from 'vue';
import { toolsTranslateList } from '@/api/common';
import { QUERY_LIST_TYPE } from '@/values';
import { getJSON, isArray, mappingArrayToObject } from '@/tools';
import { languageCurrent, languageField } from '@/lang/index';
import { setTranslateMap } from '@/lang/i18n';

export const inputLanguageMark = '#I18N#';

export const inputLanguage = reactive([]);

export const inputLanguageMap = computed(() => mappingArrayToObject(inputLanguage, 'code'));

// 初始化语言列表
export const initInputLanguage = async () => {
  const { lists } = await toolsTranslateList({ page_type: QUERY_LIST_TYPE.all });
  inputLanguage.splice(0);
  inputLanguage.push(...lists);

  // 国际化配置的词条
  const tMap = {};
  inputLanguage.forEach((item) => {
    if (!item.code.indexOf(`${inputLanguageMark}.${languageCurrent}`)) {
      const content = getJSON(inputLanguageMap.value[item.code]?.content, {});
      Object.keys(content).forEach((p) => (tMap[p] = content[p]));
    }
  });
  setTranslateMap(tMap);
};

// 翻译国际化词条
export function $ti(code) {
  if (!inputLanguageMap.value[code]) return code;
  const content = getJSON(inputLanguageMap.value[code]?.content, null);
  if (!content) return code;
  return content[languageCurrent] || content[languageField.zhCN];
}

// 多条国际化词条
export function $tis(codes) {
  if (isArray(codes)) return codes.map((val) => $ti(val));
  else return [];
}
