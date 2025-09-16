/***********************牛牛*************************/
export const ROAD_NIUNIU_EMPTY_KEY = 'kongmen';

export const ROAD_NIUNIU_SEAT = {
  dealer: 'dealer',
  player1: 'player1',
  player2: 'player2',
  player3: 'player3',
  player5: 'player5',
  player6: 'player6'
};

export const ROAD_NIUNIU_SEAT_DICT = [
  { value: ROAD_NIUNIU_SEAT.dealer, name: '庄' },
  { value: ROAD_NIUNIU_SEAT.player1, name: '闲1' },
  { value: ROAD_NIUNIU_SEAT.player2, name: '闲2' },
  { value: ROAD_NIUNIU_SEAT.player3, name: '闲3' },
  { value: ROAD_NIUNIU_SEAT.player5, name: '闲5' },
  { value: ROAD_NIUNIU_SEAT.player6, name: '闲6' }
];

export const ROAD_NIUNIU_CARD_DICT = [
  { value: 'wuniu', name: '无牛', image: 'input/wuniu.png', active: 'input/wuniu_choose.png', road: 'luzhu/wuniu.png' },
  { value: 'niu1', name: '牛1', image: 'input/niu1.png', active: 'input/niu1_choose.png', road: 'luzhu/niu1.png' },
  { value: 'niu2', name: '牛2', image: 'input/niu2.png', active: 'input/niu2_choose.png', road: 'luzhu/niu2.png' },
  { value: 'niu3', name: '牛3', image: 'input/niu3.png', active: 'input/niu3_choose.png', road: 'luzhu/niu3.png' },
  { value: 'niu4', name: '牛4', image: 'input/niu4.png', active: 'input/niu4_choose.png', road: 'luzhu/niu4.png' },
  { value: 'niu5', name: '牛5', image: 'input/niu5.png', active: 'input/niu5_choose.png', road: 'luzhu/niu5.png' },
  { value: 'niu6', name: '牛6', image: 'input/niu6.png', active: 'input/niu6_choose.png', road: 'luzhu/niu6.png' },
  { value: 'niu7', name: '牛7', image: 'input/niu7.png', active: 'input/niu7_choose.png', road: 'luzhu/niu7.png' },
  { value: 'niu8', name: '牛8', image: 'input/niu8.png', active: 'input/niu8_choose.png', road: 'luzhu/niu8.png' },
  { value: 'niu9', name: '牛9', image: 'input/niu9.png', active: 'input/niu9_choose.png', road: 'luzhu/niu9.png' },
  { value: 'niuniu', name: '牛牛', image: 'input/niuniu.png', active: 'input/niuniu_choose.png', road: 'luzhu/niuniu.png' },
  { value: 'wuhua', name: '五花', image: 'input/wuhua.png', active: 'input/wuhua_choose.png', road: 'luzhu/wuhua.png' },
  { value: 'wuxiao', name: '五小', image: 'input/wuxiao.png', active: 'input/wuxiao_choose.png', road: 'luzhu/wuxiao.png' },
  { value: 'bomb', name: '炸弹', image: 'input/zhadan.png', active: 'input/zhadan_choose.png', road: 'luzhu/zhadan.png' },
  { value: 'shu', name: '输', image: 'input/shu.png', active: 'input/shu_choose.png', road: 'luzhu/shu.png', noDealer: true },
  { value: 'kongmen', name: '空门', image: 'input/kongmen.png', active: 'input/kongmen_choose.png', road: 'luzhu/kongmen.png', noDealer: true }
];
