import { calcAmount } from '@/tools/index';

// 检查彩金金额
export function checkBonusAmountBySetting(amount, setting) {
  const bonus = Number(amount);
  const remainder = bonus % setting.mini_amount;
  const multiple = calcAmount(bonus / setting.mini_amount);
  return bonus > 0 && remainder === 0 && multiple <= setting.max_multiple;
}
