const pptxgen = require('pptxgenjs');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = '曹涵兮 徐子豪 陈鼎亚 刘昊 耿瑞林';
pres.title = '游戏中的碰撞检测算法 —— 从四叉树到GJK';

// ========== Color Palette (Academic/Tech) ==========
const C = {
  navy: '1B2A4A',      // 深蓝主色
  blue: '2E5090',      // 中蓝
  lightBlue: '4A90D9', // 亮蓝
  accent: 'E8913A',    // 橙色强调
  accent2: '3AAB8F',   // 绿色强调
  bg: 'F5F7FA',        // 浅灰背景
  white: 'FFFFFF',
  dark: '1A1A2E',      // 深色文字
  gray: '6B7280',      // 灰色
  lightGray: 'E5E7EB', // 浅灰
  codeBg: 'F0F4F8',    // 代码背景
  green: '16A34A',     // 绿色
  red: 'DC2626',       // 红色
};

// ========== Helper Functions ==========
function addFooter(slide, pageNum, total = 19) {
  slide.addText(`${pageNum} / ${total}`, {
    x: 8.8, y: 5.2, w: 1, h: 0.3,
    fontSize: 9, color: C.gray, align: 'right', fontFace: 'Calibri',
  });
}

function addTitleBar(slide, title, subtitle) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: C.navy },
  });
  slide.addText(title, {
    x: 0.5, y: 0.15, w: 8, h: 0.6,
    fontSize: 24, fontFace: 'Calibri', color: C.white, bold: true, margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 0.55, w: 8, h: 0.3,
      fontSize: 12, fontFace: 'Calibri', color: C.lightBlue, italic: true, margin: 0,
    });
  }
}

function addCard(slide, x, y, w, h, options = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: options.fill || C.white },
    shadow: { type: 'outer', color: '000000', blur: 4, offset: 1, angle: 135, opacity: 0.1 },
  });
  if (options.accent) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.06, h,
      fill: { color: options.accent },
    });
  }
}

function addLabel(slide, x, y, text, color = C.accent) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: text.length * 0.16 + 0.3, h: 0.3,
    fill: { color },
    rectRadius: 0.05,
  });
  slide.addText(text, {
    x, y, w: text.length * 0.16 + 0.3, h: 0.3,
    fontSize: 10, fontFace: 'Calibri', color: C.white, bold: true, align: 'center', valign: 'middle', margin: 0,
  });
}

// ========== SLIDE 1: 封面 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.navy };

  // 装饰线条
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 2.0, w: 10, h: 0.04,
    fill: { color: C.accent },
  });

  slide.addText('游戏中的碰撞检测算法', {
    x: 0.5, y: 1.0, w: 9, h: 0.8,
    fontSize: 36, fontFace: 'Calibri', color: C.white, bold: true, align: 'center', margin: 0,
  });
  slide.addText('从四叉树到 GJK', {
    x: 0.5, y: 1.7, w: 9, h: 0.5,
    fontSize: 28, fontFace: 'Calibri', color: C.lightBlue, align: 'center', margin: 0,
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 2.2, w: 10, h: 0.04,
    fill: { color: C.accent },
  });

  slide.addText('高级算法  课堂汇报', {
    x: 0.5, y: 2.5, w: 9, h: 0.5,
    fontSize: 18, fontFace: 'Calibri', color: C.gray, align: 'center', margin: 0,
  });

  slide.addText('汇报人：曹涵兮  徐子豪  陈鼎亚  刘昊  耿瑞林', {
    x: 0.5, y: 3.5, w: 9, h: 0.4,
    fontSize: 14, fontFace: 'Calibri', color: C.white, align: 'center', margin: 0,
  });

  slide.addText('2026年3月', {
    x: 0.5, y: 4.0, w: 9, h: 0.4,
    fontSize: 12, fontFace: 'Calibri', color: C.gray, align: 'center', margin: 0,
  });

  slide.addText('动画素材来源：https://github.com/MarcWebber/Collision-Algos-Demo', {
    x: 0.5, y: 4.8, w: 9, h: 0.3,
    fontSize: 8, fontFace: 'Calibri', color: C.gray, align: 'center', margin: 0,
  });
}

// ========== SLIDE 2: 引言 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, '引言：碰撞检测问题从何而来');
  addFooter(slide, 2);

  // 左侧问题卡片
  addCard(slide, 0.4, 1.2, 4.4, 3.8, { accent: C.red });
  slide.addText('穿模背后的算法问题', {
    x: 0.6, y: 1.3, w: 4, h: 0.4,
    fontSize: 16, fontFace: 'Calibri', color: C.dark, bold: true, margin: 0,
  });
  slide.addText([
    { text: '场景有 N 个对象', options: { breakLine: true, bullet: true } },
    { text: '暴力两两检测 → O(N²) 复杂度', options: { breakLine: true, bullet: true } },
    { text: 'N=10000 → 约5000万次比较/帧', options: { breakLine: true, bullet: true } },
    { text: '实时渲染中完全不可接受', options: { bullet: true } },
  ], {
    x: 0.6, y: 1.8, w: 4, h: 2.0,
    fontSize: 13, fontFace: 'Calibri', color: C.dark, paraSpaceAfter: 8, margin: 0,
  });

  // 右侧核心挑战
  addCard(slide, 5.2, 1.2, 4.4, 3.8, { accent: C.accent });
  slide.addText('核心挑战', {
    x: 5.4, y: 1.3, w: 4, h: 0.4,
    fontSize: 16, fontFace: 'Calibri', color: C.dark, bold: true, margin: 0,
  });
  slide.addText([
    { text: '不是两个物体能不能碰', options: { breakLine: true } },
    { text: '而是谁值得进入下一轮', options: { breakLine: true } },
  ], {
    x: 5.4, y: 1.8, w: 4, h: 1.0,
    fontSize: 14, fontFace: 'Calibri', color: C.blue, bold: true, margin: 0,
  });

  // 流程示意
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.6, y: 3.0, w: 3.8, h: 0.5,
    fill: { color: C.lightGray },
  });
  slide.addText('N个对象 → 粗筛 → 候选对 → 精算 → 碰撞对', {
    x: 5.6, y: 3.0, w: 3.8, h: 0.5,
    fontSize: 11, fontFace: 'Calibri', color: C.dark, align: 'center', valign: 'middle', margin: 0,
  });

  // 底部金句
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.1, w: 9.2, h: 0.04,
    fill: { color: C.accent },
  });
  slide.addText('游戏算法千千万，碰撞检测很难办', {
    x: 0.4, y: 5.15, w: 9.2, h: 0.35,
    fontSize: 14, fontFace: 'Calibri', color: C.accent, bold: true, italic: true, align: 'center', margin: 0,
  });
}

// ========== SLIDE 3: 形式化定义 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, '碰撞检测问题的形式化定义');
  addFooter(slide, 3);

  // 定义框
  addCard(slide, 0.4, 1.2, 9.2, 1.6, { accent: C.blue });
  slide.addText('输入', {
    x: 0.6, y: 1.3, w: 0.8, h: 0.3,
    fontSize: 12, fontFace: 'Calibri', color: C.white, bold: true,
    fill: { color: C.blue }, align: 'center', valign: 'middle', margin: 0,
  });
  slide.addText('场景中 N 个物体 {O₁, O₂, ..., Oₙ}，每个物体有几何形状和位置信息', {
    x: 1.5, y: 1.3, w: 7.9, h: 0.3,
    fontSize: 13, fontFace: 'Consolas', color: C.dark, margin: 0,
  });
  slide.addText('输出', {
    x: 0.6, y: 1.8, w: 0.8, h: 0.3,
    fontSize: 12, fontFace: 'Calibri', color: C.white, bold: true,
    fill: { color: C.accent }, align: 'center', valign: 'middle', margin: 0,
  });
  slide.addText('所有发生碰撞的物体对集合 {(Oᵢ, Oⱼ) | Oᵢ ∩ Oⱼ ≠ ∅}', {
    x: 1.5, y: 1.8, w: 7.9, h: 0.3,
    fontSize: 13, fontFace: 'Consolas', color: C.dark, margin: 0,
  });

  // 流程图
  const flowY = 3.2;
  // Broad Phase
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: flowY, w: 3.5, h: 1.2,
    fill: { color: C.white },
    shadow: { type: 'outer', color: '000000', blur: 3, offset: 1, angle: 135, opacity: 0.1 },
  });
  slide.addText('粗筛阶段\nBroad Phase', {
    x: 0.8, y: flowY, w: 3.5, h: 0.5,
    fontSize: 14, fontFace: 'Calibri', color: C.navy, bold: true, align: 'center', valign: 'middle', margin: 0,
  });
  slide.addText('四叉树 / SAP', {
    x: 0.8, y: flowY + 0.5, w: 3.5, h: 0.4,
    fontSize: 12, fontFace: 'Calibri', color: C.gray, align: 'center', valign: 'middle', margin: 0,
  });
  slide.addText('N个物体 → 候选对', {
    x: 0.8, y: flowY + 0.85, w: 3.5, h: 0.3,
    fontSize: 10, fontFace: 'Calibri', color: C.accent, align: 'center', valign: 'middle', margin: 0,
  });

  // Arrow
  slide.addShape(pres.shapes.LINE, {
    x: 4.4, y: flowY + 0.6, w: 1.2, h: 0,
    line: { color: C.accent, width: 2 },
  });
  slide.addText('候选对', {
    x: 4.4, y: flowY + 0.3, w: 1.2, h: 0.3,
    fontSize: 9, fontFace: 'Calibri', color: C.accent, align: 'center', margin: 0,
  });

  // Narrow Phase
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.7, y: flowY, w: 3.5, h: 1.2,
    fill: { color: C.white },
    shadow: { type: 'outer', color: '000000', blur: 3, offset: 1, angle: 135, opacity: 0.1 },
  });
  slide.addText('精算阶段\nNarrow Phase', {
    x: 5.7, y: flowY, w: 3.5, h: 0.5,
    fontSize: 14, fontFace: 'Calibri', color: C.navy, bold: true, align: 'center', valign: 'middle', margin: 0,
  });
  slide.addText('GJK / SAT', {
    x: 5.7, y: flowY + 0.5, w: 3.5, h: 0.4,
    fontSize: 12, fontFace: 'Calibri', color: C.gray, align: 'center', valign: 'middle', margin: 0,
  });
  slide.addText('候选对 → 碰撞对', {
    x: 5.7, y: flowY + 0.85, w: 3.5, h: 0.3,
    fontSize: 10, fontFace: 'Calibri', color: C.accent, align: 'center', valign: 'middle', margin: 0,
  });

  // 底部金句
  slide.addText('粗筛缩范围，精算给结论', {
    x: 0.4, y: 5.15, w: 9.2, h: 0.35,
    fontSize: 14, fontFace: 'Calibri', color: C.accent, bold: true, italic: true, align: 'center', margin: 0,
  });
}

// ========== SLIDE 4: 四叉树设计思想 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, '四叉树（Quadtree）', '分治空间，化整为零');
  addFooter(slide, 4);

  addLabel(slide, 0.5, 1.1, '分治法', C.accent2);

  // 左侧图解
  addCard(slide, 0.4, 1.6, 4.2, 3.6, { accent: C.blue });
  slide.addText('空间分裂示意', {
    x: 0.6, y: 1.7, w: 3.8, h: 0.35,
    fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });

  // 四叉树示意图
  // 第一层
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 1.0, y: 2.2, w: 3.0, h: 2.4,
    line: { color: C.blue, width: 1.5 },
  });
  // 十字分割
  slide.addShape(pres.shapes.LINE, {
    x: 1.0, y: 3.4, w: 3.0, h: 0,
    line: { color: C.blue, width: 1 },
  });
  slide.addShape(pres.shapes.LINE, {
    x: 2.5, y: 2.2, w: 0, h: 2.4,
    line: { color: C.blue, width: 1 },
  });

  // 标注
  slide.addText('Step 1: 整个2D地图', {
    x: 1.1, y: 2.25, w: 1.3, h: 0.25,
    fontSize: 8, fontFace: 'Calibri', color: C.dark, margin: 0,
  });
  slide.addText('Step 2: 超阈值 → 分裂', {
    x: 2.6, y: 2.25, w: 1.3, h: 0.25,
    fontSize: 8, fontFace: 'Calibri', color: C.dark, margin: 0,
  });
  slide.addText('Step 3: 递归分裂', {
    x: 1.1, y: 3.45, w: 1.3, h: 0.25,
    fontSize: 8, fontFace: 'Calibri', color: C.dark, margin: 0,
  });

  // 右侧核心思想
  addCard(slide, 5.0, 1.6, 4.6, 3.6, { accent: C.accent });
  slide.addText('核心思想', {
    x: 5.2, y: 1.7, w: 4.2, h: 0.35,
    fontSize: 14, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });
  slide.addText([
    { text: '', options: { breakLine: true, bold: true, color: C.blue } },
    { text: '', options: { breakLine: true } },
    { text: '类似把地图分区，每个区域配一个管理员', options: { breakLine: true, bullet: true } },
    { text: '对象少的区域不浪费计算', options: { breakLine: true, bullet: true } },
    { text: '对象密的区域自动细分', options: { bullet: true } },
  ], {
    x: 5.2, y: 2.2, w: 4.2, h: 2.5,
    fontSize: 13, fontFace: 'Calibri', color: C.dark, paraSpaceAfter: 6, margin: 0,
  });

  // 底部表格
  const tableData = [
    [
      { text: '核心动作', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
      { text: '设计策略', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
      { text: '适用场景', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
      { text: '不适用场景', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
    ],
    [
      { text: '递归分裂空间', options: { fontSize: 10 } },
      { text: '分治', options: { fontSize: 10 } },
      { text: '2D偏静态、分布稀疏', options: { fontSize: 10 } },
      { text: '高动态、对象密集', options: { fontSize: 10 } },
    ],
  ];
  slide.addTable(tableData, {
    x: 0.4, y: 5.0, w: 9.2, h: 0.5,
    border: { pt: 0.5, color: C.lightGray },
    colW: [2.0, 1.5, 3.0, 2.7],
  });
}

// ========== SLIDE 5: 四叉树伪代码与复杂度 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, '四叉树 —— 算法流程与复杂度');
  addFooter(slide, 5);

  // 左侧伪代码
  addCard(slide, 0.4, 1.2, 5.0, 4.2, { accent: C.blue });
  slide.addText('伪代码', {
    x: 0.6, y: 1.3, w: 4.6, h: 0.3,
    fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });

  const codeText = [
    { text: '// 插入操作', options: { breakLine: true, color: C.gray, fontSize: 10 } },
    { text: 'func Insert(node, obj):', options: { breakLine: true, fontSize: 10, bold: true } },
    { text: '  if node.count < MAX_CAPACITY:', options: { breakLine: true, fontSize: 10 } },
    { text: '    node.objects.add(obj); return', options: { breakLine: true, fontSize: 10 } },
    { text: '  if not node.isDivided:', options: { breakLine: true, fontSize: 10 } },
    { text: '    node.Subdivide()  // 分裂为4个子节点', options: { breakLine: true, fontSize: 10 } },
    { text: '  for child in node.children:', options: { breakLine: true, fontSize: 10 } },
    { text: '    if child.boundary.contains(obj):', options: { breakLine: true, fontSize: 10 } },
    { text: '      Insert(child, obj); return', options: { breakLine: true, fontSize: 10 } },
    { text: '', options: { breakLine: true, fontSize: 8 } },
    { text: '// 范围查询操作', options: { breakLine: true, color: C.gray, fontSize: 10 } },
    { text: 'func Query(node, range, results):', options: { breakLine: true, fontSize: 10, bold: true } },
    { text: '  if not node.intersects(range):', options: { breakLine: true, fontSize: 10 } },
    { text: '    return  // 剪枝', options: { breakLine: true, fontSize: 10 } },
    { text: '  for obj in node.objects:', options: { breakLine: true, fontSize: 10 } },
    { text: '    if range.contains(obj): results.add(obj)', options: { breakLine: true, fontSize: 10 } },
    { text: '  if node.isDivided:', options: { breakLine: true, fontSize: 10 } },
    { text: '    for child in node.children:', options: { breakLine: true, fontSize: 10 } },
    { text: '      Query(child, range, results)', options: { fontSize: 10 } },
  ];
  slide.addText(codeText, {
    x: 0.6, y: 1.7, w: 4.6, h: 3.5,
    fontFace: 'Consolas', color: C.dark, margin: 0,
  });

  // 右侧复杂度
  addCard(slide, 5.6, 1.2, 4.0, 4.2, { accent: C.accent });
  slide.addText('复杂度分析', {
    x: 5.8, y: 1.3, w: 3.6, h: 0.3,
    fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });

  const complexityData = [
    [
      { text: '操作', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
      { text: '最好', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
      { text: '平均', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
      { text: '最坏', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
    ],
    [
      { text: '构建', options: { fontSize: 10 } },
      { text: 'O(n log n)', options: { fontSize: 10 } },
      { text: 'O(n log n)', options: { fontSize: 10 } },
      { text: 'O(n²)', options: { fontSize: 10, color: C.red } },
    ],
    [
      { text: '单次查询', options: { fontSize: 10 } },
      { text: 'O(log n)', options: { fontSize: 10 } },
      { text: 'O(log n)', options: { fontSize: 10 } },
      { text: 'O(n)', options: { fontSize: 10, color: C.red } },
    ],
    [
      { text: '全场景检测', options: { fontSize: 10 } },
      { text: 'O(n log n)', options: { fontSize: 10 } },
      { text: 'O(n log n)', options: { fontSize: 10 } },
      { text: 'O(n²)', options: { fontSize: 10, color: C.red } },
    ],
  ];
  slide.addTable(complexityData, {
    x: 5.8, y: 1.7, w: 3.6, h: 1.5,
    border: { pt: 0.5, color: C.lightGray },
    colW: [1.0, 0.85, 0.85, 0.9],
  });

  slide.addText([
    { text: '最坏情况说明：', options: { breakLine: true, bold: true, fontSize: 11, color: C.red } },
    { text: '所有对象重叠在同一区域', options: { breakLine: true, fontSize: 11 } },
    { text: '→ 树退化为链表 → O(n²)', options: { breakLine: true, fontSize: 11 } },
    { text: '', options: { breakLine: true, fontSize: 6 } },
    { text: '关键依赖：', options: { breakLine: true, bold: true, fontSize: 11, color: C.blue } },
    { text: '对象分布是否均匀', options: { breakLine: true, fontSize: 11 } },
    { text: '阈值 MAX_CAPACITY 的选取', options: { fontSize: 11 } },
  ], {
    x: 5.8, y: 3.4, w: 3.6, h: 1.8,
    fontFace: 'Calibri', color: C.dark, margin: 0,
  });
}

// ========== SLIDE 6: 四叉树正确性与取舍 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, '四叉树 —— 正确性与优劣取舍');
  addFooter(slide, 6);

  // 左侧正确性
  addCard(slide, 0.4, 1.2, 4.6, 3.6, { accent: C.accent2 });
  slide.addText('正确性说明', {
    x: 0.6, y: 1.3, w: 4.2, h: 0.35,
    fontSize: 14, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });
  slide.addText([
    { text: '不变量', options: { breakLine: true, bold: true, color: C.blue } },
    { text: '每个对象一定存储在某个叶节点（或未分裂节点）中', options: { breakLine: true } },
    { text: '', options: { breakLine: true, fontSize: 6 } },
    { text: '空间完备性', options: { breakLine: true, bold: true, color: C.blue } },
    { text: '四个子节点的区域之和 = 父节点区域，无遗漏', options: { breakLine: true } },
    { text: '', options: { breakLine: true, fontSize: 6 } },
    { text: '查询正确性', options: { breakLine: true, bold: true, color: C.blue } },
    { text: '对象在查询范围内 → 所在叶节点一定与查询范围相交 → 一定会被找到', options: {} },
  ], {
    x: 0.6, y: 1.8, w: 4.2, h: 2.8,
    fontSize: 12, fontFace: 'Calibri', color: C.dark, paraSpaceAfter: 4, margin: 0,
  });

  // 右侧优劣对比
  addCard(slide, 5.2, 1.2, 4.4, 3.6, { accent: C.accent });
  slide.addText('优劣对比', {
    x: 5.4, y: 1.3, w: 4, h: 0.35,
    fontSize: 14, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });

  const proConData = [
    [
      { text: '✓ 优势', options: { fill: { color: 'DCFCE7' }, color: C.green, bold: true, fontSize: 10 } },
      { text: '✗ 劣势', options: { fill: { color: 'FEE2E2' }, color: C.red, bold: true, fontSize: 10 } },
    ],
    [
      { text: '结构直观，适合二维空间查询', options: { fontSize: 10 } },
      { text: '对象频繁移动时，树需反复维护', options: { fontSize: 10 } },
    ],
    [
      { text: '稀疏场景下显著减少比较次数', options: { fontSize: 10 } },
      { text: '极端分布下树深膨胀', options: { fontSize: 10 } },
    ],
    [
      { text: '实现简单，易于理解', options: { fontSize: 10 } },
      { text: '仅适用于2D（3D需八叉树）', options: { fontSize: 10 } },
    ],
  ];
  slide.addTable(proConData, {
    x: 5.4, y: 1.8, w: 4, h: 1.8,
    border: { pt: 0.5, color: C.lightGray },
    colW: [2.0, 2.0],
  });

  // 底部总结
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.0, w: 9.2, h: 0.5,
    fill: { color: C.navy },
  });
  slide.addText('静态地图、动态对象少 → 四叉树是好选择；高动态场景 → 需要其他方案', {
    x: 0.6, y: 5.0, w: 8.8, h: 0.5,
    fontSize: 13, fontFace: 'Calibri', color: C.white, bold: true, align: 'center', valign: 'middle', margin: 0,
  });
}

// ========== SLIDE 7: SAP设计思想 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, 'Sweep and Prune（SAP）', '降维打击，排序复用');
  addFooter(slide, 7);

  addLabel(slide, 0.5, 1.1, '降维 + 时间局部性', C.accent);

  // 流程图
  addCard(slide, 0.4, 1.6, 5.6, 2.0, { accent: C.blue });
  slide.addText('核心思想图解', {
    x: 0.6, y: 1.7, w: 5.2, h: 0.3,
    fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });

  // 三步流程
  const steps = [
    { x: 0.6, label: 'Step 1', desc: '取AABB\n投影到X轴' },
    { x: 2.4, label: 'Step 2', desc: '按左端点\n排序' },
    { x: 4.2, label: 'Step 3', desc: '从左扫描\n重叠=候选对' },
  ];
  steps.forEach((s, i) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: s.x, y: 2.1, w: 1.5, h: 1.2,
      fill: { color: C.white },
      line: { color: C.blue, width: 1 },
    });
    slide.addText(s.label, {
      x: s.x, y: 2.15, w: 1.5, h: 0.25,
      fontSize: 9, fontFace: 'Calibri', color: C.white, bold: true,
      fill: { color: C.blue }, align: 'center', margin: 0,
    });
    slide.addText(s.desc, {
      x: s.x, y: 2.4, w: 1.5, h: 0.8,
      fontSize: 11, fontFace: 'Calibri', color: C.dark, align: 'center', valign: 'middle', margin: 0,
    });
    if (i < 2) {
      slide.addText('→', {
        x: s.x + 1.5, y: 2.4, w: 0.9, h: 0.8,
        fontSize: 20, fontFace: 'Calibri', color: C.accent, align: 'center', valign: 'middle', margin: 0,
      });
    }
  });

  // 关键洞察
  addCard(slide, 6.2, 1.6, 3.4, 2.0, { accent: C.accent });
  slide.addText('关键洞察', {
    x: 6.4, y: 1.7, w: 3, h: 0.3,
    fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });
  slide.addText([
    { text: '帧间位置变化很小', options: { breakLine: true, bold: true, color: C.blue } },
    { text: '→ 排序顺序几乎不变', options: { breakLine: true } },
    { text: '→ 插入排序接近O(n)', options: { breakLine: true } },
    { text: '', options: { breakLine: true, fontSize: 6 } },
    { text: '这就是时间局部性', options: { bold: true, color: C.accent } },
  ], {
    x: 6.4, y: 2.1, w: 3, h: 1.3,
    fontSize: 11, fontFace: 'Calibri', color: C.dark, margin: 0,
  });

  // 不等式传递性
  addCard(slide, 0.4, 3.8, 9.2, 1.6, { accent: C.accent2 });
  slide.addText('核心优化原理 —— 不等式传递性', {
    x: 0.6, y: 3.9, w: 8.8, h: 0.35,
    fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });
  slide.addText([
    { text: '若已知 A.right ≤ B.left  且  B.right ≤ C.left', options: { breakLine: true, fontFace: 'Consolas', fontSize: 12 } },
    { text: '→ 由传递性：A.right ≤ C.left', options: { breakLine: true, fontFace: 'Consolas', fontSize: 12 } },
    { text: '→ 无需检测 A 与 C，直接跳过！', options: { breakLine: true, bold: true, color: C.accent, fontSize: 12 } },
  ], {
    x: 0.6, y: 4.3, w: 8.8, h: 1.0,
    fontFace: 'Calibri', color: C.dark, margin: 0,
  });
}

// ========== SLIDE 8: SAP伪代码与复杂度 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, 'SAP —— 算法流程与复杂度');
  addFooter(slide, 8);

  // 左侧伪代码
  addCard(slide, 0.4, 1.2, 5.0, 4.2, { accent: C.blue });
  slide.addText('伪代码', {
    x: 0.6, y: 1.3, w: 4.6, h: 0.3,
    fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });

  const sapCode = [
    { text: 'func SweepAndPrune(objects):', options: { breakLine: true, fontSize: 10, bold: true } },
    { text: '  // 1. 沿X轴按AABB最小X坐标排序', options: { breakLine: true, fontSize: 10, color: C.gray } },
    { text: '  Sort(objects, key=aabb.minX)', options: { breakLine: true, fontSize: 10 } },
    { text: '  // 首次：快排；后续帧：插入排序', options: { breakLine: true, fontSize: 10, color: C.gray } },
    { text: '', options: { breakLine: true, fontSize: 6 } },
    { text: '  candidates = []', options: { breakLine: true, fontSize: 10 } },
    { text: '  // 2. 从左到右扫描', options: { breakLine: true, fontSize: 10, color: C.gray } },
    { text: '  for i = 0 to n-1:', options: { breakLine: true, fontSize: 10 } },
    { text: '    for j = i+1 to n-1:', options: { breakLine: true, fontSize: 10 } },
    { text: '      // 3. 剪枝：后续对象minX>', options: { breakLine: true, fontSize: 10, color: C.gray } },
    { text: '      //    当前maxX → 后面都不重叠', options: { breakLine: true, fontSize: 10, color: C.gray } },
    { text: '      if objects[j].minX >', options: { breakLine: true, fontSize: 10 } },
    { text: '         objects[i].maxX:', options: { breakLine: true, fontSize: 10 } },
    { text: '        break', options: { breakLine: true, fontSize: 10, bold: true, color: C.accent } },
    { text: '      // 4. X轴重叠 → 检查Y轴', options: { breakLine: true, fontSize: 10, color: C.gray } },
    { text: '      if AABBOverlap(...):', options: { breakLine: true, fontSize: 10 } },
    { text: '        candidates.add(...)', options: { fontSize: 10 } },
  ];
  slide.addText(sapCode, {
    x: 0.6, y: 1.7, w: 4.6, h: 3.5,
    fontFace: 'Consolas', color: C.dark, margin: 0,
  });

  // 右侧复杂度
  addCard(slide, 5.6, 1.2, 4.0, 4.2, { accent: C.accent });
  slide.addText('复杂度分析', {
    x: 5.8, y: 1.3, w: 3.6, h: 0.3,
    fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });

  const sapComplexity = [
    [
      { text: '操作', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 9 } },
      { text: '最好', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 9 } },
      { text: '平均', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 9 } },
      { text: '最坏', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 9 } },
    ],
    [
      { text: '首次排序', options: { fontSize: 9 } },
      { text: 'O(n log n)', options: { fontSize: 9 } },
      { text: 'O(n log n)', options: { fontSize: 9 } },
      { text: 'O(n log n)', options: { fontSize: 9 } },
    ],
    [
      { text: '后续帧排序', options: { fontSize: 9 } },
      { text: 'O(n)', options: { fontSize: 9, bold: true, color: C.green } },
      { text: 'O(n)', options: { fontSize: 9 } },
      { text: 'O(n log n)', options: { fontSize: 9 } },
    ],
    [
      { text: '扫描候选对', options: { fontSize: 9 } },
      { text: 'O(n)', options: { fontSize: 9 } },
      { text: 'O(n+m)', options: { fontSize: 9 } },
      { text: 'O(n²)', options: { fontSize: 9, color: C.red } },
    ],
    [
      { text: '全场景(后续)', options: { fontSize: 9 } },
      { text: 'O(n)', options: { fontSize: 9, bold: true, color: C.green } },
      { text: 'O(n+m)', options: { fontSize: 9 } },
      { text: 'O(n²)', options: { fontSize: 9, color: C.red } },
    ],
  ];
  slide.addTable(sapComplexity, {
    x: 5.8, y: 1.7, w: 3.6, h: 1.8,
    border: { pt: 0.5, color: C.lightGray },
    colW: [1.1, 0.8, 0.85, 0.85],
  });

  slide.addText([
    { text: '注：m = 重叠区间对数', options: { breakLine: true, fontSize: 10, color: C.gray } },
    { text: '复杂度与输出规模挂钩', options: { breakLine: true, fontSize: 11, bold: true, color: C.blue } },
    { text: '(output-sensitive)', options: { breakLine: true, fontSize: 10, color: C.blue } },
    { text: '碰撞对越少越快', options: { fontSize: 11, bold: true, color: C.accent } },
  ], {
    x: 5.8, y: 3.6, w: 3.6, h: 1.5,
    fontFace: 'Calibri', color: C.dark, margin: 0,
  });
}

// ========== SLIDE 9: SAP正确性与适用讨论 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, 'SAP —— 正确性分析与适用边界');
  addFooter(slide, 9);

  // 左侧正确性
  addCard(slide, 0.4, 1.2, 4.6, 2.4, { accent: C.accent2 });
  slide.addText('正确性说明', {
    x: 0.6, y: 1.3, w: 4.2, h: 0.35,
    fontSize: 14, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });
  slide.addText([
    { text: '投影保交（分离轴定理）', options: { breakLine: true, bold: true, color: C.blue, fontSize: 12 } },
    { text: '若A和B空间相交 → 任意轴投影必有重叠', options: { breakLine: true, fontSize: 11 } },
    { text: '', options: { breakLine: true, fontSize: 4 } },
    { text: '逆否命题', options: { breakLine: true, bold: true, color: C.accent, fontSize: 12 } },
    { text: '某轴上投影不重叠 → 一定不相交 → 可安全排除', options: { breakLine: true, fontSize: 11 } },
    { text: '', options: { breakLine: true, fontSize: 4 } },
    { text: '排序剪枝的正确性', options: { breakLine: true, bold: true, color: C.blue, fontSize: 12 } },
    { text: '基于不等式传递性，已排序列表上可安全跳过', options: { fontSize: 11 } },
  ], {
    x: 0.6, y: 1.7, w: 4.2, h: 1.7,
    fontFace: 'Calibri', color: C.dark, margin: 0,
  });

  // 右侧适用讨论
  addCard(slide, 5.2, 1.2, 4.4, 2.4, { accent: C.accent });
  slide.addText('适用边界', {
    x: 5.4, y: 1.3, w: 4, h: 0.35,
    fontSize: 14, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });

  const sapFitData = [
    [
      { text: '✓ 适合SAP', options: { fill: { color: 'DCFCE7' }, color: C.green, bold: true, fontSize: 10 } },
      { text: '✗ 不适合SAP', options: { fill: { color: 'FEE2E2' }, color: C.red, bold: true, fontSize: 10 } },
    ],
    [
      { text: '对象数量大但碰撞对少', options: { fontSize: 10 } },
      { text: '对象密集且大量重叠', options: { fontSize: 10 } },
    ],
    [
      { text: '帧间运动幅度小', options: { fontSize: 10 } },
      { text: '对象瞬间大幅位移', options: { fontSize: 10 } },
    ],
    [
      { text: '对象尺寸相近', options: { fontSize: 10 } },
      { text: '对象尺寸差异极大', options: { fontSize: 10 } },
    ],
  ];
  slide.addTable(sapFitData, {
    x: 5.4, y: 1.8, w: 4, h: 1.5,
    border: { pt: 0.5, color: C.lightGray },
    colW: [2.0, 2.0],
  });

  // 底部总结
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.8, w: 9.2, h: 0.5,
    fill: { color: C.navy },
  });
  slide.addText('SAP的威力在于变化少；变化越大，越接近暴力法', {
    x: 0.6, y: 3.8, w: 8.8, h: 0.5,
    fontSize: 14, fontFace: 'Calibri', color: C.white, bold: true, align: 'center', valign: 'middle', margin: 0,
  });

  // 历史来源
  addCard(slide, 0.4, 4.5, 9.2, 0.9, { accent: C.gray });
  slide.addText([
    { text: '历史来源：', options: { bold: true, fontSize: 11 } },
    { text: 'Baraff (1992) 博士论文首次提出；Cohen et al. (1995) I-COLLIDE 系统化', options: { fontSize: 11 } },
  ], {
    x: 0.6, y: 4.6, w: 8.8, h: 0.6,
    fontFace: 'Calibri', color: C.dark, margin: 0,
  });
}

// ========== SLIDE 10: GJK设计思想 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, 'GJK算法 —— 两体相交，以差判之，决于原点');
  addFooter(slide, 10);

  addLabel(slide, 0.5, 1.1, '迭代逼近法', C.accent2);

  // Minkowski差定义
  addCard(slide, 0.4, 1.6, 9.2, 1.2, { accent: C.blue });
  slide.addText('Minkowski差定义', {
    x: 0.6, y: 1.7, w: 3, h: 0.3,
    fontSize: 12, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });
  slide.addText('A ⊖ B = { a - b | a ∈ A, b ∈ B }', {
    x: 0.6, y: 2.1, w: 8.8, h: 0.5,
    fontSize: 22, fontFace: 'Consolas', color: C.blue, bold: true, align: 'center', valign: 'middle', margin: 0,
  });

  // 关键等价关系
  addCard(slide, 0.4, 3.0, 9.2, 2.2, { accent: C.accent });
  slide.addText('关键等价关系', {
    x: 0.6, y: 3.1, w: 3, h: 0.3,
    fontSize: 12, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });

  // 三步推导
  const derivSteps = [
    { x: 0.6, text: 'A ∩ B ≠ ∅\n⟺ 存在公共点 p ∈ A 且 p ∈ B', color: C.blue },
    { x: 3.5, text: '⟺ p - p = 0 ∈ A ⊖ B', color: C.accent },
    { x: 6.4, text: '⟺ 原点 ∈ A ⊖ B', color: C.green },
  ];
  derivSteps.forEach((s) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: s.x, y: 3.5, w: 2.7, h: 1.0,
      fill: { color: C.white },
      line: { color: s.color, width: 1.5 },
    });
    slide.addText(s.text, {
      x: s.x, y: 3.5, w: 2.7, h: 1.0,
      fontSize: 11, fontFace: 'Consolas', color: C.dark, align: 'center', valign: 'middle', margin: 0,
    });
  });

  // 底部结论
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.1, w: 9.2, h: 0.4,
    fill: { color: C.navy },
  });
  slide.addText('核心转化：把两个物体是否相交转化为一个形状是否包含原点', {
    x: 0.6, y: 5.1, w: 8.8, h: 0.4,
    fontSize: 12, fontFace: 'Calibri', color: C.white, bold: true, align: 'center', valign: 'middle', margin: 0,
  });
}

// ========== SLIDE 11: GJK算法流程与伪代码 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, 'GJK —— 取支、立形、决原');
  addFooter(slide, 11);

  // 左侧核心概念
  addCard(slide, 0.4, 1.2, 4.6, 2.0, { accent: C.blue });
  slide.addText('核心概念', {
    x: 0.6, y: 1.3, w: 4.2, h: 0.3,
    fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });
  slide.addText([
    { text: '支持点（Support Point）', options: { breakLine: true, bold: true, color: C.blue, fontSize: 12 } },
    { text: '沿给定方向在Minkowski差上最远的点', options: { breakLine: true, fontSize: 11 } },
    { text: 'Support(A,B,d) = A沿d最远 - B沿-d最远', options: { breakLine: true, fontSize: 10, fontFace: 'Consolas' } },
    { text: '', options: { breakLine: true, fontSize: 4 } },
    { text: '单纯形（Simplex）', options: { breakLine: true, bold: true, color: C.blue, fontSize: 12 } },
    { text: '线段(1D) → 三角形(2D) → 四面体(3D)', options: { fontSize: 11 } },
  ], {
    x: 0.6, y: 1.7, w: 4.2, h: 1.3,
    fontFace: 'Calibri', color: C.dark, margin: 0,
  });

  // 右侧流程
  addCard(slide, 5.2, 1.2, 4.4, 2.0, { accent: C.accent });
  slide.addText('三步流程', {
    x: 5.4, y: 1.3, w: 4, h: 0.3,
    fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });
  slide.addText([
    { text: '① 找新支持点 p = Support(A, B, d)', options: { breakLine: true, fontSize: 10 } },
    { text: '② 若 p·d ≤ 0 → 不相交，返回 false', options: { breakLine: true, fontSize: 10 } },
    { text: '③ 将 p 加入单纯形', options: { breakLine: true, fontSize: 10 } },
    { text: '④ 更新单纯形和搜索方向：', options: { breakLine: true, fontSize: 10 } },
    { text: '   包含原点 → 返回 true', options: { breakLine: true, fontSize: 10, color: C.green } },
    { text: '   否则 → 缩小方向，继续迭代', options: { fontSize: 10, color: C.accent } },
  ], {
    x: 5.4, y: 1.7, w: 4, h: 1.3,
    fontFace: 'Calibri', color: C.dark, margin: 0,
  });

  // 伪代码
  addCard(slide, 0.4, 3.4, 9.2, 2.0, { accent: C.accent2 });
  slide.addText('伪代码', {
    x: 0.6, y: 3.5, w: 3, h: 0.3,
    fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });

  const gjkCode = [
    { text: 'func GJK(shapeA, shapeB):', options: { breakLine: true, fontSize: 10, bold: true } },
    { text: '  dir = initialDirection()', options: { breakLine: true, fontSize: 10 } },
    { text: '  simplex = [Support(shapeA, shapeB, dir)]', options: { breakLine: true, fontSize: 10 } },
    { text: '  dir = -simplex[0]  // 方向指向原点', options: { breakLine: true, fontSize: 10 } },
    { text: '', options: { breakLine: true, fontSize: 4 } },
    { text: '  while true:', options: { breakLine: true, fontSize: 10 } },
    { text: '    p = Support(shapeA, shapeB, dir)', options: { breakLine: true, fontSize: 10 } },
    { text: '    if dot(p, dir) <= 0: return false  // 不相交', options: { breakLine: true, fontSize: 10, color: C.red } },
    { text: '    simplex.append(p)', options: { breakLine: true, fontSize: 10 } },
    { text: '    if UpdateSimplex(simplex, ref dir):', options: { breakLine: true, fontSize: 10 } },
    { text: '      return true  // 单纯形包含原点 → 相交', options: { fontSize: 10, color: C.green } },
  ];
  slide.addText(gjkCode, {
    x: 0.6, y: 3.9, w: 8.8, h: 1.3,
    fontFace: 'Consolas', color: C.dark, margin: 0,
  });
}

// ========== SLIDE 12: GJK复杂度分析 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, 'GJK —— 复杂度分析');
  addFooter(slide, 12);

  // 核心结论
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.2, w: 9.2, h: 0.8,
    fill: { color: C.navy },
  });
  slide.addText('GJK 的迭代次数有常数上界：2D ≤ 3次，3D ≤ 4次\n→ 每对物体的判定时间取决于 Support 函数的代价', {
    x: 0.6, y: 1.2, w: 8.8, h: 0.8,
    fontSize: 14, fontFace: 'Calibri', color: C.white, bold: true, align: 'center', valign: 'middle', margin: 0,
  });

  // 复杂度表
  addCard(slide, 0.4, 2.2, 9.2, 2.2, { accent: C.blue });
  const gjkComplexity = [
    [
      { text: '因素', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11 } },
      { text: '代价', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11 } },
      { text: '说明', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11 } },
    ],
    [
      { text: '迭代次数（2D）', options: { fontSize: 11 } },
      { text: 'O(1)，最多3次', options: { fontSize: 11, bold: true, color: C.green } },
      { text: '单纯形最多3个点（三角形）', options: { fontSize: 11 } },
    ],
    [
      { text: '迭代次数（3D）', options: { fontSize: 11 } },
      { text: 'O(1)，最多4次', options: { fontSize: 11, bold: true, color: C.green } },
      { text: '单纯形最多4个点（四面体）', options: { fontSize: 11 } },
    ],
    [
      { text: 'Support函数（朴素）', options: { fontSize: 11 } },
      { text: 'O(n)', options: { fontSize: 11 } },
      { text: '遍历所有顶点找极值', options: { fontSize: 11 } },
    ],
    [
      { text: 'Support函数（预处理）', options: { fontSize: 11 } },
      { text: 'O(log n)', options: { fontSize: 11 } },
      { text: '凸体预排序后二分查找', options: { fontSize: 11 } },
    ],
    [
      { text: '增量模式', options: { fontSize: 11 } },
      { text: '接近O(1)', options: { fontSize: 11, bold: true, color: C.accent } },
      { text: '上一帧单纯形作起点，1-2次迭代收敛', options: { fontSize: 11 } },
    ],
  ];
  slide.addTable(gjkComplexity, {
    x: 0.6, y: 2.3, w: 8.8, h: 2.0,
    border: { pt: 0.5, color: C.lightGray },
    colW: [2.5, 2.0, 4.3],
  });

  // 关键文献发现
  addCard(slide, 0.4, 4.6, 9.2, 0.8, { accent: C.accent });
  slide.addText([
    { text: '关键文献（Montanari et al., 2017）：', options: { bold: true, fontSize: 11, color: C.blue } },
    { text: '提出基于有符号体积的新子算法，避免小量相乘，CPU时间平均减少10%', options: { fontSize: 11 } },
  ], {
    x: 0.6, y: 4.7, w: 8.8, h: 0.5,
    fontFace: 'Calibri', color: C.dark, margin: 0,
  });
}

// ========== SLIDE 13: GJK正确性说明 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, 'GJK —— 为什么这个算法是正确的？');
  addFooter(slide, 13);

  // 三要素
  const correctnessItems = [
    {
      y: 1.2, title: '1. 等价转化', accent: C.blue,
      text: 'A ∩ B ≠ ∅ ⟺ 原点 ∈ A ⊖ B（第10页已证）',
    },
    {
      y: 2.5, title: '2. 单纯形逼近的收敛性', accent: C.accent,
      text: 'Support函数保证每次取的点在Minkowski差的边界上\nJohnson距离子算法保证距离单调不增\n有限维空间 + 距离单调不增 + 常数上界 → 必然收敛',
    },
    {
      y: 3.8, title: '3. 判定的完备性', accent: C.accent2,
      text: '返回 true：单纯形包含原点 → 原点在Minkowski差内 → 相交 ✓\n返回 false：新支持点无法超越原点 → 整个Minkowski差在原点一侧 → 不相交 ✓',
    },
  ];

  correctnessItems.forEach((item) => {
    addCard(slide, 0.4, item.y, 9.2, 1.1, { accent: item.accent });
    slide.addText(item.title, {
      x: 0.6, y: item.y + 0.05, w: 3, h: 0.3,
      fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
    });
    slide.addText(item.text, {
      x: 0.6, y: item.y + 0.35, w: 8.8, h: 0.65,
      fontSize: 11, fontFace: 'Calibri', color: C.dark, margin: 0,
    });
  });

  // 底部金句
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.1, w: 9.2, h: 0.4,
    fill: { color: C.navy },
  });
  slide.addText('不需要穷举所有顶点——每次只取最有利于逼近原点的点，这就是迭代贪心的力量', {
    x: 0.6, y: 5.1, w: 8.8, h: 0.4,
    fontSize: 11, fontFace: 'Calibri', color: C.white, bold: true, align: 'center', valign: 'middle', margin: 0,
  });
}

// ========== SLIDE 14: GJK示例演示 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, 'GJK 实例演示 —— 两个2D凸多边形');
  addFooter(slide, 14);

  // 设置说明
  addCard(slide, 0.4, 1.2, 9.2, 0.8, { accent: C.blue });
  slide.addText([
    { text: '正方形A', options: { bold: true, color: C.blue } },
    { text: '（中心在原点，边长2）：顶点 (-1,-1), (1,-1), (1,1), (-1,1）    ', options: {} },
    { text: '正方形B', options: { bold: true, color: C.accent } },
    { text: '（中心在(1.5, 0)，边长2）：顶点 (0.5,-1), (2.5,-1), (2.5,1), (0.5,1)', options: {} },
  ], {
    x: 0.6, y: 1.3, w: 8.8, h: 0.5,
    fontSize: 10, fontFace: 'Consolas', color: C.dark, margin: 0,
  });

  // 执行过程表
  const gjkSteps = [
    [
      { text: '步骤', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
      { text: '操作', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
      { text: '单纯形状态', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
      { text: '搜索方向', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
    ],
    [
      { text: '1', options: { fontSize: 10, align: 'center' } },
      { text: '取初始方向d=(1,0)\nSupport = (1,0)-(0.5,-1) = (0.5,1)', options: { fontSize: 9 } },
      { text: '[(0.5,1)]', options: { fontSize: 10, fontFace: 'Consolas' } },
      { text: '改为-(0.5,1)\n= (-0.5,-1)', options: { fontSize: 9 } },
    ],
    [
      { text: '2', options: { fontSize: 10, align: 'center' } },
      { text: 'Support沿(-0.5,-1)\nA最远=(-1,-1), B最远=(2.5,1)\n差=(-3.5,-2)', options: { fontSize: 9 } },
      { text: '[(0.5,1),\n(-3.5,-2)]', options: { fontSize: 10, fontFace: 'Consolas' } },
      { text: '线段，计算新方向', options: { fontSize: 9 } },
    ],
    [
      { text: '3', options: { fontSize: 10, align: 'center' } },
      { text: '取新支持点\n形成三角形', options: { fontSize: 9 } },
      { text: '[(0.5,1),\n(-3.5,-2),\n新点]', options: { fontSize: 10, fontFace: 'Consolas' } },
      { text: '检查原点\n是否在三角形内', options: { fontSize: 9 } },
    ],
    [
      { text: '4', options: { fontSize: 10, align: 'center' } },
      { text: '原点在三角形内', options: { fontSize: 10, bold: true, color: C.green } },
      { text: '→ 返回 true', options: { fontSize: 10, bold: true, color: C.green } },
      { text: 'A ∩ B ≠ ∅ ✓', options: { fontSize: 10, bold: true, color: C.green } },
    ],
  ];
  slide.addTable(gjkSteps, {
    x: 0.4, y: 2.2, w: 9.2, h: 2.6,
    border: { pt: 0.5, color: C.lightGray },
    colW: [0.6, 3.5, 2.5, 2.6],
  });

  // 底部总结
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.0, w: 9.2, h: 0.5,
    fill: { color: C.navy },
  });
  slide.addText('整个过程只用了3次Support调用，没有遍历任何物体的全部顶点', {
    x: 0.6, y: 5.0, w: 8.8, h: 0.5,
    fontSize: 13, fontFace: 'Calibri', color: C.white, bold: true, align: 'center', valign: 'middle', margin: 0,
  });
}

// ========== SLIDE 15: 工业界组合使用 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, '工业界怎么组合使用', '小孩子才做选择，成熟的引擎什么都要');
  addFooter(slide, 15);

  // 引擎对比表
  const engineData = [
    [
      { text: '引擎', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11 } },
      { text: '粗筛方案', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11 } },
      { text: '精算方案', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11 } },
      { text: '特色', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11 } },
    ],
    [
      { text: 'Unity (PhysX)', options: { fontSize: 11, bold: true } },
      { text: 'SAP / MBP / ABP', options: { fontSize: 11 } },
      { text: 'GJK + SAT', options: { fontSize: 11 } },
      { text: 'MBP适合静态多的场景', options: { fontSize: 11 } },
    ],
    [
      { text: 'Unreal (Chaos)', options: { fontSize: 11, bold: true } },
      { text: '多种空间加速结构', options: { fontSize: 11 } },
      { text: 'GJK + EPA', options: { fontSize: 11 } },
      { text: '高度并行化', options: { fontSize: 11 } },
    ],
    [
      { text: 'Box2D v3', options: { fontSize: 11, bold: true } },
      { text: '动态AABB树', options: { fontSize: 11 } },
      { text: 'GJK + EPA', options: { fontSize: 11 } },
      { text: '2D专精，开源', options: { fontSize: 11 } },
    ],
    [
      { text: 'Bullet / Jolt', options: { fontSize: 11, bold: true } },
      { text: '动态AABB树', options: { fontSize: 11 } },
      { text: 'GJK + EPA', options: { fontSize: 11 } },
      { text: 'Jolt被Godot 4内置', options: { fontSize: 11 } },
    ],
  ];
  slide.addTable(engineData, {
    x: 0.4, y: 1.2, w: 9.2, h: 2.2,
    border: { pt: 0.5, color: C.lightGray },
    colW: [2.0, 2.5, 2.0, 2.7],
  });

  // 关键结论
  addCard(slide, 0.4, 3.6, 9.2, 1.8, { accent: C.accent });
  slide.addText('关键结论', {
    x: 0.6, y: 3.7, w: 3, h: 0.35,
    fontSize: 14, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
  });
  slide.addText([
    { text: '四叉树更多用于逻辑层（AI感知、区域触发器），而非物理引擎核心', options: { breakLine: true, bullet: true, fontSize: 12 } },
    { text: '动态AABB树是工业界广泛采用的粗筛方案', options: { breakLine: true, bullet: true, fontSize: 12 } },
    { text: 'GJK + EPA 是最常用的精算+穿透深度组合', options: { breakLine: true, bullet: true, fontSize: 12 } },
    { text: '真正的工程设计：按场景选结构，不是押宝单一算法', options: { bullet: true, fontSize: 12, bold: true, color: C.blue } },
  ], {
    x: 0.6, y: 4.1, w: 8.8, h: 1.1,
    fontFace: 'Calibri', color: C.dark, paraSpaceAfter: 4, margin: 0,
  });
}

// ========== SLIDE 16: 三种算法综合对比 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, '总结对比 —— 先快再准，先筛后算');
  addFooter(slide, 16);

  // 大对比表
  const compareData = [
    [
      { text: '维度', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10 } },
      { text: '四叉树', options: { fill: { color: C.blue }, color: C.white, bold: true, fontSize: 10 } },
      { text: 'SAP', options: { fill: { color: C.accent }, color: C.white, bold: true, fontSize: 10 } },
      { text: 'GJK', options: { fill: { color: C.accent2 }, color: C.white, bold: true, fontSize: 10 } },
    ],
    [
      { text: '定位', options: { fontSize: 10, bold: true } },
      { text: '粗筛（空间索引）', options: { fontSize: 10 } },
      { text: '粗筛（区间扫描）', options: { fontSize: 10 } },
      { text: '精算（几何判定）', options: { fontSize: 10 } },
    ],
    [
      { text: '设计策略', options: { fontSize: 10, bold: true } },
      { text: '分治', options: { fontSize: 10 } },
      { text: '降维+时间局部性', options: { fontSize: 10 } },
      { text: '迭代逼近', options: { fontSize: 10 } },
    ],
    [
      { text: '最好时间', options: { fontSize: 10, bold: true } },
      { text: 'O(n log n)', options: { fontSize: 10 } },
      { text: 'O(n)', options: { fontSize: 10, bold: true, color: C.green } },
      { text: 'O(1)增量', options: { fontSize: 10, bold: true, color: C.green } },
    ],
    [
      { text: '平均时间', options: { fontSize: 10, bold: true } },
      { text: 'O(n log n)', options: { fontSize: 10 } },
      { text: 'O(n+m)', options: { fontSize: 10 } },
      { text: 'O(n)', options: { fontSize: 10 } },
    ],
    [
      { text: '最坏时间', options: { fontSize: 10, bold: true } },
      { text: 'O(n²)', options: { fontSize: 10, color: C.red } },
      { text: 'O(n²)', options: { fontSize: 10, color: C.red } },
      { text: 'O(n)', options: { fontSize: 10 } },
    ],
    [
      { text: '空间', options: { fontSize: 10, bold: true } },
      { text: 'O(n)', options: { fontSize: 10 } },
      { text: 'O(n+p)', options: { fontSize: 10 } },
      { text: 'O(1)', options: { fontSize: 10 } },
    ],
    [
      { text: '强项', options: { fontSize: 10, bold: true } },
      { text: '稀疏场景查询快', options: { fontSize: 10 } },
      { text: '帧间连续性好', options: { fontSize: 10 } },
      { text: '凸体判定精确高效', options: { fontSize: 10 } },
    ],
    [
      { text: '短板', options: { fontSize: 10, bold: true } },
      { text: '高动态维护重', options: { fontSize: 10, color: C.red } },
      { text: '极端乱序退化', options: { fontSize: 10, color: C.red } },
      { text: '仅限凸体', options: { fontSize: 10, color: C.red } },
    ],
  ];
  slide.addTable(compareData, {
    x: 0.4, y: 1.2, w: 9.2, h: 3.8,
    border: { pt: 0.5, color: C.lightGray },
    colW: [1.5, 2.5, 2.6, 2.6],
  });

  // 底部金句
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.1, w: 9.2, h: 0.4,
    fill: { color: C.navy },
  });
  slide.addText('先粗筛缩小范围，再精算得出结论——这就是碰撞检测流水线的设计哲学', {
    x: 0.6, y: 5.1, w: 8.8, h: 0.4,
    fontSize: 12, fontFace: 'Calibri', color: C.white, bold: true, align: 'center', valign: 'middle', margin: 0,
  });
}

// ========== SLIDE 17: 拓展讨论 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, '拓展讨论 —— 从GJK出发的延伸');
  addFooter(slide, 17);

  // 三个方向卡片
  const directions = [
    {
      x: 0.4, title: '方向一：EPA', accent: C.blue,
      items: [
        'GJK只能判定是否相交，不能给出穿透多深',
        'EPA在GJK判定相交后，利用最终单纯形作为起点',
        '核心：Minkowski差上距原点最近点 = 穿透方向',
        '应用：物体被推开多少、往哪个方向推',
      ],
    },
    {
      x: 3.5, title: '方向二：连续碰撞检测', accent: C.accent,
      items: [
        '离散检测：每个时间步检测一次',
        '高速物体可能穿墙',
        'CCD：沿运动轨迹做扫掠体检测',
        '典型场景：子弹、高速赛车',
      ],
    },
    {
      x: 6.6, title: '方向三：非凸体处理', accent: C.accent2,
      items: [
        'GJK只适用于凸体',
        '实际游戏模型多为凹形',
        '凸分解（Convex Decomposition）',
        'V-HACD等算法将凹网格分解为多个凸体',
      ],
    },
  ];

  directions.forEach((d) => {
    addCard(slide, d.x, 1.2, 2.9, 3.6, { accent: d.accent });
    slide.addText(d.title, {
      x: d.x + 0.15, y: 1.3, w: 2.6, h: 0.35,
      fontSize: 13, fontFace: 'Calibri', color: C.navy, bold: true, margin: 0,
    });
    const items = d.items.map((item, i) => ({
      text: item,
      options: { bullet: true, breakLine: i < d.items.length - 1, fontSize: 10 },
    }));
    slide.addText(items, {
      x: d.x + 0.15, y: 1.75, w: 2.6, h: 2.8,
      fontFace: 'Calibri', color: C.dark, paraSpaceAfter: 6, margin: 0,
    });
  });

  // 底部总结
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.0, w: 9.2, h: 0.5,
    fill: { color: C.navy },
  });
  slide.addText('GJK是起点，不是终点——从判定到响应、从离散到连续、从凸体到凹体，每一步都是新的算法问题', {
    x: 0.6, y: 5.0, w: 8.8, h: 0.5,
    fontSize: 11, fontFace: 'Calibri', color: C.white, bold: true, align: 'center', valign: 'middle', margin: 0,
  });
}

// ========== SLIDE 18: 总结 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.navy };

  // 装饰线条
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 1.5, w: 10, h: 0.04,
    fill: { color: C.accent },
  });

  slide.addText('总结', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 36, fontFace: 'Calibri', color: C.white, bold: true, align: 'center', margin: 0,
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 1.7, w: 10, h: 0.04,
    fill: { color: C.accent },
  });

  // 核心哲学
  slide.addText('碰撞检测的核心设计哲学：', {
    x: 0.5, y: 2.0, w: 9, h: 0.5,
    fontSize: 18, fontFace: 'Calibri', color: C.lightBlue, align: 'center', margin: 0,
  });
  slide.addText('', {
    x: 0.5, y: 2.5, w: 9, h: 0.6,
    fontSize: 24, fontFace: 'Calibri', color: C.accent, bold: true, align: 'center', margin: 0,
  });
  slide.addText('→ 先粗筛再精算，用最小代价得到正确答案。', {
    x: 0.5, y: 3.1, w: 9, h: 0.5,
    fontSize: 16, fontFace: 'Calibri', color: C.white, align: 'center', margin: 0,
  });

  // 致谢
  slide.addText('感谢聆听', {
    x: 0.5, y: 3.8, w: 9, h: 0.5,
    fontSize: 20, fontFace: 'Calibri', color: C.lightBlue, align: 'center', margin: 0,
  });

  // 参考资料
  addCard(slide, 0.5, 4.3, 9, 1.2, { fill: '253A5E' });
  slide.addText('主要参考资料', {
    x: 0.7, y: 4.35, w: 8.6, h: 0.25,
    fontSize: 10, fontFace: 'Calibri', color: C.lightBlue, bold: true, margin: 0,
  });
  slide.addText([
    { text: 'Gilbert, Johnson, Keerthi (1988)  |  Cohen et al. (1995) I-COLLIDE  |  Baraff (1992)', options: { breakLine: true, fontSize: 8 } },
    { text: 'van den Bergen (2001)  |  Montanari et al. (2017)  |  Christer Ericson (2005) Real-Time Collision Detection', options: { breakLine: true, fontSize: 8 } },
    { text: 'Erin Catto (2005-2019) GDC Talks  |  Lean Rada - Sort, sweep, and prune', options: { fontSize: 8 } },
  ], {
    x: 0.7, y: 4.6, w: 8.6, h: 0.8,
    fontFace: 'Calibri', color: C.gray, margin: 0,
  });
}

// ========== SLIDE 19: 小组分工 ==========
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addTitleBar(slide, '小组成员分工');
  addFooter(slide, 19);

  // 分工表
  const teamData = [
    [
      { text: '成员', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 14 } },
      { text: '分工内容', options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 14 } },
    ],
    [
      { text: '曹涵兮', options: { fontSize: 14, bold: true, color: C.blue } },
      { text: '四叉树算法原理、伪代码与复杂度分析', options: { fontSize: 14 } },
    ],
    [
      { text: '徐子豪', options: { fontSize: 14, bold: true, color: C.blue } },
      { text: 'SAP算法原理、帧间一致性分析', options: { fontSize: 14 } },
    ],
    [
      { text: '陈鼎亚', options: { fontSize: 14, bold: true, color: C.blue } },
      { text: 'GJK算法原理、Minkowski差与正确性证明', options: { fontSize: 14 } },
    ],
    [
      { text: '刘昊', options: { fontSize: 14, bold: true, color: C.blue } },
      { text: '工业界应用调研、引擎对比分析', options: { fontSize: 14 } },
    ],
    [
      { text: '耿瑞林', options: { fontSize: 14, bold: true, color: C.blue } },
      { text: '实例演示、拓展讨论与PPT整合', options: { fontSize: 14 } },
    ],
  ];
  slide.addTable(teamData, {
    x: 1.5, y: 1.5, w: 7, h: 3.0,
    border: { pt: 1, color: C.lightGray },
    colW: [2.0, 5.0],
    rowH: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  });

  // 谢谢
  slide.addText('谢谢大家！', {
    x: 0.5, y: 4.8, w: 9, h: 0.5,
    fontSize: 24, fontFace: 'Calibri', color: C.navy, bold: true, align: 'center', margin: 0,
  });
}

// ========== Generate ==========
const outputPath = 'h:\\研一\\研一下\\高级算法\\课堂汇报\\碰撞检测算法课堂汇报.pptx';
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log('PPT generated: ' + outputPath);
}).catch((err) => {
  console.error('Error:', err);
});
