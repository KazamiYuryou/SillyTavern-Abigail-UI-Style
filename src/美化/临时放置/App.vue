<template>
  <!-- 
    =================================================================
    阿比盖尔美化 - Galgame风格对话框组件
    =================================================================
    
    本组件用于美化酒馆AI输出的对话内容，采用Galagame经典布局风格。
    数据通过正则替换时的捕获组获取，使用 $1, $2, $3 占位符：
    
    | 占位符 | 对应正则捕获组 | 说明 |
    |--------|--------------|------|
    | $1 | (.*?) 第1个括号 | 角色名称 name |
    | $2 | (.*?) 第2个括号 | 心情/头像ID mood |
    | $3 | (.*?) 第3个括号 | 对话内容 content |
    
    组件整体结构（由外到内）：
    1. abby-mount-hook - 根容器，设置基础样式和CSS变量
    2. abby-yog-container - 最外层卡片容器，包含边框装饰
    3. bg-wrapper - 背景特效层（极光、星空、星云）
    4. abby-yog-card - 核心内容卡片（呼吸灯效果）
    5. solar-key-system - 右上角银钥机械装饰
    6. abby-dialog - 对话布局（左侧头像 + 右侧对话框）
  -->

  <!-- 根容器：设置基础样式和CSS变量 -->
  <div class="abby-mount-hook">
    <!-- 
      =================================================================
      最外层容器 - abby-yog-container
      =================================================================
      包含：
      - 双层边框装饰（通过::before和::after伪元素实现）
      - 四个角落的直角小方框装饰
      - 边框上的斜线、发光圆点、线条等装饰
      - 背景特效层
      - 核心内容卡片
    -->
    <div class="abby-yog-container">
      <!-- 
        =================================================================
        背景包裹器 - bg-wrapper
        =================================================================
        装载所有背景特效元素，使用 inset: 6px 向内收缩
        避免遮住外层边框装饰
      -->
      <div class="bg-wrapper">
        <!-- 
          =================================================================
          宇宙背景层 - bg-container
          =================================================================
          包含：底色渐变、星云气态效果、星系旋臂
          使用 var(--void-deep) 作为背景色
        -->
        <div class="bg-container">
          <!-- 
            -----------------------------------------------------------------
            底色渐变层 - void-base
            -----------------------------------------------------------------
            多层径向渐变叠加，创造深邃的宇宙背景
            中心偏上（50% 25%）有一个较亮的蓝色区域
            中心偏下（50% 75%）有另一个较暗的区域
            最底层是 var(--void-deep) 虚空深色
          -->
          <div class="void-base"></div>

          <!-- 
            -----------------------------------------------------------------
            星云层 - nebula (3团)
            -----------------------------------------------------------------
            使用径向渐变创建气态效果
            通过 animation 实现缓慢漂浮动画
            三团星云使用不同的模糊程度和透明度
          -->
          <div class="nebula"></div>
          <div class="nebula-2"></div>
          <div class="nebula-3"></div>

          <!-- 
            -----------------------------------------------------------------
            星系旋臂 - galaxy-arm
            -----------------------------------------------------------------
            使用 conic-gradient 圆锥渐变创建漩涡效果
            arm-primary: 主旋臂，紫蓝色调
            arm-secondary: 副旋臂，青色调
            通过 mech-spin 动画实现旋转
          -->
          <div class="galaxy-arm arm-primary"></div>
          <div class="galaxy-arm arm-secondary"></div>
        </div>

        <!-- 
          =================================================================
          极光层 - aurora-layer
          =================================================================
          使用 mix-blend-mode: screen 让光线透亮
          包含3条不同颜色和速度的极光带
          以及波纹和光晕效果
        -->
        <div class="aurora-layer">
          <div class="aurora-band">
            <!-- 极光带1 - 绿/青/蓝色调 -->
            <div class="aurora-1"></div>
            <!-- 极光带2 - 青/蓝色调，位置稍低 -->
            <div class="aurora-2"></div>
            <!-- 极光带3 - 淡青色，位置稍高 -->
            <div class="aurora-3"></div>
            <!-- 极光波纹 - 重复线性渐变 -->
            <div class="aurora-wave"></div>
            <!-- 极光光晕 - 径向渐变脉冲动画 -->
            <div class="aurora-glow"></div>
          </div>
        </div>

        <!-- 
          =================================================================
          星屑系统 - star-layer (8个层级)
          =================================================================
          通过8个不同大小、透明度、旋转中心、动画时间的层级
          创造深邃的3D星空视差效果
          越小的星屑越接近前景，动画越快
        -->
        <div class="star-layer stars-1"></div>
        <div class="star-layer stars-2"></div>
        <div class="star-layer stars-3"></div>
        <div class="star-layer stars-4"></div>
        <div class="star-layer stars-5"></div>
        <div class="star-layer stars-6"></div>
        <div class="star-layer stars-7"></div>
        <div class="star-layer stars-8"></div>

        <!-- 
          =================================================================
          尘埃和粒子层
          =================================================================
          直线飘动的尘埃效果，增加空间感
        -->
        <div class="dust-layer"></div>
        <div class="particle-layer"></div>

        <!-- 
          =================================================================
          扫描光效 - scan-beam (预留占位)
          =================================================================
          暂未启用，显示设置为 none
        -->
        <div class="scan-beam"></div>
      </div>

      <!-- 
        =================================================================
        边框装饰件
        =================================================================
        所有装饰使用 position: absolute 定位在边框四周
      -->

      <!-- 角落直角小方框装饰 (4个) -->
      <div class="frame-corner fc-tl"></div>
      <div class="frame-corner fc-tr"></div>
      <div class="frame-corner fc-bl"></div>
      <div class="frame-corner fc-br"></div>

      <!-- 斜线装饰 (4个) -->
      <div class="frame-flourish ff-tl"></div>
      <div class="frame-flourish ff-tr"></div>
      <div class="frame-flourish ff-bl"></div>
      <div class="frame-flourish ff-br"></div>

      <!-- 发光圆点 (4个) -->
      <div class="frame-dot fd-top"></div>
      <div class="frame-dot fd-bottom"></div>
      <div class="frame-dot fd-left"></div>
      <div class="frame-dot fd-right"></div>

      <!-- 边框中间的点缀线段 (4个) -->
      <div class="frame-mid fm-top"></div>
      <div class="frame-mid fm-bottom"></div>
      <div class="frame-mid fm-left"></div>
      <div class="frame-mid fm-right"></div>

      <!-- 四分之一处的小号发光圆点 (8个) -->
      <div class="frame-qdot fq-top1"></div>
      <div class="frame-qdot fq-top2"></div>
      <div class="frame-qdot fq-bottom1"></div>
      <div class="frame-qdot fq-bottom2"></div>
      <div class="frame-qdot fq-left1"></div>
      <div class="frame-qdot fq-left2"></div>
      <div class="frame-qdot fq-right1"></div>
      <div class="frame-qdot fq-right2"></div>

      <!-- 
        =================================================================
        核心内容卡片层 - abby-yog-card
        =================================================================
        装载头像和对话框的主容器
        包含 card-breathe 呼吸灯动画效果
        使用 CSS Grid 布局
      -->
      <div class="abby-yog-card">
        <!-- 
          =================================================================
          银钥机关特效 - solar-key-system
          =================================================================
          固定在右上角的机械装饰
          包含：
          - dimension-ripple: 波纹圆圈（爆发时效果）
          - orbit-ring: 轨道圆环
            - ring-outer: 外圈刻度盘
            - ring-inner: 内圈刻度盘
          - eldritch-key-group: 钥匙本体组
            - ek-handle: 钥匙柄
            - ek-shaft: 钥匙杆
            - ek-bit: 钥匙齿
        -->
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

        <!-- 
          =================================================================
          对话布局 - abby-dialog
          =================================================================
          使用 CSS Grid 网格布局
          grid-template-columns: auto 1fr
          - 左侧：头像 (auto 自适应)
          - 右侧：对话内容 (1fr 占据剩余空间)
          
          数据绑定说明：
          $1 = 角色名称 (name) - 来自正则第1捕获组
          $2 = 心情/头像ID (mood) - 来自正则第2捕获组
          $3 = 对话内容 (content) - 来自正则第3捕获组
        -->
        <div class="abby-dialog">
          <!-- 
            =================================================================
            头像框 - portrait-wrap
            =================================================================
            包含：
            - portrait-frame: 头像边框（带四个角装饰）
            - portrait-gem: 顶部宝石装饰
            - portrait-inner: 头像图片容器
            - portrait-overlay: 光影遮罩层
            
            头像URL格式：
            https://cdn.jsdelivr.net/gh/AkabaneSaki/myrepo@main/picture/abby/${$2}.png
            其中 $2 是心情/头像ID
          -->
          <div class="portrait-wrap">
            <!-- 头像边框 -->
            <div class="portrait-frame">
              <!-- 四个角的装饰 -->
              <div class="pf-corner pf-tl"></div>
              <div class="pf-corner pf-tr"></div>
              <div class="pf-corner pf-bl"></div>
              <div class="pf-corner pf-br"></div>
            </div>

            <!-- 头像顶部小宝石 -->
            <div class="portrait-gem"></div>

            <!-- 头像图片容器 - 使用动态URL -->
            <!-- 头像URL格式: https://cdn.jsdelivr.net/gh/AkabaneSaki/myrepo@main/picture/abby/$2.png -->
            <div
              class="portrait-inner"
              style="background-image: url('https://cdn.jsdelivr.net/gh/AkabaneSaki/myrepo@main/picture/abby/$2.png')"
            ></div>

            <!-- 光影遮罩层 -->
            <div class="portrait-overlay"></div>
          </div>

          <!-- 
            =================================================================
            右侧对话主容器 - dialog-main
            =================================================================
          -->
          <div class="dialog-main">
            <!-- 
              =================================================================
              姓名面板 - name-plate
              =================================================================
              显示角色名称 $1
              使用负外边距 margin-bottom: -6px 使其"陷入"对话框
              造成视觉上连接的选项卡效果
            -->
            <div class="name-plate">
              <!-- 名字图标（小圆点） -->
              <div class="name-icon"></div>
              <!-- 角色名称文本 - $1 -->
              <div class="abby-name-text">$1</div>
            </div>

            <!-- 
              =================================================================
              对话框 - dialog-box
              =================================================================
              显示对话内容 $3
              带有顶部/底部装饰线条（::before/::after伪元素）
              内部有 dialog-inner-deco 点阵装饰
              四个角有 dialog-corner 小角标
            -->
            <div class="dialog-box">
              <!-- 点阵装饰层 -->
              <div class="dialog-inner-deco"></div>

              <!-- 四个角的小角标 -->
              <div class="dialog-corner dc-tl"></div>
              <div class="dialog-corner dc-tr"></div>
              <div class="dialog-corner dc-bl"></div>
              <div class="dialog-corner dc-br"></div>

              <!-- 对话内容 - $3 -->
              <div class="abby-yog-content">$3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/**
 * =================================================================
 * 阿比盖尔美化 - Galgame风格对话框样式
 * =================================================================
 * 严格复刻《阿比盖尔-统合外链美化 - 副本.css》样式
 * 适配Vue SFC格式
 * 
 * CSS变量说明：
 * --base-blue: 基础深蓝色 (#4a5a8a)
 * --light-blue: 亮蓝色，用于高光和边框 (#a8c0ff)
 * --glow-blue: 发光蓝，带有透明度
 * --mithril-white: 秘银白，用于钥匙等极亮元素 (#f0f8ff)
 * --void-deep: 虚空深色，最底层背景 (#05081c)
 * --panel: 对话框主底色
 * --name-plate: 名字牌底色
 * --portrait-w/h: 头像宽度/高度
 * --blur-strength: 背景模糊强度
 * --star-scale: 星屑缩放比例
 * --frame-color/glow: 边框装饰颜色
 * 
 * 数据绑定：
 * $1 = 角色名称 (name)
 * $2 = 心情/头像ID (mood)  
 * $3 = 对话内容 (content)
 */

/* 引入Google Fonts字体 */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Noto+Serif+SC:wght@400;700&display=swap');

/**
 * =================================================================
 * 01. 全局变量与基础设定 (:root)
 * =================================================================
 * 把常用的颜色和尺寸定义在CSS变量中
 * 便于后续统一修改主题色
 */
.abby-mount-hook {
  /* 基础颜色变量 */
  --base-blue: #4a5a8a; /* 基础深蓝色 */
  --light-blue: #a8c0ff; /* 亮蓝色，用于高光和边框 */
  --glow-blue: rgba(168, 192, 255, 0.8); /* 发光蓝，带有透明度 */
  --mithril-white: #f0f8ff; /* 秘银白，用于钥匙等极其明亮的元素 */
  --void-deep: #05081c; /* 虚空深色，作为最底层的背景色 */

  /* Galgame 风格专属变量 */
  --panel: rgba(8, 14, 30, 0.85); /* 对话框的主底色：加深的半透明深蓝 */
  --panel-border: rgba(184, 203, 255, 0.4);
  --name-plate: rgba(10, 16, 42, 0.9); /* 名字牌底色 */
  --name-plate-border: rgba(199, 219, 255, 0.7);

  /* 响应式尺寸设置 */
  /* clamp(最小值, 首选值, 最大值)：让头像宽度根据屏幕宽度自动缩放 */
  --portrait-w: clamp(108px, 13vw, 148px);
  --portrait-h: calc(var(--portrait-w) * 1.33); /* 高度永远是宽度的 1.33 倍 */

  --blur-strength: 60px; /* 背景模糊强度 */
  --star-scale: 1; /* 星星星屑的缩放比例 */
  --frame-color: rgba(168, 192, 255, 0.5); /* 装饰边框颜色 */
  --frame-glow: rgba(120, 156, 248, 0.35); /* 装饰边框发光色 */

  /* 基础重置 */
  margin: 0;
  padding: 12px;
  box-sizing: border-box;
  overflow: hidden;
  min-height: 100%;
  background: transparent;
  font-family: 'Noto Serif SC', 'Microsoft YaHei', serif;
  color: #f0f4f8;
}

/**
 * =================================================================
 * 02. 核心容器与布局层
 * =================================================================
 */

/**
 * 背景包裹器：装载特效
 * inset: 6px 让背景层向内收缩6px
 * 这样就不会遮住最外层画出来的边框了
 * pointer-events: none 让鼠标事件穿透背景
 */
.bg-wrapper {
  position: absolute;
  inset: 6px;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
}

/**
 * 整体大卡片容器
 * width: min(100%, 1160px) 最大1160px，小屏幕时占满
 * margin: 16px auto 上下留白，左右居中
 * box-shadow 整体外部微光
 */
.abby-yog-container {
  position: relative;
  width: min(100%, 1160px);
  margin: 16px auto;
  border-radius: 6px;
  z-index: 10;
  overflow: visible;
  box-sizing: border-box;
  isolation: isolate;
  border: none;
  outline: none;
  box-shadow: 0 0 18px rgba(100, 140, 220, 0.28);
}

/**
 * 双层边框：通过::before和::after伪元素绘制
 * 性能好且不会影响内部内容排版
 */
.abby-yog-container::before,
.abby-yog-container::after {
  content: '';
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
  z-index: 11;
}

/**
 * 外层主边框
 * inset: 0 表示完全贴合容器边缘
 * border: 2px 实线边框
 * box-shadow 外发光
 */
.abby-yog-container::before {
  inset: 0;
  border: 2px solid rgba(168, 192, 255, 0.88);
  box-shadow: 0 0 12px rgba(100, 140, 220, 0.35);
}

/**
 * 内层高光边框
 * inset: 4px 向内收缩4px，形成双线效果
 * border: 1px 较细的边框
 */
.abby-yog-container::after {
  inset: 4px;
  border: 1px solid rgba(200, 220, 255, 0.48);
  box-shadow: inset 0 0 8px rgba(168, 192, 255, 0.18);
}

/**
 * =================================================================
 * 03. 边框上的小装饰件
 * =================================================================
 * 所有装饰使用 position: absolute 绝对定位
 * 放置在边框的四个角或中段
 */

/**
 * 角落直角小方框装饰
 * 使用 ::before 画横线，::after 画竖线
 * transform 翻转定位到四个角
 */
.frame-corner {
  position: absolute !important;
  width: 22px !important;
  height: 22px !important;
  pointer-events: none;
  z-index: 12;
}

.frame-corner::before,
.frame-corner::after {
  content: '';
  position: absolute;
  background: var(--frame-color) !important;
  border-radius: 1.5px;
}

.frame-corner::before {
  width: 100%;
  height: 2.5px;
  top: 0;
  left: 0;
}

.frame-corner::after {
  width: 2.5px;
  height: 100%;
  top: 0;
  left: 0;
}

/* 四个角的定位 */
.fc-tl {
  top: -8px !important;
  left: -8px !important;
} /* 左上角 */
.fc-tr {
  top: -8px !important;
  right: -8px !important;
  transform: scaleX(-1);
} /* 右上角，水平翻转 */
.fc-bl {
  bottom: -8px !important;
  left: -8px !important;
  transform: scaleY(-1);
} /* 左下角，垂直翻转 */
.fc-br {
  bottom: -8px !important;
  right: -8px !important;
  transform: scale(-1);
} /* 右下角，水平+垂直翻转 */

/**
 * 斜线装饰 - frame-flourish
 * 45度倾斜的线条，增加边框装饰感
 */
.frame-flourish {
  position: absolute !important;
  width: 20px !important;
  height: 20px !important;
  pointer-events: none;
  z-index: 12;
  opacity: 0.65;
}

.frame-flourish::before {
  content: '';
  position: absolute;
  width: 145%;
  height: 2.5px;
  top: 50%;
  left: -22%;
  background: var(--frame-color) !important;
  transform: rotate(45deg);
  border-radius: 1.5px;
}

.ff-tl {
  top: -16px !important;
  left: -16px !important;
}
.ff-tr {
  top: -16px !important;
  right: -16px !important;
  transform: scaleX(-1);
}
.ff-bl {
  top: -16px !important;
  left: -16px !important;
  transform: scaleY(-1);
}
.ff-br {
  top: -16px !important;
  right: -16px !important;
  transform: scale(-1);
}

/**
 * 发光圆点 - frame-dot
 * 边框上下的中心发光点
 */
.frame-dot {
  position: absolute !important;
  width: 9px !important;
  height: 9px !important;
  border-radius: 50%;
  background: radial-gradient(circle, var(--light-blue), var(--glow-blue)) !important;
  box-shadow: 0 0 8px var(--glow-blue) !important;
  pointer-events: none;
  z-index: 12;
  opacity: 0.75;
}

.fd-top {
  top: -12px !important;
  left: 50%;
  transform: translateX(-50%);
}
.fd-bottom {
  bottom: -12px !important;
  left: 50%;
  transform: translateX(-50%);
}
.fd-left {
  left: -12px !important;
  top: 50%;
  transform: translateY(-50%);
}
.fd-right {
  right: -12px !important;
  top: 50%;
  transform: translateY(-50%);
}

/**
 * 边框中间的点缀线段 - frame-mid
 * 使用线性渐变实现两端透明的效果
 */
.frame-mid {
  position: absolute !important;
  pointer-events: none;
  z-index: 12;
}

.frame-mid::before {
  content: '';
  position: absolute;
  background: linear-gradient(90deg, transparent, var(--frame-color), transparent) !important;
}

.fm-top {
  top: -12px !important;
  left: 18%;
  right: 18%;
  height: 1.5px;
}
.fm-top::before {
  width: 100%;
  height: 1.5px;
}
.fm-bottom {
  bottom: -12px !important;
  left: 18%;
  right: 18%;
  height: 1.5px;
}
.fm-bottom::before {
  width: 100%;
  height: 1.5px;
}
.fm-left {
  left: -12px !important;
  top: 18%;
  bottom: 18%;
  width: 1.5px;
}
.fm-left::before {
  background: linear-gradient(180deg, transparent, var(--frame-color), transparent) !important;
  width: 1.5px;
  height: 100%;
}
.fm-right {
  right: -12px !important;
  top: 18%;
  bottom: 18%;
  width: 1.5px;
}
.fm-right::before {
  background: linear-gradient(180deg, transparent, var(--frame-color), transparent) !important;
  width: 1.5px;
  height: 100%;
}

/**
 * 四分之一处的小号发光圆点 - frame-qdot
 * 边框四等分位置的装饰点
 */
.frame-qdot {
  position: absolute !important;
  width: 5px !important;
  height: 5px !important;
  border-radius: 50%;
  background: var(--frame-color) !important;
  box-shadow: 0 0 4px var(--frame-glow) !important;
  pointer-events: none;
  z-index: 12;
  opacity: 0.55;
}

.fq-top1 {
  top: -12px !important;
  left: 25%;
}
.fq-top2 {
  top: -12px !important;
  left: 75%;
}
.fq-bottom1 {
  bottom: -12px !important;
  left: 25%;
}
.fq-bottom2 {
  bottom: -12px !important;
  left: 75%;
}
.fq-left1 {
  left: -12px !important;
  top: 25%;
}
.fq-left2 {
  left: -12px !important;
  top: 75%;
}
.fq-right1 {
  right: -12px !important;
  top: 25%;
}
.fq-right2 {
  right: -12px !important;
  top: 75%;
}

/**
 * =================================================================
 * 04. 复杂的背景特效层 (极光与星海)
 * =================================================================
 */

/**
 * 极光层 - aurora-layer
 * mix-blend-mode: screen 让光线显得透亮
 */
.aurora-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
  opacity: 0.68;
  mix-blend-mode: screen;
}

.aurora-band {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  mix-blend-mode: screen;
}

/**
 * 极光带1 - 绿/青/蓝色调
 * 使用 linear-gradient 创建多色渐变
 * filter: blur 模糊处理
 * animation 缓慢移动效果
 */
.aurora-1 {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(80, 180, 120, 0.12) 15%,
    rgba(100, 200, 180, 0.18) 30%,
    rgba(80, 160, 220, 0.15) 50%,
    rgba(120, 140, 255, 0.12) 70%,
    rgba(80, 180, 120, 0.1) 85%,
    transparent 100%
  );
  filter: blur(35px);
  animation: aurora-flow 22s ease-in-out infinite alternate;
}

/**
 * 极光带2 - 青/蓝色调
 * 位置稍低 (bottom: -8%)
 */
.aurora-2 {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(60, 200, 160, 0.1) 18%,
    rgba(100, 180, 255, 0.14) 38%,
    rgba(140, 120, 255, 0.11) 58%,
    rgba(80, 200, 140, 0.12) 78%,
    transparent 100%
  );
  filter: blur(40px);
  animation: aurora-flow-2 28s ease-in-out infinite alternate;
  bottom: -8%;
}

/**
 * 极光带3 - 淡青色
 * 位置稍高 (bottom: 2%)
 */
.aurora-3 {
  background: linear-gradient(
    90deg,
    transparent 5%,
    rgba(100, 220, 180, 0.08) 20%,
    rgba(80, 180, 240, 0.1) 40%,
    rgba(120, 160, 255, 0.08) 60%,
    rgba(100, 200, 160, 0.06) 80%,
    transparent 95%
  );
  filter: blur(50px);
  animation: aurora-flow 32s ease-in-out infinite alternate-reverse;
  bottom: 2%;
}

/**
 * 极光波纹 - aurora-wave
 * repeating-linear-gradient 重复线性渐变
 */
.aurora-wave {
  position: absolute;
  bottom: -10%;
  left: -15%;
  width: 130%;
  height: 80%;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.3;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 45px,
    rgba(100, 220, 180, 0.06) 90px,
    rgba(80, 180, 240, 0.05) 135px
  );
  filter: blur(28px);
  animation: aurora-wave-move 18s linear infinite;
}

/**
 * 极光光晕 - aurora-glow
 * 径向渐变 + 脉冲动画
 */
.aurora-glow {
  position: absolute;
  bottom: 5%;
  left: 25%;
  width: 50%;
  height: 40%;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(100, 200, 180, 0.1), transparent 70%);
  filter: blur(30px);
  animation: aurora-pulse 8s ease-in-out infinite alternate;
}

/**
 * =================================================================
 * 宇宙背景层
 * =================================================================
 */

/**
 * 宇宙深蓝底色与星云旋臂容器
 * background: var(--void-deep) 虚空深色
 */
.bg-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;
  background: var(--void-deep);
  border-radius: inherit;
}

/**
 * 底色渐变 - void-base
 * 多层径向渐变叠加创造深邃背景
 */
.void-base {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background:
    radial-gradient(ellipse at 50% 25%, rgba(53, 87, 174, 0.22) 0%, transparent 55%),
    radial-gradient(ellipse at 50% 75%, rgba(36, 68, 132, 0.15) 0%, transparent 50%), rgba(5, 8, 28, 0.82);
}

/**
 * 星云气态效果 - nebula (3团)
 * 使用径向渐变创建气态效果
 * filter: blur 模糊处理
 * animation: nebula-drift 漂浮动画
 */
.nebula {
  position: absolute;
  inset: -18%;
  pointer-events: none;
  background:
    radial-gradient(50% 45% at 22% 22%, rgba(120, 162, 255, 0.32), transparent 78%),
    radial-gradient(38% 35% at 72% 58%, rgba(106, 138, 235, 0.26), transparent 74%),
    radial-gradient(30% 30% at 48% 82%, rgba(90, 130, 220, 0.2), transparent 70%);
  filter: blur(22px);
  opacity: 0.78;
  animation: nebula-drift 46s ease-in-out infinite alternate;
}

.nebula-2 {
  position: absolute;
  inset: -16%;
  pointer-events: none;
  background:
    radial-gradient(35% 38% at 52% 12%, rgba(90, 130, 220, 0.24), transparent 68%),
    radial-gradient(30% 30% at 28% 72%, rgba(140, 170, 255, 0.2), transparent 72%),
    radial-gradient(25% 25% at 78% 38%, rgba(120, 162, 255, 0.18), transparent 68%);
  filter: blur(26px);
  opacity: 0.62;
  animation: nebula-drift-2 62s ease-in-out infinite alternate;
}

.nebula-3 {
  position: absolute;
  inset: -14%;
  pointer-events: none;
  background:
    radial-gradient(40% 35% at 12% 52%, rgba(100, 150, 230, 0.18), transparent 70%),
    radial-gradient(28% 28% at 62% 28%, rgba(80, 120, 210, 0.16), transparent 65%);
  filter: blur(30px);
  opacity: 0.45;
  animation: nebula-drift 52s ease-in-out infinite alternate-reverse;
}

/**
 * 星系旋臂 - galaxy-arm
 * 使用 conic-gradient 圆锥渐变创建漩涡效果
 * mix-blend-mode: screen 让其与背景融合
 */
.galaxy-arm {
  position: absolute;
  width: 300%;
  height: 300%;
  filter: blur(var(--blur-strength));
  mix-blend-mode: screen;
  opacity: 0.4;
  pointer-events: none;
}

.arm-primary {
  top: -100%;
  left: -100%;
  transform-origin: 20% 80%;
  background: conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    transparent 140deg,
    rgba(74, 20, 140, 0.3) 180deg,
    rgba(168, 192, 255, 0.1) 220deg,
    transparent 260deg,
    transparent 360deg
  );
  animation: mech-spin 120s linear infinite;
}

.arm-secondary {
  top: -100%;
  left: -100%;
  transform-origin: 80% 20%;
  background: conic-gradient(
    from 180deg at 50% 50%,
    transparent 0deg,
    transparent 120deg,
    rgba(0, 229, 255, 0.15) 160deg,
    rgba(168, 192, 255, 0.05) 200deg,
    transparent 240deg,
    transparent 360deg
  );
  animation: mech-spin 90s linear infinite reverse;
}

/**
 * =================================================================
 * 05. 星屑系统 (8个层级)
 * =================================================================
 * 通过设置不同的 background-size、opacity、transform-origin 和动画时间
 * 利用视差错觉创造出深邃的3D星空效果
 * 越小的星屑越接近前景，动画越快
 */

/**
 * 星屑层基础样式
 * mix-blend-mode: screen 让星屑发光
 */
.star-layer {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  mix-blend-mode: screen;
  pointer-events: none;
  z-index: 4;
}

/**
 * 星屑层1 - 最小最慢的远景星屑
 */
.stars-1 {
  transform-origin: 25% 20%;
  background-image:
    radial-gradient(1.5px 1.5px at 10% 15%, #fff, transparent),
    radial-gradient(1.2px 1.2px at 35% 48%, rgba(200, 220, 255, 0.8), transparent),
    radial-gradient(1.6px 1.6px at 62% 32%, rgba(255, 255, 255, 0.85), transparent),
    radial-gradient(1px 1px at 82% 68%, rgba(180, 200, 255, 0.7), transparent),
    radial-gradient(1.3px 1.3px at 45% 85%, rgba(210, 225, 255, 0.75), transparent),
    radial-gradient(1.1px 1.1px at 25% 72%, rgba(255, 255, 255, 0.8), transparent);
  background-size: calc(160px * var(--star-scale));
  opacity: 0.65;
  animation: star-cw 260s linear infinite;
}

.stars-2 {
  transform-origin: 72% 75%;
  background-image:
    radial-gradient(1.4px 1.4px at 12% 28%, rgba(255, 255, 255, 0.9), transparent),
    radial-gradient(1.1px 1.1px at 40% 65%, rgba(168, 192, 255, 0.8), transparent),
    radial-gradient(1.6px 1.6px at 68% 20%, rgba(220, 230, 255, 0.85), transparent),
    radial-gradient(1.2px 1.2px at 85% 52%, rgba(255, 255, 255, 0.75), transparent),
    radial-gradient(1px 1px at 30% 82%, rgba(200, 210, 255, 0.7), transparent),
    radial-gradient(1.3px 1.3px at 55% 38%, rgba(255, 255, 255, 0.8), transparent);
  background-size: calc(200px * var(--star-scale));
  opacity: 0.55;
  animation: star-ccw 200s linear infinite;
}

.stars-3 {
  transform-origin: 20% 82%;
  background-image:
    radial-gradient(2px 2px at 18% 38%, rgba(255, 255, 255, 0.92), transparent),
    radial-gradient(1.8px 1.8px at 52% 12%, rgba(168, 192, 255, 0.85), transparent),
    radial-gradient(1.6px 1.6px at 75% 58%, rgba(200, 215, 255, 0.75), transparent),
    radial-gradient(1.9px 1.9px at 38% 78%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1.5px 1.5px at 62% 88%, rgba(180, 200, 255, 0.7), transparent),
    radial-gradient(1.7px 1.7px at 28% 22%, rgba(255, 255, 255, 0.85), transparent);
  background-size: calc(280px * var(--star-scale));
  opacity: 0.48;
  animation: star-cw 160s linear infinite;
}

.stars-4 {
  transform-origin: 82% 15%;
  background-image:
    radial-gradient(2.4px 2.4px at 15% 45%, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(2.2px 2.2px at 48% 22%, rgba(180, 200, 255, 0.88), transparent),
    radial-gradient(2px 2px at 72% 68%, rgba(220, 235, 255, 0.82), transparent),
    radial-gradient(1.8px 1.8px at 30% 32%, rgba(255, 255, 255, 0.9), transparent),
    radial-gradient(2.1px 2.1px at 58% 85%, rgba(200, 220, 255, 0.75), transparent);
  background-size: calc(380px * var(--star-scale));
  opacity: 0.38;
  animation: star-ccw 280s linear infinite;
}

.stars-5 {
  transform-origin: 42% 52%;
  background-image:
    radial-gradient(2.6px 2.6px at 8% 20%, #fff, transparent),
    radial-gradient(2.2px 2.2px at 30% 55%, rgba(200, 220, 255, 0.92), transparent),
    radial-gradient(2.8px 2.8px at 52% 35%, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(1.9px 1.9px at 70% 75%, rgba(180, 200, 255, 0.88), transparent),
    radial-gradient(2.3px 2.3px at 88% 12%, rgba(255, 255, 255, 0.92), transparent),
    radial-gradient(2px 2px at 25% 88%, rgba(200, 210, 255, 0.8), transparent);
  background-size: calc(450px * var(--star-scale));
  opacity: 0.42;
  animation: star-drift 85s linear infinite alternate;
}

.stars-6 {
  transform-origin: 32% 62%;
  background-image:
    radial-gradient(0.8px 0.8px at 6% 12%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(0.7px 0.7px at 22% 40%, rgba(200, 220, 255, 0.5), transparent),
    radial-gradient(0.9px 0.9px at 45% 25%, rgba(255, 255, 255, 0.55), transparent),
    radial-gradient(0.6px 0.6px at 62% 65%, rgba(180, 200, 255, 0.45), transparent),
    radial-gradient(0.8px 0.8px at 78% 32%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(0.7px 0.7px at 90% 78%, rgba(210, 225, 255, 0.45), transparent),
    radial-gradient(0.6px 0.6px at 15% 72%, rgba(255, 255, 255, 0.48), transparent),
    radial-gradient(0.75px 0.75px at 55% 92%, rgba(200, 220, 255, 0.42), transparent);
  background-size: calc(120px * var(--star-scale));
  opacity: 0.52;
  animation: star-diag 180s linear infinite;
}

.stars-7 {
  transform-origin: 58% 38%;
  background-image:
    radial-gradient(3.2px 3.2px at 20% 32%, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(2.8px 2.8px at 55% 62%, rgba(190, 210, 255, 0.88), transparent),
    radial-gradient(3px 3px at 78% 18%, rgba(255, 255, 255, 0.92), transparent),
    radial-gradient(2.5px 2.5px at 35% 78%, rgba(200, 220, 255, 0.8), transparent),
    radial-gradient(2.9px 2.9px at 62% 45%, rgba(255, 255, 255, 0.85), transparent);
  background-size: calc(520px * var(--star-scale));
  opacity: 0.32;
  animation: star-drift-2 100s linear infinite alternate;
}

.stars-8 {
  transform-origin: 45% 48%;
  background-image:
    radial-gradient(0.5px 0.5px at 12% 22%, rgba(255, 255, 255, 0.55), transparent),
    radial-gradient(0.4px 0.4px at 32% 52%, rgba(200, 220, 255, 0.45), transparent),
    radial-gradient(0.55px 0.55px at 52% 15%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(0.45px 0.45px at 68% 45%, rgba(180, 200, 255, 0.42), transparent),
    radial-gradient(0.5px 0.5px at 85% 68%, rgba(255, 255, 255, 0.48), transparent),
    radial-gradient(0.4px 0.4px at 25% 85%, rgba(200, 210, 255, 0.4), transparent),
    radial-gradient(0.48px 0.48px at 58% 82%, rgba(255, 255, 255, 0.45), transparent),
    radial-gradient(0.42px 0.42px at 78% 28%, rgba(180, 220, 255, 0.38), transparent);
  background-size: calc(100px * var(--star-scale));
  opacity: 0.48;
  animation: star-orbit 220s linear infinite;
}

/**
 * 尘埃和粒子层 - 直线飘动的效果
 */
.dust-layer {
  position: absolute;
  inset: -12%;
  pointer-events: none;
  background-image: radial-gradient(1px 1px at 30% 30%, rgba(255, 255, 255, 0.8), transparent 1.5px);
  background-size: 210px 210px;
  opacity: 0.18;
  animation: dust-fall 22s linear infinite;
}

.particle-layer {
  position: absolute;
  inset: -25%;
  background-image: radial-gradient(1px 1px at 50% 50%, #fff, transparent);
  background-size: calc(350px * var(--star-scale));
  opacity: 0.18;
  z-index: 0;
  animation: pan-slow 60s linear infinite;
  mix-blend-mode: screen;
}

/**
 * 扫描光效 - 预留占位，暂不启用
 */
.scan-beam {
  display: none;
}

/**
 * =================================================================
 * 06. 核心内容卡片层 - abby-yog-card
 * =================================================================
 * 装载头像和对话框的主容器
 * 包含 card-breathe 呼吸灯动画效果
 * 使用固定像素高度 min-height: 400px 适配iframe
 */
.abby-yog-card {
  position: relative;
  width: 100%;
  height: 100%;
  padding: clamp(28px, 4vw, 42px) clamp(24px, 3.5vw, 36px);
  border-radius: 6px;
  overflow: hidden;
  z-index: 3;
  color: #f0f4f8;
  font-family: 'Noto Serif SC', 'Times New Roman', serif;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  animation: card-breathe 8s ease-in-out infinite;
  box-sizing: border-box;
}

.abby-yog-card * {
  box-sizing: border-box;
}

/**
 * =================================================================
 * 07. 银钥机关特效 - solar-key-system
 * =================================================================
 * 固定在右上角的机械装饰
 * 包含刻度盘和钥匙本体
 */

/**
 * 银钥系统外框
 * 固定在右上角，使用 clamp 实现响应式尺寸
 */
.solar-key-system {
  position: absolute;
  top: clamp(12px, 2vw, 24px);
  right: clamp(12px, 2vw, 24px);
  width: 70px;
  height: 70px;
  z-index: 20;
  pointer-events: none;
  transition: transform 0.3s ease;
}

/**
 * 中心锚点
 * 保证所有子元素以中间为基准旋转
 */
.zero-anchor {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
}

/**
 * 爆发时的波纹圆圈
 * 初始 width/height 为 0，悬停时展开
 */
.dimension-ripple {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-radius: 50%;
  border: 1px solid rgba(168, 192, 255, 0.6);
  opacity: 0;
  transition: all 0.5s ease;
}

.orbit-ring {
  position: absolute;
  border-radius: 50%;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/**
 * 外圈刻度盘 - ring-outer
 * 使用 repeating-conic-gradient 绘制扇形条纹
 * 使用 -webkit-mask/mask 挖空中心，只留边缘
 */
.ring-outer {
  width: 56px;
  height: 56px;
  top: -28px;
  left: -28px;
  border-radius: 50%;
  background: repeating-conic-gradient(from 0deg, var(--light-blue) 0deg 5deg, transparent 5deg 25deg);
  -webkit-mask: radial-gradient(transparent 58%, black 60%);
  mask: radial-gradient(transparent 58%, black 60%);
  opacity: 0.9;
  animation: ring-spin-rev 40s linear infinite;
}

/**
 * 内圈刻度盘 - ring-inner
 */
.ring-inner {
  width: 40px;
  height: 40px;
  top: -20px;
  left: -20px;
  border-radius: 50%;
  background: repeating-conic-gradient(from 0deg, var(--glow-blue) 0deg 3deg, transparent 3deg 13deg);
  -webkit-mask: radial-gradient(transparent 52%, black 54%);
  mask: radial-gradient(transparent 52%, black 54%);
  opacity: 0.65;
  animation: mech-spin 25s linear infinite;
}

/**
 * 钥匙本体组 - eldritch-key-group
 * 由柄、杆、齿三部分组成
 */
.eldritch-key-group {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  animation: mech-spin 20s linear infinite;
  z-index: 15;
  filter: drop-shadow(0 0 3px rgba(168, 192, 255, 0.5));
}

/**
 * 钥匙柄 - ek-handle
 * 旋转45度的小菱形
 */
.ek-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  top: -6px;
  left: -6px;
  transform: rotate(45deg);
  border: 2.5px double var(--mithril-white);
  box-shadow: 0 0 6px var(--glow-blue);
  background: rgba(0, 0, 0, 0.3);
}

.ek-handle::after {
  content: '';
  position: absolute;
  inset: 2px;
  border: 1px solid var(--light-blue);
  background: var(--glow-blue);
  opacity: 0.5;
}

/**
 * 钥匙杆 - ek-shaft
 * 线性渐变创造金属质感
 */
.ek-shaft {
  position: absolute;
  width: 16px;
  height: 2px;
  top: -1px;
  left: 6px;
  background: linear-gradient(to bottom, #8a9bb8, #fff 50%, #8a9bb8);
  transform-origin: left center;
  border-radius: 0 2px 2px 0;
}

/**
 * 钥匙齿 - ek-bit
 * 使用复杂的 mask 遮罩挖缺口
 */
.ek-bit {
  position: absolute;
  width: 5px;
  height: 8px;
  top: -4px;
  left: 22px;
  background: var(--mithril-white);
  -webkit-mask:
    conic-gradient(from 45deg at 2px 2px, transparent 270deg, black 0deg),
    linear-gradient(to bottom, black 40%, transparent 40%, transparent 60%, black 60%);
  mask:
    conic-gradient(from 45deg at 2px 2px, transparent 270deg, black 0deg),
    linear-gradient(to bottom, black 40%, transparent 40%, transparent 60%, black 60%);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  box-shadow: 2px 0 0 var(--mithril-white);
}

.ek-bit::before {
  content: '';
  position: absolute;
  top: 2px;
  left: -2px;
  width: 3px;
  height: 6px;
  border-right: 2px solid var(--mithril-white);
  border-top: 2px solid var(--mithril-white);
  border-bottom: 2px solid var(--mithril-white);
}

/**
 * =================================================================
 * 08. 对话与头像布局 - abby-dialog
 * =================================================================
 * 使用 CSS Grid 网格布局
 * 左边头像(auto)，右边对话内容(1fr)
 */
.abby-dialog {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: clamp(12px, 2vw, 24px);
  align-items: start;
  min-height: var(--portrait-h);
  padding-right: clamp(40px, 5vw, 60px);
  padding-left: 6px;
}

/**
 * 头像框 - portrait-wrap
 * 包含边框、角装饰、宝石、图片、遮罩
 */
.portrait-wrap {
  width: var(--portrait-w);
  height: var(--portrait-h);
  border-radius: 4px;
  overflow: visible;
  position: relative;
  background: #03070f;
  transform: rotate(-0.6deg);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  margin-top: 10px;
}

/**
 * 头像边框 - portrait-frame
 * 双层边框效果
 */
.portrait-frame {
  position: absolute;
  inset: -6px;
  border-radius: 6px;
  border: 1.5px solid var(--frame-color);
  box-shadow:
    0 0 10px var(--frame-glow),
    0 0 18px rgba(80, 116, 206, 0.15);
  pointer-events: none;
  z-index: 2;
}

.portrait-frame::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 8px;
  border: 1px solid rgba(168, 192, 255, 0.2);
  box-shadow: 0 0 8px rgba(80, 116, 206, 0.08);
}

/**
 * 头像边框四个角装饰
 */
.pf-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  pointer-events: none;
  z-index: 3;
}

.pf-corner::before,
.pf-corner::after {
  content: '';
  position: absolute;
  background: var(--frame-color);
  border-radius: 1px;
}

.pf-corner::before {
  width: 100%;
  height: 1.5px;
  top: 0;
  left: 0;
}

.pf-corner::after {
  width: 1.5px;
  height: 100%;
  top: 0;
  left: 0;
}

.pf-tl {
  top: -6px;
  left: -6px;
}
.pf-tr {
  top: -6px;
  right: -6px;
  transform: scaleX(-1);
}
.pf-bl {
  bottom: -6px;
  left: -6px;
  transform: scaleY(-1);
}
.pf-br {
  bottom: -6px;
  right: -6px;
  transform: scale(-1);
}

/**
 * 头像顶部小宝石
 */
.portrait-gem {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 9px;
  height: 9px;
  border-radius: 50%;
  z-index: 4;
  background: radial-gradient(circle at 35% 35%, #fff, var(--light-blue) 50%, var(--base-blue));
  box-shadow:
    0 0 8px var(--glow-blue),
    0 0 14px rgba(120, 156, 248, 0.3);
}

/**
 * 头像图片容器
 */
.portrait-inner {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  background-size: cover;
  background-position: center top;
  filter: contrast(1.08) saturate(1.05);
}

/**
 * 头像光影遮罩
 * 让图片底部融入背景
 */
.portrait-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 4px;
  background:
    linear-gradient(to bottom, transparent 58%, rgba(5, 10, 24, 0.78)),
    linear-gradient(135deg, rgba(200, 220, 255, 0.1), transparent 44%);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.45);
}

/**
 * 右侧对话主容器
 * min-width: 0 防止Grid布局中长单词撑破布局
 */
.dialog-main {
  min-width: 0;
  position: relative;
}

/**
 * =================================================================
 * 姓名面板 - name-plate
 * =================================================================
 * 使用负外边距使其"陷入"对话框
 * 创建连接的选项卡视觉效果
 */
.name-plate {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: min(100%, 460px);
  padding: 6px 16px;
  margin-bottom: -6px;
  margin-left: 8px;
  position: relative;
  z-index: 5;
  border-radius: 8px 8px 0 0;
  border: 1px solid var(--name-plate-border);
  border-bottom: none;
  background: linear-gradient(180deg, rgba(43, 72, 150, 0.4), rgba(12, 28, 66, 0.85)), var(--name-plate);
  box-shadow:
    0 -4px 10px rgba(126, 163, 255, 0.2),
    inset 0 1px 0 rgba(212, 227, 255, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/**
 * 名字图标 - 小圆点
 */
.name-icon {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex: none;
  background: radial-gradient(circle, #fff, #a8c3ff 60%, rgba(168, 195, 255, 0) 72%);
  box-shadow: 0 0 8px rgba(194, 215, 255, 0.8);
}

/**
 * 角色名称文本
 * 使用 Cinzel 字体，标题风格
 */
.abby-name-text {
  font-family: 'Cinzel', 'Noto Serif SC', serif;
  font-size: clamp(1.1em, 1em + 0.25vw, 1.4em);
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #f7fbff;
  text-shadow: 0 0 8px rgba(176, 203, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/**
 * =================================================================
 * 对话框 - dialog-box
 * =================================================================
 * 带有顶部/底部装饰线条
 * 多层阴影营造立体感
 */
.dialog-box {
  position: relative;
  border-radius: 8px;
  padding: clamp(18px, 2.5vw, 26px) clamp(20px, 3vw, 30px);
  border: 1px solid rgba(168, 192, 255, 0.2);
  border-top: 1.5px solid rgba(168, 192, 255, 0.5);
  background: linear-gradient(180deg, rgba(12, 18, 40, 0.8), rgba(6, 10, 24, 0.92)), rgba(8, 14, 30, 0.7);
  box-shadow:
    0 0 24px rgba(100, 140, 220, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(200, 220, 255, 0.08),
    inset 0 0 40px rgba(80, 116, 206, 0.05);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  overflow: hidden;
  animation:
    dialog-float 4s ease-in-out infinite,
    dialog-glow 3s ease-in-out infinite alternate;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease;
}

/**
 * 对话框顶部装饰线条
 * 渐变创造高光效果
 */
.dialog-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1.5px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(168, 192, 255, 0.6),
    rgba(255, 255, 255, 0.8),
    rgba(168, 192, 255, 0.6),
    transparent
  );
  z-index: 3;
}

/**
 * 对话框底部装饰线条
 */
.dialog-box::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 15%;
  right: 15%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(168, 192, 255, 0.15), rgba(168, 192, 255, 0.15), transparent);
  z-index: 3;
}

/**
 * 对话框内部点阵装饰
 */
.dialog-inner-deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background:
    radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(8, 14, 30, 0.4), transparent 10%, transparent 90%, rgba(8, 14, 30, 0.4));
  background-size:
    4px 4px,
    100% 100%;
}

/**
 * 对话框四个角小角标
 */
.dialog-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  pointer-events: none;
  z-index: 4;
  opacity: 0.5;
}

.dialog-corner::before,
.dialog-corner::after {
  content: '';
  position: absolute;
  background: var(--frame-color);
  border-radius: 1px;
}

.dialog-corner::before {
  width: 100%;
  height: 1px;
  top: 0;
  left: 0;
}

.dialog-corner::after {
  width: 1px;
  height: 100%;
  top: 0;
  left: 0;
}

.dc-tl {
  top: 4px;
  left: 4px;
}
.dc-tr {
  top: 4px;
  right: 4px;
  transform: scaleX(-1);
}
.dc-bl {
  bottom: 4px;
  left: 4px;
  transform: scaleY(-1);
}
.dc-br {
  bottom: 4px;
  right: 4px;
  transform: scale(-1);
}

/**
 * =================================================================
 * 对话内容文本 - abby-yog-content
 * =================================================================
 */
.abby-yog-content {
  position: relative;
  z-index: 2;
  color: #fdfdfd;
  font-size: clamp(1em, 0.95em + 0.22vw, 1.15em);
  line-height: 1.85;
  letter-spacing: 0.8px;
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 0 2px rgba(100, 140, 220, 0.3);
  word-break: break-word;
  font-family: 'Noto Serif SC', serif;
}

/**
 * =================================================================
 * 09. 交互悬停效果
 * =================================================================
 */

/**
 * 对话框悬停
 * 上浮并变亮
 */
.dialog-box:hover {
  box-shadow:
    0 0 30px rgba(100, 140, 220, 0.3),
    0 12px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(200, 220, 255, 0.15),
    inset 0 0 45px rgba(80, 116, 206, 0.08);
  transform: translateY(-2px);
  border-color: rgba(168, 192, 255, 0.45);
  background: linear-gradient(180deg, rgba(16, 24, 52, 0.85), rgba(6, 10, 24, 0.95)), rgba(8, 14, 30, 0.75);
}

/**
 * 名字牌悬停
 */
.name-plate:hover {
  box-shadow:
    0 -4px 14px rgba(126, 163, 255, 0.35),
    inset 0 1px 0 rgba(212, 227, 255, 0.35);
  transform: translateY(-1px);
}

/**
 * 头像悬停
 */
.portrait-wrap:hover {
  transform: rotate(0deg) scale(1.04);
  box-shadow:
    0 0 22px rgba(120, 156, 248, 0.5),
    0 10px 24px rgba(0, 0, 0, 0.55);
}

.portrait-wrap:hover .portrait-gem {
  box-shadow:
    0 0 10px var(--glow-blue),
    0 0 18px rgba(120, 156, 248, 0.4);
}

/**
 * 卡片悬停时星空效果
 * 增加背景亮度，加速星空运动
 */
.abby-yog-card:hover .scan-beam::after {
  animation-duration: 14s;
  background: linear-gradient(
    90deg,
    transparent 5%,
    rgba(168, 192, 255, 0.035),
    rgba(255, 255, 255, 0.09) 30%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(255, 255, 255, 0.09) 70%,
    rgba(168, 192, 255, 0.035),
    transparent 95%
  );
}

.abby-yog-card:hover .star-layer {
  filter: brightness(1.3);
}

.abby-yog-card:hover .stars-1 {
  opacity: 0.72;
  animation-duration: 140s;
}
.abby-yog-card:hover .stars-2 {
  opacity: 0.62;
  animation-duration: 110s;
}
.abby-yog-card:hover .stars-3 {
  opacity: 0.55;
  animation-duration: 85s;
}
.abby-yog-card:hover .stars-4 {
  opacity: 0.45;
  animation-duration: 150s;
}
.abby-yog-card:hover .stars-5 {
  opacity: 0.55;
  animation-duration: 45s;
}
.abby-yog-card:hover .stars-6 {
  opacity: 0.6;
  animation-duration: 100s;
}
.abby-yog-card:hover .stars-7 {
  opacity: 0.4;
  animation-duration: 55s;
}
.abby-yog-card:hover .stars-8 {
  opacity: 0.55;
  animation-duration: 120s;
}
.abby-yog-card:hover .galaxy-arm {
  opacity: 0.48;
  filter: brightness(1.1);
}

/**
 * 银钥悬停放大
 */
.abby-yog-card:hover .ring-outer {
  width: 76px !important;
  height: 76px !important;
  top: -38px !important;
  left: -38px !important;
  opacity: 1;
  filter: drop-shadow(0 0 5px var(--light-blue));
  animation-duration: 20s;
}

.abby-yog-card:hover .ring-inner {
  width: 54px !important;
  height: 54px !important;
  top: -27px !important;
  left: -27px !important;
  opacity: 0.9;
  filter: drop-shadow(0 0 3px var(--glow-blue));
  animation-duration: 12s;
}

.abby-yog-card:hover .eldritch-key-group {
  animation-duration: 8s;
  filter: drop-shadow(0 0 7px var(--light-blue)) brightness(1.2);
}

.abby-yog-card:hover .dimension-ripple {
  animation: ripple-burst 1.5s ease-out infinite;
}

.abby-yog-card:hover .dialog-box {
  box-shadow:
    0 0 16px rgba(80, 116, 206, 0.2),
    0 12px 26px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(200, 220, 255, 0.14),
    inset 0 0 24px rgba(80, 116, 206, 0.08);
}

/**
 * =================================================================
 * 10. 媒体查询 (响应式)
 * =================================================================
 */

@media (max-width: 1920px) {
  .abby-mount-hook {
    --star-scale: 1.2;
    --blur-strength: 80px;
  }
}

@media (max-width: 1440px) {
  .abby-mount-hook {
    --star-scale: 1;
    --blur-strength: 60px;
  }
}

@media (max-width: 1024px) {
  .abby-mount-hook {
    --star-scale: 0.8;
    --blur-strength: 40px;
  }

  .abby-yog-card {
    padding: 20px;
  }

  .abby-dialog {
    padding-right: 30px;
  }
}

@media (max-width: 768px) {
  .abby-mount-hook {
    --star-scale: 0.6;
    --blur-strength: 30px;
    padding: 6px;
  }

  .abby-yog-card {
    padding: 16px;
  }

  /* 变为上下堆叠布局 */
  .abby-dialog {
    grid-template-columns: 1fr;
    gap: 12px;
    min-height: auto;
    padding-right: 0;
  }

  /* 缩小银钥组件 */
  .solar-key-system {
    transform: scale(0.7);
    transform-origin: top right;
    top: 12px;
    right: 12px;
  }

  .portrait-wrap {
    width: 80px;
    height: 106px;
    transform: none;
    margin-top: 0;
  }

  .abby-name-text {
    letter-spacing: 1px;
    font-size: 1.05em;
  }

  .dialog-box {
    padding: 14px 16px;
    border-radius: 6px;
  }

  .abby-yog-content {
    font-size: 0.95em;
    line-height: 1.7;
  }

  .frame-corner {
    width: 16px;
    height: 16px;
  }

  .name-plate {
    margin-left: 4px;
    margin-bottom: -4px;
    padding: 4px 12px;
  }
}

@media (max-width: 480px) {
  .abby-mount-hook {
    --star-scale: 0.5;
    --blur-strength: 24px;
    --portrait-w: 68px;
    padding: 4px;
  }

  .abby-yog-card {
    border-radius: 4px;
    padding: 12px;
  }

  .solar-key-system {
    transform: scale(0.55);
    top: 8px;
    right: 8px;
  }

  .name-plate {
    padding: 4px 10px;
  }

  .frame-corner {
    width: 14px;
    height: 14px;
  }

  .dialog-corner {
    display: none;
  }

  .dialog-box {
    padding: 12px 14px;
  }
}

/**
 * =================================================================
 * 11. 动画序列定义 (@keyframes)
 * =================================================================
 * 所有动画效果在这里统一定义
 */

/**
 * 星空旋转动画 - 顺时针
 */
@keyframes star-cw {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/**
 * 星空旋转动画 - 逆时针
 */
@keyframes star-ccw {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

/**
 * 星空漂移动画
 */
@keyframes star-drift {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(18px, -12px) rotate(180deg);
  }
  100% {
    transform: translate(-12px, 10px) rotate(360deg);
  }
}

@keyframes star-drift-2 {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-14px, 16px) rotate(-180deg);
  }
  100% {
    transform: translate(10px, -8px) rotate(-360deg);
  }
}

/**
 * 星空斜线动画
 */
@keyframes star-diag {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-80px, -50px);
  }
}

/**
 * 星空轨道动画
 */
@keyframes star-orbit {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(20px, 10px) rotate(90deg);
  }
  50% {
    transform: translate(5px, 20px) rotate(180deg);
  }
  75% {
    transform: translate(-15px, 5px) rotate(270deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

/**
 * 尘埃飘落动画
 */
@keyframes dust-fall {
  from {
    transform: translate3d(0, -12px, 0);
  }
  to {
    transform: translate3d(0, 12px, 0);
  }
}

/**
 * 缓慢平移动画
 */
@keyframes pan-slow {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100px, -100px);
  }
}

/**
 * 星云漂移动画
 */
@keyframes nebula-drift {
  from {
    transform: translate3d(-18px, 4px, 0) scale(1.01);
  }
  to {
    transform: translate3d(14px, -6px, 0) scale(1.03);
  }
}

@keyframes nebula-drift-2 {
  from {
    transform: translate3d(12px, -8px, 0) scale(1.02);
  }
  to {
    transform: translate3d(-16px, 10px, 0) scale(0.98);
  }
}

/**
 * 扫描光效动画
 */
@keyframes smart-scan {
  0% {
    left: -100%;
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  85% {
    left: 200%;
    opacity: 1;
  }
  86% {
    opacity: 0;
  }
  100% {
    left: 200%;
    opacity: 0;
  }
}

/**
 * 脉冲圆环动画
 */
@keyframes pulse-ring {
  0% {
    transform: scale(0.35);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

/**
 * 对话框浮动动画
 */
@keyframes dialog-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-1.5px);
  }
}

/**
 * 对话框发光动画
 */
@keyframes dialog-glow {
  0%,
  100% {
    box-shadow:
      0 0 24px rgba(100, 140, 220, 0.15),
      0 8px 24px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(200, 220, 255, 0.08),
      inset 0 0 40px rgba(80, 116, 206, 0.05);
  }
  50% {
    box-shadow:
      0 0 32px rgba(100, 140, 220, 0.22),
      0 8px 28px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(200, 220, 255, 0.12),
      inset 0 0 50px rgba(80, 116, 206, 0.08);
  }
}

/**
 * 卡片呼吸动画
 */
@keyframes card-breathe {
  0%,
  100% {
    box-shadow:
      0 0 22px rgba(80, 116, 206, 0.28),
      0 10px 28px rgba(0, 0, 0, 0.52),
      inset 0 0 0 1px rgba(196, 216, 255, 0.14);
  }
  50% {
    box-shadow:
      0 0 26px rgba(104, 146, 238, 0.34),
      0 10px 30px rgba(0, 0, 0, 0.56),
      inset 0 0 0 1px rgba(196, 216, 255, 0.2);
  }
}

/**
 * 波纹爆发动画
 */
@keyframes ripple-burst {
  0% {
    width: 0;
    height: 0;
    border-width: 2px;
    opacity: 0.8;
  }
  100% {
    width: 100px;
    height: 100px;
    border-width: 0;
    opacity: 0;
  }
}

/**
 * 机械旋转动画 - 正转
 */
@keyframes mech-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/**
 * 机械旋转动画 - 反转
 */
@keyframes ring-spin-rev {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

/**
 * 极光流动动画
 */
@keyframes aurora-flow {
  0% {
    transform: translateX(0) scaleY(1);
  }
  50% {
    transform: translateX(-15%) scaleY(1.1);
  }
  100% {
    transform: translateX(-30%) scaleY(0.95);
  }
}

@keyframes aurora-flow-2 {
  0% {
    transform: translateX(-10%) scaleY(0.95);
  }
  50% {
    transform: translateX(5%) scaleY(1.08);
  }
  100% {
    transform: translateX(20%) scaleY(1);
  }
}

/**
 * 极光波纹动画
 */
@keyframes aurora-wave-move {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(40px);
  }
}

/**
 * 极光脉冲动画
 */
@keyframes aurora-pulse {
  0% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.35;
    transform: scale(1.15);
  }
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
}
</style>
