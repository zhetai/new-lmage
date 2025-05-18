# 🖼️ TG-Image 图床 ✨

<div align="center">
  <img src="public/images/logo.svg" alt="TG-Image Logo" width="150">
  <br>
  <h2>现代化、高颜值的 Telegram 图片托管服务</h2>

  <p>
    <a href="#-特性"><img src="https://img.shields.io/badge/特性-Features-blue?style=for-the-badge&logo=telegram" alt="特性"></a>
    <a href="#部署指南"><img src="https://img.shields.io/badge/部署-Deploy-orange?style=for-the-badge&logo=cloudflare" alt="部署"></a>
    <a href="#使用方法"><img src="https://img.shields.io/badge/使用-Usage-green?style=for-the-badge&logo=bookstack" alt="使用"></a>
    <a href="#-更新日志"><img src="https://img.shields.io/badge/更新-Changelog-red?style=for-the-badge&logo=git" alt="更新"></a>
  </p>
</div>

<p align="center">
  <strong>TG-Image</strong> 是一个基于 Telegram 的现代化图片托管服务，提供简单、可靠的图片上传和存储解决方案。该项目利用 Telegram 的强大存储能力，为用户提供<strong>免费、无限制</strong>的图床服务，并拥有精美的用户界面和流畅的交互体验。
</p>

<p align="center">
  特别支持<strong>原图上传</strong>和<strong>原图下载</strong>功能，确保您的图片在分享过程中保持原始质量，不会被压缩或降低画质。
</p>

<hr>

## ✨ 特性

| 🚀 快速上传与全球加速 | 📦 无限空间 | 🔒 安全可靠 |
|:----------------------:|:------------:|:------------:|
| 优化的上传流程，使用CDN加速全球访问，快速响应，即时处理 | 基于Telegram强大的存储能力，无容量限制，永久保存 | 数据安全存储，稳定访问，长期保存，无需担心数据丢失 |

| 🎨 现代化界面 | 👍 用户友好 | 📸 原图上传与下载 |
|:------------:|:------------:|:------------------:|
| 精美的UI设计，支持暗色模式，响应式布局适配各种设备 | 拖放上传，一键复制链接，支持多种格式，操作简单直观 | 保持图片原始质量，不进行压缩，确保图片完美呈现 |

| 📚 批量上传 | 👤 用户系统 | 🏷️ 图片管理 |
|:------------:|:------------:|:------------:|
| 支持同时选择或拖放多张图片，提高工作效率 | 支持用户注册、登录，管理个人上传的图片，保护隐私 | 支持图片列表、删除、重命名、标签管理和搜索功能 |

## 🚀 部署指南

### 📋 前提条件

<table>
  <tr>
    <td align="center"><img src="https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare"></td>
    <td><a href="https://cloudflare.com" target="_blank">Cloudflare</a> 账号</td>
  </tr>
  <tr>
    <td align="center"><img src="https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"></td>
    <td>Telegram Bot Token (通过 <a href="https://t.me/BotFather" target="_blank">@BotFather</a> 创建)</td>
  </tr>
  <tr>
    <td align="center"><img src="https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"></td>
    <td>Telegram Chat ID (可以是群组或频道)</td>
  </tr>
  <tr>
    <td align="center"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></td>
    <td><a href="https://nodejs.org/" target="_blank">Node.js</a> (开发环境)</td>
  </tr>
</table>

### ⚙️ 安装步骤

<details open>
<summary><b>1. 克隆仓库</b></summary>

```bash
git clone https://github.com/your-username/tg-image.git
cd tg-image
```
</details>

<details open>
<summary><b>2. 安装依赖</b></summary>

```bash
npm install
```
</details>

<details open>
<summary><b>3. 登录到 Cloudflare 账号</b></summary>

```bash
npx wrangler login
```

这个命令会打开浏览器，引导你完成 Cloudflare 账号的登录过程。
</details>

<details open>
<summary><b>4. 配置环境变量</b></summary>

修改 `wrangler.toml` 文件，填入你的 Telegram Bot Token、Chat ID 和 JWT 密钥:

```toml
[vars]
TG_Bot_Token = "YOUR_BOT_TOKEN"
TG_Chat_ID = "YOUR_CHAT_ID"
JWT_SECRET = "YOUR_JWT_SECRET" # 用于用户认证的密钥，请更改为随机字符串
```
</details>

<details open>
<summary><b>5. 创建 Cloudflare KV 命名空间并部署</b></summary>

```bash
# 创建 KV 命名空间并部署
npm run setup
```

这个命令会自动执行以下操作：
- ✅ 检查并创建必要的 KV 命名空间（如果不存在）
- ✅ 自动更新 `wrangler.toml` 文件中的 KV 命名空间 ID
- ✅ 部署项目到 Cloudflare Workers

> **💡 提示**：如果你使用的是 Wrangler 4.x 版本，KV 命名空间的命令格式已经改变。
> 正确的命令格式是：`npx wrangler kv namespace create "img_url"`（注意 `kv` 和 `namespace` 之间没有冒号）

你也可以分步执行：

```bash
# 创建 KV 命名空间并更新 wrangler.toml
npm run create-kv

# 部署
npm run deploy
```
</details>

### 🌐 Cloudflare Pages 部署

<details>
<summary><b>点击展开 Cloudflare Pages 部署说明</b></summary>

如果你使用 Cloudflare Pages 部署此项目，请参阅 [Cloudflare Pages 部署配置](cloudflare-pages-config.md) 文件，了解如何配置 Cloudflare Pages 的部署设置。
</details>

## 📖 使用方法

### 🔄 匿名上传

<div align="center">
  <img src="https://img.shields.io/badge/无需注册-直接上传-success?style=for-the-badge" alt="无需注册">
</div>

<table>
  <tr>
    <td align="center">1️⃣</td>
    <td>访问你的网站</td>
  </tr>
  <tr>
    <td align="center">2️⃣</td>
    <td>拖放单张或多张图片到上传区域，或点击选择文件</td>
  </tr>
  <tr>
    <td align="center">3️⃣</td>
    <td>上传完成后，系统会自动生成链接（所有图片均以原图质量上传）</td>
  </tr>
  <tr>
    <td align="center">4️⃣</td>
    <td>如果上传了多张图片，可在图片列表中点击查看不同图片的详情</td>
  </tr>
  <tr>
    <td align="center">5️⃣</td>
    <td>复制需要的链接格式（直接链接、HTML、Markdown）</td>
  </tr>
  <tr>
    <td align="center">6️⃣</td>
    <td>分享链接给他人，对方打开链接时将看到原图，无任何压缩或质量损失</td>
  </tr>
</table>

### 👤 用户功能

<div align="center">
  <img src="https://img.shields.io/badge/注册登录-管理图片-blue?style=for-the-badge" alt="用户功能">
</div>

#### 🔑 账户管理
- **注册/登录**：点击导航栏中的"登录"链接，创建账户或登录
- **个人资料**：管理您的用户信息和偏好设置

#### 🖼️ 图片管理
登录后，点击"我的图片"进入仪表盘，您可以：

<table>
  <tr>
    <td align="center">👁️</td>
    <td><b>查看图片</b>：浏览您上传的所有图片，支持分页和排序</td>
  </tr>
  <tr>
    <td align="center">📋</td>
    <td><b>复制链接</b>：一键复制直接链接、HTML代码或Markdown代码</td>
  </tr>
  <tr>
    <td align="center">✏️</td>
    <td><b>编辑信息</b>：修改图片文件名、添加标签等</td>
  </tr>
  <tr>
    <td align="center">🗑️</td>
    <td><b>删除图片</b>：移除不需要的图片</td>
  </tr>
  <tr>
    <td align="center">🔍</td>
    <td><b>搜索功能</b>：按文件名或标签搜索图片</td>
  </tr>
  <tr>
    <td align="center">📤</td>
    <td><b>批量上传</b>：同时上传多张图片，提高效率</td>
  </tr>
</table>

## 🖥️ 技术架构

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="https://img.shields.io/badge/前端-Frontend-blue?style=for-the-badge" alt="前端"></td>
      <td>
        <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
        <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
        <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
      </td>
    </tr>
    <tr>
      <td align="center"><img src="https://img.shields.io/badge/后端-Backend-orange?style=for-the-badge" alt="后端"></td>
      <td>
        <img src="https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Workers">
        <img src="https://img.shields.io/badge/Hono-E36002?style=flat-square&logo=cloudflare&logoColor=white" alt="Hono">
      </td>
    </tr>
    <tr>
      <td align="center"><img src="https://img.shields.io/badge/存储-Storage-green?style=for-the-badge" alt="存储"></td>
      <td>
        <img src="https://img.shields.io/badge/Telegram_API-26A5E4?style=flat-square&logo=telegram&logoColor=white" alt="Telegram API">
        <img src="https://img.shields.io/badge/Cloudflare_KV-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare KV">
      </td>
    </tr>
    <tr>
      <td align="center"><img src="https://img.shields.io/badge/部署-Deploy-purple?style=for-the-badge" alt="部署"></td>
      <td>
        <img src="https://img.shields.io/badge/Wrangler_CLI-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Wrangler CLI">
        <img src="https://img.shields.io/badge/Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Pages">
      </td>
    </tr>
  </table>
</div>

## 🛠️ 开发

<div align="center">
  <img src="https://img.shields.io/badge/开发环境-Development-brightgreen?style=for-the-badge&logo=visualstudiocode" alt="开发环境">
</div>

### 本地开发服务器

```bash
# 启动本地开发服务器
npm run dev
```

### 构建与部署

```bash
# 构建项目
npm run build

# 部署到 Cloudflare Workers
npm run deploy
```

## 🌟 特色功能

<div class="feature-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">

<div align="center">
  <img src="https://img.shields.io/badge/UI/UX-用户体验-blueviolet?style=for-the-badge&logo=figma" alt="UI/UX">

  | 功能 | 描述 |
  |:----:|:-----|
  | 🌓 **暗色模式** | 自动适应系统设置，也可手动切换，保护眼睛 |
  | 🎭 **3D交互效果** | 卡片悬停时的立体效果，增强视觉体验 |
  | ✨ **粒子动画背景** | 动态视觉效果增强，提升页面美观度 |
  | 📱 **响应式设计** | 完美适配各种设备尺寸，从手机到桌面 |
  | 🔄 **滚动动画** | 页面元素随滚动平滑显示，提升交互体验 |
</div>

<div align="center">
  <img src="https://img.shields.io/badge/功能-Features-success?style=for-the-badge&logo=cloudflare" alt="功能">

  | 功能 | 描述 |
  |:----:|:-----|
  | 🖼️ **原图保真技术** | 保持原始质量，不压缩，适合摄影作品分享 |
  | 📚 **批量上传功能** | 一次选择或拖放多张图片同时上传 |
  | 🔐 **用户认证系统** | 基于JWT的安全认证机制，保护账户安全 |
  | 🏷️ **图片标签管理** | 为图片添加标签，方便分类和搜索 |
  | 📊 **个人仪表盘** | 用户可以管理自己上传的所有图片 |
</div>

</div>

<div align="center">
  <img src="https://img.shields.io/badge/持续更新-Continuous_Updates-red?style=for-the-badge&logo=github" alt="持续更新">
</div>

## 🤝 贡献指南

<div align="center">
  <img src="https://img.shields.io/badge/欢迎贡献-Welcome_Contributions-brightgreen?style=for-the-badge&logo=github" alt="贡献">
</div>

我们非常欢迎社区成员为 TG-Image 项目做出贡献！以下是一些贡献方式：

- **🐛 报告问题**：发现 bug？请[创建 Issue](https://github.com/xiyewuqiu/new-lmage/issues) 告诉我们
- **✨ 功能建议**：有新功能想法？欢迎提交功能请求
- **🎨 UI/UX 改进**：我们特别欢迎界面和用户体验方面的改进建议
- **📝 文档完善**：帮助改进文档，使其更加清晰和完整
- **💻 代码贡献**：提交 Pull Request 来修复问题或添加新功能

**贡献流程**：Fork → 修改 → 提交 PR → 审核 → 合并

## 📄 许可证

<div align="center">
  <img src="https://img.shields.io/badge/许可证-License-important?style=for-the-badge&logo=gnu" alt="许可证">
</div>

本项目采用 **GNU Affero通用公共许可证v3.0 (AGPL-3.0) 附加 Commons Clause** 进行许可。

<table>
  <tr>
    <th>主要条款</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>📝 <b>强制开源</b></td>
    <td>任何对本软件的修改或衍生作品必须以相同的许可证（AGPL-3.0）开源</td>
  </tr>
  <tr>
    <td>🌐 <b>网络使用也视为分发</b></td>
    <td>即使通过网络提供服务，也必须开源您的修改</td>
  </tr>
  <tr>
    <td>💼 <b>禁止商业使用</b></td>
    <td>根据Commons Clause限制，禁止将本软件或其任何部分用于商业目的</td>
  </tr>
  <tr>
    <td>📜 <b>专利授权</b></td>
    <td>授予使用者在该软件相关的专利上的权利</td>
  </tr>
  <tr>
    <td>⚠️ <b>无担保声明</b></td>
    <td>软件按"原样"提供，不提供任何形式的担保</td>
  </tr>
</table>

详细条款请参阅项目根目录下的LICENSE文件。

> **注意**：如需商业使用，请联系项目作者获取商业许可。

## 🙏 致谢

<div align="center">
  <img src="https://img.shields.io/badge/感谢-Thanks-yellow?style=for-the-badge&logo=heart" alt="致谢">
</div>

<table>
  <tr>
    <td align="center">
      <a href="https://telegram.org/" target="_blank">
        <img src="https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram">
      </a>
    </td>
    <td>提供存储基础设施</td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://workers.cloudflare.com/" target="_blank">
        <img src="https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Workers">
      </a>
    </td>
    <td>提供边缘计算平台</td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://hono.dev/" target="_blank">
        <img src="https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Hono">
      </a>
    </td>
    <td>轻量级的 Web 框架</td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://rsms.me/inter/" target="_blank">
        <img src="https://img.shields.io/badge/Inter_Font-000000?style=for-the-badge&logo=google-fonts&logoColor=white" alt="Inter Font">
      </a>
    </td>
    <td>现代化网页字体</td>
  </tr>
</table>

## 📞 联系方式

<div align="center">
  <img src="https://img.shields.io/badge/联系我们-Contact_Us-blue?style=for-the-badge&logo=minutemailer" alt="联系方式">
</div>

如有问题或建议，请通过以下方式联系我们:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/xiyewuqiu/new-lmage/issues" target="_blank">
        <img src="https://img.shields.io/badge/GitHub_Issues-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Issues">
      </a>
    </td>
    <td>创建 <a href="https://github.com/xiyewuqiu/new-lmage/issues">Issue</a></td>
  </tr>
  <tr>
    <td align="center">
      <a href="mailto:xiyewuqiu@gmail.com">
        <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
      </a>
    </td>
    <td>发送邮件至: xiyewuqiu@gmail.com</td>
  </tr>
</table>

## 📝 更新日志

### 2024.05.18 更新：

#### 粘贴上传功能
- 新增支持Ctrl+V直接粘贴图片上传功能
- 添加了粘贴上传时的视觉反馈动画效果
- 优化了键盘快捷键的界面显示样式
- 对所有上传方式进行了统一处理，确保一致的用户体验

### 2024.05.14 更新：

#### 用户认证系统
- 实现了完整的用户注册、登录和会话管理功能
- 使用 JWT 令牌进行安全认证
- 添加了用户个人资料页面和设置

#### 图片管理功能
- 用户可以查看自己上传的所有图片
- 支持图片分页显示和排序
- 实现了图片搜索功能，可按文件名搜索
- 实现批量上传图片

#### 移动端优化
- 修复了移动端菜单按钮显示问题
- 优化了移动端菜单的交互体验
- 增强了移动端菜单按钮和关闭按钮的可见性
- 改进了移动端菜单的层级管理，确保按钮可点击
- 优化了移动端菜单在不同设备上的显示效果

#### 性能优化
- 修复了页面加载时的显示问题
- 优化了加载动画和过渡效果
- 提高了页面加载速度和响应性
- 改进了资源加载顺序，减少白屏时间
