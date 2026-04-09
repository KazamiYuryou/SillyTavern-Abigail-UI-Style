import { App as VueApp, createApp, reactive } from 'vue';
import App from './App.vue';
import './阿比盖尔-统合外链美化.css';

// --- 1. 数据类型与默认值 ---
type AbbyProps = {
  name: string;
  mood: string;
  content: string;
  skin: string;
};

const defaults: AbbyProps = {
  name: '阿比盖尔',
  mood: '高兴',
  content: '「Master，阿比已经准备好了哦♪」',
  skin: '0',
};

// 记录挂载实例的复合类型，方便统一管理和销毁
type MountedInstance = {
  app: VueApp;
  hookEl: HTMLDivElement; // 【修复1】：统一规范命名为 hookEl
  state: AbbyProps;
  observer: MutationObserver;
};

// 全局 Map：基于楼层 ID (messageId) 严格管理实例，防止内存泄漏
const mountedByMessage = new Map<number, MountedInstance>();

// --- 2. 工具函数 ---

// 安全解析楼层 ID
function parseMessageId(messageEl: Element | null): number | null {
  if (!messageEl) return null;
  const raw = messageEl.getAttribute('mesid');
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

// 从 DOM 的 dataset 提取数据
function parsePropsFromHook(hook: HTMLDivElement): AbbyProps {
  return {
    name: (hook.dataset.name || defaults.name).trim() || defaults.name,
    mood: (hook.dataset.mood || defaults.mood).trim() || defaults.mood,
    // 如果正则由于某些原因没写进 dataset，兜底读取 innerHTML
    content: (hook.dataset.content || hook.innerHTML || defaults.content).trim() || defaults.content,
    skin: (hook.dataset.skin || defaults.skin).trim() || defaults.skin,
  };
}

// 同步 DOM 数据到 Vue 响应式状态 (性能优化的核心：不用销毁重建实例)
function updateStateFromHook(state: AbbyProps, hook: HTMLDivElement) {
  Object.assign(state, parsePropsFromHook(hook));
}

// --- 3. 核心挂载与卸载逻辑 ---

function mountOne(messageId: number) {
  const messageEl = document.querySelector(`.mes[mesid="${messageId}"]`);
  if (!messageEl) return;

  const hookEl = messageEl.querySelector('.abby-mount-hook') as HTMLDivElement;
  // 拦截已经挂载过的节点，防止套娃
  if (!hookEl || hookEl.hasAttribute('data-v-mounted')) return;

  // 提取初始数据并变为响应式
  const state = reactive<AbbyProps>(parsePropsFromHook(hookEl));
  const app = createApp(App, state);

  app.mount(hookEl);
  hookEl.setAttribute('data-v-mounted', 'true'); // 打上标记

  // 【神级优化】：监听这个锚点的属性变化。
  // 如果酒馆行内编辑了内容，正则会更新锚点的 data-* 属性。
  // Observer 捕捉到变化后，直接更新 state，Vue 瞬间完成热更新。
  const observer = new MutationObserver(() => updateStateFromHook(state, hookEl));
  observer.observe(hookEl, {
    attributes: true,
    attributeFilter: ['data-name', 'data-mood', 'data-content', 'data-skin'],
  });

  // 【修复1】：存入 Map 时，使用正确的变量名 hookEl
  mountedByMessage.set(messageId, { app, hookEl, state, observer });
}

function destroyOne(messageId: number) {
  const instance = mountedByMessage.get(messageId);
  if (instance) {
    instance.observer.disconnect(); // 停用监听器
    instance.app.unmount(); // 销毁 Vue 组件
    // 【修复致命风险】：清理标记，允许后续重新挂载
    // 【修复1】：调用正确的属性名 hookEl
    if (instance.hookEl) instance.hookEl.removeAttribute('data-v-mounted');
    mountedByMessage.delete(messageId);
  }
}

// 扫描当前可视区的所有消息并挂载
function scanAll() {
  document.querySelectorAll<HTMLDivElement>('.abby-mount-hook').forEach(hook => {
    const messageId = parseMessageId(hook.closest('.mes'));
    if (messageId !== null) mountOne(messageId);
  });
}

// --- 4. 接入酒馆生命周期 ---

function init() {
  scanAll(); // 初始扫描

  // [渲染] 新消息产生
  // 【修复2】：老老实实拆分角色和用户的渲染事件，保证类型安全和 100% 触发
  const onCharRendered = eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, (messageId: number) => mountOne(messageId));
  const onUserRendered = eventOn(tavern_events.USER_MESSAGE_RENDERED, (messageId: number) => mountOne(messageId));

  // [更新] 消息被编辑、滑页（防范酒馆事件链断裂，必须 摧毁+重建）
  const onUpdated = eventOn(tavern_events.MESSAGE_UPDATED, (messageId: number) => {
    destroyOne(messageId);
    mountOne(messageId);
  });
  const onEdited = eventOn(tavern_events.MESSAGE_EDITED, (messageId: number) => {
    destroyOne(messageId);
    mountOne(messageId);
  });

  // [删除] 释放内存
  const onDeleted = eventOn(tavern_events.MESSAGE_DELETED, (messageId: number) => destroyOne(messageId));

  // [滚动] 加载旧历史记录
  const onMoreLoaded = eventOn(tavern_events.MORE_MESSAGES_LOADED, () => {
    setTimeout(scanAll, 100); // 稍微延迟等待 DOM 渲染完成
  });

  // [切换] 切换聊天记录 (彻底洗牌)
  const onChatLoaded = eventOn('chatLoaded', () => {
    mountedByMessage.forEach((_, messageId) => destroyOne(messageId));
    scanAll();
  });

  // [系统] 离开页面大扫除
  $(window).on('pagehide', () => {
    onCharRendered.stop();
    onUserRendered.stop();
    onUpdated.stop();
    onEdited.stop();
    onDeleted.stop();
    onMoreLoaded.stop();
    onChatLoaded.stop();
    mountedByMessage.forEach((_, messageId) => destroyOne(messageId));
    mountedByMessage.clear();
  });
}

$(() => {
  errorCatched(init)();
});
