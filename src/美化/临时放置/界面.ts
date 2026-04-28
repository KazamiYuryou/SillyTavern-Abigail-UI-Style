/**
 * =====================================================
 * 界面配置 - 路由设置和应用挂载
 * =====================================================
 * 本文件负责：
 * 1. 创建 Vue Router 配置
 * 2. 设置路由历史模式（使用内存历史）
 * 3. 挂载 Vue 应用到 #app 容器
 *
 * 重要说明：
 * - 必须使用 createMemoryHistory() 而不是 createWebHistory()
 *   因为前端界面运行在iframe中，无法使用浏览器历史记录
 * - 路由路径使用 / 开头，组件在 routes 数组中定义
 */

import { createApp } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

// 导入主组件
import App from './App.vue';

/**
 * 创建路由实例
 * history: 使用内存历史，避免在iframe中出现问题
 * routes: 路由配置数组
 */
const router = createRouter({
  // 使用内存历史模式（适用于iframe环境）
  history: createMemoryHistory(),

  // 路由配置
  routes: [
    /**
     * 主路由 - 显示美化后的对话框界面
     * 由于本界面不需要多页面切换，直接使用App组件作为根视图
     */
    {
      path: '/',
      component: App,
    },
  ],
});

// 设置默认路由为根路径
router.replace('/');

/**
 * jQuery ready 回调
 * 在DOM加载完成后执行应用的创建和挂载
 * 注意：必须使用 $() 而不是原生 addEventListener
 */
$(() => {
  /**
   * 创建 Vue 应用实例
   * 1. 使用 createApp(App) 创建应用
   * 2. 使用 .use(router) 注册路由插件
   * 3. 使用 .mount('#app') 挂载到 #app 元素
   */
  createApp(App).use(router).mount('#app');
});
