import { $t } from '@/lang/i18n';

// 菜单类型
export const MENU_ENUM_TYPE = { CATALOGUE: 'M', MENU: 'C', BUTTON: 'A' };

// 全局状态适配-字典
export const MENU_ENUM_TYPE_DICT = [
  { name: $t('other.values.menu_type_m'), value: MENU_ENUM_TYPE.CATALOGUE },
  { name: $t('other.values.menu_type_c'), value: MENU_ENUM_TYPE.MENU },
  { name: $t('other.values.menu_type_a'), value: MENU_ENUM_TYPE.BUTTON }
];

// 菜单是否显示
export const MENU_ENUM_SHOW = { show: 1, hide: 0 };

// 菜单是否缓存
export const MENU_ENUM_CACHE = { yes: 1, noe: 0 };
