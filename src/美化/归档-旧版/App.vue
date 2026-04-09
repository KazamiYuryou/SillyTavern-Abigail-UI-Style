<template>
<div class="abby-yog-container" data-template-ver="v20260408-github-jsdelivr">
      <div class="bg-wrapper">
        <div class="aurora-layer">
          <div class="aurora-band aurora-1"></div>
          <div class="aurora-band aurora-2"></div>
          <div class="aurora-band aurora-3"></div>
          <div class="aurora-wave"></div>
          <div class="aurora-glow"></div>
        </div>
        <div class="bg-container">
          <div class="void-base"></div>
          <div class="nebula"></div>
          <div class="nebula-2"></div>
          <div class="nebula-3"></div>
          <div class="galaxy-arm arm-primary"></div>
          <div class="galaxy-arm arm-secondary"></div>
          <div class="star-layer stars-1"></div>
          <div class="star-layer stars-2"></div>
          <div class="star-layer stars-3"></div>
          <div class="star-layer stars-4"></div>
          <div class="star-layer stars-5"></div>
          <div class="star-layer stars-6"></div>
          <div class="star-layer stars-7"></div>
          <div class="star-layer stars-8"></div>
          <div class="dust-layer"></div>
          <div class="particle-layer"></div>
        </div>
      </div>

      <div class="frame-corner fc-tl"></div>
      <div class="frame-corner fc-tr"></div>
      <div class="frame-corner fc-bl"></div>
      <div class="frame-corner fc-br"></div>
      <div class="frame-flourish ff-tl"></div>
      <div class="frame-flourish ff-tr"></div>
      <div class="frame-flourish ff-bl"></div>
      <div class="frame-flourish ff-br"></div>
      <div class="frame-dot fd-top"></div>
      <div class="frame-dot fd-bottom"></div>
      <div class="frame-dot fd-left"></div>
      <div class="frame-dot fd-right"></div>
      <div class="frame-mid fm-top"></div>
      <div class="frame-mid fm-bottom"></div>
      <div class="frame-mid fm-left"></div>
      <div class="frame-mid fm-right"></div>
      <div class="frame-qdot fq-top1"></div>
      <div class="frame-qdot fq-top2"></div>
      <div class="frame-qdot fq-bottom1"></div>
      <div class="frame-qdot fq-bottom2"></div>
      <div class="frame-qdot fq-left1"></div>
      <div class="frame-qdot fq-left2"></div>
      <div class="frame-qdot fq-right1"></div>
      <div class="frame-qdot fq-right2"></div>

      <div class="scan-beam"></div>

      <div class="abby-yog-card">
        <div class="solar-key-system">
          <div class="zero-anchor">
            <div class="dimension-ripple"></div>
            <div class="orbit-ring ring-outer"></div>
            <div class="orbit-ring ring-inner"></div>
            <div class="eldritch-key-group">
              <div class="ek-handle"></div>
              <div class="ek-shaft"></div>
              <div class="ek-bit"></div>
            </div>
          </div>
        </div>

        <div class="abby-dialog">
          <div class="portrait-wrap">
            <div class="portrait-frame"></div>
            <div class="pf-corner pf-tl"></div>
            <div class="pf-corner pf-tr"></div>
            <div class="pf-corner pf-bl"></div>
            <div class="pf-corner pf-br"></div>
            <div class="portrait-gem"></div>
            <div class="portrait-inner" :style="portraitStyle"></div>
            <div class="portrait-overlay"></div>
          </div>
          <div class="dialog-main">
            <div class="name-plate">
              <span class="name-icon"></span>
              <span class="abby-name-text">{{ displayName }}</span>
            </div>
            <div class="dialog-box">
              <div class="dialog-inner-deco"></div>
              <div class="dialog-corner dc-tl"></div>
              <div class="dialog-corner dc-tr"></div>
              <div class="dialog-corner dc-bl"></div>
              <div class="dialog-corner dc-br"></div>
              <div class="abby-yog-content" v-html="displayContent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    name?: string;
    mood?: string;
    content?: string;
    skin?: string;
  }>(),
  {
    name: '阿比盖尔',
    mood: '高兴',
    content: '「Master，阿比已经准备好了哦♪」',
    skin: '0',
  },
);

const moodAlias: Record<string, string> = {
  高兴: '高兴',
  开心: '高兴',
  喜悦: '高兴',
  悲伤: '悲伤',
  难过: '悲伤',
  害羞: '害羞',
  生气: '生气',
  愤怒: '生气',
  疑惑: '疑惑',
  困惑: '疑惑',
};

const displayName = computed(() => props.name?.trim() || '阿比盖尔');
const displayContent = computed(() => props.content?.trim() || '「Master，阿比已经准备好了哦♪」');
const safeSkin = computed(() => (/^(0|1|2|3)$/.test(props.skin ?? '') ? props.skin! : '0'));
const safeMood = computed(() => moodAlias[props.mood?.trim() || ''] || '高兴');
const portraitStyle = computed(() => ({
  backgroundImage: `url('https://testingcf.jsdelivr.net/gh/AkabaneSaki/myrepo@main/picture/abby/${encodeURIComponent(`${safeMood.value}${safeSkin.value}.png`)}')`,
}));
</script>
