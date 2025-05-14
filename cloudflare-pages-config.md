# Cloudflare Pages 部署配置

如果你使用 Cloudflare Pages 部署此项目，请确保在 Cloudflare Pages 的 Web 界面中更新部署命令。

## 更新部署命令

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages 部分
3. 选择你的项目
4. 点击 "Settings" 标签
5. 在 "Build & deployments" 部分中，找到 "Build command" 设置
6. 将 "Build command" 更改为：`npm run deploy`
7. 点击 "Save" 保存更改

## 环境变量

确保在 Cloudflare Pages 的环境变量中设置以下变量：

- `TG_Bot_Token`: 你的 Telegram Bot Token
- `TG_Chat_ID`: 你的 Telegram Chat ID
- `JWT_SECRET`: 用于 JWT 认证的密钥

## KV 命名空间

确保在 Cloudflare Pages 的 KV 命名空间中绑定以下命名空间：

- `img_url`: 用于存储图片 URL
- `users`: 用于存储用户信息

## 部署

更新配置后，重新部署项目：

1. 在 Cloudflare Pages 的项目页面中，点击 "Deployments" 标签
2. 点击 "Create new deployment" 按钮
3. 选择要部署的分支
4. 点击 "Deploy" 按钮

## 故障排除

如果部署失败，请检查以下内容：

1. 确保 `wrangler.toml` 文件中的 KV 命名空间 ID 是正确的
2. 确保 `package.json` 中的部署命令是 `wrangler deploy`
3. 确保 Cloudflare Pages 的部署命令是 `npm run deploy`
4. 检查部署日志，查看具体错误信息
