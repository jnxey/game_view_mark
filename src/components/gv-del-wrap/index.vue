<template>
  <div class="del-wrap">
    <slot></slot>
    <div v-if="showClose" class="icon-close" @click.stop="handleClose">
      <gv-icon :size="12" name="el-icon-CloseBold" />
    </div>
  </div>
</template>

<script>
import GvIcon from '@/components/gv-icon/index.vue';

export default {
  name: 'gv-del-wrap',
  components: { GvIcon },
  props: {
    showClose: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const handleClose = () => {
      emit('close');
    };
    return {
      handleClose
    };
  }
};
</script>

<style scoped lang="scss">
.del-wrap {
  position: relative;
  &:hover > .icon-close {
    display: flex;
  }
  .icon-close {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    width: 16px;
    height: 16px;
    background-color: rgba(0, 0, 0, 0.3);
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
  }
}
</style>
