# dressmakerguide.com 优化计划

审计日期 **2026-09-26**。所有结论都有实测依据（线上响应头、dist 产物、Steam 官方 API、竞品对照见 `research/dressmaker-wiki/REPORT.md`）。

---

## 0. 先纠正一条：我们的广告和竞品是同一批

上一份竞品报告里我写了"我们走 AdSense、页面干净，竞品才用 Adsterra"——**这条是错的**，我核对了自己的 `src/data/site.mjs`：

```js
banners.wide.src  = 'https://www.highrevenueformat.com/3bfd5956.../invoke.js'   // Adsterra
banners.narrow.src= 'https://www.highrevenueformat.com/9f809a88.../invoke.js'   // Adsterra
inPagePush.src    = 'https://pl31505864.profitableratecpmnetwork.com/.../invoke.js'
adsenseClient     = 'ca-pub-9073496682747119'   // 只在 <head> 做验证，没有 AdSense 广告位
```

竞品用的是 `highperformanceformat.com` + `profitableratecpmnetwork.com`，**同一个 Adsterra 系**，只是子域不同。
所以"广告更干净"目前**不是**我们的差异点，而是一个需要拍板的风险项（见 P0-5）。

---

## 1. 现状体检（实测）

| 维度 | 我们的实测值 | 竞品 | 判断 |
|---|---|---|---|
| 页面数 | 16 HTML（11 在 sitemap） | 88 英文 + 264 翻译 = 352 | ❌ 差距 5.5× |
| 正文词量 | **17,064 词** | 225,334 词 | ❌ 差距 13× |
| 首页 HTML 传输 | 32,736 B raw / **9,039 B gzip** | 536,602 B | ✅ 大胜 |
| 文章页 | 24–29 KB | 中位 309 KB | ✅ 大胜 |
| 运行时 JS | 除广告外仅 1 段广告适配脚本 | 12+ chunk | ✅ 大胜 |
| **字体** | **236 KB（3 个可变字体）** | 2 个 woff2 | ❌ 全站最重的资源 |
| 图片 | 每张全尺寸 86–128 KB，且**与 -1100 版字节相同** | 全 WebP | ⚠️ 有冗余 |
| HTML 缓存 | `max-age=0, must-revalidate` + `cf-cache-status: DYNAMIC`，TTFB **0.93 s** | `CF-Cache-Status: HIT` | ⚠️ 静态站却没吃到边缘缓存 |
| 分析 | **`ga4Id: ''` —— 一个分析都没装** | GA4 + Plausible + Clarity + CF | ❌ 完全盲飞 |
| JSON-LD | BreadcrumbList 全站；Article 仅 2 页；VideoGame 2 页；FAQPage 5 页；HowTo 1 页 | 全站 Article + ItemList | ⚠️ 覆盖不齐 |
| 正文内链 | 每页 3–9 条（另有 23–24 条模板链接） | 每页 20–31 条 | ⚠️ 编辑型内链偏少 |
| 多语言 | 无 | en/de/ja/pt（**无中文**） | ❌ 空缺即机会 |
| 404 页 | **`index,follow` + canonical 指向不存在的 /404/** | — | 🐞 真 bug |

---

## 2. P0 —— 本周就该做完（低成本、确定性高）

### P0-1 装上分析（否则一切优化都是猜）

`src/data/site.mjs` 里 `ga4Id: ''`，`layout.mjs` 是三段式渲染的，填上 ID 就自动注入。
同时确认 **Google Search Console** 与 **Bing Webmaster** 已验证（sitemap.xml 已就绪），并在 GSC 里提交 sitemap。

- 影响：没有它，无法知道哪个页面/查询有效，后面所有内容投入都是盲投。
- 成本：填 1 个字段 + 3 个后台验证。**这是全清单里投入产出比最高的一项。**

### P0-2 修 404 页的 robots / canonical

实测 `dist/404.html`：

```html
<link rel="canonical" href="https://dressmakerguide.com/404/">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
```

`/404/` 这个 URL 根本不存在，却告诉搜索引擎"请索引我，并且我是这个规范地址"。
Cloudflare Pages 对任意未知 URL 都会返回这个文件 → **soft 404 + canonical 指向空页面**，是典型的索引膨胀源。

修法：`src/pages/404.mjs` 输出 `<meta name="robots" content="noindex,follow">`，并去掉 canonical（或 canonical 到 `/`）。
顺手在 `scripts/audit.mjs` 加一条断言：**除 404 外每页必须恰好 1 个 canonical；404 必须 noindex**，防止回归。

### P0-3 字体瘦身（一个下午，省下全站最重资产）

实测：

| 文件 | 体积 | CSS 中使用次数 |
|---|---|---|
| `newsreader.woff2` | **127,860 B** | **1 次**（`--serif`） |
| `fraunces.woff2` | 66,472 B | 4 次（`--display`，被 preload） |
| `inter.woff2` | 42,320 B | 25 次（`--sans`，被 preload） |

三个都是 `font-weight:100 900` 的**全轴可变字体**，`font-display:swap`（这点做对了）。

问题：**127 KB 的 Newsreader 全站只用了一次**，而 HTML 本身只有 9 KB gzip —— 字体比页面重 14 倍。

动作（按性价比排序）：
1. **砍掉 Newsreader**，那 1 处 `--serif` 改用 Fraunces（已经是展示字体，风格不冲突）→ 直接省 127 KB。
2. 保留的字体做 **latin 子集**（`pyftsubset --unicodes=U+0000-00FF,...` 或 fonttools），全轴可变字体子集后通常降到 20–40 KB。
3. 只 preload 真正首屏用到的那一个，另一个改 `media="print" onload` 或干脆不 preload。

预期：字体总量 236 KB → 50 KB 以内。

### P0-4 去掉重复图片

实测 md5：`shot1.webp` 与 `shot1-1100.webp` **字节完全相同**，8 张全部如此，共 **750 KB 冗余**。

而且 `<img src="/assets/shots/shot1.webp" ... srcset="...-550.webp 550w, ...-1100.webp 1100w">` 里，`src` 指向的就是全尺寸文件——老浏览器（不支持 srcset）会拿到最大的那张。

修法：`src` 直接指向 `-1100` 文件，删掉 8 个无后缀副本。省 750 KB 仓库体积，且不改变任何请求行为。

另外可以再补一档 **375w** 给窄屏手机（现在最小 550w，手机上是浪费）。

### P0-5 广告路线拍板 + 补 ads.txt

现在是一个**两头不靠**的状态：

- `ads.txt` 只声明了 Google：
  ```
  google.com, pub-9073496682747119, DIRECT, f08c47fec0942fa0
  ```
- 但实际在跑的是 **Adsterra（highrevenueformat.com）** 和 **ProfitableRateCPM** —— 这两家**没有 ads.txt 授权行**。买方读取 ads.txt 发现未授权，会直接压低出价或拒绝竞价，我们等于在**白送一部分收入**。

两条路，选一条：

**路线 A：AdSense 主线（推荐）**
- 把 `ADS.enabled` 置为 `false`（代码已经支持一键关闭），先干净地过 AdSense 审核
- 过审后再逐页开 AdSense 单元，长期 CPM 与政策稳定性都更好
- 理由：Adsterra 的创意不可控（易出低质/擦边素材），而它与 AdSense 在**同一批页面共存**，是 AdSense 拒批的常见原因

**路线 B：继续走网盟**
- 在 `public/ads.txt` 补上 `highrevenueformat.com` 与 `profitableratecpmnetwork.com` 的授权行（具体行文向两家后台索取）
- 把 `<head>` 里的 AdSense 验证脚本留着（无广告位就不违规），但别再宣传"无广告/干净"

**不管选哪条**：现在 3 个广告位（468x60、320x50、in-page push）都嵌在正文里，首页 1,679 词配 3 个位，密度还算克制；补内容后可维持"每 500 词不超过 1 个位"。

---

## 3. P1 —— 内容广度：唯一能改变量级的事

**这是最大的杠杆，也是我们和竞品差距真正的所在：17,064 词 vs 225,334 词。**

竞品 10 个栏目，我们的覆盖情况：

| 竞品栏目 | 它有 | 我们的现状 | 缺口 |
|---|---|---|---|
| guides | 10 篇 | /how-to-play、/sewing-tips、/wiki | 🟡 部分覆盖，但没有"分主题"的文章 |
| **achievements** | 7 篇 | **无** | 🔴 **完全空缺，且最容易做** |
| **fabrics** | 7 篇 | /wiki 里一张表 | 🔴 可拆出 3–4 页 |
| patterns | 7 篇 | /sewing-tips 里 | 🔴 可拆出 3 页 |
| **decorations** | 7 篇 | **无** | 🔴 完全空缺 |
| characters | 7 篇 | /customers（只讲偏好） | 🟡 缺 NPC 图鉴 |
| **shop** | 7 篇 | **无** | 🔴 完全空缺（经济循环/定价/上架） |
| updates | 7 篇 | /patch-notes（1,402 词） | 🟡 有骨架，缺分支 |
| platforms | 7 篇 | /system-requirements、/demo、/troubleshooting | 🟢 覆盖最好 |

### P1-1 建 `/achievements`（最高优先级的新页面）

理由：**Steam 官方 appdetails API 直接给我们结构化数据**，不需要猜：

```
GET https://store.steampowered.com/api/appdetails?appids=4019220&l=english
→ achievements.total = 32
→ achievements.highlighted[] = 10 条 { localized_name, icon, hidden, path }
```

我们已经核实过：这 10 个名字是真实的（`Good Girl Gone Vlad`、`Swan Song`、`Go Off, Queen!`、`Caw Evermore`、`Prudence and Prejudice`、`Snitches Get Stitches`、`A Rose By Any Other Name`、`Drawn to Hue`、`G.O.A.T.`、`Reap what You Sew`）。

建议做法：
- 写一个 `scripts/fetch-steam.mjs`，把 API 快照存成 `src/data/steam.json`（**带抓取时间戳**），构建时读它
- 页面输出 32 个成就的表格：名称、图标、是否隐藏、**核实状态**（"官方 API 已确认" vs "开发者未公布"）
- JSON-LD 用 `ItemList` + 每项 ` Thing`
- 明确写"其余 22 个成就的名称与图标会随解锁显示；我们不会编造它们的解锁条件"

**这正是竞品的软肋**：它的成就页写了"300 单阈值""低于 1.4% 解锁率""第 1 章/第 8 章"这些**没有来源的结构化断言**，还自相矛盾。我们用官方 API + 诚实标注"未公布"，可以直接在质量上压过它，而且**我们有它没有的东西：可核实**。

### P1-2 把 `/wiki` 拆成 4 个独立页面

现在 `/wiki` 947 词，H2 是：`How to use this wiki / Fabric families at a glance / Pattern pieces and garment panels / Decoration types / The making loop / Key terms / What this wiki is, and what it is not`
—— **一个页面想吃 5 个关键词，结果每个都只有一段。**

拆法：

| 新页面 | 吃的查询 | 目标词量 |
|---|---|---|
| `/fabrics` | dressmaker fabrics / fabric list / best fabric | 1,400+ |
| `/patterns` | dressmaker patterns / pattern pieces / cutting | 1,400+ |
| `/decorations` | dressmaker decorations / buttons bows appliqué | 1,400+ |
| `/glossary`（或保留 /wiki 做枢纽） | dressmaker terms / grain / bias / seam allowance | 900+ |

`/wiki` 本身保留成**枢纽页**（Hub），只放每块的 3 行摘要 + 指向 4 个子页的链接。
这样一次改动：页面数 +4，词量 +5,000，且形成 hub→spoke 结构（竞品正是靠这个结构吃内链权重的）。

### P1-3 建 `/characters` 与 `/shop`

- `/characters`：从 `/customers` 拆出 NPC 维度（谁是谁、喜好、礼物），`/customers` 保留"怎么读 brief"的方法论
- `/shop`：经济循环（定价、声望、上架预制裙、库存）——竞品有 7 篇，我们 0 篇

### P1-4 目标与节奏

| 阶段 | 页面数 | 词量 | 说明 |
|---|---|---|---|
| 现在 | 16 | 17,064 | — |
| 阶段一（P0 + P1-1/P1-2） | 21 | ~25,000 | 成就页 + wiki 拆分，**全部基于官方数据** |
| 阶段二（P1-3） | 28 | ~38,000 | characters / shop / updates 分支 |
| 阶段三 | 40+ | ~60,000 | 补齐 fabrics/patterns/decorations 深度文章 |

**不要追求 88 页。** 竞品 88 页里有大量"官方未公布 + 免责话术"的灌水段。我们的目标是**每一页都有官方来源、都标注核实日期**——40 页可信内容在我们的定位下比 88 页灌水更值钱，也更抗 Google 的 helpful-content 更新。

---

## 4. P2 —— 结构化数据与 E-E-A-T

### P2-1 补齐 JSON-LD 覆盖面

现状：Article 仅 `/sewing-tips`、`/wiki`；VideoGame 仅 `/`、`/release-date`；FAQPage 5 页；HowTo 仅 `/how-to-play`。

| 页面 | 应加 |
|---|---|
| 所有内容页 | `Article`（含 `datePublished`/`dateModified`/`author`） |
| `/achievements` | `ItemList`（32 项） |
| `/system-requirements` | `HowTo` 或 `SoftwareApplication` + `operatingSystem` |
| `/demo` | `SoftwareApplication`（免费原型） |
| `/games-like` | `ItemList`（10 款游戏，每项 `VideoGame`） |
| `/patch-notes` | `ItemList`，每项带 `datePublished` |
| 已有 VideoGame 的页 | 补 `sameAs`（Steam/itch）、`applicationCategory`、`gamePlatform`、`offers`（价格） |

### P2-2 作者与核实日期（我们已有制度，只是没露出来）

`layout.mjs` 已有 `pageHead` 输出 `Reviewed <date>`，`sourcesHtml` 已有 "Where this came from" 来源块——**这是我们相对竞品的真优势，但只做了一半**：

- schema 里 `author` 现在是 `Organization: "Dressmaker Guide"`，可见区域也没有署名 → 补一个真实的 `author`（Person，带 `url` 指向 `/about`），visible byline 同步显示
- `Reviewed` 日期目前**全站都是 2026-09-21**（`site.mjs` 的 `contentUpdated`）→ 改成**每页独立**的 `updated` 字段，spoke 页发布时写各自日期
- 在 `/about` 明确写"哪些事实经过核实、怎么核实的、发现错误怎么改"

**竞品 88 页的 `datePublished` 全等于 `dateModified` 全等于 2026-09-22，作者是 Organization 且无署名。** 我们把这块做扎实，就是可验证的差异。

---

## 5. P2 —— 内链

实测每页**正文内链只有 3–9 条**（其余 23–24 条来自侧栏/页脚模板）。竞品每页 20–31 条。

同时有近孤儿页：`/disclaimer` 只有 1 个正文入链，`/privacy` 2 个，`/troubleshooting` 4 个，`/system-requirements` 6 个。

动作：
1. 每页正文尾部加 **"Related pages" 块**（3–5 条），锚文本用描述性长尾（我们导航锚文本已经写得好：*"Dressmaker customer preferences"*，保持这个风格）
2. 在正文段落里做**编辑型内链**：讲面料时链到 `/fabrics`，讲裁剪时链到 `/patterns`——这是竞品做得比我们好的地方
3. `scripts/audit.mjs` 加一条：**每个页面至少被 3 个其它页面的正文链接到**，把孤儿页检测从"存在入链"升级为"至少有 3 条正文入链"

---

## 6. P2 —— 交付与缓存

实测首页响应：`Cache-Control: public, max-age=0, must-revalidate`，`cf-cache-status: DYNAMIC`，TTFB **0.93 s**。
一个纯静态站在 LAX 边缘 0.93 s 是不必要的。

`dist/_headers` 目前只给 `/assets/*` 设了 `immutable`（对），HTML 没有边缘缓存策略。

建议在 `_headers` 增加：

```
/*
  Cache-Control: public, max-age=0, s-maxage=86400, stale-while-revalidate=604800
```

即：浏览器每次校验（内容更新即时可见），**边缘缓存 24 小时**。静态站内容变更频率低，这个组合能把 TTFB 从 ~0.9 s 压到边缘命中级别。

另外用浏览器 DevTools 确认一下实际协商到的是 HTTP/2 还是 HTTP/3（本机 curl 没有 http2 支持，无法从命令行验证；响应头里有 `alt-svc: h3=":443"`，说明服务端是支持的）。

---

## 7. P3 —— 多语言

零多语言。竞品做了 **en/de/ja/pt，唯独没有中文**。

而 Steam 官方 API 核实：游戏支持语言是 **English / Simplified Chinese / Japanese**（三语全语音）。

**简体中文 = 官方语种 + 竞品空缺 + 我们的构建器改造成本极低**（`src/lib/layout.mjs` 的 head 已经是参数化的，加 locale 前缀 + hreflang 是纯机械工作）。

建议顺序：简中 → 日文 →（可选）其它。
注意 hreflang 必须**双向自指**（每条 hreflang 集合里包含自己），竞品这点做对了，抄它的结构即可。

---

## 8. P3 —— 两个小而确定的修正

### P3-1 robots.txt 与 llms.txt 自相矛盾

- `public/llms.txt` 写着 "## Notes for answer engines"，主动邀请 AI 引擎读取
- 但**线上 robots.txt** 被 Cloudflare Managed Content 注入了一大批 `Disallow`：`ChatGPT-User`、`Perplexity-User`、`Claude-User`、`Google-Agent`、`Google-GeminiNotebook`、`MistralAI-User`、`Kimi-User`、`meta-externalfetcher` …
- 同时 `Content-Signal: search=yes,ai-train=yes,use=reference`

结果：一边说"欢迎来读"，一边把这些 agent 全挡在门外。**选一个立场**：
- 想被 AI 引用 → 在 Cloudflare 后台关掉这些 Disallow 规则（生成式引擎的引荐流量对我们这种攻略站是净增量）
- 不想 → 删掉 `llms.txt` 里 "answer engines" 的表述，别自相矛盾

### P3-2 sitemap 的 lastmod 纪律

现在 11 条 URL 的 `lastmod` 全是 `2026-09-21`、`changefreq: monthly`。
内容真的更新时（例如补了成就页），`lastmod` 要跟着走，否则 Google 会忽略这个字段。建议 `build.mjs` 从各页 `page.updated` 自动生成，而不是硬编码 `SITE.contentUpdated`。

---

## 9. 优先级总表

| 优先级 | 事项 | 预期收益 | 成本 |
|---|---|---|---|
| **P0-1** | 填 `ga4Id` + 接 Search Console | 从盲飞变成可测量 | 1 小时 |
| **P0-2** | 404 页改 `noindex`、去掉错 canonical | 消除 soft 404 与索引膨胀 | 30 分钟 |
| **P0-3** | 删 Newsreader + 字体子集 | **省 ~190 KB**（全站最重资源） | 半天 |
| **P0-4** | 去 8 张重复图片 + `src` 指向 1100 | 省 750 KB 冗余 | 1 小时 |
| **P0-5** | 广告路线拍板 + 补 ads.txt | 停止白送竞价 / 降低 AdSense 拒批风险 | 决策 + 1 小时 |
| **P1-1** | 建 `/achievements`（Steam API 驱动） | 吃"dressmaker achievements"这一高意图词，且**数据可核实** | 1–2 天 |
| **P1-2** | 拆 `/wiki` 为 fabrics / patterns / decorations / glossary | 页面 +4，词量 +5,000，形成 hub-spoke | 2–3 天 |
| **P1-3** | 建 `/characters`、`/shop` | 补两个完全空缺的栏目 | 2–3 天 |
| **P2-1** | 补齐 JSON-LD（Article/ItemList/HowTo/SoftwareApplication） | 富结果与实体识别 | 1 天 |
| **P2-2** | 真实作者署名 + 每页独立核实日期 | E-E-A-T，正是竞品最弱处 | 半天 |
| **P2-3** | "Related pages" 块 + 孤儿页修复 + audit 断言 | 内链权重从 3–9 → 10+ | 1 天 |
| **P2-4** | `_headers` 加 HTML 边缘缓存 | TTFB 0.93 s → 边缘命中 | 30 分钟 |
| **P3-1** | 解决 robots.txt vs llms.txt 矛盾 | 一致性 | 30 分钟（决策） |
| **P3-2** | sitemap lastmod 自动化 | 抓取效率 | 1 小时 |
| **P3-3** | 简体中文版 | 官方语种 + 竞品空缺 | 1–2 周 |

---

## 10. 一句话

**我们输在广度（17k 词 vs 225k 词），赢在可信度与轻量（32 KB vs 537 KB）。**
所以路径不是"追平 88 页"，而是：**先把 P0 的 5 个确定性缺陷修掉（一天内可完成，省 190 KB 字体 + 750 KB 图片 + 拿回可测量性），再用"Steam API 驱动 + 官方来源标注"的方式，把竞品最薄弱的成就/面料/版型/装饰四块做深。**

这四块恰好是竞品用免责话术灌水最多、而我们能用一手数据做扎实的地方。
