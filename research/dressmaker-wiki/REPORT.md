# 竞品调研：dressmaker-wiki.wiki

调研日期 **2026-09-26** · 全部结论基于一手抓取（站点 HTML/JS chunk/sitemap/robots + Steam 官方 appdetails API + 域名 RDAP）
原始数据与脚本见本目录：`html/`（88 个英文页原件）、`analysis.json`、`inventory.md`、`crawl.mjs`、`analyze.mjs`、`facts.mjs`、`visible.mjs`、`locales.mjs`

---

## 0. 一句话结论

**一个 4 天前上线、用 Next.js 批量产出 352 个 URL（4 语言 × 88 页）、英文约 22.5 万词的 AI 内容农场型竞品。**
它的强项是**覆盖面、内链网、模板化速度**；弱项是**数据真实性、页面重量、内容同质化、更新承诺不兑现**。
对我们的直接含义：**它有广度没有可信度，我们的 `docs/dressmaker-facts.md` 式的"可核实"路线正好打它的软肋，但覆盖面差距很大（11 页 vs 88 页）。**

| | 我们 dressmakerguide.com | 竞品 dressmaker-wiki.wiki |
|---|---|---|
| 域名注册日（RDAP） | 2026-09-21 | **2026-09-22**（比我们晚 1 天） |
| 可索引页面 | 11（sitemap）+ 4 个合规页 | **352**（en/de/ja/pt × 88） |
| 英文正文词量 | 16 个 HTML 文件，指南页 1,200–1,800 词/页 | **225,334 词**，中位 2,691 词/页 |
| 首页 HTML | **32.7 KB** | **537 KB**（16 倍） |
| 文章页 HTML | 24–29 KB | 中位 **309 KB** |
| 技术栈 | 自研构建脚本，纯静态 HTML，零运行时、零 JS | Next.js App Router SSG + React 水合，12+ 个 JS chunk |
| 结构化数据 | VideoGame / FAQPage / BreadcrumbList | Organization / WebSite / Article / BreadcrumbList / ItemList **（无 FAQPage、无 VideoGame）** |
| 广告 | AdSense（待批） | **Adsterra** 6 个自建 iframe 位 + ProfitableRateCPM native 位 |
| 多语言 | 无 | en / de / ja / pt（**没有中文**） |
| 内容更新 | `lastUpdated` 数据驱动 | sitemap 全部 lastmod = 2026-09-22，**之后 4 天零更新** |

---

## 1. 站点身份与生命周期

- **域名**：`dressmaker-wiki.wiki`，2026-09-22T05:13Z 通过 **Spaceship, Inc.** 注册，2027-09-22 到期，注册人地区 US/Delaware，未开启 DNSSEC。**域名年龄 = 4 天。**
- **托管**：Cloudflare（`server: cloudflare`，`CF-Cache-Status: HIT`）。
- **sitemap 352 条 URL 的 `<lastmod>` 全部是 2026-09-22** —— 即 88 页 × 4 语言在一天内一次性批量发布，此后没有任何页面被更新过。
- 页面上每篇都印着 `Updated : 9/22/2026`，是静态字符串，不是真实修订时间。
- 结论：**"每日更新"的 `changefreq: daily` 是假的**，实际是"一次性生成、不维护"。

---

## 2. 技术架构（网页结构的第一层）

### 2.1 框架与渲染

- **Next.js App Router**，动态段 `app/[locale]/[[...slug]]/page.tsx`：从 chunk 名可见
  `app/%5Blocale%5D/page-*.js`、`app/%5Blocale%5D/layout-*.js`、`app/%5Blocale%5D/%5B...slug%5D/page-*.js`，以及 10 个栏目各自的 `app/%5Blocale%5D/<category>/page-*.js`。
- **SSG**：正文完整出现在首屏 HTML 里（我们的解析能拿到 2,000+ 词正文），说明不是 CSR。这点做对了。
- 样式：**Tailwind 原子类**直写在 `class` 上（`text-3xl md:text-4xl font-bold font-[var(--font-heading)]`），配色走 CSS 变量 + 明暗双主题（`localStorage.theme` 在 `<head>` 里同步执行，避免闪烁）。
- 字体：`next/font` 自托管，2 个 woff2 `preload`。

### 2.2 页面重量（可测量的弱点）

| 页面 | HTML 体积 |
|---|---|
| 首页 | **536,602 B** |
| 最大的文章页 | 332,531 B |
| 文章页中位 | **308,843 B** |
| 最小（terms-of-service） | 247,468 B |

原因：Next.js 把整个 **RSC payload**（含完整 i18n 文案包）序列化后内联进每个页面。副作用是**每个页面都重复携带全站字典**——我在每页的 HTML 里都能搜到 `about`、`sidebar`、`latest_updates` 等全部界面字符串，甚至首页统计数据 `96%`、`450+ Reviews` 也出现在全部 88 个页面里。

对照：**我们首页 32.7 KB，文章页 24–29 KB。轻 9–16 倍。** 这是我们在 Core Web Vitals 和 AdSense 审核上的结构性优势，不要在重构中丢掉。

### 2.3 分析/第三方脚本（4 套并存）

| 用途 | 实现 |
|---|---|
| GA4 | `googletagmanager.com/gtag/js?id=G-2BFF6NC11H`（`strategy="lazyOnload"`） |
| 隐私友好分析 | **Plausible**（88/88 页） |
| CDN 分析 | `static.cloudflareinsights.com/beacon.min.js` |
| 会话录制 | **Microsoft Clarity**（1 页检出） |
| DNS 预连接 | fonts.googleapis / fonts.gstatic / **pagead2.googlesyndication** / **pl31454149.profitableratecpmnetwork.com** |

四套分析工具对一个 4 天大的站是明显过度配置（多半是模板市场里"什么都要"的默认套餐）。

---

## 3. 信息架构与 URL 结构

### 3.1 布局模式

```
/{locale}/                      首页（默认 locale 也有 /en/ 前缀版本）
/{locale}/{category}/           栏目 hub
/{locale}/{category}/{slug}/    文章
/{locale}/about|sitemap|privacy-policy|terms-of-service/
```

- 语言：`en`（无前缀根，canonical 到 `/`，仍有 `/en/` 副本）、`de`、`ja`、`pt`。hreflang 5 条（含 x-default）**配置正确**，各自 canonical 指向自身。
- slug 命名一律 **`dressmaker-<关键词>`**：关键词前置、全小写连字符、目录层语义清晰（`/en/fabrics/dressmaker-all-fabrics/`）。对英文长尾词覆盖非常刻意。

### 3.2 内容规模（英文 88 页 = 10 hub + 73 文章 + 5 站务）

| 栏目 | 文章数 | 词量 | 均页词量 |
|---|---|---|---|
| guides | **10** | 26,095 | 2,610 |
| fabrics | 7 | 19,797 | 2,828 |
| patterns | 7 | 21,982 | 3,140 |
| commissions | 7 | 20,930 | 2,990 |
| decorations | 7 | 18,990 | 2,713 |
| characters | 7 | 20,017 | 2,860 |
| achievements | 7 | 17,408 | 2,487 |
| shop | 7 | 20,251 | 2,893 |
| updates | 7 | 16,592 | 2,370 |
| platforms | 7 | 17,958 | 2,565 |
| 首页 | 1 | 3,813 | — |
| **合计** | **88** | **225,334** | 2,561 |

**73 篇文章全部 ≥ 2,000 词**（区间 2,035–3,892）。没有一篇低于 2,000 词——这是"最低字数配额"的产物，不是自然写作分布。
完整清单见 `inventory.md`。

### 3.3 导航与内链结构

- **顶部导航**：10 个栏目各一个下拉；每个下拉只列 **前 8 篇**子文 + 一条 "All X →"。移动端汉堡菜单同构。
- **左侧栏**（xl 以上）：「Wiki Navigation」列出全部 10 栏目 + 子项 + 「Active Codes」组件（显示 "None — No active codes yet. Check back soon!"）。`Active Codes` 出现在 **88/88 页**——这是典型的"兑换码"SEO 钩子，但内容永远是空的。
- **固定广告轨**：`aside.fixed.left-0.top-16.bottom-0` 与 `.fixed.top-16.left-0.right-0` —— 左右两条贴边广告位（宽屏时出现）。
- **面包屑** + `BreadcrumbList` JSON-LD（正确）。
- **内链密度**：每页 20–31 个唯一内链（中位 28），来自「wiki 侧栏 + 下拉 + 正文关键词 + Explore More + 页脚」。**内链网比我们密得多**，这是它排名的真实助力。
- 栏目 hub 完整链接全部 7 个子文（已逐一验证）。
- 另有 **HTML sitemap 页** `/en/sitemap/`（641 词，按栏目列全站链接）。

---

## 4. 页面模板（它真正的"产品"）

### 4.1 文章页

```
breadcrumb (Home > Category > Title)
├─ 徽章行：栏目名 + 难度（beginner / intermediate）+ "Updated : 9/22/2026"
├─ H1（= 完整长尾标题，如 "Dressmaker Achievement List With Descriptions and Hints"）
├─ 摘要段（60–80 词，全站统一句式，同时是 meta description 的扩写）
├─ 16:9 媒体位：<div id="yt-article-…">（YouTube 懒加载）+ <noscript><img …></noscript> 兜底
└─ <article class="mdx-content">
     H2 / H3（5–12 个）+ 表格（.mdx-table-wrap）+ 卡片网格
     尾部固定五段：FAQ → Quick Tips → Articles → Explore More
```

**证据**：这五段的文案键硬编码在 i18n 包里——`common_overview`、`common_coreMechanics`、`common_advantages`、`common_challenges`、`common_faq`、`common_quickTips`、`common_articles`。
**即：73 篇文章共用同一套骨架**，每页的 H2 组合都是 "…介绍 / 核心机制 / 优势 / 挑战 / FAQ / 快速提示 / 相关文章 / 延伸阅读"。

媒体策略值得一提：**图片文件名就是 YouTube 视频 ID**（`/images/achievements/ZH3apaOf-pI.webp`、`/images/fabrics/ItxT6Bagph0.webp`…），即它把官方预告片/实机视频的封面抽成 WebP 当配图，同时用 \`<noscript>\` 图片兜底 SEO。全站 274 张图，**没有一页是 0 图**，每页都有 `alt`。

### 4.2 栏目 hub

`Hero + 3 个统计卡片 → On This Page 目录 → Introduction → 汇总表格 → 卡片网格（每张卡带 S/A/B 评级 + Covers + Roadmap note）→ FAQ → Quick Tips → Articles → Explore More`
其中 "S / A / B / C" 评级、`featured` / `active` / `rare` / `top` 标签是自造的编辑分级。

### 4.3 结构化数据（明确的短板）

| 页面类型 | JSON-LD |
|---|---|
| 73 篇文章 | Organization + WebSite + **Article** + BreadcrumbList |
| 10 个 hub | Organization + WebSite + **ItemList** |
| 5 个站务页 | Organization + WebSite |

问题：
1. **没有 `VideoGame` schema** —— 一个游戏攻略站漏掉最相关的类型。
2. **没有 `FAQPage`** —— 每页都有 FAQ 板块，却完全没标记。
3. **没有 `HowTo`** —— 73 篇都是步骤型攻略。
4. `Article.author` 是 `Organization: "Dressmaker Wiki"`，**没有具名作者**；`about` 页说"built by the community"却没有任何编辑者身份。E-E-A-T 全空。
5. `Article.url` 无尾斜杠，canonical 有尾斜杠（小不一致）。
6. `datePublished` = `dateModified` = 2026-09-22（全站同一天）。

### 4.4 On-page SEO 体检

| 项 | 结果 |
|---|---|
| `<h1>` 数量 | 88/88 恰好 1 个 ✅ |
| `robots` | 全部 `index, follow` ✅ |
| canonical | 88/88 正确自指 ✅ |
| hreflang | 5 条（en/de/ja/pt/x-default）✅ |
| og:image | 88/88，1200×630 ✅ |
| **title 长度** | **73/88 超过 60 字符**（最长 87），统一后缀 ` | Dressmaker Wiki` 撑爆了 SERP 截断线 ⚠️ |
| meta description | 中位 153 字符，最长 170（略超 155）⚠️ |
| 6 个描述里有 HTML 实体未解码（`&#x27;`）⚠️ |
| 图片 alt | 全站齐备 ✅ |
| 首页 `Latest Updates` 列表 | **同一批 5 条内容在首屏重复渲染了两遍**（一次带 NEW 徽章、一次不带）——模板 bug 🐞 |

---

## 5. 内容质量：它最大的裂缝

### 5.1 已核实为真的部分（不能冤枉它）

我用 Steam 官方 `appdetails` API 逐条核对：

- **32 个成就总数** → 真实（`achievements.total = 32`）。
- **它列出的 10 个成就名全部真实**：`Good Girl Gone Vlad`、`Swan Song`、`Go Off, Queen!`、`Caw Evermore`、`Prudence and Prejudice`、`Snitches Get Stitches`、`A Rose By Any Other Name`、`Drawn to Hue`、`G.O.A.T.`、`Reap what You Sew` —— 恰好等于 API 里 `achievements.highlighted` 的 10 条。
- "官方语言只有英/简中/日、三语全语音" → 真实。
- "150+ 布料部件 / 450+ 面料 / 350+ 配饰 / 35 小时剧情委托" → 与官方 devlog 一致。
- "Windows & macOS"、"Cozy Lives 开发 / Free Lives 发行" → 真实。

**它做对的一件事**：抓取了 Steam store API 的公开字段，所以核心名词不会错到离谱。

### 5.2 编造与自相矛盾的部分（攻击面）

1. **成就分组是编的。** 它把 32 个成就切成"剧情 8 / 委托 10 / 商店 7 / 隐藏 7"。Steam 从未公布分组，它也没给来源。同一页里 **`Swan Song` 同时被列为"第 1 章章末"和"第 8 章结局（finale）"**，一张表内自我矛盾。
2. **算术不成立。** 原文："覆盖了商店数据里约 88% 的成就；剩余的一打是隐藏成就"。88% × 32 = 28，28 + 12 = 40 ≠ 32。
3. **具体阈值是编的。** "10 单 / 50 单 / 150 单 / 300 单"、"每档 +5/+10/+15/+25 声望"、"低于 1.4% 解锁率"、"匹配同一面料三次"——全部无一手来源。
4. **角色名疑似虚构。** `Madame Lacroix`、`Lord Threadbare` 只在该页出现一次，站内其他 87 页都不认这两个名字（`Edith`、`Pigeon Witch` 则出现在 14–21 页，是有真实来源的）。这种"孤例名词"是生成时幻觉的典型指纹。
5. **首页统计已过期，且与自家页面打架。** 首页（88 页内联）硬编码 **"96% Very Positive · 450+ Reviews"**；而 Steam 现在（2026-09-26）是 **Overwhelmingly Positive，2,367 条评测**（`recommendations.total = 3,179`）。它自己的 `/updates/dressmaker-review-roundups` 页也写着 "Overwhelmingly Positive"。**同一站点两个说法。**
6. **`/updates/dressmaker-russian-localization` 建立在未证实前提上**：声称"已有两个俄语粉丝汉化项目在 Steam 上线"、"Steam 指南区当时只有 3 篇指南"。Riot 无法验证，且这两个数字对一个 4 天新游戏来说高度可疑。
7. **免责式灌水。** 拿不到数据时的固定话术：
   > "exact numeric requirements are not published here so you can plan without spoilers or wrong guesses"

   这类段落占了很多页面的相当篇幅——**字数达标，信息增量为零**。
8. **5 个"栏目页"其实是文章**：`/updates/dressmaker-paralives-bundle` 标题里直接写 "Price Drop & Cozy Sale Deals"，用促销词做 slug，是典型流量导向而非知识导向。

### 5.3 同质化量化

- 88 页全部同一模板、同一"介绍/机制/优势/挑战/FAQ/提示"骨架。
- 73 篇全部 ≥ 2,000 词，字数分布极窄（p25 2,249 / 中位 2,691 / p75 2,919）。
- 栏目内部主题高度重叠，**存在明显的自我蚕食（cannibalization）**：
  `dressmaker-achievements-list` / `dressmaker-achievement-list-with-descriptions` / `dressmaker-achievement-roadmap` / `dressmaker-achievement-percentage` —— 四个近义 slug 抢同一个查询；fabrics 下 7 篇里有 4 篇在讲"哪种面料好"。

---

## 6. 变现方式（全部来自 JS chunk 逆向）

广告系统实现在布局 chunk `app/[locale]/layout-*.js` 的 module 1681：

```js
// 六个自建 iframe 广告位
{ "banner-468x60":  { width:468, height:60,  src:"/ads/banner-468x60.html"  },
  "banner-300x250": { width:300, height:250, src:"/ads/banner-300x250.html" },
  "banner-160x300": { ... }, "banner-160x600": { ... },
  "banner-320x50":  { ... }, "banner-728x90":  { ... },
  // 外加一个 native 位
  "native-banner": { containerId:"container-aa7035072d7390b97c19df9f7ff95a0b",
                     scriptUrl:"//pl31454149.profitableratecpmnetwork.com/aa7035072d7390b97c19df9f7ff95a0b/invoke.js" } }
```

我直接把 6 个 `/ads/*.html` 拉了下来，**实际投放网络是 Adsterra**：

```html
<script>atOptions = { 'key':'e586723d2fdf594d4d6ba109ad7b9b40', 'format':'iframe', 'height':250, 'width':300, 'params':{} };</script>
<script src="//www.highperformanceformat.com/e586723d2fdf594d4d6ba109ad7b9b40/invoke.js" async></script>
```

（`highperformanceformat.com` 是 Adsterra 的投放域名；6 个位各自一个 key。）

关键工程细节：
- 广告在 `requestAnimationFrame` 之后才注入 DOM → **首屏 HTML 里没有任何广告代码**，对不执行 JS 的抓取器完全隐身。
- iframe 内和主页面里都主动改写 `window.top / window.parent / window.frameElement` 为自身 —— **这是用来绕过广告网络 frame-busting 检测的**。
- `<head>` 里只有 `dns-prefetch pagead2.googlesyndication`，全站 **0 处 `adsbygoogle`** —— 所以主变现**不是 AdSense**，AdSense 只是预连接（可能在申请中，或打算后期加）。
- 广告位密度：正文内 banner + **左右两条 fixed 贴边广告轨**（xl 断点以上）。桌面端一屏内可同时出现 3–4 个广告位。
- 与广告无关的外链只有 5 个域：Steam 商店、Steam 社区、Discord、YouTube、freelives.net。**没有联盟营销**（无 Amazon 等），靠纯展示广告。

对我们：它走的是**低门槛高密度网盟**路线（Adsterra/native CPM，单价低、创意质量不可控、政策风险高、用户体验差）。我们走 AdSense + 干净排版，**长期 CPM 和审核通过率都更有利**，而且"页面不塞广告"本身就是可宣传的差异点。

---

## 7. 多语言策略

- en/de/ja/pt **四语全量翻译**（`/de/fabrics/` 1,972 词、`/pt/fabrics/` 2,380 词，正文完整、H2 结构一致），不是占位机翻。
- hreflang / canonical / x-default 实现正确 —— 这部分技术水准是合格的。
- **但它没有中文版。** 游戏的官方首发语言是 **英语 / 简体中文 / 日语**（已核实）。它做了日语、德语、葡萄牙语，**却漏掉了官方语种里中文这个最大增量市场**。
- 翻译页字数普遍低于英文（`/de/fabrics/` 1,972 vs `/en/fabrics/` 2,035），且只有一级栏目名被本地化，文章标题仍是英文风。

---

## 8. 结论与可执行建议

### 8.1 它的强项（我们要学）

| # | 强项 | 具体做法 | 我们的动作 |
|---|---|---|---|
| 1 | **主题集群完整** | 10 个栏目 × 7–10 篇，hub↔文章的树状结构，无孤儿页 | 按同样 10 个栏目补齐，优先 `achievements` / `fabrics` / `patterns`（搜索意图最强、我们目前只有 `/sewing-tips`、`/customers` 泛指） |
| 2 | **内链密度高** | 每页 20–31 个唯一内链，中位 28；侧栏 + 下拉 + 正文 + Explore More + 页脚 | 我们现在每页内链远低于此；给每篇加"同栏目其余 6 篇 + 跨栏目 3 篇"的强制定向链接块 |
| 3 | **slug 命名规范** | `dressmaker-<keyword>` 前缀式长尾 | 新增页沿用（我们已有 `/how-to-play` 这类短 slug，可保留，但新页用关键词前置） |
| 4 | **图片策略** | 官方 YouTube 封面转 WebP，每页必有图，alt 齐备 | 我们已有 `docs/image-placement-brief.md`，继续保持 |
| 5 | **多语言** | 4 语全量 + hreflang 正确 | 先做**简中**（官方语种、竞品空缺），再考虑日文 |

### 8.2 它的弱点（我们要打）

| # | 弱点 | 证据 | 我们的打法 |
|---|---|---|---|
| 1 | **数据编造** | "300 单阈值"、成就分组、`Madame Lacroix`/`Lord Threadbare`、"低于 1.4% 解锁率"，全无一手来源 | 把 `docs/dressmaker-facts.md` 的"已核实/未核实"制度**搬到线上**：每篇标注"核实来源 + 核实日期"，凡是没来源的直接写"官方未公布"。这是我们唯一能建立护城河的地方 |
| 2 | **页面重量** | 首页 537 KB、文章中位 309 KB、12+ JS chunk、4 套分析 | 我们 32.7 KB + 零 JS。**坚持不动摇**，并在 `/about` 或 README 里明确"纯静态、无框架、无追踪"作为卖点 |
| 3 | **更新承诺造假** | 352 条 URL lastmod 全为 2026-09-22，4 天零更新；页面 `Updated` 是静态串 | 建立真实更新节奏（至少 patch notes / achievements / known bugs 三块跟 Steam 新闻同步），并用真实的 `dateModified` |
| 4 | **统计会过期** | 首页硬编码 "450+ Reviews / 96% Very Positive"，实际已 2,367 条、Overwhelmingly Positive；且与自家 roundups 页矛盾 | 数字要么标注"截至 <日期> 快照"，要么每次发版时人工更新并写进 CHANGELOG |
| 5 | **结构化数据缺失** | 无 `FAQPage`、无 `VideoGame`、无 `HowTo`、作者是 Organization | 我们已有 FAQPage/VideoGame/BreadcrumbList，继续扩大 FAQ 覆盖页数；补 `HowTo` 到 /how-to-play、/sewing-tips |
| 6 | **标题超长** | 73/88 页 title > 60 字符（最长 87），统一后缀撑爆 | 保持我们"title ≤ 60 且唯一"的 audit 规则 |
| 7 | **自我蚕食** | achievements 下 4 个近义 slug 抢同一查询 | 一页一意图；我们做 `/achievements` 单页 + 锚点，而不是拆 4 篇 |
| 8 | **EF-EF-A-T 为空** | `about` 页 337 词，无具名作者，无编辑政策 | 我们的 `/about` 写清楚"谁维护、核对了哪些来源、错了怎么改"，并把 `docs/dressmaker-facts.md` 的核实日期公开 |
| 9 | **低质广告网盟** | 6 个 Adsterra iframe 位 + native CPM 位，左右贴边广告轨，改写 window.top 绕过 frame-busting | 我们 AdSense + 有限的 4 个位 + 全部标 "Advertisement"，页面干净度是对比优势 |
| 10 | **模板 bug** | 首页 Latest Updates 列表在首屏重复渲染两遍 | 我们的 audit 脚本可以加"同一页内重复内容块"检测 |

### 8.3 时间窗判断

它域名 4 天、零外链、无品牌搜索，**排名尚未稳固**；内容虽然铺得快，但：
- 大量页面是"官方未公布 + 免责话术"，**在 Google 的 helpful content 与 AI 内容政策下是暴露面**；
- 首页数据 5 天就过期、全站 4 天零更新，与 sitemap 里 `changefreq: daily` 自相矛盾；
- `Adsterra` + 自建 iframe + 改写 `window.top` 的组合，在 AdSense 审核和广告质量政策上都是减分项。

**建议优先级**：
1. **立刻**：把 `/achievements`（32 个成就，用 Steam API 的 `highlighted` + 全量 schema 做真数据）和 `/fabrics`（面料对比表）建起来——这两块是它流量最重、我们完全空缺的位置。
2. **短期**：按 10 栏目补到 30–40 页，每页强制"同栏目其余页 + 跨栏目 3 页"内链块。
3. **中期**：上线**简体中文版**（官方语种、竞品空缺、hreflang 我们已有能力做对）。
4. **持续**：把"可核实 / 标注来源与日期 / 零 JS 零追踪 / 不塞低质广告"做成品牌资产。

---

## 附：证据文件索引

| 文件 | 内容 |
|---|---|
| `html/*.html` | 88 个英文页原始 HTML |
| `analysis.json` | 每页 title/description/canonical/hreflang/schema/H 标签/词数/图数/内链数 |
| `inventory.md` | 88 页清单（slug、类型、标题、词数、H2/H3 数、图数、内链数、schema） |
| `sitemap.xml` / `all_urls.txt` | 352 条 URL（含 lastmod） |
| `js/*.js` | 逆向出的布局 chunk（广告系统在此） |
| `ads/*.html` | 6 个自建广告位原件（Adsterra key） |
| `t_de_fabrics_.html` 等 | 德/日/葡语页面样本 |
| `crawl.mjs` `analyze.mjs` `inventory.mjs` `facts.mjs` `visible.mjs` `locales.mjs` `dump.mjs` `final.mjs` | 全部可复跑的采集与分析脚本 |
