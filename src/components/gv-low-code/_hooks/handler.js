import { useKeydownSpace } from './keydown.js';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { GLC_FIELD, WIDGET_MAP } from '../_models/index.js';
import { usePosNumber } from './number.js';
import { deepClone, getJSON } from '@/tools';

export function useHandler(getRef, getConfig) {
  // 当前编辑模板
  const current = ref();

  // 当前页面配置json
  const schema = reactive([]);

  // 是否按下空格键
  const isEnterSpace = ref(false);

  // 监听按下空格键
  const listenerKeydownSpace = () => {
    useKeydownSpace(
      () => {
        isEnterSpace.value = true;
        document.body.style.cursor = 'grab';
      },
      () => {
        isEnterSpace.value = false;
        document.body.style.cursor = null;
      }
    );
  };

  // 是否接受拖拽元素
  const handleDrop = (e) => {
    e.preventDefault();
    const content = getRef().querySelector('.canvas-content').getBoundingClientRect();
    const config = getConfig();
    const offset = { x: usePosNumber((e.pageX - content.x) / config.scale), y: usePosNumber((e.pageY - content.y) / config.scale) };
    const transfer = getJSON(e.dataTransfer.getData('text/plain'), {});
    if (!WIDGET_MAP[transfer.mark]) return;
    const temp = deepClone(WIDGET_MAP[transfer.mark]);
    temp.uid = String(Date.now());
    temp.config = {};
    temp.extend = transfer.extend;
    temp.attribute.forEach((item) => {
      temp.config[item.field] = item.def;
      if (item.type === GLC_FIELD.position) temp.config[item.field] = offset;
    });
    delete temp.attribute;
    schema.push(temp);
  };

  // 设置当前选中项
  const setCurrent = (uid) => {
    current.value = uid;
  };

  // 清除当前选中项
  const clearCurrent = () => {
    current.value = null;
  };

  // 设置某个模型的某个值
  const setSchema = (uid, field, value, attr) => {
    if (!attr) {
      const key = schema.findIndex((val) => val.uid === uid);
      if (key <= -1) return;
      schema[key].config[field] = value;
    } else {
      const key = schema.findIndex((val) => val.uid === uid);
      if (key <= -1) return;
      const fullValue = { ...schema[key].config[field] };
      fullValue[attr] = value;
      schema[key].config[field] = fullValue;
    }
  };

  // 追加模型
  const addSchema = (info) => {
    const id = String(Date.now());
    schema.push({ ...info, uid: id });
    return id;
  };

  // 重置模型
  const resetSchema = (list) => {
    schema.splice(0);
    schema.push(...list);
  };

  // 层级操作，置顶top，置底bottom，上移up，下移down，删除delete
  const setZIndex = (uid, type) => {
    const index = schema.findIndex((val) => val.uid === uid);
    if (index <= -1) return;
    if (type === 'top') {
      const item = schema.splice(index, 1)[0];
      schema.push(item);
    } else if (type === 'bottom') {
      const item = schema.splice(index, 1)[0];
      schema.unshift(item);
    } else if (type === 'up') {
      if (index < schema.length - 1) [schema[index], schema[index + 1]] = [schema[index + 1], schema[index]];
    } else if (type === 'down') {
      if (index > 0) [schema[index], schema[index - 1]] = [schema[index - 1], schema[index]];
    } else if (type === 'delete') {
      schema.splice(index, 1);
      clearCurrent();
    }
  };

  onMounted(() => {
    getRef().addEventListener('mousedown', clearCurrent);
  });

  onBeforeUnmount(() => {
    getRef().removeEventListener('mousedown', clearCurrent);
  });

  listenerKeydownSpace();

  return { current, setCurrent, schema, setSchema, addSchema, resetSchema, setZIndex, isEnterSpace, handleDrop };
}
