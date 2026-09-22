# Bilibili CC字幕批量下载复制查看器

**面向哔哩哔哩 CC 字幕的单集下载、批量下载、复制与查看油猴脚本**

[![Release](https://img.shields.io/github/v/release/WanderLandWalker/Bilibili-CC-Subtitle-Tool?label=Release&style=flat)](https://github.com/WanderLandWalker/Bilibili-CC-Subtitle-Tool/releases/latest)
[![GitHub Stars](https://img.shields.io/github/stars/WanderLandWalker/Bilibili-CC-Subtitle-Tool?style=flat)](https://github.com/WanderLandWalker/Bilibili-CC-Subtitle-Tool)
[![Version](https://img.shields.io/badge/Version-v1.0-blue?style=flat)](./Bilibili-CC-Subtitle-Tool.user.js)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](https://opensource.org/licenses/MIT)

本项目是在 Bilibili CC 字幕工具基础上的完善版本，重点整合了字幕查看、复制、格式转换和合集/选集批量下载功能。README 的组织方式参考了 [SCUT_Auto_Grader](https://github.com/WanderLandWalker/SCUT_Auto_Grader)。

## 功能

| 功能 | 说明 |
|------|------|
| **单集字幕查看** | 在当前 B 站页面打开统一的字幕查看窗口，不再维护两套查看窗口 |
| **单集下载** | 下载当前视频/选集的 CC 字幕 |
| **批量下载** | 识别合集或选集列表，可选择全部或指定集数，最终打包为 ZIP |
| **语言切换** | 在字幕窗口中选择当前视频可用的字幕语言，并支持刷新 |
| **多格式导出** | 支持 TXT、SRT、VTT、ASS、LRC、BCC |
| **复制字幕** | 一键复制当前字幕，完成后会显示成功提示 |
| **新标签页查看** | 将当前字幕内容在新标签页中打开 |
| **窗口交互** | 窗口可拖动；右下角蓝色方形手柄可拖动调整大小 |
| **悬浮按钮设置** | 可通过油猴菜单开启/关闭悬浮按钮；右键悬浮按钮可临时或永久隐藏 |
| **多播放器兼容** | 兼容 B 站新旧播放器字幕面板，并保留本地字幕相关入口 |

### 核心特性

- **合集/选集自动识别**：读取播放器选集列表、合集数据和页面内嵌视频信息，支持普通视频、课程、番剧和播放列表。
- **逐集语言选择**：批量下载可以固定语言，也可以让每一集自动选择该集第一种可用语言。
- **失败可追踪**：单集失败不会中断整个批量任务，完成后显示成功数量、失败数量和失败原因。
- **格式转换内置**：在浏览器中直接转换时间轴和字幕文本，不需要额外安装 Python、Node.js 或桌面软件。
- **旧版播放器兼容**：保留旧版、2.x、3.14、3.15 等播放器的字幕入口适配。
- **设置本地保存**：悬浮按钮显示状态、临时/永久隐藏状态等设置保存在当前浏览器本地。

## 安装

### 方式一：手动安装（推荐）

1. 安装用户脚本管理器：[Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)。
2. 打开管理器，选择“新建脚本”。
3. 删除编辑器中的默认内容，将 [`Bilibili-CC-Subtitle-Tool.user.js`](./Bilibili-CC-Subtitle-Tool.user.js) 全部复制进去。
4. 保存脚本并启用。

也可以将脚本文件名改为 `.user.js` 后，用浏览器打开进行安装：

```text
   Bilibili-CC-Subtitle-Tool.user.js
```

### 方式二：从 GitHub 安装

1. 打开 [v1.0 Release](https://github.com/WanderLandWalker/Bilibili-CC-Subtitle-Tool/releases/tag/v1.0)。
2. 点击 [安装脚本](https://raw.githubusercontent.com/WanderLandWalker/Bilibili-CC-Subtitle-Tool/main/Bilibili-CC-Subtitle-Tool.user.js)。
3. 油猴管理器弹出安装页面后，确认脚本名称和来源，点击安装。

脚本已经配置 `@updateURL` 和 `@downloadURL`，后续发布新版本后，油猴可以从 GitHub raw 地址检查更新。

### 方式三：从 Release 源码安装

1. 打开 [Releases](https://github.com/WanderLandWalker/Bilibili-CC-Subtitle-Tool/releases)。
2. 下载对应版本的 Source code 压缩包。
3. 解压后打开 `Bilibili-CC-Subtitle-Tool.user.js`，复制到油猴新建脚本中并保存。

## 使用

### 打开字幕窗口

安装并启用脚本后，在支持 CC 字幕的 B 站视频页面使用以下任一入口：

1. 点击页面上的蓝色悬浮按钮。
2. 点击悬浮按钮右键菜单中的“打开字幕下载窗口”。
3. 打开油猴菜单，选择“打开字幕下载窗口”。

字幕窗口中的常用操作：

- **语言**：选择字幕语言。
- **刷新**：重新读取当前视频的字幕列表。
- **下载**：按所选格式下载当前字幕。
- **复制**：复制当前字幕文本，并通过提示确认复制成功。
- **在新标签页中打开**：在新标签页查看当前字幕。
- **关闭**：关闭当前字幕窗口。

窗口顶部会提示“窗口可拖动，点击⌜⌟可调整窗口大小”。拖动标题区域可以移动窗口，拖动右下角蓝色方形手柄可以调整字幕区域和窗口大小。

### 批量下载合集或选集

1. 在油猴菜单选择“批量下载字幕”，或打开字幕窗口后点击“批量下载”。
2. 在“范围”中选择合集、全部选集或指定范围。
3. 在“语言”中选择固定语言，或使用“自动选择可用语言”。自动模式会为每一集选择该集可用字幕列表中的第一种语言。
4. 选择导出格式。
5. 勾选需要下载的集数。
6. 点击“开始批量下载”。

所有成功获取的字幕会被打包成一个 ZIP 文件。窗口会显示完成数量、失败数量和失败原因，便于检查某些选集没有字幕或请求失败的情况。

### 悬浮按钮设置

悬浮按钮默认用于快速打开字幕窗口。如果按钮遮挡页面内容，可以：

- 打开油猴菜单，点击“打开/关闭悬浮按钮（全局设置）”切换显示状态；
- 右键悬浮按钮，选择“临时关闭”或“永久关闭”；
- 需要恢复时，再次从油猴菜单执行“打开/关闭悬浮按钮（全局设置）”。

“临时关闭”只影响当前页面；“永久关闭”会保存全局设置。即使关闭悬浮按钮，油猴菜单中的字幕查看和批量下载功能仍然可以使用。

### 油猴菜单

脚本注册了以下菜单项：

- `打开字幕下载窗口`
- `批量下载字幕`
- `打开/关闭悬浮按钮（全局设置）`

因此，即使悬浮按钮被隐藏，也可以通过油猴菜单继续使用全部主要功能。

## 支持格式

| 格式 | 适用场景 |
|------|----------|
| TXT | 只需要纯字幕文本 |
| SRT | 通用视频字幕格式 |
| VTT | Web 视频播放器字幕 |
| ASS | 需要样式和高级字幕信息 |
| LRC | 音频歌词或带时间轴的文本 |
| BCC | B 站字幕数据格式 |

## 支持页面

脚本当前匹配以下 B 站页面类型：

- 普通视频页面；
- 番剧/课程的合集页和选集页；
- 稍后再看；
- 播放列表；
- B 站 HTML5 播放器页面。

具体页面是否能下载字幕，取决于该视频是否公开提供 CC 字幕，以及当前账号和浏览器能否正常访问 B 站字幕接口。

## 注意事项

- 本工具只处理视频页面已经提供的 CC 字幕，不负责语音识别或自动生成字幕。
- “自动选择可用语言”是逐集选择：不同选集可能会得到不同语言，具体取决于每一集实际提供的字幕。
- 批量下载时，没有字幕、字幕接口拒绝访问或网络请求失败的选集会在结果中标记为失败，不会阻止其他选集继续处理。
- B 站页面结构或接口发生变化时，可能需要更新播放器节点识别逻辑。
- 下载和使用字幕时请遵守 B 站规则、字幕作者授权范围及相关法律法规。

## 版本历史

| 版本 | 变化 |
|------|------|
| v1.0 | 统一为正常字幕查看窗口；整合单集下载、复制、查看、语言切换和合集/选集批量下载；增加多格式导出、拖动缩放、复制成功提示及悬浮按钮全局设置 |

## 技术实现

- **字幕配置读取**：从 B 站播放器接口读取当前视频或选集的 CC 字幕配置，再请求对应字幕资源。
- **选集识别**：优先读取页面中的选集 DOM 和 `data-cid`，并兼容 `ugc_season`、视频页内嵌数据及番剧选集数据。
- **批量处理**：逐集获取字幕并在任务窗口中实时汇总结果；成功文件使用浏览器 `Blob` 打包成 ZIP 下载。
- **格式编码**：内置 TXT、SRT、VTT、ASS、LRC、BCC 的编码和时间轴转换逻辑。
- **窗口交互**：使用原生 DOM/CSS 实现拖动、右下角方形手柄缩放、复制提示和页面透明背景，不依赖第三方前端框架。
- **播放器适配**：通过观察 B 站播放器节点和页面变化，在播放器切换或页面局部刷新后重新初始化字幕入口。

## 文件说明

| 文件 | 说明 |
|------|------|
| `Bilibili-CC-Subtitle-Tool.user.js` | 当前推荐使用的油猴脚本（GitHub 发布文件） |
| `Bilibili CC字幕工具完善优化版.txt` | 本地开发源文件 |
| `Bilibili CC字幕工具.txt` | 原始版本，保留用于对照 |
| `Bilibili CC字幕工具（优化版）-魔改版-可通道.txt` | 其他历史优化版本 |
| `0520Bilibili CC字幕工具（优化版）-魔改版-独立查看器.txt` | 独立查看器历史版本 |

## 隐私说明

- 脚本不会主动收集、上传用户的字幕内容或使用统计。
- 字幕请求直接发往 B 站页面所使用的字幕接口和字幕资源地址。
- 复制功能只把内容写入当前浏览器剪贴板。
- 悬浮按钮和窗口相关设置保存在浏览器本地。

## 致谢

本项目是在以下两个字幕项目的基础上继续整理和完善，特别感谢原作者和后续维护者的工作：

1. **Bilibili CC字幕工具**：感谢作者 **indefined**。本项目沿用了原脚本的 CC 字幕读取、播放器适配和字幕格式转换思路。
   - [GitHub：indefined/UserScripts](https://github.com/indefined/UserScripts)
   - [Greasy Fork：Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)
2. **0520Bilibili CC字幕工具（优化版）-魔改版-独立查看器**：感谢作者 **rui ma** 及相关优化贡献者。本项目参考了其独立查看器、窗口拖动、复制和界面交互实现。
   - [Greasy Fork：0520Bilibili CC字幕工具（优化版）-魔改版-独立查看器](https://greasyfork.org/en/scripts/579166-0520bilibili-cc%E5%AD%97%E5%B9%95%E5%B7%A5%E5%85%B7-%E4%BC%98%E5%8C%96%E7%89%88-%E9%AD%94%E6%94%B9%E7%89%88-%E7%8B%AC%E7%AB%8B%E6%9F%A5%E7%9C%8B%E5%99%A8)

本项目仅在原有功能基础上进行整合、修复和扩展，相关版权和许可证信息以各上游项目页面及脚本声明为准。

## 许可证

[MIT License](https://opensource.org/licenses/MIT)

## 如果觉得有用

如果这个脚本对你有帮助，欢迎给项目点一个 Star，或者提交 Issue 反馈 B 站页面结构变化和使用问题。

[![GitHub Stars](https://img.shields.io/github/stars/WanderLandWalker/Bilibili-CC-Subtitle-Tool?style=social)](https://github.com/WanderLandWalker/Bilibili-CC-Subtitle-Tool)

## 参考

- [SCUT_Auto_Grader](https://github.com/WanderLandWalker/SCUT_Auto_Grader)：README 结构与表达方式参考项目。

