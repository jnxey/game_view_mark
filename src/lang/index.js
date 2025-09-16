import zh_CN from '@/lang/zh-CN/_index';
import en_US from '@/lang/en-US/_index';
import { storage } from '@/tools/storage';
import { CACHE_CURRENT_LANGUAGE } from '@/values/cache';
import { delayExec, pageReload } from '@/tools';

export const languageField = { zhCN: 'zh-CN', enUS: 'en-US' };

export const languageCurrent = storage.get(CACHE_CURRENT_LANGUAGE) ?? languageField.zhCN;

export const languageSupport = [
  { code: languageField.zhCN, name: '简体中文' },
  { code: languageField.enUS, name: 'English' }
];

export const languageAll = { 'zh-CN': zh_CN, 'en-US': en_US };

export const language = languageAll[languageCurrent];

export const languageSet = async (code) => {
  storage.set(CACHE_CURRENT_LANGUAGE, code);
  await delayExec(300);
  pageReload();
};

export const languageBody = () => {
  document.body.classList.add(languageCurrent);
};

export function getRateUSD() {
  const list = language.currency.currencies;
  const result = {};
  list.forEach((item) => (result[item.code] = item.rateUSD));
  return result;
}
