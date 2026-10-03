---
name: Battery Lab
description: 黑色透明工作台与实时电池进入场景
colors:
  page: "#090909"
  paper: "#151515"
  ink: "#f1f1f1"
  muted: "#ababab"
  line: "#363636"
  accent: "#e3e3e3"
  wash: "#222222"
  highlight: "#ddb184"
  data: "#aec5b5"
  entry-black: "#000000"
  entry-blue: "#277ef0"
  entry-rim: "#49bcff"
  entry-ink: "#f1f5fb"
  entry-muted: "#bed0e2"
typography:
  display:
    fontFamily: "'Lab Latin','Lab Sans','Microsoft YaHei','Segoe UI Symbol',sans-serif"
    fontSize: "clamp(54px,6.8vw,96px)"
    fontWeight: 550
    lineHeight: 1.14
    letterSpacing: "-.035em"
  headline:
    fontFamily: "'Lab Latin','Lab Sans','Microsoft YaHei','Segoe UI Symbol',sans-serif"
    fontSize: "32px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-.6px"
  title:
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "'Lab Latin','Lab Sans','Microsoft YaHei','Segoe UI Symbol',sans-serif"
    fontSize: "16px"
    lineHeight: 1.6
  label:
    fontSize: "14px"
    lineHeight: 1.5
rounded:
  flush: "0"
  control: "4px"
  entry-action: "7px"
  photo: "8px"
  glass: "16px"
spacing:
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "24": "24px"
  "32": "32px"
  "36": "36px"
components:
  button-primary:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  button-entry:
    rounded: "{rounded.entry-action}"
    padding: "14px 24px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  step-navigation:
    textColor: "{colors.muted}"
    rounded: "{rounded.flush}"
    padding: "16px 8px"
  structure-chip:
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  glass-container:
    rounded: "{rounded.glass}"
  material-row:
    textColor: "{colors.ink}"
    rounded: "{rounded.flush}"
    padding: "14px 12px"
---

# Design System: Battery Lab

## Overview

**Creative North Star: "黑色透明工作台"**

黑色透明工作台以清楚的中文阅读、材料本色和可直接操作的结构为中心。工作区域采用中性黑灰，控制轻薄，铜色只帮助定位；真实照片、三维模型和数据承担主要视觉内容。用户已明确拒绝机械卡片、密集小字和大块铜色按钮。

进入场景是这一系统的局部扩展：蓝色实时微型电池几何场提供沉浸感，工作台保留原有中性黑灰。大展示区用克制的水膜玻璃表现深度，列表和说明保持平整。已有本地字体、真实图片和来源标注继续作为视觉基础；本次首页没有新增栅格图像。

**Key Characteristics:**

- 中性黑灰工作台，铜色定位与低饱和绿数据。
- 本地 Noto Sans SC 与 IBM Plex Sans，中文与数字层级清楚。
- 平整照片列表、透明控制、少量大玻璃展示面。
- 桌面操作优先，手机保留内容和上下文。
- 首页蓝色局部使用，实时几何响应指针。

## Colors

前置 token 保留源码的实际颜色；工作台靠黑灰与明暗区分层次，首页单独使用冷蓝。

### Primary

- **铜色定位（highlight）**：当前步骤、材料层导航、键盘焦点和少量选中标记；按钮保持透明。
- **白灰操作（accent）**：普通链接、结构文字和操作状态。

### Secondary

- **低饱和数据绿（data）**：实测曲线、结果读数与平均电流密度数值。
- **电池蓝与边缘蓝（entry-blue / entry-rim）**：仅供进入场景的电池外壳与环形高光；实际渲染受光照和色调映射影响。

### Neutral

- **工作台黑、纸面灰和浅灰层（page / paper / wash）**：页面底色、输入与轻微悬停层。
- **正文白、辅助灰和分隔灰（ink / muted / line）**：阅读、说明和细分隔。
- **首页黑与冷白（entry-black / entry-ink / entry-muted）**：进入场景底色、巨标题和一句说明。

**The Scoped Blue Rule.** 首页蓝色只属于进入场景；工作台继续使用中性黑灰、铜色定位与低饱和绿数据。

## Typography

**Display Font / Body Font:** IBM Plex Sans（本地别名 Lab Latin）与 Noto Sans SC（本地别名 Lab Sans）；回退字体见前置 token。两款本地字体分别承担拉丁字符与中文，均使用可变字重。

### Hierarchy

- **Display**：首页巨标题使用 display token；手机改为 clamp(46px,12vw,64px)，行高（1.18）。
- **Headline**：工作台当前任务标题使用 headline token；手机字号（27px）。
- **Title**：常规面板标题使用 title token；材料详情标题另用中等字重（23px / 500）。
- **Body**：界面基准使用 body token；阅读段落行高（1.75），材料说明约（65ch），任务说明约（70ch）。
- **Label**：label token 用于辅助信息；主要控件通常为（15–17px），首页说明为（18px）。
- **Data**：结果大读数通常为（32px / 500），使用 tabular-nums；单位以（14px）辅文显示。

**The Reading First Rule.** 大标题明确任务，辅助信息留在说明层；不把密集小字作为主要阅读入口。

## Layout

工作台容器最大宽度（1520px），桌面两侧留白（32px），主要工作区间距（36px）。体系与选材步骤将内容和模型并排，选材模型在桌面可保持 sticky；结构和测量步骤使用较窄输入栏与较宽展示栏。照片选择是连续列表，说明和来源按需展开。

宽度（1100px）以下减少边距；（960px）以下工作区堆叠；（720px）以下使用手机边距（16px）、更大的触摸控件和原选材上下文返回入口。手机兼容不改变桌面工作台结构。

首页为满视口高的顶栏、内容与页脚网格。巨标题和单一进入操作在左侧，实时几何占据右侧；手机内容向上，电池场移向下方。此构图是 entry surface 的表达，细节保留在 .impeccable/surfaces/entry.md，不作为所有页面的通用模板。

## Elevation & Depth

常规阅读区以细线和色调分层；水膜玻璃集中在模型、试样、结果读数和对话框等少数大展示面。现有玻璃使用（18px）背景模糊、边缘内高光与柔和环境阴影；手机模糊降为（12px）。指针反光只轻微改变高光，不承载数据含义。减少透明度偏好使用实色，照片保持原色。

**The Large Surface Rule.** 玻璃深度留给大展示面；列表和主要阅读说明保持平整，不增加重复玻璃卡片。

## Shapes

控制使用轻微圆角，列表和导航以平直边缘与底线组织；大玻璃面使用 glass token。细透明边、透光和边缘反射形成水膜质感。电池场中的柱体、端盖、正极端子与高光环由实时几何组成；它们不是材料照片或实验结果。

## Components

### Buttons

主要工作台按钮为透明白灰渐变、细玻璃边与内高光；普通按钮用 paper 色面。默认最小高度（42px），手机主要操作通常（44px）以上。悬停增加边缘亮度，按下轻微加深，键盘焦点以铜色轮廓明确显示。首页进入按钮使用冷蓝透明边、entry-action 圆角和最小高度（58px）；悬停时内联 SVG 箭头向右移（3px）。

### Inputs / Fields

字段采用 paper 色底、细 line 边和 control 圆角，内距见 input-field token；常规最小高度（45px）。材料搜索只保留底线和上方圆角；焦点继承铜色轮廓。未输入值保持可辨认，错误信息沿用现有状态色。

### Navigation / Chips

四步导航使用平整底线，当前步骤以铜色文字和底线定位；数字表示探索位置。材料层导航沿用这一语法。结构部件采用透明细边的可选按钮与圆点标记，按展示栏实际宽度排成两列或三列；选中部件使用细铜色边和实心圆点，底色保持透明。按钮文字可换行，说明和上一层、下一层操作在网格下方。首尾操作停用；重新渲染后保留键盘焦点。当前标记只说明正在查看的位置。完整外形与展开结构使用双选切换，选中状态跟随实际展开量和外壳显示；能量路径作为独立动作。

### Containers / Material Rows

主要列表行以底分隔线连续排列，材料名称优先，照片不调色。选中行使用极淡铜色到白色渐变与明确的选中标记，保持材料与模型的联系。结果、模型和对话框沿用大玻璃面，不把每项数据再包进一张卡片。

### Live Battery Field

首页采用实例化柱形电池，桌面数量（1050）、手机数量（390）；蓝色外壳、金属端盖、端子和环形高光可辨认。指针附近局部排斥，弹簧阻尼使电池缓慢归位。暂停、减少动态效果和隐藏标签页停止自动更新；进入工作台释放渲染资源。WebGL 不可用时使用静态 Canvas 几何替代，入口仍可操作。

### Physical Structure Viewer

薄层器件按真实功能构造增加封装与连接细节，默认以斜俯视显示层面；取景根据可见部件和窗口比例留出边缘空间。视图保持可旋转和点选。结构细节与微表面为教学示意，层厚及重复层数不作为制造参数。参考软包的成形、叠层与热封结构：[MSE Supplies](https://www.msesupplies.com/blogs/news/formation-and-sealing-for-battery-case-of-pouch-cell)，以及 PEM 的膜电极、气体扩散层、流场和垫圈：[DOE](https://www.energy.gov/cmei/fuels/parts-fuel-cell)。

### Principle Lesson

能量路径使用一幅有实体层面、功能层和外部负载的原理剖面，取代四张等权重文字卡片。章节进度、当前反应说明与透明播放控制围绕这幅图组织；后续结构、物种路径与产物到对应讲解阶段才显现，已讲部分保留空间连续性。淡青绿表示内部传输，铜色表示外部电子路径；物种标签与箭头同时表达含义，颜色不独立承担信息。

各燃料电池使用各自的载流物种及方向；光伏、热电与 β 伏打使用对应转换机制。公式和来源只在需要时展开。播放节奏为教学顺序，不暗示真实传输速度或先后发生；提供暂停、上一段、下一段和重播，末段停止。讲解关闭恢复原来的模型配置与查看状态，中英文切换保留进度。隐藏页面停止动画；减少动态效果使用手动静态阶段。

### Arrival / Surface Switching

阅读区一次轻微上移显现（850ms），首页文字入场（950ms）；选材、搜索和拖动即时响应。减少动态效果关闭 CSS 入场与过渡。首页与工作台在同页切换，保留方案、测量草稿和相机；直接 #lab 可进入工作台。

## Do's and Don'ts

### Do:

- **Do** 保留中性黑灰工作台，用铜色说明位置，用低饱和绿呈现数据。
- **Do** 使用已有本地字体、清楚的正文层级和连续照片列表。
- **Do** 将透光、高光和轻微反光集中在少数大展示面。
- **Do** 保留桌面并排操作，并在手机上提供可触摸控制和上下文返回。
- **Do** 保留暂停、减少动态效果、减少透明度与键盘焦点路径。

### Don't:

- **Don't** 把首页蓝色推广到工作台。
- **Don't** 增加机械卡片、密集小字或整块铜色填充按钮。
- **Don't** 调色真实材料照片，或把粒子与概念模型当作实验记录。
- **Don't** 因切换语言、选材或返回首页反复播放整页动画或清空操作状态。

<!-- Source of truth: dist/styles.css, dist/entry.css, dist/battery-field.js, dist/entry-physics.js, dist/entry.js, dist/index.html, dist/app.js, dist/pathway-view.js and dist/pathway.css; documented after the finish review on 2026-10-03. -->

## Material imagery

- 选材缩略图保持完整比例并保留图片本色；列表只显示简短类别，当前材料名称承担对象标题。真实 SEM/TEM、原料或文献参考与生成形态插图须可区分。
- 图片详情提供适应窗口、原尺寸及完整图访问。原尺寸图片允许双向滚动，图片区域获得键盘焦点；关闭后恢复打开按钮。照片、论文图与历史结构资料分别按对象说明，不以参考图推断性能。
- 网页缩略图和预览图使用 WebP，原图保留用于阅读与追溯；预览加载失败时退回原图。浅灰图片衬底是阅读媒介，不改变工作台黑灰主题。
- 图注以 15–16px 清楚阅读，手机点击控件至少 44px。来源资产保留作者、许可和原页；生成资产保留完整提示词与用途边界，不分配真实照片的署名或许可。
- 本轮有限验收：桌面 1280×800 与手机 390×844；列表无缺图和横向溢出，英文长图注缩短，原尺寸按钮、焦点回归和太阳能参考器件加载通过。探测器未发现主级问题，旧设计侧表的建议性标记不扩展为本轮重设计。
