import { App as VueApp, createApp, reactive } from 'vue';
import App from './App.vue';
import './阿比盖尔-统合外链美化.css';

// 1. 定义数据接口
type AbbyProps = {
  name: string;
  mood: string;
  content: string;
  skin: string;
};

// 2. 默认值配置
const defaults: AbbyProps = {
  name: '阿比盖尔',
  mood: '高兴',
  content: '「Master，阿比已经准备好了哦♪」',
  skin: '0',
};

// 3. 从 DOM (正则生成的锚点) 的 dataset 中提取数据
function parsePropsFromDataset(dataset: DOMStringMap): AbbyProps {
  return {
    name: (dataset.name || defaults.name).trim() || defaults.name,
    mood: (dataset.mood || defaults.mood).trim() || defaults.mood,
    content: (dataset.content || defaults.content).trim() || defaults.content,
    skin: (dataset.skin || defaults.skin).trim() || defaults.skin,
  };
}

// 【关键修改点】：使用 Map 集中管理每一层楼（每条消息）的 Vue 实例
// 键为 messageId (楼层ID)，值为 Vue 实例。这样在删除消息时可以精确销毁组件，防止内存泄漏。
const appInstances = new Map<number, VueApp>();

// 4. 针对单条消息的挂载逻辑
function mountToMessage(messageId: number) {
  // 定位到具体的聊天气泡 DOM
  const messageEl = document.querySelector(`.mes[mesid="${messageId}"]`);
  if (!messageEl) return;

  // 定位到正则在该气泡内生成的挂载锚点
  const hookEl = messageEl.querySelector('.abby-mount-hook') as HTMLDivElement;
  if (!hookEl) return;

  // 防止由于重绘导致的重复挂载
  if (hookEl.hasAttribute('data-v-mounted')) return;

  // 提取数据并创建响应式状态
  const state = reactive<AbbyProps>(parsePropsFromDataset(hookEl.dataset));

  // 【关键修改点】：去掉无用的 createPinia()，保持纯粹的 UI 渲染组件，加快渲染速度
  const app = createApp(App, state);

  // 挂载到该锚点，并打上防重标记
  app.mount(hookEl);
  hookEl.setAttribute('data-v-mounted', 'true');

  // 将实例存入 Map 管理
  appInstances.set(messageId, app);
}

// 5. 针对单条消息的卸载逻辑
function unmountFromMessage(messageId: number) {
  if (appInstances.has(messageId)) {
    const app = appInstances.get(messageId)!;
    app.unmount(); // 彻底销毁 Vue 实例，释放内存
    appInstances.delete(messageId);
  }
}

// 6. 初始化与酒馆事件监听
function init() {
  // 监听：角色或用户消息渲染完成时，执行挂载
  const onCharRender = eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, mountToMessage);
  const onUserRender = eventOn(tavern_events.USER_MESSAGE_RENDERED, mountToMessage);

  // 监听：消息被编辑/更新（如滑动切换回复），需要先卸载旧的实例
  const onUpdate = eventOn(tavern_events.MESSAGE_UPDATED, unmountFromMessage);

  // 监听：消息被删除时，销毁对应的 Vue 实例
  const onDelete = eventOn(tavern_events.MESSAGE_DELETED, unmountFromMessage);

  // 兜底：进入页面或重载时，扫描已经存在的所有历史消息并挂载
  document.querySelectorAll('.mes').forEach(el => {
    const mesIdAttr = el.getAttribute('mesid');
    if (mesIdAttr) mountToMessage(Number(mesIdAttr));
  });

  // 全局清理：当关闭窗口或停用脚本时，摧毁一切，保持干干净净
  $(window).on('pagehide', () => {
    onCharRender.stop();
    onUserRender.stop();
    onUpdate.stop();
    onDelete.stop();
    appInstances.forEach(app => app.unmount());
    appInstances.clear();
  });
}

$(() => {
  errorCatched(init)();
});
