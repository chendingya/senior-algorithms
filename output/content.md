# 游戏中的碰撞检测算法
从四叉树到GJK——碰撞检测流水线的核心算法

## 元信息
- 受众：研究生（高级算法课程）
- 语言：中文
- 预估页数：21页

## 封面
- title: 游戏中的碰撞检测算法
- subtitle: 从四叉树到GJK
- description: 高级算法 课堂汇报
- footer: 汇报人：曹涵兮 徐子豪 陈鼎亚 刘昊 耿瑞林 | 2026年3月

## 目录
- title: 汇报内容
- intro: 沿着「先粗筛、再精算」的工程思路，讲解碰撞检测流水线中的核心算法
- chapters: [引言与问题定义, 四叉树算法, Sweep and Prune算法, GJK算法, 工业界应用与总结]

## 正文

### 章节 1 - 引言与问题定义
- chapterNumber: 01
- title: 引言与问题定义
- subtitle: Introduction & Problem Definition
- statement: 碰撞检测的核心挑战：不是「两个物体能不能比」，而是「谁值得进入下一轮」

#### 页1：引言 - content-one-columns
- title: 碰撞检测问题从何而来
- subtitle: Why Collision Detection Matters
- block1Heading: 问题背景
- block1Copy: 玩家在游戏中看到的是穿模、卡墙这些体验问题，但开发者背后面对的，是碰撞检测这个算法问题。假设场景里有一万个对象，暴力两两检测的复杂度是O(N²)，每帧需要执行约五千万次比较——这在实时渲染中是完全不可接受的。
- block2Heading: 核心挑战
- block2Copy: 真正困难的不是「两个物体能不能碰」，而是「在一万个对象中，哪些对值得做精确判断」。这就是碰撞检测流水线要解决的核心问题——先粗筛缩小范围，再精算得出结论。游戏算法千千万，碰撞检测很难办。

#### 页2：形式化定义 - content-one-columns
- title: 碰撞检测问题的形式化定义
- subtitle: Formal Definition
- block1Heading: 输入与输出
- block1Copy: 输入：场景中N个物体{O₁, O₂, ..., Oₙ}，每个物体有几何形状和位置信息。输出：所有发生碰撞的物体对集合{(Oᵢ, Oⱼ) | Oᵢ ∩ Oⱼ ≠ ∅}。工程上不会直接对所有对做精确检测。
- block2Heading: 分层流水线架构
- block2Copy: 分两个阶段：粗筛阶段(Broad Phase)用轻量级近似方法快速排除不可能碰撞的对，输出候选集合；精算阶段(Narrow Phase)只对候选对做精确几何判定。四叉树和SAP属于粗筛阶段，GJK属于精算阶段。这种分层设计是现代游戏引擎的通用架构。

### 章节 2 - 四叉树算法
- chapterNumber: 02
- title: 四叉树算法
- subtitle: Quadtree
- statement: 分治空间，化整为零——让每个对象只和局部邻居打交道

#### 页3：四叉树设计思想 - content-three-columns
- title: 四叉树——设计思想
- subtitle: Design Philosophy
- block1Image: lucide:git-branch
- block1Heading: 分治策略
- block1Copy: 四叉树的设计思想是「分治」——把二维地图递归划分为四个象限，区域内对象超阈值时继续分裂。直觉是：稀疏区域的对象不必和其他区域比较。
- block2Image: lucide:map
- block2Heading: 空间分区
- block2Copy: 类似「把地图分区管理」——每个管理员只负责自己地盘。查询时只在目标叶节点及相邻区域搜索，大幅缩小范围。对象少的区域不浪费计算，对象密的区域自动细分。
- block3Image: lucide:target
- block3Heading: 适用场景
- block3Copy: 四叉树非常适合二维稀疏场景。核心动作是递归分裂空间，设计策略是分治。不适用场景：高动态、对象密集的情况。

#### 页4：四叉树伪代码与复杂度 - content-three-columns
- title: 四叉树——算法流程与复杂度
- subtitle: Pseudocode & Complexity
- block1Image: lucide:code
- block1Heading: 插入操作
- block1Copy: 插入时，对象数未超限就直接存入节点；超限则分裂为4个子节点，递归插入到包含该对象的子节点中。这是四叉树构建的核心操作。
- block2Image: lucide:search
- block2Heading: 范围查询
- block2Copy: 查询时，节点与范围不相交则直接剪枝；否则搜索当前节点对象和子节点。平均情况下，单次查询O(log n)，保证不遗漏任何可能碰撞的对象。
- block3Image: lucide:bar-chart-3
- block3Heading: 复杂度分析
- block3Copy: 平均情况：构建O(n log n)，单次查询O(log n)，全场景检测O(n log n)。最坏情况——所有对象集中在同一区域——树会退化，退回到O(n²)。所以四叉树的效果高度依赖空间分布是否均匀。

#### 页5：四叉树正确性与取舍 - comparison
- title: 四叉树——正确性与优劣取舍
- subtitle: Correctness & Trade-offs
- leftLabel: 优势
- leftItem1: 结构直观，适合二维空间查询
- leftItem2: 稀疏场景下显著减少比较次数
- leftItem3: 实现简单，易于理解
- leftItem4: 空间完备性保证查询正确
- rightLabel: 劣势
- rightItem1: 对象频繁移动时，树需要反复删除/插入/分裂
- rightItem2: 极端分布下树深膨胀，维护成本吞掉收益
- rightItem3: 仅适用于2D（3D需要八叉树，结构更复杂）
- rightItem4: 阈值MAX_CAPACITY的选取影响性能

### 章节 3 - Sweep and Prune算法
- chapterNumber: 03
- title: Sweep and Prune算法
- subtitle: Sweep and Prune
- statement: 降维打击，排序复用——帧与帧之间，对象位置变化很小

#### 页6：SAP设计思想 - content-three-columns
- title: SAP——设计思想
- subtitle: Design Philosophy
- block1Image: lucide:arrow-down
- block1Heading: 降维策略
- block1Copy: SAP的设计思想是「降维」——把二维碰撞简化为一维区间重叠问题。将物体包围盒投影到坐标轴，排序后扫描找重叠。这个算法最早出自Baraff 1992年博士论文。
- block2Image: lucide:clock
- block2Heading: 时间局部性
- block2Copy: 关键洞察：帧与帧之间，对象位置变化很小→排序顺序几乎不变→插入排序接近O(n)。这就是时间局部性(Temporal Coherence)，由Cohen等人1995年I-COLLIDE系统化。
- block3Image: lucide:scissors
- block3Heading: 不等式传递性
- block3Copy: 若已知A.right ≤ B.left且B.right ≤ C.left，由传递性：A.right ≤ C.left，无需检测A与C，直接跳过！排序让这个剪枝可以大规模生效。

#### 页7：SAP伪代码与复杂度 - content-three-columns
- title: SAP——算法流程与复杂度
- subtitle: Pseudocode & Complexity
- block1Image: lucide:arrow-up-az
- block1Heading: 排序阶段
- block1Copy: 首次帧用快速排序O(n log n)，后续帧序列几乎有序，改用插入排序接近O(n)。这是SAP高效的关键——利用帧间连续性避免重复排序。
- block2Image: lucide:scan
- block2Heading: 扫描阶段
- block2Copy: 从左到右遍历，利用不等式传递性提前break终止内层循环。X轴重叠后还需检查Y轴（和Z轴），复杂度O(n+m)，m为实际重叠数。
- block3Image: lucide:activity
- block3Heading: Output-Sensitive
- block3Copy: 复杂度与输出规模挂钩（output-sensitive），碰撞对越少越接近O(n)。最坏情况（对象剧烈穿插完全乱序）退化为O(n²)。关键：m远小于n²。

#### 页8：SAP正确性与适用讨论 - comparison
- title: SAP——正确性分析与适用边界
- subtitle: Correctness & Applicability
- leftLabel: 适合SAP
- leftItem1: 对象数量大但碰撞对少
- leftItem2: 帧间运动幅度小（时间局部性好）
- leftItem3: 对象尺寸相近
- leftItem4: 大部分对象相安无事
- rightLabel: 不适合SAP
- rightItem1: 对象密集且大量重叠（p≈n²）
- rightItem2: 对象瞬间大幅位移（如传送）
- rightItem3: 对象尺寸差异极大（大区间吞没小区间）
- rightItem4: SAP的威力在于「变化少」；变化越大，越接近暴力法

### 章节 4 - GJK算法
- chapterNumber: 04
- title: GJK算法
- subtitle: Gilbert-Johnson-Keerthi
- statement: 两体相交，以差判之，决于原点

#### 页9：GJK设计思想 - content-three-columns
- title: GJK——设计思想（Minkowski差）
- subtitle: Design Philosophy
- block1Image: lucide:circle-minus
- block1Heading: Minkowski差
- block1Copy: GJK的核心数学基础是Minkowski差：A⊖B = {a-b | a∈A, b∈B}。如果A和B有公共点p，则p-p=0，原点一定在Minkowski差中。
- block2Image: lucide:crosshair
- block2Heading: 等价转化
- block2Copy: 判断A和B是否相交⟺判断Minkowski差是否包含原点。核心转化：把「两个物体是否相交」转化为「一个形状是否包含原点」。
- block3Image: lucide:zap
- block3Heading: 迭代逼近
- block3Copy: GJK不显式构造完整的Minkowski差——那太昂贵——而是通过迭代逼近在Minkowski差的边界上找关键点（支持点）。每次只需对两个凸体各做一次极值查询。

#### 页10：GJK算法流程 - content-three-columns
- title: GJK——取支、立形、决原
- subtitle: Algorithm Flow
- block1Image: lucide:circle
- block1Heading: 支持点
- block1Copy: Support(A,B,d) = A上沿d最远的点 − B上沿−d最远的点。GJK的每一步只做一件事：沿当前搜索方向，在Minkowski差上找一个支持点。
- block2Image: lucide:triangle
- block2Heading: 单纯形
- block2Copy: 2D场景单纯形依次是点、线段、三角形。三角形包围原点即判定相交。算法不断更新单纯形，尝试包围原点。
- block3Image: lucide:repeat
- block3Heading: 迭代过程
- block3Copy: 如果支持点没有越过原点，说明Minkowski差不含原点，直接判定不相交。越过了就加入单纯形，检查是否包围原点。2D最多3次迭代。

#### 页11：GJK复杂度分析 - data-highlight
- title: GJK——复杂度分析
- subtitle: Complexity Analysis
- data1Num: O(1)
- data1Desc: 迭代次数有常数上界：2D≤3次，3D≤4次。单纯形最多3个点（三角形）或4个点（四面体）
- data2Num: O(n) / O(log n)
- data2Desc: 单次判定代价取决于Support函数实现。朴素实现需遍历所有顶点O(n)，预处理可降到O(log n)
- data3Num: ≈O(1)
- data3Desc: 增量模式：物理引擎用上一帧单纯形作初始猜测，帧间变化小时通常1-2次迭代就收敛
- slogan: 空间复杂度恒为O(1)——仅存储当前单纯形，最多4个点。正是这种稳定性和小开销使GJK成为实时碰撞检测的首选

#### 页12：GJK正确性说明 - content-three-columns
- title: GJK——为什么这个算法是正确的？
- subtitle: Correctness
- block1Image: lucide:equal
- block1Heading: 等价转化
- block1Copy: A∩B≠∅ ⟺ 原点∈A⊖B。这个数学等价关系保证了判定的完备性——如果相交，一定能找到原点。
- block2Image: lucide:trending-down
- block2Heading: 收敛性
- block2Copy: Support函数保证每次取的点在Minkowski差的边界上。Johnson距离子算法计算单纯形中距原点最近的点，保证距离单调不增，有限维空间中必然收敛。
- block3Image: lucide:circle-check
- block3Heading: 判定完备
- block3Copy: 返回true时单纯形确实包围了原点；返回false时新支持点证明整个Minkowski差都在原点的某一侧，不可能包含原点。整个过程无需穷举所有顶点。

#### 页13：GJK实例演示 - timeline
- title: GJK实例演示——两个2D正方形
- subtitle: Walkthrough Example
- step1Number: "01"
- step1Heading: 初始方向
- step1Copy: 正方形A中心在原点，B中心在(1.5,0)，X方向重叠0.5。取方向d=(1,0)，Support = (0.5,1)，方向改为指向原点。
- step2Number: "02"
- step2Heading: 第二次迭代
- step2Copy: 沿新方向取Support = (-3.5,-2)。两点线段不包围原点，计算新搜索方向朝向原点。
- step3Number: "03"
- step3Heading: 判定相交
- step3Copy: 取第三个点形成三角形，检查原点在三角形内部，判定相交。全过程只调用3次Support函数，没有遍历任何物体的全部顶点。

### 章节 5 - 工业界应用与总结
- chapterNumber: 05
- title: 工业界应用与总结
- subtitle: Industry Applications & Summary
- statement: 先粗筛缩小范围，再精算得出结论——这就是碰撞检测流水线的设计哲学

#### 页14：工业界组合使用 - content-four-columns
- title: 工业界怎么组合使用
- subtitle: Industry Combinations
- block1Image: lucide:box
- block1Heading: Unity (PhysX)
- block1Copy: 粗筛支持SAP/MBP/ABP三种模式。MBP适合静态多的场景，ABP自动选择最优策略。精算用GJK+SAT组合。
- block2Image: lucide:gamepad-2
- block2Heading: Unreal (Chaos)
- block2Copy: 多种空间加速结构，高度并行化面向大规模场景。精算用GJK+EPA组合，EPA计算穿透深度。
- block3Image: lucide:hexagon
- block3Heading: Box2D v3
- block3Copy: 动态AABB树，由Erin Catto精心设计，2D专精，开源。精算用GJK+EPA。四叉树更多用于逻辑层而非物理引擎核心。
- block4Image: lucide:cpu
- block4Heading: Jolt / Bullet
- block4Copy: Jolt被Godot 4内置为默认3D物理引擎，Bullet社区广泛使用。动态AABB树+GJK+EPA是标准组合。

#### 页15：三种算法综合对比 - comparison
- title: 总结对比——先快再准，先筛后算
- subtitle: Comprehensive Comparison
- leftLabel: 粗筛阶段
- leftItem1: 四叉树：分治，适合稀疏2D场景
- leftItem2: SAP：降维+时间局部性，高动态首选
- leftItem3: 四叉树平均O(n log n)，SAP后续帧O(n)
- leftItem4: 共同目标：快速排除大量不可能的对
- rightLabel: 精算阶段
- rightItem1: GJK：迭代逼近，凸体判定精确高效
- rightItem2: 迭代次数有常数上界（2D≤3次，3D≤4次）
- rightItem3: 增量模式接近O(1)，空间O(1)
- rightItem4: 只处理粗筛后的少量候选对

#### 页16：拓展讨论 - content-three-columns
- title: 拓展讨论——从GJK出发的延伸
- subtitle: Extensions & Discussions
- block1Image: lucide:expand
- block1Heading: EPA算法
- block1Copy: GJK只能判定「是否相交」，不能给出「穿透多深」。EPA在GJK判定相交后，利用最终单纯形扩展多面体，计算穿透方向和深度，用于物理响应。
- block2Image: lucide:move
- block2Heading: 连续碰撞检测
- block2Copy: 离散检测每个时间步检测一次，高速物体可能「穿墙」。CCD沿运动轨迹做扫掠体检测，t∈[0,1]连续求解。典型场景：子弹、高速赛车。
- block3Image: lucide:puzzle
- block3Heading: 非凸体处理
- block3Copy: GJK只适用于凸体，实际游戏模型多为凹形。解决方案：凸分解(Convex Decomposition)，如V-HACD等算法将凹网格分解为多个凸体，再分别用GJK检测。

#### 页17：总结 - quote
- quote: 碰撞检测的核心设计哲学：不是比谁算得准，而是比谁排除得快。先粗筛再精算，用最小代价得到正确答案。四叉树用分治做空间索引，SAP利用帧间连续性做区间扫描，GJK用迭代逼近做精确凸体判定。

#### 页18：小组分工 - content-one-columns
- title: 小组成员分工
- subtitle: Team分工
- block1Heading: 成员分工
- block1Copy: 曹涵兮：四叉树算法原理、伪代码与复杂度分析。徐子豪：SAP算法原理、帧间一致性分析。陈鼎亚：GJK算法原理、Minkowski差与正确性证明。
- block2Heading: 成员分工（续）
- block2Copy: 刘昊：工业界应用调研、引擎对比分析。耿瑞林：实例演示、拓展讨论与PPT整合。

## 致谢
- description: 感谢聆听 | 欢迎提问
