import { GAME_MODEL, GAME_MODEL_TYPE_BACCARAT } from '@/values';
import { deepClone } from '@/tools';

export const POINTS_BACCARAT = {
  b: {
    name: 'B',
    color: '#ff0303',
    fill: 'rgba(255,3,3,0.3)',
    points: [
      [373, 220],
      [473, 220],
      [473, 320],
      [373, 320]
    ]
  },
  p: {
    name: 'P',
    color: '#046ee6',
    fill: 'rgba(4,110,230,0.3)',
    points: [
      [515, 220],
      [615, 220],
      [615, 320],
      [515, 320]
    ]
  }
};

export const POINTS_NIU = {
  b: {
    name: 'B',
    color: '#ff0303',
    fill: 'rgba(255,3,3,0.3)',
    points: [
      [376, 172],
      [615, 172],
      [614, 274],
      [376, 272]
    ]
  },
  s1: {
    name: 'S1',
    color: '#046ee6',
    fill: 'rgba(4,110,230,0.3)',
    points: [
      [865, 198],
      [991, 198],
      [991, 390],
      [860, 333],
      [866, 301]
    ]
  },
  s2: {
    name: 'S2',
    color: '#046ee6',
    fill: 'rgba(4,110,230,0.3)',
    points: [
      [825, 390],
      [858, 339],
      [991, 398],
      [991, 551],
      [859, 551],
      [737, 406]
    ]
  },
  s3: {
    name: 'S3',
    color: '#046ee6',
    fill: 'rgba(4,110,230,0.3)',
    points: [
      [502, 409],
      [729, 407],
      [849, 552],
      [502, 551]
    ]
  },
  s5: {
    name: 'S5',
    color: '#046ee6',
    fill: 'rgba(4,110,230,0.3)',
    points: [
      [277, 410],
      [494, 410],
      [495, 551],
      [171, 553]
    ]
  },
  s6: {
    name: 'S6',
    color: '#046ee6',
    fill: 'rgba(4,110,230,0.3)',
    points: [
      [143, 346],
      [183, 393],
      [270, 408],
      [162, 552],
      [6, 551],
      [6, 402]
    ]
  },
  s7: {
    name: 'S7',
    color: '#046ee6',
    fill: 'rgba(4,110,230,0.3)',
    points: [
      [6, 200],
      [131, 199],
      [133, 309],
      [141, 339],
      [6, 394]
    ]
  }
};

// 获取默认点位
export const getDefPoints = (gameModel) => {
  if (GAME_MODEL_TYPE_BACCARAT.includes(gameModel)) {
    return deepClone(POINTS_BACCARAT);
  } else if (gameModel === GAME_MODEL.niu_niu) {
    return deepClone(POINTS_NIU);
  }
};
