import { $t } from '@/lang/i18n';

// 牌型-百家乐
export const BACCARAT_CARD_TYPE = {
  master: 'master', // 庄赢
  player: 'player', // 闲赢
  draw: 'draw', // 和局
  master_pair: 'master_pair', // 庄对
  player_pair: 'player_pair', // 闲对
  pair_any: 'pair_any', // 任意对子
  pair_perfect: 'pair_perfect', // 完美对子
  luck_6: 'luck_6', // 幸运6
  luck_6_2: 'luck_6_2', // 幸运6两张牌
  luck_6_3: 'luck_6_3', // 幸运6三张牌
  luck_7: 'luck_7', // 幸运7
  other: 'other' // 其他
};

// 牌型-百家乐-Top字典
export const BACCARAT_CARD_TYPE_TOP_DICT = [
  { name: $t('other.values.card_baccarat_master'), value: BACCARAT_CARD_TYPE.master },
  { name: $t('other.values.card_baccarat_player'), value: BACCARAT_CARD_TYPE.player },
  { name: $t('other.values.card_baccarat_draw'), value: BACCARAT_CARD_TYPE.draw }
];

// 牌型-百家乐-Sub字典
export const BACCARAT_CARD_TYPE_SUB_DICT = [
  { name: $t('other.values.card_baccarat_master_pair'), value: BACCARAT_CARD_TYPE.master_pair },
  { name: $t('other.values.card_baccarat_player_pair'), value: BACCARAT_CARD_TYPE.player_pair },
  { name: $t('other.values.card_baccarat_pair_any'), value: BACCARAT_CARD_TYPE.pair_any },
  { name: $t('other.values.card_baccarat_pair_perfect'), value: BACCARAT_CARD_TYPE.pair_perfect },
  { name: $t('other.values.card_baccarat_luck_6'), value: BACCARAT_CARD_TYPE.luck_6 },
  { name: $t('other.values.card_baccarat_luck_6_2'), value: BACCARAT_CARD_TYPE.luck_6_2 },
  { name: $t('other.values.card_baccarat_luck_6_3'), value: BACCARAT_CARD_TYPE.luck_6_3 },
  { name: $t('other.values.card_baccarat_luck_7'), value: BACCARAT_CARD_TYPE.luck_7 },
  { name: $t('other.title'), value: BACCARAT_CARD_TYPE.other }
];

// 牌型-龙虎
export const LONG_HU_CARD_TYPE = {
  master: 'master', // 龙赢
  player: 'player', // 虎赢
  draw: 'draw', // 和局
  pair_any: 'pair_any' // 任意对子
};

// 牌型-龙虎-Top字典
export const LONG_HU_CARD_TYPE_TOP_DICT = [
  { name: $t('other.values.card_baccarat_long_master'), value: LONG_HU_CARD_TYPE.master },
  { name: $t('other.values.card_baccarat_long_player'), value: LONG_HU_CARD_TYPE.player },
  { name: $t('other.values.card_baccarat_draw'), value: LONG_HU_CARD_TYPE.draw }
];

// 牌型-龙虎-Sub字典
export const LONG_HU_CARD_TYPE_SUB_DICT = [{ name: $t('other.title'), value: BACCARAT_CARD_TYPE.other }];

// 牌型-牛牛
export const NIU_CARD_TYPE = {
  niu_5small: 'niu_5small', // 5小
  niu_bomb: 'niu_bomb', // 炸弹
  niu_5hua: 'niu_5hua', // 5花
  niu_niu: 'niu_niu', // 牛牛
  niu_9: 'niu_9',
  niu_8: 'niu_8',
  niu_7: 'niu_7',
  niu_6: 'niu_6',
  niu_5: 'niu_5',
  niu_4: 'niu_4',
  niu_3: 'niu_3',
  niu_2: 'niu_2',
  niu_1: 'niu_1',
  niu_7_9: 'niu_7_9',
  niu_1_6: 'niu_1_6',
  niu_none: 'niu_none',
  niu_all: 'niu_all',
  other: 'other' // 其他
};

// 牌型-牛牛 - 范围
export const NIU_CARD_TYPE_AREA = {
  niu_7_9: [NIU_CARD_TYPE.niu_7, NIU_CARD_TYPE.niu_8, NIU_CARD_TYPE.niu_9],
  niu_1_6: [NIU_CARD_TYPE.niu_1, NIU_CARD_TYPE.niu_2, NIU_CARD_TYPE.niu_3, NIU_CARD_TYPE.niu_4, NIU_CARD_TYPE.niu_5, NIU_CARD_TYPE.niu_6],
  niu_all: [
    NIU_CARD_TYPE.niu_1,
    NIU_CARD_TYPE.niu_2,
    NIU_CARD_TYPE.niu_3,
    NIU_CARD_TYPE.niu_4,
    NIU_CARD_TYPE.niu_5,
    NIU_CARD_TYPE.niu_6,
    NIU_CARD_TYPE.niu_7,
    NIU_CARD_TYPE.niu_8,
    NIU_CARD_TYPE.niu_9,
    NIU_CARD_TYPE.niu_niu,
    NIU_CARD_TYPE.niu_5hua,
    NIU_CARD_TYPE.niu_bomb,
    NIU_CARD_TYPE.niu_5small
  ]
};

// 牌型-牛牛-字典
export const NIU_CARD_TYPE_DICT = [
  { name: $t('other.values.card_niu_5small'), value: NIU_CARD_TYPE.niu_5small },
  { name: $t('other.values.card_niu_bomb'), value: NIU_CARD_TYPE.niu_bomb },
  { name: $t('other.values.card_niu_5hua'), value: NIU_CARD_TYPE.niu_5hua },
  { name: $t('other.values.card_niu_niu'), value: NIU_CARD_TYPE.niu_niu },
  { name: $t('other.values.card_niu_9'), value: NIU_CARD_TYPE.niu_9 },
  { name: $t('other.values.card_niu_8'), value: NIU_CARD_TYPE.niu_8 },
  { name: $t('other.values.card_niu_7'), value: NIU_CARD_TYPE.niu_7 },
  { name: $t('other.values.card_niu_6'), value: NIU_CARD_TYPE.niu_6 },
  { name: $t('other.values.card_niu_5'), value: NIU_CARD_TYPE.niu_5 },
  { name: $t('other.values.card_niu_4'), value: NIU_CARD_TYPE.niu_4 },
  { name: $t('other.values.card_niu_3'), value: NIU_CARD_TYPE.niu_3 },
  { name: $t('other.values.card_niu_2'), value: NIU_CARD_TYPE.niu_2 },
  { name: $t('other.values.card_niu_1'), value: NIU_CARD_TYPE.niu_1 },
  { name: $t('other.values.card_niu_7_9'), value: NIU_CARD_TYPE.niu_7_9 },
  { name: $t('other.values.card_niu_1_6'), value: NIU_CARD_TYPE.niu_1_6 },
  { name: $t('other.values.card_niu_none'), value: NIU_CARD_TYPE.niu_none },
  { name: $t('other.values.card_niu_all'), value: NIU_CARD_TYPE.niu_all },
  { name: $t('other.title'), value: BACCARAT_CARD_TYPE.other }
];

// 彩金牌型
export const BONUS_CARD_TYPE = {
  royal_flush: 'royal_flush', // 皇家同花顺
  flush: 'flush', // 同花顺
  same_flower: 'same_flower', // 同花
  straight: 'straight', // 顺子
  gourd: 'gourd', // 葫芦
  other: 'other' // 其他
};

// 彩金牌型-字典
export const BONUS_CARD_TYPE_DICT = [
  { name: $t('other.values.card_bonus_royal_flush'), value: BONUS_CARD_TYPE.royal_flush },
  { name: $t('other.values.card_bonus_flush'), value: BONUS_CARD_TYPE.flush },
  { name: $t('other.values.card_bonus_same_flower'), value: BONUS_CARD_TYPE.same_flower },
  { name: $t('other.values.card_bonus_straight'), value: BONUS_CARD_TYPE.straight },
  { name: $t('other.values.card_bonus_gourd'), value: BONUS_CARD_TYPE.gourd },
  { name: $t('other.title'), value: BACCARAT_CARD_TYPE.other }
];
