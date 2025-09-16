<template>
  <teleport to="#app">
    <div class="play-wrap" :class="{ show: show }">
      <div class="top-wrap">
        <transition-group name="box" tag="div">
          <template v-if="show">
            <div class="title-box mb-16" v-for="item in awardList" :key="item.id">
              <div class="text color-white">
                {{ $t('desk.bonus.congratulations') }}{{ item.name }}{{ $t('desk.bonus.hit_prize') }}{{ item.profit }}
              </div>
            </div>
          </template>
        </transition-group>
      </div>
      <div class="animate-box" ref="animateBoxRef" />
    </div>
  </teleport>
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { useSpeak } from '@/hooks/speak';
import { useTimeout } from '@/hooks/timeout';
import { useAudio } from '@/hooks/audio';
import audio from '@/assets/images/activity/huankuai.mp3';
import { $t } from '@/lang/i18n';
import { useImgAnimate } from '@/hooks/img-animate';
import { config } from '@/config';

const animateBoxRef = shallowRef();

const show = ref(false);
const awardList = shallowRef([]);
const speakReturn = useSpeak();
const audioReturn = useAudio(audio);

const imgAnimate = useImgAnimate(() => animateBoxRef.value, {
  repeat: 180,
  getFrameUrl: (index) => {
    return `${config.baseImageExtend}/bonus-animate-1/bfh (${index}).webp`;
  }
});

const open = (record) => {
  show.value = true;
  awardList.value = record;

  // 动画
  imgAnimate.play();

  // 语音
  const speakArr = record.map((item) => `${$t('desk.bonus.congratulations')}${item.name}${$t('desk.bonus.hit_prize')}${item.profit}`);
  const speakText = speakArr.join('; ');
  speakReturn.start(speakText);
  audioReturn.open();

  // 20秒后关闭
  delayClose.timeout();
};

const close = () => {
  show.value = false;

  // 关闭动画
  imgAnimate.close();

  // 关闭声音
  audioReturn?.close();
  speakReturn?.close();
};

const delayClose = useTimeout(close, 20 * 1000);

onMounted(() => {
  imgAnimate.preload();
});

onBeforeUnmount(() => {
  close();
});

defineExpose({ open, close });
</script>
<style lang="scss" scoped>
.play-wrap {
  position: fixed;
  top: -200vw;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;

  &.show {
    top: 0;
  }

  .animate-box {
    position: relative;
    width: 100vw;
    height: 100vh;
    z-index: 10;
  }

  .top-wrap {
    position: absolute;
    top: 0;
    left: 50%;
    width: 80%;
    max-width: 800px;
    padding: 30px;
    transform: translateX(-50%);
    overflow: hidden;
    z-index: 12;

    .title-box {
      position: relative;
      width: calc(100% - 60px);
      height: 60px;
      border-radius: 30px;
      border: 2px solid transparent;
      background-image: linear-gradient(to right, #420880, #dd0505, #f4ae04), linear-gradient(to right, #ffd700, #008000);
      background-origin: border-box;
      background-clip: content-box, border-box;

      .text {
        position: relative;
        padding-left: 30px;
        line-height: 56px;
        font-weight: bold;
        font-size: 20px;
        letter-spacing: 2px;
        z-index: 10;
      }

      &:before {
        content: '';
        position: absolute;
        top: -30px;
        right: -20px;
        width: 300px;
        height: 100px;
        background-image: url('@/assets/images/activity/liangpian.png');
        background-size: 100% 100%;
        z-index: 10;
      }

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: -12px;
        width: 80px;
        height: 60px;
        background-image: url('@/assets/images/activity/guangyun.png');
        background-size: 100% 100%;
        z-index: 5;
      }
    }
  }

  /* 进入动画 */
  .box-enter-from {
    opacity: 0;
    transform: translateX(60px);
  }

  /* 激活状态 */
  .box-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* 排序动画 */
  .box-move {
    transition: transform 0.5s ease;
  }
}
</style>
