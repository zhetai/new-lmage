# 直接上传API使用说明

## 概述

这个API允许你直接上传图片到你的图床服务，不返回链接，只返回上传状态和文件ID信息。这个API需要API密钥认证，确保只有你能使用。

## 配置

在部署前，请确保在 `wrangler.toml` 文件中设置了安全的API密钥：

```toml
[vars]
# 其他环境变量...
API_KEY = "your-secure-api-key-here"  # 请替换为一个复杂、安全的密钥
```

## API端点

```
POST /api/upload
```

## 请求头

| 名称 | 必填 | 描述 |
|------|------|------|
| X-API-Key | 是 | 用于认证的API密钥 |

## 请求体

使用 `multipart/form-data` 格式，包含以下字段：

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| file | File | 是 | 要上传的图片文件 |

## 响应

### 成功响应

```json
{
  "success": true,
  "message": "上传成功",
  "file_id": "文件ID",
  "file_extension": "文件扩展名",
  "original_name": "原始文件名",
  "size": 文件大小,
  "timestamp": 上传时间戳
}
```

### 错误响应

```json
{
  "success": false,
  "error": "错误信息"
}
```

## 使用示例

### 使用curl

```bash
curl -X POST https://你的域名/api/upload \
  -H "X-API-Key: your-secure-api-key-here" \
  -F "file=@/path/to/your/image.jpg"
```

### 使用Python

```python
import requests

url = "https://你的域名/api/upload"
headers = {
    "X-API-Key": "your-secure-api-key-here"
}
files = {
    "file": open("/path/to/your/image.jpg", "rb")
}

response = requests.post(url, headers=headers, files=files)
print(response.json())
```

### 使用JavaScript (Node.js)

```javascript
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

async function uploadImage(imagePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(imagePath));

  const response = await fetch('https://你的域名/api/upload', {
    method: 'POST',
    headers: {
      'X-API-Key': 'your-secure-api-key-here',
      ...form.getHeaders()
    },
    body: form
  });

  const result = await response.json();
  console.log(result);
}

uploadImage('/path/to/your/image.jpg');
```

## 注意事项

1. 请保管好你的API密钥，不要泄露给他人
2. 这个API仅供个人使用，不建议公开或分享
3. 上传的图片仍然会存储在你的Telegram频道/群组中
4. 如果需要获取图片的URL，可以使用返回的file_id和file_extension构建：`/file/{file_id}.{file_extension}`
