<template>
  <div class="panel-attribute" @mousedown.stop>
    <template v-for="item in attribute" :key="item">
      <!--   imageSrc   -->
      <div v-if="item.type === GLC_FIELD.imageSrc" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <gv-material-picker
            :show-bottom-btn="false"
            :model-value="config[item.field]"
            @update:model-value="(value) => handlerSave(item.field, value)"
          />
        </div>
      </div>
      <!--   text   -->
      <div v-else-if="item.type === GLC_FIELD.text" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <el-input type="textarea" :model-value="config[item.field]" @input="(value) => handlerSave(item.field, value)" />
        </div>
      </div>
      <!--   boolean   -->
      <div v-else-if="item.type === GLC_FIELD.boolean" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <el-switch :model-value="config[item.field]" @change="(value) => handlerSave(item.field, value)" />
        </div>
      </div>
      <!--   color   -->
      <div v-else-if="item.type === GLC_FIELD.color" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <el-color-picker :model-value="config[item.field]" @update:modelValue="(value) => handlerSave(item.field, value)" show-alpha />
        </div>
      </div>
      <!--   textAlign   -->
      <div v-else-if="item.type === GLC_FIELD.textAlign" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <el-radio-group :model-value="config[item.field]" @change="(value) => handlerSave(item.field, value)">
            <el-radio-button value="left">
              <template #default>
                <gv-icon name="local-icon-align-left" />
              </template>
            </el-radio-button>
            <el-radio-button value="center">
              <template #default>
                <gv-icon name="local-icon-align-center" />
              </template>
            </el-radio-button>
            <el-radio-button value="right">
              <template #default>
                <gv-icon name="local-icon-align-right" />
              </template>
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!--   textShadow   -->
      <div v-else-if="item.type === GLC_FIELD.textShadow" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <el-color-picker :model-value="config[item.field]" @update:modelValue="(value) => handlerSave(item.field, value)" show-alpha />
        </div>
      </div>
      <!--   fontBold   -->
      <div v-else-if="item.type === GLC_FIELD.fontBold" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <el-switch :model-value="config[item.field]" @update:modelValue="(value) => handlerSave(item.field, value)" />
        </div>
      </div>
      <!--   fontItalic   -->
      <div v-else-if="item.type === GLC_FIELD.fontItalic" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <el-switch :model-value="config[item.field]" @update:modelValue="(value) => handlerSave(item.field, value)" />
        </div>
      </div>
      <!--   fontSize   -->
      <div v-else-if="item.type === GLC_FIELD.fontSize" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <el-input-number class="w-full center" :model-value="config[item.field]" @input="(value) => handlerSave(item.field, value)">
            <template #suffix><span class="pl-4">px</span></template>
          </el-input-number>
        </div>
      </div>
      <!--   fontFamily   -->
      <div v-else-if="item.type === GLC_FIELD.fontFamily" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <el-select class="oid-select" :model-value="config[item.field]" @change="(value) => handlerSave(item.field, value)">
            <el-option v-for="item in FONT_FAMILY" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </div>
      </div>
      <!--   size   -->
      <div v-else-if="item.type === GLC_FIELD.size" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <el-input-number
            class="w-120"
            :model-value="config[item.field]?.width"
            @input="(value) => handlerSave(item.field, value, 'width')"
            :controls="false"
          >
            <template #prefix>
              <span class="pr-4">{{ $t('components.gv_low_code.attr_width') }}</span>
            </template>
          </el-input-number>
          <el-divider direction="vertical" />
          <el-input-number
            class="w-120"
            :model-value="config[item.field]?.height"
            @input="(value) => handlerSave(item.field, value, 'height')"
            :controls="false"
          >
            <template #prefix>
              <span class="pr-4">{{ $t('components.gv_low_code.attr_height') }}</span>
            </template>
          </el-input-number>
        </div>
      </div>
      <!--   position   -->
      <div v-else-if="item.type === GLC_FIELD.position" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <el-input-number
            class="w-120"
            :model-value="config[item.field]?.x"
            @input="(value) => handlerSave(item.field, value, 'x')"
            :controls="false"
          >
            <template #prefix>
              <span class="pr-4">{{ $t('components.gv_low_code.attr_left') }}</span>
            </template>
          </el-input-number>
          <el-divider direction="vertical" />
          <el-input-number
            class="w-120"
            :model-value="config[item.field]?.y"
            @input="(value) => handlerSave(item.field, value, 'y')"
            :controls="false"
          >
            <template #prefix>
              <span class="pr-4">{{ $t('components.gv_low_code.attr_top') }}</span>
            </template>
          </el-input-number>
        </div>
      </div>
      <!--   other style   -->
      <div v-else-if="item.type === GLC_FIELD.otherStyle" class="flex-row align-center p-8">
        <div class="w-100 pl-8 pr-8">{{ item.name }}</div>
        <div class="flex-1">
          <el-input type="textarea" :model-value="config[item.field]" @input="(value) => handlerSave(item.field, value)" />
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default { name: 'glc-panel-attribute' };
</script>
<script setup>
import { computed, inject } from 'vue';
import { FONT_FAMILY, GLC_FIELD, WIDGET_MAP } from './_models/index.js';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import { $t } from '@/lang/i18n';
import GvIcon from '@/components/gv-icon/index.vue';

const current = inject('current');
const schema = inject('schema');
const setSchema = inject('setSchema');

const attribute = computed(() => {
  const key = schema.findIndex((val) => val.uid === current.value);
  if (key <= -1) return [];
  return WIDGET_MAP[schema[key].mark].attribute ?? [];
});

const config = computed(() => {
  const key = schema.findIndex((val) => val.uid === current.value);
  if (key <= -1) return {};
  return schema[key].config ?? {};
});

const handlerSave = (field, value, attr) => {
  if (!attr) {
    setSchema(current.value, field, value);
  } else {
    const fullValue = { ...config.value[field] };
    fullValue[attr] = value;
    setSchema(current.value, field, fullValue);
  }
};
</script>
<style scoped>
.panel-attribute {
  position: absolute;
  top: 10%;
  bottom: 10%;
  right: 20px;
  width: 400px;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
  z-index: 20;
}
</style>
