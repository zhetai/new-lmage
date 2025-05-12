# TG-Image 图床

TG-Image 是一个基于 Telegram 的图片托管服务，提供简单、可靠的图片上传和存储解决方案。该项目利用 Telegram 的存储能力，为用户提供免费的图床服务。

## 特性

- **简单易用**: 拖放上传，一键复制链接
- **稳定可靠**: 基于 Telegram 的强大存储能力
- **免费无限**: 无存储空间限制
- **全球加速**: 使用 Cloudflare Workers 全球分发
- **安全保障**: 内容审核，防止滥用

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

## 技术架构

- 前端: HTML, CSS, JavaScript
- 后端: Cloudflare Workers
- 存储: Telegram API + Cloudflare KV
- 部署: Wrangler CLI

## 贡献指南

欢迎提交 Pull Request 或创建 Issue 来改进这个项目。

## 许可证

[MIT License](LICENSE)

## 致谢

- [Telegram](https://telegram.org/) - 提供存储基础设施
- [Cloudflare Workers](https://workers.cloudflare.com/) - 提供边缘计算平台
- [Hono](https://hono.dev/) - 轻量级的 Web 框架 