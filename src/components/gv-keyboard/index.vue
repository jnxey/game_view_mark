<template>
  <teleport to="#app">
    <div class="gv-keyboard" :style="contentStyle">
      <div class="header-warp" ref="elRef" @pointerdown.prevent.stop />
      <span class="change-btn flex-row align-center cursor-pointer" @pointerdown.prevent.stop @click="toggle">{{ changBtnName }}</span>
      <span class="close-icon flex-row align-center justify-center cursor-pointer" @click="close">
        <gv-icon name="el-icon-close" class="fz-16" />
      </span>
      <!--  数字  -->
      <div v-if="currentType === KEYBOARD_TYPE.number" class="keyboard numbers" id="numberKeyboard" @pointerdown.prevent.stop>
        <div class="key" @click="setValue(1)">1</div>
        <div class="key" @click="setValue(2)">2</div>
        <div class="key" @click="setValue(3)">3</div>
        <div class="key" @click="setValue(4)">4</div>
        <div class="key" @click="setValue(5)">5</div>
        <div class="key" @click="setValue(6)">6</div>
        <div class="key" @click="setValue(7)">7</div>
        <div class="key" @click="setValue(8)">8</div>
        <div class="key" @click="setValue(9)">9</div>
        <div class="key" @click="setValue(KEYBOARD_SPECIAL.horizontalBar)">-</div>
        <div class="key" @click="setValue(0)">0</div>
        <div class="key" @click="setValue(KEYBOARD_SPECIAL.delete)">⌫</div>
      </div>
      <!-- 字母键盘 -->
      <div v-if="currentType === KEYBOARD_TYPE.letter" class="keyboard letters hidden" id="letterKeyboard" @pointerdown.prevent.stop>
        <div class="row">
          <div class="key" @click="setValue('Q')">Q</div>
          <div class="key" @click="setValue('W')">W</div>
          <div class="key" @click="setValue('E')">E</div>
          <div class="key" @click="setValue('R')">R</div>
          <div class="key" @click="setValue('T')">T</div>
          <div class="key" @click="setValue('Y')">Y</div>
          <div class="key" @click="setValue('U')">U</div>
          <div class="key" @click="setValue('I')">I</div>
          <div class="key" @click="setValue('O')">O</div>
          <div class="key" @click="setValue('P')">P</div>
        </div>
        <div class="row">
          <div class="key" @click="setValue('A')">A</div>
          <div class="key" @click="setValue('S')">S</div>
          <div class="key" @click="setValue('D')">D</div>
          <div class="key" @click="setValue('F')">F</div>
          <div class="key" @click="setValue('G')">G</div>
          <div class="key" @click="setValue('H')">H</div>
          <div class="key" @click="setValue('J')">J</div>
          <div class="key" @click="setValue('K')">K</div>
          <div class="key" @click="setValue('L')">L</div>
        </div>
        <div class="row">
          <div class="key" @click="setValue('Z')">Z</div>
          <div class="key" @click="setValue('X')">X</div>
          <div class="key" @click="setValue('C')">C</div>
          <div class="key" @click="setValue('V')">V</div>
          <div class="key" @click="setValue('B')">B</div>
          <div class="key" @click="setValue('N')">N</div>
          <div class="key" @click="setValue('M')">M</div>
        </div>
        <div class="row">
          <div class="key" @click="setValue(KEYBOARD_SPECIAL.point)">.</div>
          <div class="key space" @click="setValue(KEYBOARD_SPECIAL.space)">{{ $t('components.gv_keyboard.space') }}</div>
          <div class="key" @click="setValue(KEYBOARD_SPECIAL.delete)">⌫</div>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script>
export default { name: 'gv-keyboard' };
</script>
<script setup>
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useDrag } from '@/hooks/drag';
import { getPX } from '@/tools';
import GvIcon from '@/components/gv-icon/index.vue';
import { KEYBOARD_SPECIAL } from './keyboard';
import { $t } from '@/lang/i18n';

const KEYBOARD_TYPE = { number: 0, letter: 1 };

const props = defineProps({ position: Object, show: Function, hide: Function, setValue: Function });

const elRef = shallowRef();
const currentType = ref(KEYBOARD_TYPE.number);

const changBtnName = computed(() =>
  currentType.value === KEYBOARD_TYPE.number ? $t('components.gv_keyboard.change_word') : $t('components.gv_keyboard.change_number')
);

const { pointer, resetPointer, setDragDom } = useDrag();

const contentStyle = computed(() => {
  return { top: getPX(pointer.y), left: getPX(pointer.x) };
});

const toggle = () => {
  currentType.value = currentType.value === KEYBOARD_TYPE.number ? KEYBOARD_TYPE.letter : KEYBOARD_TYPE.number;
};

const setValue = (value) => {
  props.setValue(value);
};

const close = () => {
  props.hide();
};

onMounted(() => {
  setDragDom(elRef.value, props.position);
});

defineExpose({ resetPointer, close });
</script>
<style lang="scss" scoped>
.gv-keyboard {
  position: fixed;
  top: 0;
  left: 0;
  width: 360px;
  background-color: var(--el-fill-color-dark);
  border-radius: 10px;
  box-shadow: var(--el-box-shadow-light);
  user-select: none;
  overflow: hidden;
  z-index: var(--gv-command-z-index);

  .header-warp {
    height: 32px;
    background-color: var(--el-border-color);
    cursor: move;
    touch-action: none;
  }

  .change-btn {
    position: absolute;
    top: 0;
    right: 32px;
    height: 32px;
    padding: 0 10px;
    z-index: 10;

    &:hover {
      color: var(--el-primary-text-color);
      background-color: var(--el-color-primary);
    }
  }

  .close-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 32px;
    height: 32px;
    z-index: 10;

    &:hover {
      color: var(--el-primary-text-color);
      background-color: var(--el-color-primary);
    }
  }

  .keyboard {
    padding: 20px;
    &.numbers {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    &.letters {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .row {
      display: flex;
      justify-content: center;
      gap: 6px;
    }

    .key {
      background-color: white;
      border: 1px solid #999;
      border-radius: 5px;
      padding: 15px 8px;
      min-width: 28px;
      min-height: 40px;
      text-align: center;
      cursor: pointer;
      user-select: none;
    }

    .key:hover {
      background-color: #ddd;
    }

    .key:active {
      background-color: #ccc;
    }

    .space {
      width: 200px;
    }

    .hidden {
      display: none;
    }
  }
}
</style>
