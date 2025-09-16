class SessionManager {
  constructor(namespace = '') {
    this.namespace = namespace ? `${namespace}:` : '';
  }

  /**
   * 设置数据到 sessionStorage
   * @param {string} key - 键名
   * @param {*} value - 值（支持字符串、数字、对象、数组等）
   */
  set(key, value) {
    const fullKey = this._getFullKey(key);
    const serializedValue = JSON.stringify({ data: value, type: typeof value });
    sessionStorage.setItem(fullKey, serializedValue);
  }

  /**
   * 获取 sessionStorage 中的数据
   * @param {string} key - 键名
   * @returns {*} - 返回存储的原始数据类型（字符串、数字、对象等），如果不存在返回 null
   */
  get(key) {
    const fullKey = this._getFullKey(key);
    const item = sessionStorage.getItem(fullKey);

    if (item === null) return null;

    try {
      const { data, type } = JSON.parse(item);

      // 处理 JSON 类型自动解析
      if (type === 'number') return Number(data);
      if (type === 'boolean') return Boolean(data);
      if (type === 'object') return data; // 自动返回对象或数组
      return data; // 默认返回字符串
    } catch (error) {
      console.warn(`Failed to parse sessionStorage item for key: ${key}`);
      return null;
    }
  }

  /**
   * 删除指定的 sessionStorage 数据
   * @param {string} key - 键名
   */
  remove(key) {
    const fullKey = this._getFullKey(key);
    sessionStorage.removeItem(fullKey);
  }

  /**
   * 清除当前命名空间下的所有数据
   */
  clear() {
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this.namespace)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  }

  /**
   * 获取所有存储的键名
   * @returns {Array<string>} - 返回键名数组
   */
  keys() {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this.namespace)) {
        keys.push(key.replace(this.namespace, ''));
      }
    }
    return keys;
  }

  /**
   * 获取完整的键名（带命名空间）
   * @param {string} key - 键名
   * @returns {string} - 带命名空间的完整键名
   * @private
   */
  _getFullKey(key) {
    return `${this.namespace}${key}`;
  }
}

// 初始化 StorageManager
const _session = new SessionManager('GV');

export const session = _session;
