import { App as VueApp, createApp, reactive } from 'vue';
import App from './App.vue';
import './阿比盖尔-统合外链美化.css';

/**
 * 组件 Props 的运行时结构。
 * 这些值来自每条消息中由正则生成的 `.abby-mount-hook` 节点的 `data-*` 属性。
 */
type AbbyProps = {
  /** 角色名 */
  name: string;
  /** 表情/心情关键字，对应头像文件名 */
  mood: string;
  /** 对话正文（可能包含简单 HTML） */
  content: string;
  /** 皮肤编号（如 0/1/2/3） */
  skin: string;
};

/**
 * 每一条消息上挂载实例的完整上下文。
 * 通过它可以实现“精准卸载”与“原地状态同步”。
 */
type MountedInstance = {
  /** Vue 应用实例 */
  app: VueApp;
  /** 本条消息对应的挂载锚点 */
  hookEl: HTMLDivElement; // 统一规范命名为 hookEl
  /** 传入 App 的响应式状态 */
  state: AbbyProps;
  /** 监听锚点属性变化的观察器 */
  observer: MutationObserver;
};

/**
 * 缺省数据：当 dataset 缺字段或为空时回退到这里。
 */
const defaults: AbbyProps = {
  name: '阿比盖尔',
  mood: '高兴',
  content: '「Master，阿比已经准备好了哦♪」',
  skin: '0',
};

/**
 * 楼层 ID -> 已挂载实例 的索引表。
 * 用它确保同一楼层始终只有一个实例，且可在删除/重绘时回收。
 */
const mountedByMessage = new Map<number, MountedInstance>();

/**
 * 从消息 DOM（`.mes`）上解析楼层 ID。
 * 失败时返回 null，调用方应当跳过。
 */
function parseMessageId(messageEl: Element | null): number | null {
  if (!messageEl) return null;
  const raw = messageEl.getAttribute('mesid');
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * 从挂载锚点读取 props。
 * content 兜底读取 innerHTML，适配 dataset 缺失或被改写的场景。
 */
function parsePropsFromHook(hook: HTMLDivElement): AbbyProps {
  return {
    name: (hook.dataset.name || defaults.name).trim() || defaults.name,
    mood: (hook.dataset.mood || defaults.mood).trim() || defaults.mood,
    content: (hook.dataset.content || hook.innerHTML || defaults.content).trim() || defaults.content,
    skin: (hook.dataset.skin || defaults.skin).trim() || defaults.skin,
  };
}

/**
 * 将锚点当前数据同步到已挂载实例的响应式 state。
 * 这样无需重建实例，Vue 会自动触发局部更新。
 */
function updateStateFromHook(state: AbbyProps, hook: HTMLDivElement) {
  Object.assign(state, parsePropsFromHook(hook));
}

/**
 * 卸载并销毁某一楼层实例。
 * - 断开 MutationObserver
 * - 卸载 Vue app
 * - 清理 Map 记录
 */
function destroyOne(messageId: number) {
  const mounted = mountedByMessage.get(messageId);
  if (!mounted) return;

  mounted.observer.disconnect();
  mounted.app.unmount();
  mountedByMessage.delete(messageId);
}

/**
 * 挂载某一楼层的组件实例。
 * 同时兼容：
 * - 楼层不存在/锚点不存在（执行清理）
 * - 同楼层重复渲染（复用并同步 state）
 * - 锚点被替换（先销毁旧实例，再新建）
 */
function mountOne(messageId: number) {
  const messageEl = document.querySelector(`.mes[mesid="${messageId}"]`);
  if (!messageEl) {
    destroyOne(messageId);
    return;
  }

  const hookEl = messageEl.querySelector<HTMLDivElement>('.abby-mount-hook');
  if (!hookEl) {
    destroyOne(messageId);
    return;
  }

  // 该楼层已挂载，并且锚点没变：只同步数据，不重建实例
  const mounted = mountedByMessage.get(messageId);
  if (mounted && mounted.hookEl === hookEl) {
    updateStateFromHook(mounted.state, hookEl);
    return;
  }

  // 该楼层已挂载，但锚点已变：先销毁旧实例
  if (mounted) {
    destroyOne(messageId);
  }

  // 正常首挂载流程
  const state = reactive<AbbyProps>(parsePropsFromHook(hookEl));
  const app = createApp(App, state);
  app.mount(hookEl);

  // 监听 data-* 与子树变化，保证外部更新时能实时同步到 Vue state
  const observer = new MutationObserver(() => {
    const current = mountedByMessage.get(messageId);
    if (!current || current.hookEl !== hookEl) return;
    updateStateFromHook(current.state, hookEl);
  });

  observer.observe(hookEl, {
    attributes: true,
    attributeFilter: ['data-name', 'data-mood', 'data-content', 'data-skin'],
    childList: true,
    subtree: true,
  });

  mountedByMessage.set(messageId, {
    app,
    hookEl,
    state,
    observer,
  });
}

/**
 * 扫描页面上所有挂载锚点，并尝试挂载。
 * 常用于初始进入与历史消息批量加载后。
 */
function scanAll() {
  document.querySelectorAll<HTMLDivElement>('.abby-mount-hook').forEach(hook => {
    const messageId = parseMessageId(hook.closest('.mes'));
    if (messageId !== null) {
      mountOne(messageId);
    }
  });
}

/**
 * 生命周期入口：
 * - 首次扫描
 * - 绑定酒馆事件
 * - 页面卸载时统一清理
 */
function init() {
  // 初始渲染：覆盖已经存在的消息楼层
  scanAll();

  // 角色消息渲染完成
  const onCharacterRendered = eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, messageId => {
    mountOne(messageId);
  });

  // 用户消息渲染完成
  const onUserRendered = eventOn(tavern_events.USER_MESSAGE_RENDERED, messageId => {
    mountOne(messageId);
  });

  // 楼层内容更新（例如替换/重绘）：先销毁再重挂
  const onMessageUpdated = eventOn(tavern_events.MESSAGE_UPDATED, messageId => {
    destroyOne(messageId);
    mountOne(messageId);
  });

  // 楼层被编辑：同样走销毁+重挂
  const onMessageEdited = eventOn(tavern_events.MESSAGE_EDITED, messageId => {
    destroyOne(messageId);
    mountOne(messageId);
  });

  // 加载更多历史消息后延迟重扫，等待 DOM 就绪
  const onMoreLoaded = eventOn(tavern_events.MORE_MESSAGES_LOADED, () => {
    setTimeout(scanAll, 100);
  });

  // 楼层删除：回收实例
  const onDeleted = eventOn(tavern_events.MESSAGE_DELETED, messageId => {
    destroyOne(messageId);
  });

  // 切换聊天：清空旧会话实例并重新扫描新会话
  const onChatLoaded = eventOn('chatLoaded', () => {
    mountedByMessage.forEach((_instance, messageId) => destroyOne(messageId));
    scanAll();
  });

  // 前端界面卸载时做最终清理，避免泄漏
  $(window).on('pagehide', () => {
    onCharacterRendered.stop();
    onUserRendered.stop();
    onMessageUpdated.stop();
    onMessageEdited.stop();
    onMoreLoaded.stop();
    onDeleted.stop();
    onChatLoaded.stop();

    mountedByMessage.forEach((_instance, messageId) => destroyOne(messageId));
  });
}

$(() => {
  errorCatched(init)();
});
