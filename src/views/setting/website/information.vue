<!-- 网站信息 -->
<template>
  <div class="website-information">
    <el-form ref="formRef" :rules="rules" :model="formData" label-width="140px" scroll-to-error>
      <el-card shadow="never" class="mb-12">
        <el-form-item :label="$t('setting.website.web_name')" prop="web_name">
          <el-input
            class="w-280"
            v-trim
            v-model="formData.web_name"
            :placeholder="$t('setting.website.placeholder_web_name')"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('setting.website.web_logo')" prop="web_logo" required>
          <div class="flex-1 flex-col justify-start">
            <!--   图片   -->
            <gv-upload
              :data="{ cid: -1 }"
              type="image"
              :limit="1"
              :multiple="false"
              :show-progress="true"
              :cropper-options="{ fixed: true, fixedBox: true, autoCropWidth: 256, autoCropHeight: 256, fixedNumber: [1, 1] }"
              @success="(res) => (formData.web_logo = `${res.data.uri}?name=${res.data.name}&size=${res.data.file_size}&${res.data.detail}`)"
            >
              <img v-if="!!formData.web_logo" :src="getBaseImagUrl(formData.web_logo)" class="avatar" alt="" />
              <gv-icon v-if="!formData.web_logo" class="uploader-icon" name="el-icon-plus" />
              <gv-icon
                v-if="!!formData.web_logo"
                class="uploader-close-icon fz-18 text-placeholder"
                name="el-icon-circle-close-filled"
                @click.stop="() => (formData.web_logo = '')"
              />
            </gv-upload>
            <div class="text-tips">{{ $t('setting.website.tips_web_logo') }}</div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('setting.website.web_favicon')" prop="web_favicon" required>
          <div class="flex-1 flex-col justify-start">
            <!--   图片   -->
            <gv-upload
              :data="{ cid: -1 }"
              type="image"
              :limit="1"
              :multiple="false"
              :show-progress="true"
              :cropper-options="{ fixed: true, fixedBox: true, autoCropWidth: 256, autoCropHeight: 256, fixedNumber: [1, 1], outputType: 'ico' }"
              @success="(res) => (formData.web_favicon = `${res.data.uri}?name=${res.data.name}&size=${res.data.file_size}&${res.data.detail}`)"
            >
              <img v-if="!!formData.web_favicon" :src="getBaseImagUrl(formData.web_favicon)" class="avatar" alt="" />
              <gv-icon v-if="!formData.web_favicon" class="uploader-icon" name="el-icon-plus" />
              <gv-icon
                v-if="!!formData.web_favicon"
                class="uploader-close-icon fz-18 text-placeholder"
                name="el-icon-circle-close-filled"
                @click.stop="() => (formData.web_favicon = '')"
              />
            </gv-upload>
            <div class="text-tips">{{ $t('setting.website.tips_web_favicon') }}</div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('setting.website.login_image')" prop="login_image" required>
          <div class="flex-1 flex-col justify-start">
            <gv-material-picker v-model="formData.login_image" :limit="1" />
            <div class="text-tips">{{ $t('setting.website.tips_login_image') }}</div>
          </div>
        </el-form-item>
      </el-card>
    </el-form>
    <gv-footer v-perms="[setWebsite.perm]">
      <el-button type="primary" @click="handleSubmit">{{ $t('common.save_btn') }}</el-button>
    </gv-footer>
  </div>
</template>

<script setup>
import { getWebsite, setWebsite } from '@/api/setting/website';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import GvFooter from '@/components/gv-footer/index.vue';
import { onBeforeMount, reactive, ref } from 'vue';
import { delayExec, getBaseImagUrl, getElementError, getFileExtension, pageReload, parseUrlParams, syncObjectData, toAwait } from '@/tools';
import layer from '@/tools/layer';
import { $t } from '@/lang/i18n';
import GvIcon from '@/components/gv-icon/index.vue';
import GvUpload from '@/components/gv-upload/index.vue';

const formRef = ref();
// 表单数据
const formData = reactive({
  web_name: '',
  web_favicon: '',
  web_logo: '',
  login_image: ''
});

// 表单验证
const rules = {
  web_name: [{ required: true, message: $t('setting.website.field_check_web_name'), trigger: ['blur'] }],
  web_favicon: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error($t('setting.website.field_check_web_favicon')));
        } else {
          console.log(value, '--------------------------------99');
          const params = parseUrlParams(value);
          const width = Number(params.width);
          const height = Number(params.height);
          const file = getFileExtension(value);
          if (width !== 256 || height !== 256) {
            callback(new Error($t('setting.website.field_check_web_favicon_size')));
          } else if (file !== 'ico') {
            callback(new Error($t('setting.website.field_check_web_favicon_type')));
          } else {
            callback();
          }
        }
      }
    }
  ],
  web_logo: [{ required: true, message: $t('setting.website.field_check_web_logo'), trigger: ['change'] }],
  login_image: [{ required: true, message: $t('setting.website.field_check_login_image'), trigger: ['change'] }]
};

// 获取备案信息
const getData = async () => {
  const data = await getWebsite();
  syncObjectData(formData, data);
};

// 设置备案信息
const handleSubmit = async () => {
  const [, err] = await toAwait(formRef.value?.validate());
  if (err) return layer.msgError(getElementError(err));
  console.log();
  layer.loading();
  await setWebsite(formData);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  await delayExec(500);
  pageReload();
};

onBeforeMount(() => {
  getData();
});
</script>

<style lang="scss" scoped>
.upload {
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  ::v-deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }

  .uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
  }

  .uploader-close-icon {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
  }
}
</style>
