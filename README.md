# TG-Image 图床 ✨

<div align="center">
  <img src="public/images/logo.svg" alt="TG-Image Logo" width="120">
  <br>
  <p>
    <strong>现代化、高颜值的 Telegram 图片托管服务</strong>
  </p>
</div>

TG-Image 是一个基于 Telegram 的现代化图片托管服务，提供简单、可靠的图片上传和存储解决方案。该项目利用 Telegram 的强大存储能力，为用户提供免费、无限制的图床服务，并拥有精美的用户界面和流畅的交互体验。特别支持原图上传和原图下载功能，确保您的图片在分享过程中保持原始质量，不会被压缩或降低画质。

## ✨ 特性

- **🚀 快速上传与全球加速**: 优化的上传流程，使用CDN加速全球访问，快速响应，即时处理
- **📦 无限空间**: 基于Telegram强大的存储能力，无容量限制
- **🔒 安全可靠**: 数据安全存储，稳定访问，长期保存
- **🎨 现代化界面**: 精美的UI设计，支持暗色模式，响应式布局适配各种设备
- **👍 用户友好**: 拖放上传，一键复制链接，支持多种格式
- **📸 原图上传与下载**: 保持图片原始质量，不进行压缩，确保图片完美呈现
- **👤 用户系统**: 支持用户注册、登录，管理个人上传的图片
- **🏷️ 图片管理**: 支持图片列表、删除、重命名、标签管理和搜索功能

## 部署指南

### 前提条件

1. [Cloudflare](https://cloudflare.com) 账号
2. Telegram Bot Token (通过 [@BotFather](https://t.me/BotFather) 创建)
3. Telegram Chat ID (可以是群组或频道)
4. [Node.js](https://nodejs.org/) (开发环境)

### 安装步骤

1. 克隆仓库:

```bash
git clone https://github.com/your-username/tg-image.git
cd tg-image
```

2. 安装依赖:

```bash
npm install
```

3. 配置环境变量:

修改 `wrangler.toml` 文件，填入你的 Telegram Bot Token 和 Chat ID:

```toml
[vars]
TG_Bot_Token = "YOUR_BOT_TOKEN"
TG_Chat_ID = "YOUR_CHAT_ID"
```

4. 创建 Cloudflare KV 命名空间并部署:

```bash
# 创建 KV 命名空间并部署
npm run setup
```

或者手动创建 KV 命名空间:

```bash
# 创建图片 KV 命名空间
npx wrangler kv:namespace create "img_url"

# 创建用户 KV 命名空间
npx wrangler kv:namespace create "users"
```

然后将生成的 ID 复制到 `wrangler.toml` 文件中。

5. 部署到 Cloudflare Workers:

```bash
npm run deploy
```

## 使用方法

### 匿名上传
1. 访问你的网站
2. 拖放图片到上传区域或点击选择文件
3. 上传完成后，系统会自动生成链接（所有图片均以原图质量上传）
4. 复制需要的链接格式（直接链接、HTML、Markdown）
5. 分享链接给他人，对方打开链接时将看到原图，无任何压缩或质量损失

### 用户功能
1. 注册/登录：点击导航栏中的"登录"链接，创建账户或登录
2. 图片管理：登录后，点击"我的图片"进入仪表盘
3. 在仪表盘中，你可以：
   - 查看所有上传的图片
   - 复制图片链接
   - 编辑图片信息（文件名、标签）
   - 删除图片
   - 搜索图片

## 🖥️ 技术架构

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Cloudflare Workers
- **存储**: Telegram API + Cloudflare KV
- **部署**: Wrangler CLI

## 🛠️ 开发

本地开发服务器:

```bash
npm run dev
```

## 🌟 特色功能

- **暗色模式**: 自动适应系统设置，也可手动切换
- **3D交互效果**: 卡片悬停时的立体效果
- **粒子动画背景**: 动态视觉效果增强
- **滚动动画**: 页面元素随滚动平滑显示
- **响应式设计**: 完美适配各种设备尺寸
- **原图保真技术**: 图片上传和下载过程中保持原始质量，不进行压缩，适合摄影作品和高清图像分享
- **用户认证系统**: 基于JWT的安全认证机制
- **图片标签管理**: 为图片添加标签，方便分类和搜索
- **个人仪表盘**: 用户可以管理自己上传的所有图片

## 🤝 贡献指南

欢迎提交 Pull Request 或创建 Issue 来改进这个项目。我们特别欢迎UI/UX方面的改进建议。

## 📄 许可证

本项目采用 **GNU Affero通用公共许可证v3.0 (AGPL-3.0) 附加 Commons Clause** 进行许可。

这是一个强制开源且禁止商用的许可证组合，具有法律效力，主要条款如下：

- **强制开源**：任何对本软件的修改或衍生作品必须以相同的许可证（AGPL-3.0）开源
- **网络使用也视为分发**：即使通过网络提供服务，也必须开源您的修改
- **禁止商业使用**：根据Commons Clause限制，禁止将本软件或其任何部分用于商业目的
- **专利授权**：授予使用者在该软件相关的专利上的权利
- **无担保声明**：软件按"原样"提供，不提供任何形式的担保

详细条款请参阅项目根目录下的LICENSE文件。

**注意**：如需商业使用，请联系项目作者获取商业许可。

## 🙏 致谢

- [Telegram](https://telegram.org/) - 提供存储基础设施
- [Cloudflare Workers](https://workers.cloudflare.com/) - 提供边缘计算平台
- [Hono](https://hono.dev/) - 轻量级的 Web 框架
- [Inter Font](https://rsms.me/inter/) - 现代化网页字体

## 📞 联系方式

如有问题或建议，请通过以下方式联系我们:

- 创建 [Issue](https://github.com/xiyewuqiu/new-lmage/issues)
- 发送邮件至: xiyewuqiu@gmail.com
