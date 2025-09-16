import { STATUS_VALUE } from '@/values';

export function getExchangeStatus(value) {
  return value === STATUS_VALUE.disable ? STATUS_VALUE.normal : STATUS_VALUE.disable;
}
