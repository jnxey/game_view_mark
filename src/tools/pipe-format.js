import { isArray, isObject, isString } from '@/tools/index';

// 默认值设为Null管道
export function pipeToNull(data, options) {
  if (isObject(data)) {
    Object.keys(options).forEach((name) => {
      if (data[name] === options[name]) data[name] = null;
    });
  }
  if (isArray(data)) {
    data.forEach((item) => {
      Object.keys(options).forEach((name) => {
        if (item[name] === options[name]) item[name] = null;
      });
    });
  }
  return data;
}

// 默认值设为Number管道
export function pipeToNumber(data, fields) {
  if (isObject(data)) {
    fields.forEach((name) => {
      if (isString(data[name])) data[name] = Number(data[name]);
    });
  }
  if (isArray(data)) {
    data.forEach((item) => {
      fields.forEach((name) => {
        if (isString(item[name])) item[name] = Number(item[name]);
      });
    });
  }
  return data;
}
