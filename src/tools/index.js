import { config } from '@/config';

/**
 * 判断数据类型
 */
export const getType = (value) => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
export const isNumber = (value) => getType(value) === 'number';
export const isString = (value) => getType(value) === 'string';
export const isArray = (value) => getType(value) === 'array';
export const isObject = (value) => getType(value) === 'object';
export const isBoolean = (value) => getType(value) === 'boolean';
export const isFunction = (value) => getType(value).toLowerCase().indexOf('function') > -1;
export const isNull = (value) => getType(value) === 'null';
export const isUndefined = (value) => getType(value) === 'undefined';
export const isPromise = (value) => getType(value) === 'promise';
export const isNode = (value) => !isNull(value) && !isUndefined(value) && Boolean(value.nodeName) && Boolean(value.nodeType);
export const isElement = (value) => isNode(value) && value.nodeType === 1;
export const isEmpty = (value) => value === undefined || value === '' || value === null;

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度
 * @param {string} [charset] - 可选，自定义字符集（默认为字母和数字）
 * @returns {string} - 随机字符串
 */
function _generateRandomString(length, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  let result = '';
  const charsetLength = charset.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    result += charset[randomIndex];
  }
  return result;
}

/**
 *  判断字符串是否是严格数字
 */
function _isValidNumberString(str) {
  // 预处理纯小数形式（如 .5 → 0.5）
  if (/^[-+]?\.\d+$/.test(str)) {
    str = str.replace(/^([-+]?)\./, '$10.');
  }

  // 修正后的单行正则表达式（移除换行符）
  const numberPattern = /^[-+]?(?:0(?:\.\d+)?|([1-9]\d*)(?:\.\d+)?|\.\d+|([1-9]\d*?)(?:\.\d+)?[eE][-+]?\d+)$/;

  // 排除前导零的整数（如 001、012.3）
  const hasInvalidLeadingZero = /^[-+]?0+[1-9]/.test(str);

  return !hasInvalidLeadingZero && numberPattern.test(str);
}

/**
 *  同步对象数据
 */
function _syncObjectData(target, remote) {
  Object.keys(target).forEach(function (name) {
    if (remote.hasOwnProperty(name)) {
      target[name] = remote[name];
    }
  });
  return target;
}

/**
 *  将数组转为对象
 */
function _mappingArrayToObject(array = [], key = 'id') {
  const result = {};
  if (!key) {
    array.forEach((item) => (result[item] = true));
  } else {
    array.forEach((item) => (result[item[key]] = item));
  }
  return result;
}

/**
 * 判断两个数组的值是否相等（忽略顺序）
 * @param {Array} arr1 - 第一个数组
 * @param {Array} arr2 - 第二个数组
 * @returns {boolean} - 如果两个数组的值相等（忽略顺序），返回 true；否则返回 false
 */
function _areArraysEqual(arr1, arr2) {
  if (!isArray(arr1)) arr1 = [];
  if (!isArray(arr2)) arr2 = [];

  // 如果长度不同，直接返回 false
  if (arr1.length !== arr2.length) return false;

  // 将数组转换为字符串（排序后）进行比较
  const sortedArr1 = JSON.stringify([...arr1].sort());
  const sortedArr2 = JSON.stringify([...arr2].sort());

  return sortedArr1 === sortedArr2;
}

/**
 *  根据id获取列表信息
 */
function _getListInfoById(id, list) {
  const key = list?.findIndex((val) => val.id === id);
  return list?.[key] ?? {};
}

/**
 *  获取json
 */
function _getJSON(value, def) {
  if (!value) return def;
  try {
    return JSON.parse(value);
  } catch (e) {
    return def;
  }
}

/**
 *  切割数组成固定大小的二维数组的函数
 */
function _chunkArray(array, size) {
  if (size <= 0) return [];
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 *  将一个数组切割成二维数组，并确保每个子数组中的元素值相同
 */
function _splitArrayByValue(array, field) {
  const result = [];
  let currentGroup = [];
  for (let i = 0; i < array.length; i++) {
    if (currentGroup.length === 0 || array[i][field] === currentGroup[0][field]) {
      // 如果当前组为空或元素和当前组的第一个元素相同，加入当前组
      currentGroup.push(array[i]);
    } else {
      // 否则，将当前组加入结果，重新开始一个新组
      result.push(currentGroup);
      currentGroup = [array[i]];
    }
  }

  // 最后一个组加入结果
  if (currentGroup.length > 0) {
    result.push(currentGroup);
  }

  return result;
}

// 根据数值获取像素
function _getPX(num) {
  if (isString(num) && num.indexOf('px') > -1) return num;
  return num + 'px';
}

// 根据像素获取数字
function _parsePX(num) {
  if (isString(num)) return Number(num.replace('px', ''));
  else return Number(num);
}

// 获取屏幕宽高
function _getWindowSize() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  };
}

// 限制小数点的位数
function _limitDecimal(number, decimals, isFloor = false) {
  if (isFloor) {
    const factor = Math.pow(10, decimals);
    return Math.floor(number * factor) / factor;
  } else {
    const factor = Math.pow(10, decimals);
    return Math.round(number * factor) / factor;
  }
}

// 处理canvas模糊问题，width, height要为初始大小
function _adaptDPR(canvas, ctx, width, height) {
  // 在初始化 canvas 的时候就要调用该方法
  const dpr = window.devicePixelRatio;
  // 重新设置 canvas 自身宽高大小和 css 大小。放大 canvas；css 保持不变，因为我们需要那么多的点
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  // 直接用 scale 放大整个坐标系，相对来说就是放大了每个绘制操作
  ctx.scale(dpr, dpr);
  // 接下来的绘制操作和往常一样，比如画个矩形 ctx2d.strokeRect(x, y, w, h);原来该怎么算就怎么算，该怎么调用还是怎么调用
}

/**
 * async错误处理
 * @return Promise 返回一个Promise
 */
function _toAwait(promise) {
  return promise.then((data) => [data, null]).catch((err) => [null, err]);
}

/**
 * 获取当前是否时全屏
 */
function _getFullscreen() {
  return !!(document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}

/**
 * 进入全屏模式
 */
function _enterFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    // Firefox
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    // IE/Edge
    document.documentElement.msRequestFullscreen();
  }
}

/**
 * 退出全屏模式
 */
function _exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    // Chrome, Safari and Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    // IE/Edge
    document.msExitFullscreen();
  }
}

/**
 * 切换全屏模式
 */
function _toggleFullscreen(element = document.documentElement) {
  const isFull = _getFullscreen();
  if (isFull) {
    _exitFullscreen();
  } else {
    _enterFullscreen();
  }
}

/**
 * 判断是否链接
 * @param {string} path
 * @returns {Boolean}
 */
function _isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @description对象格式化为Query语法
 * @param { Object } params
 * @return {string} Query语法
 */
function _objectToQuery(params) {
  let query = '';
  for (const props of Object.keys(params)) {
    const value = params[props];
    const part = encodeURIComponent(props) + '=';
    if (!isEmpty(value)) {
      if (isObject(value)) {
        for (const key of Object.keys(value)) {
          if (!isEmpty(value[key])) {
            const params = props + '[' + key + ']';
            const subPart = encodeURIComponent(params) + '=';
            query += subPart + encodeURIComponent(value[key]) + '&';
          }
        }
      } else {
        query += part + encodeURIComponent(value) + '&';
      }
    }
  }
  return query.slice(0, -1);
}

/**
 * @description 获取正确的路经
 * @param {String} path  数据
 */
function _getNormalPath(path) {
  if (path.length === 0 || !path || path === 'undefined') return path;
  const newPath = path.replace('//', '/');
  const length = newPath.length;
  if (newPath[length - 1] === '/') {
    return newPath.slice(0, length - 1);
  }
  return newPath;
}

/**
 * Hump naming=>Middle line naming
 */
function _kebabCase(name) {
  if (!isString(name)) warn('Name must be a string');
  const hyphenateRE = /([^-])([A-Z])/g;
  return name.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
}

/**
 *  Middle horizontal line naming=>Hump naming
 */
function _camelCase(name) {
  if (!isString(name)) warn('Name must be a string');
  const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g;
  const MOZ_HACK_REGEXP = /^moz([A-Z])/;
  return name
    .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1');
}

/**
 * 计算颜色透明度减淡
 */
function _calcColor(color, opacity) {
  // 规范化透明度值在 0 ~ 1 之间
  opacity = Math.min(1, Math.max(0, opacity));

  // 检查颜色是否是 hex 格式
  const isHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const isRgb = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
  const isRgba = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-9.]+\s*\)$/;

  let r = 0,
    g = 0,
    b = 0;

  if (isHex.test(color)) {
    // 如果是 hex 格式 (#ffffff 或 #fff)
    const hex = color.slice(1);

    // 如果是3位短格式，扩展为6位
    const fullHex =
      hex.length === 3
        ? hex
            .split('')
            .map((h) => h + h)
            .join('')
        : hex;

    // 转换为 RGB
    r = parseInt(fullHex.substring(0, 2), 16);
    g = parseInt(fullHex.substring(2, 4), 16);
    b = parseInt(fullHex.substring(4, 6), 16);
  } else if (isRgb.test(color)) {
    // 如果是 rgb 格式 (rgb(255, 255, 255))
    const rgbValues = color.match(/\d+/g);
    if (rgbValues) {
      r = parseInt(rgbValues[0]);
      g = parseInt(rgbValues[1]);
      b = parseInt(rgbValues[2]);
    }
  } else if (isRgba.test(color)) {
    // 如果是 rgba 格式 (rgba(255, 255, 255, 1))
    const rgbaValues = color.match(/\d+(\.\d+)?/g);
    if (rgbaValues) {
      r = parseInt(rgbaValues[0]);
      g = parseInt(rgbaValues[1]);
      b = parseInt(rgbaValues[2]);
    }
  } else {
    throw new Error('Unsupported color format');
  }
  // 返回转换后的 rgba 颜色值
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * 深度克隆
 */
function _deepClone(json) {
  let obj = null;
  if (isArray(json)) {
    obj = [];
    json.forEach((item) => obj.push(_deepClone(item)));
  } else if (isObject(json)) {
    obj = {};
    for (let key in json) {
      obj[key] = _deepClone(json[key]);
    }
  } else {
    return json;
  }
  return obj;
}

/**
 * @description 树转数组，队列实现广度优先遍历
 * @param {Array} data  数据
 * @param {Object} props `{ children: 'children' }`
 */

function _treeToArray(data, props = { children: 'children' }) {
  data = _deepClone(data);
  const { children } = props;
  const newData = [];
  const queue = [];
  data.forEach((child) => queue.push(child));
  while (queue.length) {
    const item = queue.shift();
    if (item[children]) {
      item[children].forEach((child) => queue.push(child));
      delete item[children];
    }
    newData.push(item);
  }
  return newData;
}

// 将列表转为树形结构
function _arrayToTree(arr, { id = 'id', pid = 'pid', label = 'label', children = 'children', iterator, start } = {}) {
  const map = {}; // 存储 id -> 节点映射
  const result = []; // 存储最终的树形结构
  if (start) start(result);
  const getLevel = (node) => {
    let current = node[pid];
    let res = 1;
    while (!!current) {
      res = res + 1;
      current = map[current]?.[pid] ?? null;
    }
    return res;
  };
  const getLabel = (node) => {
    let current = node[pid];
    const res = [node?.[label]];
    while (!!current) {
      res.push(map[current]?.[label]);
      current = map[current]?.[pid] ?? null;
    }
    return res.reverse().join('/');
  };
  // 第一次遍历：创建节点映射
  arr.forEach((item) => {
    map[item[id]] = { ...item, [children]: [] }; // 初始化 children 数组
    if (iterator) iterator(map[item[id]]);
  });
  // 第二次遍历：组装树形结构
  arr.forEach((item) => {
    const node = map[item[id]];
    node.LEVEL = getLevel(node);
    node.LABEL = getLabel(node);
    if (!item[pid]) {
      result.push(node); // 根节点直接放入结果数组
    } else {
      map[item[pid]][children].push(node); // 挂到父节点的 children 上
    }
  });
  return result;
}

/**
 * 查找指定节点的所有层级的子元素
 * @param {Array} flatTree - 平铺的树形结构数组，元素需包含 id 和 parentId 字段
 * @param {string|number} targetId - 要查找的目标节点ID
 * @returns {Array} 包含所有子元素的数组（按层级顺序排列）
 * @returns {Object} 字段描述
 */
function _findAllChildren(flatTree, targetId, { id = 'id', pid = 'pid' } = {}) {
  // 创建映射表：parentId → 子节点数组（使用 Map 支持 null 作为键）
  const parentMap = new Map();

  // 构建映射关系
  for (const node of flatTree) {
    const key = node[pid]; // 保留原始类型（支持 number/string/null）
    if (!parentMap.has(key)) {
      parentMap.set(key, []);
    }
    parentMap.get(key).push(node);
  }

  // 结果集和队列初始化
  const result = [];
  const queue = parentMap.get(targetId) ? [...parentMap.get(targetId)] : [];

  // 广度优先搜索（BFS）遍历
  while (queue.length > 0) {
    const currentNode = queue.shift();
    result.push(currentNode); // 将当前节点加入结果

    // 将当前节点的子节点加入队列
    const children = parentMap.get(currentNode[id]) || [];
    queue.push(...children);
  }

  return result;
}

/**
 * 查找指定节点的所有层级的子元素
 * @param {Array} flatTree - 平铺的树形结构数组，元素需包含 id 和 parentId 字段 | 树的map
 * @param {string|number} targetId - 要查找的目标节点ID
 * @returns {Array} 包含所有子元素的数组（按层级顺序排列）
 * @returns {Object} 字段描述
 */
function _findAllParent(flatTree, targetId, { id = 'id', pid = 'pid' } = {}) {
  const map = isArray(flatTree) ? _mappingArrayToObject(flatTree, id) : flatTree;
  const result = [];
  let current = map[targetId]?.[pid];
  while (!!current) {
    result.push(current);
    current = map[current]?.[pid];
  }
  return result;
}

/**
 * 按规则删除数组元素
 * @param {Array} arr - 目标数组
 * @param {Function} condition - 删除条件函数，接收 (element, index, array) 参数，返回 true 表示删除
 * @param {Object} [options] - 配置选项
 * @param {Boolean} [options.inPlace=false] - 是否修改原数组
 * @param {Boolean} [options.keepRemoved=false] - 是否保留被删除元素
 * @param {Boolean} [options.deepClone=false] - 是否深拷贝原数组（非 inPlace 时生效）
 * @returns {Array} 根据配置返回新数组或原数组（当 inPlace 为 true 时）
 */
function _removeElements(arr, condition, options = {}) {
  const { inPlace = true, keepRemoved = false, deepClone = false } = options;

  // 处理原始数据
  let workingArray = inPlace ? arr : deepClone ? JSON.parse(JSON.stringify(arr)) : [...arr];

  const removed = [];

  // 逆向遍历避免索引错位
  for (let i = workingArray.length - 1; i >= 0; i--) {
    const shouldRemove = condition(workingArray[i], i, workingArray);

    if (shouldRemove) {
      const [removedItem] = workingArray.splice(i, 1);
      if (keepRemoved) {
        removed.unshift(removedItem); // 保持原始顺序
      }
    }
  }

  return inPlace ? (keepRemoved ? { result: workingArray, removed } : workingArray) : workingArray;
}

/**
 * 延时执行
 */
function _delayExec(time) {
  let timer = null;
  return new Promise((resolve) => {
    timer = setTimeout(() => resolve(), time);
  });
}

/**
 * 格式化字典数据
 */
function _parseDict(list) {
  if (!isArray(list)) return {};
  const map = {};
  list.forEach((item) => {
    if (isEmpty(item.value)) item.value = item.id; // 适配部分远程数据
    map[item.value] = item;
  });
  return map;
}

// 判断元素是否可见
function _isDisplayNone(element) {
  if (element === document.body) return null;
  if (!isElement(element)) return null;
  if (window.getComputedStyle(element).display === 'none') return element;
  return _isDisplayNone(element.parentNode);
}

// 获取文档相对位置
function _getOffsetDOM(element, end = null) {
  let actualLeft = element.offsetLeft;
  let actualTop = element.offsetTop;
  let current = element.offsetParent;
  while (current !== end && !!current) {
    actualLeft += current.offsetLeft;
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return { x: actualLeft, y: actualTop };
}

// 获取指定父节点
function _getAppointDOM(element, check) {
  let current = element.parentNode;
  while (!check(current) && !!current && current !== document.body) {
    current = current.parentNode;
  }
  return current;
}

// 获取Element错误
function _getElementError(valid) {
  for (let n in valid) {
    const message = valid[n]?.[0]?.message;
    if (message) return message;
  }
}

// 打印指定html
function _printElement(elemString) {
  const iframe = document.createElement('iframe');
  iframe.id = 'myIframe';
  iframe.setAttribute('style', 'position:absolute; width:0; height:0; top:-10px; left:-10px;');
  const aa = document.body.appendChild(iframe);
  const iframeDoc = iframe.contentDocument ?? iframe.contentWindow.document;
  const iframeWin = iframe.contentWindow ?? iframe.contentDocument;
  iframeDoc.write(`<html><head><title>${document.title}</title>`);
  iframeDoc.write('<style>html,body{margin:0;padding:0;-webkit-print-color-adjust: exact;}</style>');
  iframeDoc.write('</head><body >');
  iframeDoc.write(elemString);
  iframeDoc.write('</body></html>');
  iframeDoc.close();
  iframe.onload = () => {
    iframeWin.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 500);
  };
}

// 获取UUID
function _generateUUID() {
  let timestamp = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (timestamp + Math.random() * 16) % 16 | 0;
    timestamp = Math.floor(timestamp / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// 获取数据库图片基础地址
function _getBaseImagUrl(str) {
  if (!str || !isString(str)) return str;
  if (str.indexOf('http') === 0) {
    return str;
  } else if (str.indexOf(config.baseImage) === 0) {
    return str;
  } else if (str.indexOf(config.baseImage.slice(1)) === 0) {
    return '/' + str;
  } else if (str.indexOf(config.baseImageCountry) === 0) {
    return str;
  } else if (str.indexOf(config.baseImageCountry.slice(1)) === 0) {
    return '/' + str;
  } else if (str.indexOf(config.baseImageExtend) === 0) {
    return str;
  } else if (str.indexOf(config.baseImageExtend.slice(1)) === 0) {
    return '/' + str;
  } else {
    return config.baseImage + str;
  }
}

// 相册的头像
function _getAlbumDef(str, relative = true) {
  const list = _getJSON(str, null);
  const url = !!list ? list[0] : str;
  return _getBaseImagUrl(url);
}

// 获取相对地址图片连接
function _getFileImageUrl(item) {
  const url = item.uri + (item.detail ? '?' + item.detail : '');
  if (!isString(url)) return url;
  if (url.indexOf('http') === 0) {
    return _getBaseImagUrl(URL.parse(url).pathname + URL.parse(url).search);
  } else if (url.charAt(0) !== '/') {
    return _getBaseImagUrl('/' + url);
  } else {
    return _getBaseImagUrl(url);
  }
}

// 获取绝对地址图片连接
function _getUrlAndOrigin(str) {
  const prefix = window.location.origin + config.pagePrefix;
  if (str.indexOf('http') === 0) {
    return str;
  } else if (str.charAt(0) !== '/') {
    return prefix + _getBaseImagUrl('/' + str);
  } else {
    return prefix + _getBaseImagUrl(str);
  }
}

// 获取货币本地图片
function _getCurrencyImage(name) {
  return config.baseImageCountry + '/' + name;
}

// 获取货币本地图片
function _getRoadNiuImage(name) {
  return config.baseImageRoadNiu + '/' + name;
}

// 复制文字
function _copyText(content) {
  const node = document.createElement('INPUT');
  node.style.cssText = 'position: fixed; top: -100000px;';
  document.body.appendChild(node);
  node.value = content;
  node.focus();
  node.select();
  let range = document.createRange();
  range.selectNodeContents(node);
  let sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  node.setSelectionRange(0, 9999);
  document.execCommand('copy');
  node.blur();
  document.body.removeChild(node);
}

// 格式化千分位
function _formatThousand(numStr) {
  if (typeof numStr !== 'number' && typeof numStr !== 'string') return '';

  if (typeof numStr !== 'string') numStr = String(numStr);

  // 去除首尾空格
  numStr = numStr.trim();

  // 分离整数和小数部分
  let [integer, decimal] = numStr.split('.');

  // 给整数部分加千分位
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 组合整数和小数部分
  return decimal ? `${integer}.${decimal}` : integer;
}

// 光标移至最后
function _moveCursorToEnd(inputElement) {
  if (inputElement && inputElement.focus) {
    // 使输入框获得焦点
    inputElement.focus();

    // 将光标移到文本末尾
    const length = inputElement.value.length;
    inputElement.setSelectionRange(length, length);
  }
}

// 滚动
function _smoothScrollTo(scrollTo, from, to, finish, duration = 300) {
  const distance = to - from;
  const startTime = performance.now();
  function scrollAnimation(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1); // 进度在 0 到 1 之间

    // 使用缓动函数（这里使用 easeInOutQuad）
    const ease = progress < 0.5 ? 2 * progress ** 2 : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    scrollTo(from + distance * ease);
    if (progress < 1) {
      requestAnimationFrame(scrollAnimation);
    } else {
      if (finish) finish();
    }
  }
  requestAnimationFrame(scrollAnimation);
}

// Element滚动条滚动到底
function _elementScrollToEnd(ref) {
  const scrollWrap = ref?.wrapRef;
  if (scrollWrap) {
    const contentWrap = scrollWrap.querySelector('.el-scrollbar__view');
    const wrapHeight = contentWrap.clientHeight;
    const contentHeight = contentWrap.scrollHeight;
    _smoothScrollTo(
      (value) => {
        ref.setScrollLeft(value);
      },
      contentWrap.scrollTop,
      contentHeight - wrapHeight
    );
  }
}

// Element滚动条滚动到右侧
function _elementScrollToRight(ref) {
  const scrollWrap = ref?.wrapRef;
  if (scrollWrap) {
    const contentWrap = scrollWrap.querySelector('.el-scrollbar__view');
    const wrapWidth = contentWrap.clientWidth;
    const contentWidth = contentWrap.scrollWidth;
    _smoothScrollTo(
      (value) => {
        ref.setScrollLeft(value);
      },
      contentWrap.scrollLeft,
      contentWidth - wrapWidth
    );
  }
}

// 保留有效的N位小数
function _toFixedDecimals(value, n) {
  if (typeof value !== 'number' || typeof n !== 'number' || n <= 0) {
    throw new Error('Invalid input: value must be a number and n must be a positive integer');
  }

  const factor = Math.pow(10, n); // 10 的 n 次幂
  return Math.floor(value * factor) / factor; // 乘以 factor 后取整，再除以 factor
}

// 计算酒店天数，参数单位为秒
function _calculateStayDays(checkInDate, checkOutDate) {
  const checkIn = new Date(_formatServerTime(checkInDate));
  const checkOut = new Date(_formatServerTime(checkOutDate));

  // 确保退房日期晚于入住日期
  if (checkOut <= checkIn) return 0;

  // 小于6个小时，算半天
  if (Math.floor((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)) <= 6) return 0.5;

  if (checkIn.getHours() < 6) {
    // 如果是凌晨 0:00 - 6:00 入住，按前一天计算
    checkIn.setDate(checkIn.getDate() - 1);
  }

  // 将入住时间设置为当天0点
  checkIn.setHours(0, 0, 0, 1);

  // 计算入住天数
  const timeDifference = checkOut.getTime() - checkIn.getTime(); // 毫秒差值

  // 转换为天数
  return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
}

// 判断是否是移动端
function _isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // 常见移动端设备的关键词
  const mobileKeywords = [
    'Android',
    'iPhone',
    'iPad',
    'iPod',
    'BlackBerry',
    'IEMobile',
    'Opera Mini',
    'HarmonyOS', // 鸿蒙系统关键字
    'HONOR', // 部分鸿蒙设备（荣耀）关键字
    'HMSCore' // 鸿蒙 HMS Core 关键字
  ];

  // 判断是否包含任意关键词
  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
}

// 判断索引是否存在数组中
function _checkIndexArray(index) {
  return index > -1;
}

// 获取数组最后一条数据的索引
function _getArrayLastKey(list) {
  return list.length - 1;
}

// 获取两个ID组成的key
function _getMultipleKey(k1, k2, k3 = '') {
  return k1 + '-' + k2 + '-' + k3;
}

// 字符串去除首尾空格
function _stringTrim(str) {
  if (!isString(str)) return str;
  return str.replace(/^\s+|\s+$/g, '');
}

// 返回计算后的金额
function _calcAmount(value, returnNumber = true) {
  return Number(value).toFixed(2, returnNumber);
}

// 计算元素文本宽度（工具函数）
function _getTextWidth(text, element) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const style = window.getComputedStyle(element);
  context.font = `${style.fontSize} ${style.fontFamily}`;
  return context.measureText(text).width + _parsePX(style.paddingLeft);
}

// 根据标号获取位置
function _getPositionBySize(x, y, size) {
  const left = _getPX(x * size);
  const top = _getPX(y * size);
  const width = _getPX(size);
  const height = _getPX(size);
  return { top, left, width, height };
}

// 页面重新刷新
function _pageReload() {
  window.location.reload();
}

// 格式化服务器时间
function _formatServerTime(time) {
  if (!!time) return time * 1000;
  else return time;
}

// 格式化服务器时间
function _resolveServerTime(time) {
  if (!!time) return Math.floor(time / 1000);
  else return time;
}

// 格式化服务器时间
function _getTimeFormat(type) {
  if (type === 'day') {
    return 'YYYY-MM-DD';
  } else if (type === 'month') {
    return 'YYYY-MM';
  } else {
    return 'YYYY-MM-DD HH:mm:ss';
  }
}

// 动态设置网站Favicon
function _changeFavicon(iconUrl) {
  const link = document.querySelector('link[rel*="icon"]') || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = iconUrl;
  document.getElementsByTagName('head')[0].appendChild(link);
}

// 根据路径获取文件名
function _getFilenameByUrl(path) {
  // 同时匹配正斜杠和反斜杠作为分隔符
  return path.split(/[/\\]/).pop();
}

// 获取文件路径后缀
function _getFileExtension(path) {
  // 步骤分解：
  // 1. 去除URL查询参数和哈希片段（网页7策略扩展）
  const cleanPath = path.split(/[?#]/)[0];

  // 2. 提取纯文件名（兼容Windows/Linux路径分隔符，网页1逻辑加强）
  const filename = cleanPath.split(/[\\/]/).pop() || '';

  // 3. 处理无后缀名/隐藏文件/多扩展名（网页3算法优化）
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/*
 * 执行多个传入的方法
 * @param {...Function} fns - 要执行的多个函数（支持任意数量）
 * @returns {Array} 各方法的执行结果数组
 */
function _executeMethods(...fns) {
  return fns.map((fn) => {
    if (typeof fn !== 'function') {
      throw new TypeError('参数必须为函数类型');
    }
    try {
      return fn();
    } catch (e) {
      console.error('方法执行失败:', e.message);
      return null;
    }
  });
}
/*
 * 解析 URL 参数（兼容旧浏览器）
 * @param {string} url - 待解析的 URL
 * @returns {Object} 参数键值对对象
 */
function _parseUrlParams(url) {
  const params = {};
  const queryString = url.split('?')[1] || '';
  queryString.split('&').forEach((pair) => {
    const [encodedKey, encodedValue = ''] = pair.split('=');
    const key = decodeURIComponent(encodedKey.replace(/\+/g, ' '));
    const value = decodeURIComponent(encodedValue.replace(/\+/g, ' '));
    // 同名参数保留最后一个值（与现代方法行为一致）
    params[key] = value;
  });
  return params;
}

/*
 * 获取参数对应的值
 */
function _getPathValue(path, map) {
  if (typeof path !== 'string') return '';
  let paths = path.split('.');
  let result = map;
  for (let i = 0; i <= paths.length - 1; i++) {
    if (typeof result === 'object' && result !== null) {
      result = result[paths[i]];
    } else {
      result = undefined;
    }
  }
  return result;
}

// 将File转为Base64
function _fileToBase64(file, imgInfo = false) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject(new Error('参数必须是 File 对象'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (!!imgInfo) {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          console.log({ width: img.width, height: img.height }, '------------1111');
          resolve({ base64: reader.result, width: img.width, height: img.height });
        };
      } else {
        resolve({ base64: reader.result });
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 生成随机字符串
export const generateRandomString = _generateRandomString;
// 判断字符串是否是严格数字
export const isValidNumberString = _isValidNumberString;
// 同步对象数据
export const syncObjectData = _syncObjectData;
// 将数组转为对象
export const mappingArrayToObject = _mappingArrayToObject;
// 判断两个数组的值是否相等
export const areArraysEqual = _areArraysEqual;
// 根据id获取列表信息
export const getListInfoById = _getListInfoById;
// 获取json
export const getJSON = _getJSON;
// 切割数组成固定大小的二维数组的函数
export const chunkArray = _chunkArray;
// 将一个数组切割成二维数组，并确保每个子数组中的元素值相同
export const splitArrayByValue = _splitArrayByValue;
// 根据数值获取像素
export const getPX = _getPX;
// 根据像素获取数字
export const parsePX = _parsePX;
// 获取屏幕宽高
export const getWindowSize = _getWindowSize;
// 限制小数点的位数
export const limitDecimal = _limitDecimal;
// 处理canvas模糊问题，width, height要为初始大小
export const adaptDPR = _adaptDPR;
// async错误处理
export const toAwait = _toAwait;
// 获取当前是否时全屏
export const getFullscreen = _getFullscreen;
// 进入全屏模式
export const enterFullscreen = _enterFullscreen;
// 退出全屏模式
export const exitFullscreen = _exitFullscreen;
// 切换全屏模式
export const toggleFullscreen = _toggleFullscreen;
// 判断是否链接
export const isExternal = _isExternal;
// 对象格式化为Query语法
export const objectToQuery = _objectToQuery;
// 获取正确的路经
export const getNormalPath = _getNormalPath;
// 驼峰=>中划线
export const kebabCase = _kebabCase;
// 中划线=>驼峰
export const camelCase = _camelCase;
// 计算颜色透明度减淡
export const calcColor = _calcColor;
// 深度克隆
export const deepClone = _deepClone;
// 树转数组，队列实现广度优先遍历
export const treeToArray = _treeToArray;
// 将列表转为树形结构
export const arrayToTree = _arrayToTree;
// 查找指定节点的所有层级的子元素
export const findAllChildren = _findAllChildren;
// 查找指定节点的所有层级的父元素
export const findAllParent = _findAllParent;
// 按规则删除数组元素
export const removeElements = _removeElements;
// 延时执行
export const delayExec = _delayExec;
// 格式化字典数据
export const parseDict = _parseDict;
// 判断元素是否可见
export const isDisplayNone = _isDisplayNone;
// 获取文档相对位置
export const getOffsetDOM = _getOffsetDOM;
// 获取指定父节点
export const getAppointDOM = _getAppointDOM;
// 获取Element错误
export const getElementError = _getElementError;
// 打印指定html
export const printElement = _printElement;
// 获取UUID
export const generateUUID = _generateUUID;
// 获取数据库图片基础地址
export const getBaseImagUrl = _getBaseImagUrl;
// 相册的头像
export const getAlbumDef = _getAlbumDef;
// 获取相对地址图片连接
export const getFileImageUrl = _getFileImageUrl;
// 获取绝对地址图片连接
export const getUrlAndOrigin = _getUrlAndOrigin;
// 获取货币本地图片
export const getCurrencyImage = _getCurrencyImage;
// 获取货币本地图片
export const getRoadNiuImage = _getRoadNiuImage;
// 复制文字
export const copyText = _copyText;
// 格式化千分位
export const formatThousand = _formatThousand;
// 光标移至最后
export const moveCursorToEnd = _moveCursorToEnd;
// 丝滑-滚动
export const smoothScrollTo = _smoothScrollTo;
// Element滚动条滚动到底
export const elementScrollToEnd = _elementScrollToEnd;
// Element滚动条滚动到右侧
export const elementScrollToRight = _elementScrollToRight;
// 保留有效的N位小数
export const toFixedDecimals = _toFixedDecimals;
// 计算酒店天数，参数单位为秒
export const calculateStayDays = _calculateStayDays;
// 判断是否是移动端
export const isMobileDevice = _isMobileDevice;
// 判断索引是否存在数组中
export const checkIndexArray = _checkIndexArray;
// 获取数组最后一条数据的索引
export const getArrayLastKey = _getArrayLastKey;
// 获取两个ID组成的key
export const getMultipleKey = _getMultipleKey;
// 字符串去除首尾空格
export const stringTrim = _stringTrim;
// 返回计算后的金额
export const calcAmount = _calcAmount;
// 计算元素文本宽度（工具函数）
export const getTextWidth = _getTextWidth;
// 根据标号获取位置
export const getPositionBySize = _getPositionBySize;
// 页面重新刷新
export const pageReload = _pageReload;
// 格式化服务器时间
export const formatServerTime = _formatServerTime;
// 恢复服务器时间
export const resolveServerTime = _resolveServerTime;
// 格式化服务器时间
export const getTimeFormat = _getTimeFormat;
// 根据路径获取文件名
export const getFilenameByUrl = _getFilenameByUrl;
// 获取文件路径后缀
export const getFileExtension = _getFileExtension;
// 获取文件路径后缀
export const changeFavicon = _changeFavicon;
// 执行多个传入的方法
export const executeMethods = _executeMethods;
//  解析 URL 参数（兼容旧浏览器）
export const parseUrlParams = _parseUrlParams;
// 获取参数对应的值
export const getPathValue = _getPathValue;
// 将File转为Image
export const fileToBase64 = _fileToBase64;
