<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="650px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="130px">
      <el-form-item :label="$t('game.kind.game_model')" prop="game_model" @change="resetFormByChange">
        <el-radio-group v-model="formData.game_model" :disabled="true">
          <el-radio class="custom-radio" v-for="item in GAME_MODEL_DICT" :value="item.value">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('game.kind.level')" prop="is_top">
        <div class="flex-1 flex-col justify-start">
          <el-radio-group v-model="formData.is_top" @change="resetFormByChange">
            <el-radio class="custom-radio" v-for="(item, index) in GAME_KIND_LEVEL_DICT" :key="index" :label="item.name" :value="item.value" />
          </el-radio-group>
          <div class="text-tips">{{ $t('game.kind.tips_level') }}</div>
        </div>
      </el-form-item>
      <!--   子集   -->
      <template v-if="!isTopValue">
        <el-form-item :label="$t('game.kind.position')" prop="sub_position" v-if="!isGeneral">
          <div class="flex-1 flex-col justify-start">
            <el-radio-group v-model="formData.sub_position" @change="() => (formData.sub_main_id = null)">
              <el-radio class="custom-radio mb-4" v-for="item in GAME_KIND_POSITION_DICT" :value="item.value">
                <div class="flex-row align-center">
                  <gv-icon v-if="item.icon" :name="item.icon" class="mr-4" />
                  <span>{{ item.name }}</span>
                </div>
              </el-radio>
            </el-radio-group>
            <div class="text-tips">{{ $t('game.kind.tips_position') }}</div>
          </div>
        </el-form-item>
        <!--    子集位置为主图    -->
        <template v-if="formData.sub_position === GAME_KIND_POSITION.main">
          <el-form-item :label="$t('game.kind.bind')" prop="sub_main_id">
            <div class="flex-1 flex-col justify-start">
              <el-radio-group v-model="formData.sub_main_id">
                <el-radio class="custom-radio mb-4" v-for="item in topItems" :label="$ti(item.name)" :value="item.id" />
              </el-radio-group>
              <div class="text-tips">{{ $t('game.kind.tips_bind') }}</div>
            </div>
          </el-form-item>
        </template>
      </template>
      <el-form-item :label="$t('game.kind.calc')" prop="sub_calc" v-if="isTopValue || !isGeneral">
        <div class="flex-1 flex-col justify-start">
          <el-radio-group v-model="formData.sub_calc">
            <el-radio class="custom-radio" v-for="(item, index) in GAME_KIND_CALC_DICT" :key="index" :label="item.name" :value="item.value" />
          </el-radio-group>
          <div class="text-tips">
            {{ $t('game.kind.tips_calc1') }}
            <br />
            {{ $t('game.kind.tips_calc2') }}
          </div>
        </div>
      </el-form-item>
      <!--   牛牛牌型   -->
      <template v-if="formData.game_model === GAME_MODEL.niu_niu">
        <!--    牌型    -->
        <el-form-item required :label="$t('game.kind.card_pattern')" prop="card_pattern">
          <div class="flex-1 flex-col justify-start">
            <el-radio-group v-model="formData.card_pattern">
              <el-radio class="custom-radio mb-4" v-for="(item, index) in NIU_CARD_TYPE_DICT" :key="index" :label="item.name" :value="item.value" />
            </el-radio-group>
            <div class="text-tips">{{ $t('game.kind.tips_card_pattern') }}</div>
          </div>
        </el-form-item>
      </template>
      <!--   百家乐类配置项   -->
      <template v-if="GAME_MODEL_TYPE_BACCARAT.includes(formData.game_model)">
        <template v-if="formData.game_model === GAME_MODEL.baccarat">
          <!--    百家乐牌型    -->
          <el-form-item required :label="$t('game.kind.card_pattern')" prop="card_pattern">
            <div class="flex-1 flex-col justify-start">
              <el-radio-group v-model="formData.card_pattern">
                <el-radio
                  class="custom-radio mb-4"
                  v-for="(item, index) in isTopValue ? BACCARAT_CARD_TYPE_TOP_DICT : BACCARAT_CARD_TYPE_SUB_DICT"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-radio-group>
              <div class="text-tips">{{ $t('game.kind.tips_card_pattern') }}</div>
            </div>
          </el-form-item>
        </template>
        <template v-if="formData.game_model === GAME_MODEL.long_hu">
          <!--    龙虎牌型    -->
          <el-form-item required :label="$t('game.kind.card_pattern')" prop="card_pattern">
            <div class="flex-1 flex-col justify-start">
              <el-radio-group v-model="formData.card_pattern">
                <el-radio
                  class="custom-radio mb-4"
                  v-for="(item, index) in isTopValue ? LONG_HU_CARD_TYPE_TOP_DICT : LONG_HU_CARD_TYPE_SUB_DICT"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-radio-group>
              <div class="text-tips">{{ $t('game.kind.tips_card_pattern') }}</div>
            </div>
          </el-form-item>
        </template>
        <!--   杀码   -->
        <el-form-item required :label="$t('game.kind.kill_type')" prop="kill_type">
          <div class="flex-1 flex-col justify-start">
            <el-radio-group v-model="formData.kill_type" @change="() => (formData.game_kill_arr = [])">
              <el-radio class="custom-radio" v-for="(item, index) in GAME_KILL_TYPE_DICT" :key="index" :label="item.name" :value="item.value" />
            </el-radio-group>
            <div class="text-tips">{{ $t('game.kind.tips_kill_type') }}</div>
          </div>
        </el-form-item>
        <template v-if="formData.kill_type !== GAME_KILL_TYPE.all">
          <el-form-item required :label="$t('game.kind.kill_bind')" prop="game_kill_arr">
            <el-checkbox-group v-model="formData.game_kill_arr">
              <el-checkbox class="custom-checkbox mb-4" v-for="(item, index) in topItemsOther" :key="index" :value="item.id">
                <el-avatar :src="getBaseImagUrl(item.icon)" :size="20" />
                <span class="ml-4">{{ $ti(item.name) }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>
        <!--   赔码   -->
        <el-form-item required :label="$t('game.kind.compensation_type')" prop="compensation_type">
          <div class="flex-1 flex-col justify-start">
            <el-radio-group v-model="formData.compensation_type" @change="() => (formData.compensation_arr = [])">
              <el-radio
                class="custom-radio"
                v-for="(item, index) in GAME_COMPENSATION_TYPE_DICT"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-radio-group>
            <div class="text-tips">{{ $t('game.kind.tips_compensation_type') }}</div>
          </div>
        </el-form-item>
        <template v-if="formData.compensation_type !== GAME_COMPENSATION_TYPE.all">
          <el-form-item required :label="$t('game.kind.compensation_bind')" prop="compensation_arr">
            <el-checkbox-group v-model="formData.compensation_arr">
              <el-checkbox class="custom-checkbox mb-4" v-for="(item, index) in topItemsOther" :key="index" :value="item.id">
                <el-avatar :src="getBaseImagUrl(item.icon)" :size="20" />
                <span class="ml-4">{{ $ti(item.name) }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>
        <!--   保险   -->
        <el-form-item required :label="$t('game.kind.insurance')" prop="is_insurance_allowed">
          <div class="flex-1 flex-col justify-start">
            <el-radio-group v-model="formData.is_insurance_allowed" @change="() => (formData.insurance_arr = [])">
              <el-radio class="custom-radio" v-for="(item, index) in GAME_INSURANCE_TYPE_DICT" :key="index" :label="item.name" :value="item.value" />
            </el-radio-group>
            <div class="text-tips">{{ $t('game.kind.tips_insurance') }}</div>
          </div>
        </el-form-item>
        <template v-if="formData.is_insurance_allowed !== GAME_INSURANCE_TYPE.normal">
          <el-form-item required :label="$t('game.kind.insurance_bind')" prop="insurance_arr">
            <el-checkbox-group v-model="formData.insurance_arr">
              <el-checkbox class="custom-checkbox mb-4" v-for="(item, index) in topItemsOther" :key="index" :value="item.id">
                <el-avatar :src="getBaseImagUrl(item.icon)" :size="20" />
                <span class="ml-4">{{ $ti(item.name) }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>
      </template>
      <el-form-item :label="iconLabel" prop="icon">
        <gv-material-picker custom-class="w-full" v-model="formData.icon" :limit="1" />
      </el-form-item>
      <el-form-item :label="$t('game.kind.name')" prop="name">
        <gv-input-language
          v-model="formData.name"
          :placeholder="$t('game.kind.placeholder_name')"
          clearable
          :type="GV_INPUT_LANGUAGE_TYPE.game_kind_name"
        />
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :placeholder="$t('common.remark_placeholder')" clearable />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { gameKindSet } from '@/api/game/kind';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import {
  GAME_COMPENSATION_TYPE,
  GAME_COMPENSATION_TYPE_DICT,
  GAME_INSURANCE_TYPE,
  GAME_INSURANCE_TYPE_DICT,
  GAME_KILL_TYPE,
  GAME_KILL_TYPE_DICT,
  GAME_KIND_CALC,
  GAME_KIND_CALC_DICT,
  GAME_KIND_LEVEL,
  GAME_KIND_LEVEL_DICT,
  GAME_KIND_MARK,
  GAME_KIND_MARK_DICT,
  GAME_KIND_POSITION,
  GAME_KIND_POSITION_DICT,
  GAME_MODEL,
  GAME_MODEL_DICT,
  GAME_MODEL_TYPE_BACCARAT,
  GAME_MODEL_TYPE_GENERAL,
  GV_INPUT_LANGUAGE_TYPE,
  OPERATE_TYPE
} from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { getBaseImagUrl, syncObjectData } from '@/tools';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import { isTop } from '@/views/game/_models';
import GvIcon from '@/components/gv-icon/index.vue';
import { $t } from '@/lang/i18n';
import GvInputLanguage from '@/components/gv-input-language/index.vue';
import { $ti } from '@/lang/input';
import {
  BACCARAT_CARD_TYPE,
  BACCARAT_CARD_TYPE_SUB_DICT,
  BACCARAT_CARD_TYPE_TOP_DICT,
  LONG_HU_CARD_TYPE_SUB_DICT,
  LONG_HU_CARD_TYPE_TOP_DICT,
  NIU_CARD_TYPE_DICT
} from '@/values/card';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const allItems = shallowRef([]);
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('game.kind.title_edit') : $t('game.kind.title_add')));
const formTemp = {
  id: null,
  game_model: GAME_MODEL.general,
  is_top: GAME_KIND_LEVEL.top,
  icon: '',
  sub_position: GAME_KIND_POSITION.main,
  sub_main_id: null,
  name: '',
  card_pattern: '',
  sub_calc: GAME_KIND_CALC.self,
  kill_type: GAME_KILL_TYPE.all,
  game_kill_arr: [],
  compensation_type: GAME_COMPENSATION_TYPE.all,
  compensation_arr: [],
  is_insurance_allowed: GAME_INSURANCE_TYPE.normal,
  insurance_arr: [],
  sort: 0,
  remark: ''
};
const formData = reactive({ ...formTemp });

const iconLabel = computed(() => (isTop(formData.is_top) ? $t('game.kind.icon_label_main') : $t('game.kind.icon_label_sub')));

const isTopValue = computed(() => isTop(formData.is_top));
const isGeneral = computed(() => GAME_MODEL_TYPE_GENERAL.includes(formData.game_model));

// 顶级列表
const topItems = computed(() => {
  return allItems.value.filter((item) => isTop(item.is_top));
});

// 顶级列表-排除自身
const topItemsOther = computed(() => {
  return allItems.value.filter((item) => {
    return isTop(item.is_top) && item.id !== formData.id;
  });
});

// 禁用级别切换
const disabledUpdate = computed(() => {
  return mode.value === OPERATE_TYPE.update;
});

// 字段校验规则
const rules = computed(() => {
  const result = {
    is_top: [{ required: true, message: $t('game.kind.field_check_level'), trigger: ['blur'] }],
    icon: [{ required: true, message: $t('game.kind.field_check_icon'), trigger: ['blur'] }],
    name: [{ required: true, message: $t('game.kind.field_check_name'), trigger: ['blur'] }],
    sort: [{ required: true, message: $t('common.sort_check'), trigger: ['blur'] }]
  };
  if (formData.kill_type !== GAME_KILL_TYPE.all) {
    result.game_kill_arr = [{ required: true, message: $t('game.kind.field_check_kill_bind'), trigger: ['blur'] }];
  }
  if (formData.compensation_type !== GAME_COMPENSATION_TYPE.all) {
    result.compensation_arr = [{ required: true, message: $t('game.kind.field_check_compensation_bind'), trigger: ['blur'] }];
  }
  if (formData.is_insurance_allowed !== GAME_INSURANCE_TYPE.normal) {
    result.insurance_arr = [{ required: true, message: $t('game.kind.field_check_insurance_bind'), trigger: ['blur'] }];
  }
  if (!isTop(formData.is_top)) {
    result.sub_position = [{ required: true, message: $t('game.kind.field_check_position'), trigger: ['blur'] }];
    result.sub_calc = [{ required: true, message: $t('game.kind.field_check_calc'), trigger: ['blur'] }];
    if (formData.sub_position === GAME_KIND_POSITION.main) {
      result.sub_main_id = [{ required: true, message: $t('game.kind.field_check_bind'), trigger: ['blur'] }];
    }
  }

  if (formData.game_model !== GAME_MODEL.general) {
    result.card_pattern = [{ required: true, message: $t('game.kind.field_check_card_pattern'), trigger: ['blur'] }];
  }
  return result;
});

// 清除校验
const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

// 打开弹窗
const open = async (type, row, list, model) => {
  mode.value = type;
  allItems.value = list;
  if (type === OPERATE_TYPE.update) {
    const game_kill_arr = row.gamekill?.map((item) => item.band_kind_id) ?? [];
    const compensation_arr = row.compensation?.map((item) => item.band_kind_id) ?? [];
    const insurance_arr = row.insurance?.map((item) => item.band_kind_id) ?? [];
    syncObjectData(formData, { ...row, game_kill_arr, compensation_arr, insurance_arr });
  } else {
    syncObjectData(formData, { ...formTemp, sort: list.length, game_model: model, game_kill_arr: [] });
  }
  popupRef.value?.open();
  clearValidate();
};

// 重设部分字段
const resetFormByChange = () => {
  syncObjectData(formData, {
    sub_position: GAME_KIND_POSITION.main,
    sub_main_id: null,
    card_pattern: '',
    sub_calc: GAME_KIND_CALC.self,
    kill_type: GAME_KILL_TYPE.all,
    game_kill_arr: [],
    compensation_type: GAME_COMPENSATION_TYPE.all,
    is_insurance_allowed: GAME_INSURANCE_TYPE.normal,
    insurance_arr: []
  });
  clearValidate();
};

// 提交
const handleSubmit = async () => {
  await formRef.value?.validate();
  const params = { ...formData };
  params.game_kill_arr = params.game_kill_arr.map((item) => ({ game_kind_id: params.id, band_kind_id: item }));
  params.compensation_arr = params.compensation_arr.map((item) => ({ game_kind_id: params.id, band_kind_id: item }));
  params.insurance_arr = params.insurance_arr.map((item) => ({ game_kind_id: params.id, band_kind_id: item }));
  if (params.game_model === GAME_MODEL.general) params.card_pattern = BACCARAT_CARD_TYPE.other;
  layer.loading();
  await gameKindSet(params);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

// 触发关闭
const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
