# TG-Image 图床 ✨

<div align="center">
  <img src="public/images/logo.svg" alt="TG-Image Logo" width="120">
  <br>
  <p>
    <strong>现代化、高颜值的 Telegram 图片托管服务</strong>
  </p>
</div>

TG-Image 是一个基于 Telegram 的现代化图片托管服务，提供简单、可靠的图片上传和存储解决方案。该项目利用 Telegram 的强大存储能力，为用户提供免费、无限制的图床服务，并拥有精美的用户界面和流畅的交互体验。

## ✨ 特性

- **🚀 快速上传与全球加速**: 优化的上传流程，使用CDN加速全球访问，快速响应，即时处理
- **📦 无限空间**: 基于Telegram强大的存储能力，无容量限制
- **🔒 安全可靠**: 数据安全存储，稳定访问，长期保存
- **🎨 现代化界面**: 精美的UI设计，支持暗色模式，响应式布局适配各种设备
- **👍 用户友好**: 拖放上传，一键复制链接，支持多种格式

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

4. 创建 Cloudflare KV 命名空间:

```bash
npx wrangler kv:namespace create "img_url"
```

然后将生成的 ID 复制到 `wrangler.toml` 文件中。

5. 部署到 Cloudflare Workers:

```bash
npm run deploy
```

## 使用方法

1. 访问你的网站
2. 拖放图片到上传区域或点击选择文件
3. 上传完成后，系统会自动生成链接
4. 复制需要的链接格式（直接链接、HTML、Markdown）

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

## 🤝 贡献指南

欢迎提交 Pull Request 或创建 Issue 来改进这个项目。我们特别欢迎UI/UX方面的改进建议。

## 📄 许可证

本项目采用 [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/) 进行许可。

这意味着您可以：
- **分享**：复制和重新分发本项目的材料
- **改编**：修改、转换和基于本项目进行创作

但必须遵循以下条件：
- **署名**：您必须给出适当的署名，提供指向本许可证的链接，并指明是否进行了修改
- **非商业性使用**：您不得将本项目用于商业目的
- **相同方式共享**：如果您改编本项目的材料，您必须以相同的许可证分发您的贡献

## 🙏 致谢

- [Telegram](https://telegram.org/) - 提供存储基础设施
- [Cloudflare Workers](https://workers.cloudflare.com/) - 提供边缘计算平台
- [Hono](https://hono.dev/) - 轻量级的 Web 框架
- [Inter Font](https://rsms.me/inter/) - 现代化网页字体

## 📸 界面预览

<div align="center">
  <img src="public/images/screenshot.png" alt="TG-Image 界面预览" width="80%">
  <p><i>TG-Image 现代化界面展示（暗色模式）</i></p>
</div>

## 📞 联系方式

如有问题或建议，请通过以下方式联系我们:

- 创建 [Issue](https://github.com/xiyewuqiu/new-lmage)
- 发送邮件至: xiyewuqiu@gmail.com