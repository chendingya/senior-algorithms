const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Collision Detection Team";
pres.title = "游戏中的碰撞检测算法 —— 从四叉树到 GJK";

// ── Color Palette ──
const C = {
  navy: "1E2761",
  blue: "2B6CB0",
  lightBlue: "E8EEF7",
  midBlue: "A0AEC0",
  text: "2D3748",
  lightText: "718096",
  white: "FFFFFF",
  offWhite: "F7FAFC",
  accent: "3182CE",
  green: "276749",
  red: "C53030",
  headerBg: "EDF2F7",
};
const FONT = "Microsoft YaHei";
const FONT_MONO = "Consolas";
const IMG = path.join(__dirname, "images");

// ── Helpers ──
const shadow = () => ({ type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.08 });

function addSlideNumber(slide, num) {
  slide.addText(`${num} / 19`, { x: 8.8, y: 5.2, w: 1, h: 0.3, fontSize: 9, color: C.lightText, align: "right", fontFace: FONT });
}

function addSectionTag(slide, tag) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 0.35, w: tag.length * 0.18 + 0.4, h: 0.32, fill: { color: C.lightBlue }, rectRadius: 0.05 });
  slide.addText(tag, { x: 0.5, y: 0.35, w: tag.length * 0.18 + 0.4, h: 0.32, fontSize: 9, color: C.navy, align: "center", valign: "middle", fontFace: FONT, margin: 0 });
}

function addTitle(slide, title, opts = {}) {
  const y = opts.y || 0.3;
  const size = opts.size || 28;
  slide.addText(title, { x: 0.5, y, w: 9, h: 0.6, fontSize: size, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
}

function addSubtitle(slide, text, y) {
  slide.addText(text, { x: 0.5, y, w: 9, h: 0.35, fontSize: 13, fontFace: FONT, color: C.lightText, margin: 0 });
}

function addBottomQuote(slide, text) {
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.95, w: 9, h: 0.03, fill: { color: C.midBlue } });
  slide.addText(text, { x: 0.5, y: 5.0, w: 9, h: 0.35, fontSize: 11, fontFace: FONT, color: C.blue, italic: true, margin: 0 });
}

// ════════════════════════════════════════════
// SLIDE 1 — Cover
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };
  // Decorative shape
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.545, w: 10, h: 0.08, fill: { color: C.accent } });
  s.addText("游戏中的碰撞检测算法", { x: 0.8, y: 1.2, w: 8.4, h: 1.0, fontSize: 38, fontFace: FONT, color: C.white, bold: true, margin: 0 });
  s.addText("从四叉树到 GJK", { x: 0.8, y: 2.1, w: 8.4, h: 0.6, fontSize: 24, fontFace: FONT, color: "A0C4FF", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.9, w: 2.5, h: 0.04, fill: { color: C.accent } });
  s.addText("高级算法  课堂汇报", { x: 0.8, y: 3.1, w: 8.4, h: 0.4, fontSize: 14, fontFace: FONT, color: "A0C4FF" });
  s.addText("汇报人：曹涵兮  徐子豪  陈鼎亚  刘昊  耿瑞林", { x: 0.8, y: 3.7, w: 8.4, h: 0.4, fontSize: 13, fontFace: FONT, color: "CBD5E0" });
  s.addText("2026年3月", { x: 0.8, y: 4.1, w: 8.4, h: 0.3, fontSize: 11, fontFace: FONT, color: "A0AEC0" });
}

// ════════════════════════════════════════════
// SLIDE 2 — Introduction
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "碰撞检测问题从何而来");
  addSlideNumber(s, 2);

  // Left column — problem description
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 4.2, h: 3.6, fill: { color: C.offWhite }, shadow: shadow() });
  s.addText("玩家看到的", { x: 0.7, y: 1.2, w: 3.8, h: 0.35, fontSize: 13, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
  s.addText([
    { text: "穿模：角色穿透墙壁", options: { bullet: true, breakLine: true } },
    { text: "卡墙：角色被卡在几何体中", options: { bullet: true, breakLine: true } },
    { text: "漏碰：高速物体穿越障碍", options: { bullet: true } },
  ], { x: 0.7, y: 1.6, w: 3.8, h: 1.5, fontSize: 12, fontFace: FONT, color: C.text, paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.0, w: 4.2, h: 0.03, fill: { color: C.midBlue } });
  s.addText("开发者面对的", { x: 0.7, y: 3.1, w: 3.8, h: 0.35, fontSize: 13, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
  s.addText("N 个对象 → 暴力两两检测 → O(N²) 复杂度\n1万个对象 → 每帧约5000万次比较", { x: 0.7, y: 3.5, w: 3.8, h: 0.8, fontSize: 11, fontFace: FONT, color: C.text });

  // Right column — core challenge
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.1, w: 4.4, h: 3.6, fill: { color: C.lightBlue }, shadow: shadow() });
  s.addText("核心挑战", { x: 5.3, y: 1.2, w: 4, h: 0.4, fontSize: 15, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
  s.addText(`不是\u201C两个物体能不能碰\u201D\n而是\u201C谁值得进入下一轮\u201D`, { x: 5.3, y: 1.8, w: 4, h: 1.0, fontSize: 18, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
  s.addText("碰撞检测流水线的核心目标：\n快速筛选出需要精确检测的候选对", { x: 5.3, y: 3.0, w: 4, h: 0.8, fontSize: 12, fontFace: FONT, color: C.text });

  addBottomQuote(s, "游戏算法千千万，碰撞检测很难办");
}

// ════════════════════════════════════════════
// SLIDE 3 — Formal Definition + Pipeline
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "碰撞检测问题的形式化定义");
  addSlideNumber(s, 3);

  // Definition box
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9, h: 1.1, fill: { color: C.offWhite }, line: { color: C.midBlue, width: 1 } });
  s.addText([
    { text: "输入：", options: { bold: true } },
    { text: "场景中 N 个物体 {O₁, O₂, ..., Oₙ}，每个物体有几何形状和位置信息", options: { breakLine: true } },
    { text: "输出：", options: { bold: true } },
    { text: "所有发生碰撞的物体对集合 {(Oᵢ, Oⱼ) | Oᵢ ∩ Oⱼ ≠ ∅}", options: {} },
  ], { x: 0.7, y: 1.1, w: 8.6, h: 0.9, fontSize: 12, fontFace: FONT, color: C.text, paraSpaceAfter: 4 });

  // Pipeline flow — using shapes
  // Broad Phase box
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.6, w: 3.0, h: 1.6, fill: { color: C.lightBlue }, shadow: shadow() });
  s.addText("粗筛阶段\nBroad Phase", { x: 0.8, y: 2.7, w: 3.0, h: 0.7, fontSize: 14, fontFace: FONT, color: C.navy, bold: true, align: "center", margin: 0 });
  s.addText("四叉树 / SAP", { x: 0.8, y: 3.5, w: 3.0, h: 0.4, fontSize: 12, fontFace: FONT, color: C.text, align: "center" });

  // Arrow 1
  s.addText("候选对 →", { x: 3.9, y: 3.1, w: 1.3, h: 0.4, fontSize: 11, fontFace: FONT, color: C.accent, align: "center" });

  // Narrow Phase box
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 2.6, w: 3.0, h: 1.6, fill: { color: "E6F6E6" }, shadow: shadow() });
  s.addText("精算阶段\nNarrow Phase", { x: 5.2, y: 2.7, w: 3.0, h: 0.7, fontSize: 14, fontFace: FONT, color: C.green, bold: true, align: "center", margin: 0 });
  s.addText("GJK / SAT", { x: 5.2, y: 3.5, w: 3.0, h: 0.4, fontSize: 12, fontFace: FONT, color: C.text, align: "center" });

  // Arrow 2
  s.addText("碰撞对 →", { x: 8.3, y: 3.1, w: 1.3, h: 0.4, fontSize: 11, fontFace: FONT, color: C.accent, align: "center" });

  addBottomQuote(s, "粗筛缩范围，精算给结论");
}

// ════════════════════════════════════════════
// SLIDE 4 — Quadtree: Design
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addSectionTag(s, "算法一");
  addTitle(s, "四叉树 Quadtree —— 分治空间，化整为零", { y: 0.7, size: 24 });
  addSlideNumber(s, 4);

  // Left: image
  s.addImage({ path: path.join(IMG, "quadtree.png"), x: 0.5, y: 1.3, w: 4.3, h: 2.5, sizing: { type: "contain", w: 4.3, h: 2.5 } });

  // Right: core ideas
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.3, w: 4.4, h: 2.5, fill: { color: C.offWhite }, shadow: shadow() });
  s.addText("设计策略：分治法", { x: 5.3, y: 1.4, w: 4, h: 0.35, fontSize: 14, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
  s.addText([
    { text: "递归划分二维空间为四象限", options: { bullet: true, breakLine: true } },
    { text: "区域超阈值时继续分裂", options: { bullet: true, breakLine: true } },
    { text: "稀疏区域不浪费计算", options: { bullet: true, breakLine: true } },
    { text: "密集区域自动细分", options: { bullet: true } },
  ], { x: 5.3, y: 1.9, w: 4, h: 1.5, fontSize: 12, fontFace: FONT, color: C.text, paraSpaceAfter: 6 });

  // Bottom table
  const tbl = [
    [
      { text: "核心动作", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "设计策略", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "适用场景", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "不适用场景", options: { bold: true, fill: { color: C.headerBg } } },
    ],
    ["递归分裂空间", "分治", "2D偏静态、分布稀疏", "高动态、对象密集"],
  ];
  s.addTable(tbl, { x: 0.5, y: 4.1, w: 9, h: 0.8, fontSize: 11, fontFace: FONT, color: C.text, border: { pt: 0.5, color: C.midBlue }, colW: [2.25, 2.25, 2.25, 2.25] });
  addBottomQuote(s, "让每个对象只和局部邻居打交道");
}

// ════════════════════════════════════════════
// SLIDE 5 — Quadtree: Pseudocode + Complexity
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addSectionTag(s, "算法一");
  addTitle(s, "四叉树 —— 算法流程与复杂度", { y: 0.7, size: 24 });
  addSlideNumber(s, 5);

  // Left: pseudocode
  const code = `// 插入操作
func Insert(node, obj):
    if node.count < MAX_CAPACITY:
        node.objects.add(obj)
        return
    if not node.isDivided:
        node.Subdivide()
    for child in node.children:
        if child.boundary.contains(obj):
            Insert(child, obj)
            return

// 范围查询操作
func Query(node, range, results):
    if not node.intersects(range):
        return              // 剪枝
    for obj in node.objects:
        if range.contains(obj):
            results.add(obj)
    if node.isDivided:
        for child in node.children:
            Query(child, range, results)`;
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.5, h: 3.5, fill: { color: "F5F5F0" }, line: { color: C.midBlue, width: 0.5 } });
  s.addText(code, { x: 0.6, y: 1.3, w: 4.3, h: 3.3, fontSize: 8.5, fontFace: FONT_MONO, color: C.text, valign: "top", margin: 0 });

  // Right: complexity table
  const tbl = [
    [
      { text: "操作", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "最好", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "平均", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "最坏", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "空间", options: { bold: true, fill: { color: C.headerBg } } },
    ],
    ["构建(n次插入)", "O(n log n)", "O(n log n)", "O(n²)", "O(n)"],
    ["单次查询", "O(log n)", "O(log n)", "O(n)", "—"],
    ["全场景检测", "O(n log n)", "O(n log n)", "O(n²)", "O(n)"],
  ];
  s.addTable(tbl, { x: 5.2, y: 1.2, w: 4.3, h: 1.6, fontSize: 9.5, fontFace: FONT, color: C.text, border: { pt: 0.5, color: C.midBlue }, colW: [1.1, 0.8, 0.8, 0.8, 0.8] });

  // Note
  s.addText([
    { text: "最坏情况：", options: { bold: true } },
    { text: "所有对象重叠在同一区域 → 树退化为链表 → O(n²)", options: {} },
  ], { x: 5.2, y: 3.0, w: 4.3, h: 0.5, fontSize: 10, fontFace: FONT, color: C.red });
  s.addText("关键依赖：对象分布是否均匀，阈值 MAX_CAPACITY 的选取", { x: 5.2, y: 3.6, w: 4.3, h: 0.4, fontSize: 10, fontFace: FONT, color: C.lightText });
}

// ════════════════════════════════════════════
// SLIDE 6 — Quadtree: Correctness + Trade-offs
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addSectionTag(s, "算法一");
  addTitle(s, "四叉树 —— 正确性与优劣取舍", { y: 0.7, size: 24 });
  addSlideNumber(s, 6);

  // Left: correctness
  s.addText("正确性保证", { x: 0.5, y: 1.2, w: 4.5, h: 0.35, fontSize: 14, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
  s.addText([
    { text: "不变量：", options: { bold: true } },
    { text: "每个对象存储在某个叶节点中", options: { breakLine: true } },
    { text: "空间完备性：", options: { bold: true } },
    { text: "四个子节点区域之和 = 父节点区域", options: { breakLine: true } },
    { text: "查询正确性：", options: { bold: true } },
    { text: "范围内的对象所在叶节点必定与查询范围相交", options: {} },
  ], { x: 0.5, y: 1.6, w: 4.5, h: 2.2, fontSize: 12, fontFace: FONT, color: C.text, paraSpaceAfter: 10 });

  // Right: pros/cons table
  const tbl = [
    [
      { text: "优势", options: { bold: true, fill: { color: "E6F6E6" } } },
      { text: "劣势", options: { bold: true, fill: { color: "FDE8E8" } } },
    ],
    ["结构直观，适合2D空间查询", "对象频繁移动时需反复删除/插入"],
    ["稀疏场景显著减少比较次数", "极端分布下树深膨胀"],
    ["实现简单，易于理解", "仅适用于2D（3D需八叉树）"],
  ];
  s.addTable(tbl, { x: 5.2, y: 1.2, w: 4.3, h: 2.6, fontSize: 10.5, fontFace: FONT, color: C.text, border: { pt: 0.5, color: C.midBlue }, colW: [2.15, 2.15] });

  addBottomQuote(s, "静态地图、动态对象少 → 四叉树是好选择；高动态场景 → 需要其他方案");
}

// ════════════════════════════════════════════
// SLIDE 7 — SAP: Design
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addSectionTag(s, "算法二");
  addTitle(s, "Sweep and Prune —— 降维打击，排序复用", { y: 0.7, size: 24 });
  addSlideNumber(s, 7);

  // Left: image
  s.addImage({ path: path.join(IMG, "sap.png"), x: 0.5, y: 1.3, w: 4.3, h: 2.2, sizing: { type: "contain", w: 4.3, h: 2.2 } });

  // Right: key insights
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.3, w: 4.4, h: 2.2, fill: { color: C.offWhite }, shadow: shadow() });
  s.addText("设计策略：降维 + 时间局部性", { x: 5.3, y: 1.4, w: 4, h: 0.35, fontSize: 13, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
  s.addText([
    { text: "AABB投影到坐标轴 → 区间重叠", options: { bullet: true, breakLine: true } },
    { text: "排序后扫描 → 找重叠区间", options: { bullet: true, breakLine: true } },
    { text: "帧间变化小 → 插入排序≈O(n)", options: { bullet: true, breakLine: true } },
    { text: "不等式传递性 → 大规模剪枝", options: { bullet: true } },
  ], { x: 5.3, y: 1.9, w: 4, h: 1.4, fontSize: 11, fontFace: FONT, color: C.text, paraSpaceAfter: 5 });

  // Bottom: transitivity
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.8, w: 9, h: 0.9, fill: { color: C.lightBlue } });
  s.addText("核心优化 — 不等式传递性", { x: 0.7, y: 3.85, w: 4, h: 0.3, fontSize: 12, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
  s.addText("若 A.right ≤ B.left 且 B.right ≤ C.left  →  A.right ≤ C.left  →  无需检测A与C，直接跳过！", { x: 0.7, y: 4.2, w: 8.6, h: 0.4, fontSize: 11, fontFace: FONT_MONO, color: C.text });
  addBottomQuote(s, "又称 Sort and Sweep（Baraff, 1992）；I-COLLIDE（Cohen et al., 1995）首次系统化");
}

// ════════════════════════════════════════════
// SLIDE 8 — SAP: Pseudocode + Complexity
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addSectionTag(s, "算法二");
  addTitle(s, "SAP —— 算法流程与复杂度", { y: 0.7, size: 24 });
  addSlideNumber(s, 8);

  // Left: pseudocode
  const code = `func SweepAndPrune(objects):
    // 1. 沿X轴按AABB.minX排序
    Sort(objects, key = aabb.minX)
    // 首次：快排；后续帧：插入排序

    candidates = []
    // 2. 从左到右扫描
    for i = 0 to n-1:
        for j = i+1 to n-1:
            // 3. 剪枝
            if objects[j].minX > objects[i].maxX:
                break
            // 4. X轴重叠 → 检查Y轴
            if AABBOverlap(objects[i], objects[j]):
                candidates.add(objects[i], objects[j])
    return candidates`;
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.5, h: 3.0, fill: { color: "F5F5F0" }, line: { color: C.midBlue, width: 0.5 } });
  s.addText(code, { x: 0.6, y: 1.3, w: 4.3, h: 2.8, fontSize: 8.5, fontFace: FONT_MONO, color: C.text, valign: "top", margin: 0 });

  // Right: complexity table
  const tbl = [
    [
      { text: "操作", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "最好", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "平均", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "最坏", options: { bold: true, fill: { color: C.headerBg } } },
    ],
    ["首次排序", "O(n log n)", "O(n log n)", "O(n log n)"],
    ["后续帧(插入排序)", { text: "O(n)", options: { bold: true, color: C.green } }, "O(n)", "O(n log n)"],
    ["扫描候选对", "O(n)", "O(n + m)", "O(n²)"],
    ["全场景(首次)", "O(n log n)", "O(n log n+m)", "O(n²)"],
    ["全场景(后续帧)", { text: "O(n)", options: { bold: true, color: C.green } }, { text: "O(n + m)", options: { bold: true, color: C.green } }, "O(n²)"],
  ];
  s.addTable(tbl, { x: 5.2, y: 1.2, w: 4.3, h: 2.3, fontSize: 9.5, fontFace: FONT, color: C.text, border: { pt: 0.5, color: C.midBlue }, colW: [1.3, 1.0, 1.0, 1.0] });

  s.addText([
    { text: "m", options: { bold: true, italic: true } },
    { text: " = 某轴上的重叠区间对数（典型游戏中 m ≪ n²）", options: {} },
  ], { x: 5.2, y: 3.6, w: 4.3, h: 0.35, fontSize: 10, fontFace: FONT, color: C.lightText });
  s.addText("Output-sensitive：碰撞对越少越快", { x: 5.2, y: 3.95, w: 4.3, h: 0.3, fontSize: 10, fontFace: FONT, color: C.blue, bold: true });
}

// ════════════════════════════════════════════
// SLIDE 9 — SAP: Correctness + Applicability
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addSectionTag(s, "算法二");
  addTitle(s, "SAP —— 正确性分析与适用边界", { y: 0.7, size: 24 });
  addSlideNumber(s, 9);

  // Correctness
  s.addText("正确性基础", { x: 0.5, y: 1.2, w: 9, h: 0.35, fontSize: 14, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
  s.addText([
    { text: "分离轴定理：", options: { bold: true } },
    { text: "空间相交 → 任意轴投影必重叠", options: { breakLine: true } },
    { text: "逆否命题：", options: { bold: true } },
    { text: "某轴投影不重叠 → 一定不相交 → 安全排除", options: { breakLine: true } },
    { text: "多轴验证：", options: { bold: true } },
    { text: "X/Y/Z 三轴都重叠才是真正的候选对", options: {} },
  ], { x: 0.5, y: 1.6, w: 9, h: 1.5, fontSize: 12, fontFace: FONT, color: C.text, paraSpaceAfter: 8 });

  // Applicability table
  const tbl = [
    [
      { text: "适合SAP的场景", options: { bold: true, fill: { color: "E6F6E6" } } },
      { text: "不适合SAP的场景", options: { bold: true, fill: { color: "FDE8E8" } } },
    ],
    ["对象数量大但碰撞对少", "对象密集且大量重叠"],
    ["帧间运动幅度小", "对象瞬间大幅位移"],
    ["对象尺寸相近", "对象尺寸差异极大"],
  ];
  s.addTable(tbl, { x: 0.5, y: 3.3, w: 9, h: 1.5, fontSize: 11, fontFace: FONT, color: C.text, border: { pt: 0.5, color: C.midBlue }, colW: [4.5, 4.5] });
  addBottomQuote(s, `SAP的威力在于\u201C变化少\u201D；变化越大，越接近暴力法`);
}

// ════════════════════════════════════════════
// SLIDE 10 — GJK: Minkowski Difference
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addSectionTag(s, "算法三");
  addTitle(s, "GJK算法 —— 两体相交，以差判之，决于原点", { y: 0.7, size: 22 });
  addSlideNumber(s, 10);

  // Left: image
  s.addImage({ path: path.join(IMG, "minkowski.png"), x: 0.5, y: 1.3, w: 4.5, h: 2.6, sizing: { type: "contain", w: 4.5, h: 2.6 } });

  // Right: derivation
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 2.6, fill: { color: C.offWhite }, shadow: shadow() });
  s.addText("Minkowski 差", { x: 5.4, y: 1.4, w: 3.9, h: 0.35, fontSize: 14, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
  s.addText("A ⊖ B = { a − b | a ∈ A, b ∈ B }", { x: 5.4, y: 1.8, w: 3.9, h: 0.4, fontSize: 13, fontFace: FONT_MONO, color: C.text, margin: 0 });
  s.addText([
    { text: "A ∩ B ≠ ∅", options: { breakLine: true } },
    { text: "⟺ 存在公共点 p ∈ A 且 p ∈ B", options: { breakLine: true } },
    { text: "⟺ p − p = 0 ∈ A ⊖ B", options: { breakLine: true } },
    { text: "⟺ 原点 ∈ A ⊖ B", options: {} },
  ], { x: 5.4, y: 2.3, w: 3.9, h: 1.3, fontSize: 11, fontFace: FONT_MONO, color: C.text, paraSpaceAfter: 4 });

  addBottomQuote(s, `核心转化：把\u201C两个物体是否相交\u201D转化为\u201C一个形状是否包含原点\u201D`);
}

// ════════════════════════════════════════════
// SLIDE 11 — GJK: Algorithm Flow + Pseudocode
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addSectionTag(s, "算法三");
  addTitle(s, "GJK —— 取支、立形、决原", { y: 0.7, size: 24 });
  addSlideNumber(s, 11);

  // Left: concepts + flow
  s.addText("核心概念", { x: 0.5, y: 1.2, w: 4.5, h: 0.3, fontSize: 13, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
  s.addText([
    { text: "Support Point：", options: { bold: true } },
    { text: "沿给定方向在 Minkowski 差上最远的点", options: { breakLine: true } },
    { text: "Support(A,B,d) = A沿d最远 − B沿−d最远", options: { breakLine: true } },
    { text: "Simplex：", options: { bold: true } },
    { text: "点(0D) → 线段(1D) → 三角形(2D) → 四面体(3D)", options: {} },
  ], { x: 0.5, y: 1.5, w: 4.5, h: 1.3, fontSize: 10.5, fontFace: FONT, color: C.text, paraSpaceAfter: 6 });

  // Flow steps
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.9, w: 4.5, h: 2.0, fill: { color: C.lightBlue } });
  s.addText([
    { text: "① 找新支持点 p = Support(A, B, dir)", options: { breakLine: true } },
    { text: "② 若 p·dir ≤ 0 → 不相交，返回 false", options: { breakLine: true } },
    { text: "③ 将 p 加入单纯形", options: { breakLine: true } },
    { text: "④ 更新单纯形与搜索方向", options: { breakLine: true } },
    { text: "   若包含原点 → 返回 true", options: { breakLine: true } },
    { text: "   否则 → 继续迭代", options: {} },
  ], { x: 0.7, y: 3.0, w: 4.1, h: 1.8, fontSize: 11, fontFace: FONT, color: C.text, paraSpaceAfter: 3 });

  // Right: pseudocode
  const code = `func GJK(shapeA, shapeB):
    dir = initialDirection()
    simplex = [Support(A, B, dir)]
    dir = -simplex[0]

    while true:
        p = Support(A, B, dir)
        if dot(p, dir) <= 0:
            return false    // 不相交
        simplex.append(p)
        if UpdateSimplex(simplex, ref dir):
            return true     // 相交

func Support(A, B, dir):
    return A.farthest(dir) - B.farthest(-dir)`;
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 3.7, fill: { color: "F5F5F0" }, line: { color: C.midBlue, width: 0.5 } });
  s.addText(code, { x: 5.3, y: 1.3, w: 4.1, h: 3.5, fontSize: 9, fontFace: FONT_MONO, color: C.text, valign: "top", margin: 0 });
}

// ════════════════════════════════════════════
// SLIDE 12 — GJK: Complexity
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addSectionTag(s, "算法三");
  addTitle(s, "GJK —— 复杂度分析", { y: 0.7, size: 24 });
  addSlideNumber(s, 12);

  // Key conclusion
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9, h: 0.7, fill: { color: C.lightBlue } });
  s.addText("单纯形规模有常数上界：2D ≤ 3点，3D ≤ 4点  →  单次迭代 O(1)", { x: 0.7, y: 1.25, w: 8.6, h: 0.6, fontSize: 14, fontFace: FONT, color: C.navy, bold: true, margin: 0 });

  // Table
  const tbl = [
    [
      { text: "因素", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "代价", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "说明", options: { bold: true, fill: { color: C.headerBg } } },
    ],
    ["单纯形规模（2D）", "O(1)，最多3点", "三角形"],
    ["单纯形规模（3D）", "O(1)，最多4点", "四面体"],
    ["迭代次数（实践）", "通常1-2次", "增量模式；理论最坏与形状复杂度有关"],
    ["Support（朴素）", "O(n)", "遍历所有顶点"],
    ["Support（预处理）", "O(log n)", "凸体预排序+二分"],
    [{ text: "单次判定总代价", options: { bold: true } }, { text: "O(n) 或 O(log n)", options: { bold: true } }, "取决于Support实现"],
    [{ text: "增量模式", options: { bold: true } }, { text: "接近O(1)", options: { bold: true, color: C.green } }, "上帧单纯形作起点"],
  ];
  s.addTable(tbl, { x: 0.5, y: 2.1, w: 9, h: 2.6, fontSize: 10.5, fontFace: FONT, color: C.text, border: { pt: 0.5, color: C.midBlue }, colW: [2.5, 2.5, 4.0] });

  s.addText("空间复杂度 O(1) | Montanari et al. (2017)：有符号体积子算法，接触场景性能提升15%-30%", { x: 0.5, y: 4.8, w: 9, h: 0.35, fontSize: 10, fontFace: FONT, color: C.lightText });
}

// ════════════════════════════════════════════
// SLIDE 13 — GJK: Correctness
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addSectionTag(s, "算法三");
  addTitle(s, "GJK —— 为什么这个算法是正确的？", { y: 0.7, size: 24 });
  addSlideNumber(s, 13);

  // Three pillars
  const pillars = [
    { title: "1. 等价转化", body: "A ∩ B ≠ ∅  ⟺  原点 ∈ A ⊖ B\n（第10页已证）", color: C.lightBlue },
    { title: "2. 收敛性", body: "Johnson距离子算法保证\n单纯形到原点距离单调不增\n有限维 + 常数级上界\n→ 有限步内必然收敛", color: "E6F6E6" },
    { title: "3. 判定完备性", body: "返回 true：单纯形包围原点 ✓\n返回 false：Minkowski差\n在原点某一侧 ✓", color: "FFF5E6" },
  ];
  pillars.forEach((p, i) => {
    const x = 0.5 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.2, w: 2.95, h: 3.2, fill: { color: p.color }, shadow: shadow() });
    s.addText(p.title, { x: x + 0.15, y: 1.3, w: 2.65, h: 0.4, fontSize: 14, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
    s.addText(p.body, { x: x + 0.15, y: 1.8, w: 2.65, h: 2.4, fontSize: 11, fontFace: FONT, color: C.text });
  });

  addBottomQuote(s, `不需要穷举所有顶点——每次只取\u201C最有利于逼近原点\u201D的点，这就是迭代贪心的力量`);
}

// ════════════════════════════════════════════
// SLIDE 14 — GJK: 2D Example
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addSectionTag(s, "算法三");
  addTitle(s, "GJK 实例演示 —— 两个2D凸多边形", { y: 0.7, size: 22 });
  addSlideNumber(s, 14);

  // Left: image
  s.addImage({ path: path.join(IMG, "gjk_simplex.png"), x: 0.5, y: 1.2, w: 4.5, h: 2.4, sizing: { type: "contain", w: 4.5, h: 2.4 } });

  // Right: step table
  const tbl = [
    [
      { text: "步骤", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "Support 结果", options: { bold: true, fill: { color: C.headerBg } } },
      { text: "单纯形", options: { bold: true, fill: { color: C.headerBg } } },
    ],
    ["1", "(0.5, 1)", "[(0.5,1)]"],
    ["2", "(−3.5, −2)", "[(0.5,1), (−3.5,−2)]"],
    ["3", "新方向", "计算中..."],
    [{ text: "4", options: { bold: true } }, { text: "新点", options: {} }, { text: "三角形 ⊃ 原点 → true", options: { bold: true, color: C.green } }],
  ];
  s.addTable(tbl, { x: 5.2, y: 1.2, w: 4.3, h: 2.0, fontSize: 10, fontFace: FONT, color: C.text, border: { pt: 0.5, color: C.midBlue }, colW: [0.6, 1.5, 2.2] });

  // Result
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.4, w: 4.3, h: 0.7, fill: { color: "E6F6E6" } });
  s.addText("A ∩ B ≠ ∅，判定为相交 ✓\n仅 3 次 Support 调用", { x: 5.4, y: 3.45, w: 3.9, h: 0.6, fontSize: 12, fontFace: FONT, color: C.green, bold: true, margin: 0 });

  // Footnote
  s.addText("¹ 支持点不限于顶点，连续凸形状的边界点均合法", { x: 0.5, y: 4.9, w: 9, h: 0.3, fontSize: 9, fontFace: FONT, color: C.lightText });
}

// ════════════════════════════════════════════
// SLIDE 15 — Industry Usage
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "工业界怎么组合使用", { size: 26 });
  addSlideNumber(s, 15);

  const tbl = [
    [
      { text: "引擎", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "粗筛方案", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "精算方案", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "特色", options: { bold: true, fill: { color: C.navy }, color: C.white } },
    ],
    ["Unity (PhysX)", "SAP / MBP / ABP", "GJK + SAT", "ABP自动选择策略"],
    ["Unreal (Chaos)", "多种空间加速结构", "GJK + EPA", "高度并行化"],
    ["Box2D v3", "动态AABB树", "GJK + EPA", "2D专精，开源"],
    ["Bullet / Jolt", "动态AABB树", "GJK + EPA", "Jolt = Godot 4默认3D引擎"],
  ];
  s.addTable(tbl, { x: 0.5, y: 1.1, w: 9, h: 2.2, fontSize: 11, fontFace: FONT, color: C.text, border: { pt: 0.5, color: C.midBlue }, colW: [1.8, 2.2, 1.8, 3.2] });

  // Key conclusions
  s.addText([
    { text: "四叉树更多用于逻辑层（AI感知、区域触发器）", options: { bullet: true, breakLine: true } },
    { text: "动态AABB树是工业界广泛采用的粗筛方案", options: { bullet: true, breakLine: true } },
    { text: "GJK + EPA 是最常用的精算+穿透深度组合", options: { bullet: true } },
  ], { x: 0.5, y: 3.5, w: 9, h: 1.2, fontSize: 12, fontFace: FONT, color: C.text, paraSpaceAfter: 6 });
  addBottomQuote(s, "真正的工程设计：按场景选结构，不是押宝单一算法");
}

// ════════════════════════════════════════════
// SLIDE 16 — Comprehensive Comparison
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "总结对比 —— 先快再准，先筛后算", { size: 24 });
  addSlideNumber(s, 16);

  const tbl = [
    [
      { text: "维度", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "四叉树", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "SAP", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "GJK", options: { bold: true, fill: { color: C.navy }, color: C.white } },
    ],
    ["定位", "粗筛（空间索引）", "粗筛（区间扫描）", "精算（几何判定）"],
    ["设计策略", "分治", "降维+时间局部性", "迭代逼近"],
    ["最好时间", "O(n log n)", { text: "O(n)", options: { bold: true } }, "接近O(1)"],
    ["平均时间", "O(n log n)", { text: "O(n+m)", options: { bold: true } }, "O(n)"],
    ["最坏时间", "O(n²)", "O(n²)", "O(kn)"],
    ["空间", "O(n)", "O(n+p)", { text: "O(1)", options: { bold: true } }],
    ["适用维度", "2D", "2D/3D", "2D/3D"],
    ["强项", "稀疏场景查询快", "帧间连续性好", "凸体判定精确"],
    ["短板", "高动态维护重", "极端乱序退化", "仅限凸体"],
  ];
  s.addTable(tbl, { x: 0.5, y: 1.0, w: 9, h: 3.8, fontSize: 10, fontFace: FONT, color: C.text, border: { pt: 0.5, color: C.midBlue }, colW: [1.5, 2.5, 2.5, 2.5] });
  addBottomQuote(s, "先粗筛缩小范围，再精算得出结论——碰撞检测流水线的设计哲学");
}

// ════════════════════════════════════════════
// SLIDE 17 — Extended Discussion
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "拓展讨论 —— 从GJK出发的延伸", { size: 24 });
  addSlideNumber(s, 17);

  const cards = [
    { title: "EPA", sub: "穿透深度计算", body: `GJK只判\u201C碰没碰\u201D\nEPA计算\u201C碰多深\u201D\n利用GJK最终单纯形\n扩展多面体逼近`, color: C.lightBlue },
    { title: "CCD", sub: "连续碰撞检测", body: `离散检测可能漏碰\n高速物体\u201C穿墙\u201D\n沿运动轨迹扫掠\nt\u2208[0,1]连续求解`, color: "E6F6E6" },
    { title: "非凸体", sub: "凸分解", body: "GJK只适用凸体\n游戏模型多为凹形\nV-HACD凸分解\n分解后分别用GJK", color: "FFF5E6" },
  ];
  cards.forEach((c, i) => {
    const x = 0.5 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.1, w: 2.95, h: 3.6, fill: { color: c.color }, shadow: shadow() });
    s.addText(c.title, { x: x + 0.15, y: 1.2, w: 2.65, h: 0.4, fontSize: 18, fontFace: FONT, color: C.navy, bold: true, margin: 0 });
    s.addText(c.sub, { x: x + 0.15, y: 1.6, w: 2.65, h: 0.3, fontSize: 11, fontFace: FONT, color: C.blue, margin: 0 });
    s.addText(c.body, { x: x + 0.15, y: 2.0, w: 2.65, h: 2.4, fontSize: 11, fontFace: FONT, color: C.text });
  });

  addBottomQuote(s, "GJK是起点，不是终点——从判定到响应、从离散到连续、从凸体到凹体");
}

// ════════════════════════════════════════════
// SLIDE 18 — Summary
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent } });

  s.addText("总结", { x: 0.8, y: 0.5, w: 8.4, h: 0.6, fontSize: 30, fontFace: FONT, color: C.white, bold: true, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 2.5, h: 0.04, fill: { color: C.accent } });

  s.addText(`\u201C不是比谁算得准，\n  而是比谁排除得快。\u201D`, { x: 0.8, y: 1.5, w: 8.4, h: 1.0, fontSize: 22, fontFace: FONT, color: "A0C4FF", bold: true, margin: 0 });
  s.addText("先粗筛再精算，用最小代价得到正确答案。", { x: 0.8, y: 2.5, w: 8.4, h: 0.5, fontSize: 14, fontFace: FONT, color: "CBD5E0" });

  // References
  s.addText("参考资料", { x: 0.8, y: 3.2, w: 8.4, h: 0.3, fontSize: 12, fontFace: FONT, color: "A0C4FF", bold: true, margin: 0 });
  s.addText([
    { text: "Gilbert, Johnson, Keerthi (1988), IEEE J. Robotics and Automation", options: { breakLine: true } },
    { text: "Cohen et al. (1995), I-COLLIDE, Proc. ACM I3D", options: { breakLine: true } },
    { text: "Baraff (1992), Ph.D. Thesis, Cornell University", options: { breakLine: true } },
    { text: "van den Bergen (2001), GDC", options: { breakLine: true } },
    { text: "Montanari et al. (2017), ACM Trans. on Graphics", options: { breakLine: true } },
    { text: "Ericson (2005), Real-Time Collision Detection", options: {} },
  ], { x: 0.8, y: 3.5, w: 8.4, h: 1.6, fontSize: 10, fontFace: FONT, color: "A0AEC0", paraSpaceAfter: 3 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.545, w: 10, h: 0.08, fill: { color: C.accent } });
  addSlideNumber(s, 18);
}

// ════════════════════════════════════════════
// SLIDE 19 — Team
// ════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "小组成员分工", { size: 26 });
  addSlideNumber(s, 19);

  const tbl = [
    [
      { text: "成员", options: { bold: true, fill: { color: C.navy }, color: C.white } },
      { text: "分工内容", options: { bold: true, fill: { color: C.navy }, color: C.white } },
    ],
    ["曹涵兮", "四叉树算法原理、伪代码与复杂度分析"],
    ["徐子豪", "SAP算法原理、帧间一致性分析"],
    ["陈鼎亚", "GJK算法原理、Minkowski差与正确性证明"],
    ["刘昊", "工业界应用调研、引擎对比分析"],
    ["耿瑞林", "实例演示、拓展讨论与PPT整合"],
  ];
  s.addTable(tbl, { x: 1.5, y: 1.3, w: 7, h: 3.0, fontSize: 13, fontFace: FONT, color: C.text, border: { pt: 0.5, color: C.midBlue }, colW: [2, 5] });

  s.addText("谢谢大家！", { x: 0.5, y: 4.8, w: 9, h: 0.5, fontSize: 20, fontFace: FONT, color: C.navy, bold: true, align: "center" });
}

// ── Save ──
const outPath = path.join(__dirname, "碰撞检测汇报.pptx");
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("PPT generated: " + outPath);
}).catch(err => {
  console.error("Error:", err);
});
