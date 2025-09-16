<template>
  <el-icon class="local-icon" :size="size">
    <component v-if="isElIcon" :is="nameCase" />
    <svg-icon v-if="isLocal" :name="name" />
  </el-icon>
</template>
<script>
import SvgIcon from '@/components/gv-icon/svg-icon.vue';
import { camelCase } from '@/tools/index.js';

const LOCAL_ICON_PREFIX = 'local-icon-';
const EL_ICON_PREFIX = 'el-icon-';

export default {
  name: 'gv-icon',
  components: { SvgIcon },
  props: {
    size: Number,
    name: { type: String, required: true }
  },
  data() {
    return {};
  },
  computed: {
    isLocal() {
      return this.name.indexOf(LOCAL_ICON_PREFIX) === 0;
    },
    isElIcon() {
      return this.name.indexOf(EL_ICON_PREFIX) === 0;
    },
    nameCase() {
      const prefix = this.isElIcon ? EL_ICON_PREFIX : LOCAL_ICON_PREFIX;
      const name = camelCase(this.name.replace(prefix, ''));
      return name.slice(0, 1).toUpperCase() + name.slice(1);
    }
  }
};
</script>
<style scoped lang="scss">
.local-icon {
  outline: none;
}
</style>
