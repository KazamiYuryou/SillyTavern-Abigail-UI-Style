// 1. 导入你的 CSS 文件。Webpack 打包时会自动将其压缩并准备好。
import './index.css'; 

// 2. 导入酒馆助手官方提供的样式穿透工具函数。
import { teleportStyle } from '../../util/script'; 

$(() => {
  // 3. 由于脚本运行在隐藏的 iframe 中，原本的样式不会影响外部的酒馆网页。
  // 调用 teleportStyle() 将我们打包好的 CSS 强行“复制”到酒馆主界面的 <head> 中，从而渲染你的正则 HTML！
  const { destroy } = teleportStyle();

  // 4. 当用户关闭或重载脚本时，清理掉这些样式，保持环境纯净。
  $(window).on('pagehide', () => {
    destroy();
  });
});