# Cloudflare Pages 部署配置

如果你使用 Cloudflare Pages 部署此项目，请确保在 Cloudflare Pages 的 Web 界面中更新部署命令。

## 更新部署命令

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages 部分
3. 选择你的项目
4. 点击 "Settings" 标签
5. 在 "Build & deployments" 部分中，找到 "Build command" 设置
6. 将 "Build command" 更改为：`npm run setup`
7. 点击 "Save" 保存更改

这个命令会自动创建必要的 KV 命名空间（如果不存在），并更新 `wrangler.toml` 文件中的 KV 命名空间 ID，然后部署项目。

## 环境变量

确保在 Cloudflare Pages 的环境变量中设置以下变量：

- `TG_Bot_Token`: 你的 Telegram Bot Token
- `TG_Chat_ID`: 你的 Telegram Chat ID
- `JWT_SECRET`: 用于 JWT 认证的密钥

## KV 命名空间

确保在 Cloudflare Pages 的 KV 命名空间中绑定以下命名空间：

- `img_url`: 用于存储图片 URL
- `users`: 用于存储用户信息

你可以使用以下命令创建 KV 命名空间（Wrangler 4.x 版本）：

```bash
# 创建图片 KV 命名空间
npx wrangler kv namespace create "img_url"

# 创建用户 KV 命名空间
npx wrangler kv namespace create "users"
```

> **注意**：在 Wrangler 4.x 版本中，KV 命名空间的命令格式已经改变。
> 正确的命令格式是：`npx wrangler kv namespace create "img_url"`（注意 `kv` 和 `namespace` 之间没有冒号）

## 部署

更新配置后，重新部署项目：

1. 在 Cloudflare Pages 的项目页面中，点击 "Deployments" 标签
2. 点击 "Create new deployment" 按钮
3. 选择要部署的分支
4. 点击 "Deploy" 按钮

## Wrangler 登录

在部署前，确保你已经登录到 Cloudflare 账号：

```bash
npx wrangler login
```

这个命令会打开浏览器，引导你完成 Cloudflare 账号的登录过程。

## 故障排除

如果部署失败，请检查以下内容：

1. 确保你已经登录到 Cloudflare 账号（`npx wrangler login`）
2. 确保 `wrangler.toml` 文件中的 KV 命名空间 ID 是正确的
3. 确保 `package.json` 中的部署命令是 `wrangler deploy`
4. 确保 Cloudflare Pages 的部署命令是 `npm run setup`
5. 检查部署日志，查看具体错误信息

### KV 命名空间错误

如果遇到 `KV namespace 'xxx' not found` 错误，请确保你已经创建了 KV 命名空间，并且 ID 是正确的：

```bash
# 列出所有 KV 命名空间
npx wrangler kv namespace list

# 创建 KV 命名空间
npx wrangler kv namespace create "img_url"
npx wrangler kv namespace create "users"
```

然后将生成的 ID 更新到 `wrangler.toml` 文件中。
