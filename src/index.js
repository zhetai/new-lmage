import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { prettyJSON } from 'hono/pretty-json';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { getCookie, setCookie } from 'hono/cookie';
import { cache } from 'hono/cache';
import { authenticatedUpload } from './functions/upload';
import { fileHandler } from './functions/file/[id]';
import { register, login, getCurrentUser } from './functions/user/auth';
import { getUserImages, deleteUserImage, updateImageInfo, searchUserImages } from './functions/user/images';
import { authMiddleware } from './functions/utils/auth';

const app = new Hono();

// 静态文件服务
app.get('/*', serveStatic({ root: './' }));

// 上传接口
app.post('/upload', authenticatedUpload);

// 添加安全头和CSRF保护
app.use((c, next) => {
  // 安全响应头
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('X-Frame-Options', 'DENY');
  c.res.headers.set('X-XSS-Protection', '1; mode=block');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.res.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self' data:;");
  
  // 防止MIME类型嗅探攻击
  if (c.req.path.endsWith('.js')) {
    c.res.headers.set('Content-Type', 'text/javascript');
  } else if (c.req.path.endsWith('.css')) {
    c.res.headers.set('Content-Type', 'text/css');
  }
  
  return next();
});

// 针对非GET请求的CSRF保护
app.use(async (c, next) => {
  // 仅对非GET请求进行CSRF验证
  if (c.req.method !== 'GET') {
    const csrfToken = c.req.header('X-CSRF-Token');
    const expectedToken = c.cookie.get('csrf_token');
    
    // 如果请求中没有CSRF令牌或令牌不匹配
    if (!csrfToken || csrfToken !== expectedToken) {
      // 对API请求返回JSON错误
      if (c.req.path.startsWith('/api/') || c.req.header('Accept')?.includes('application/json')) {
        return c.json({ error: 'CSRF验证失败' }, 403);
      }
      // 对网页请求返回错误页面
      return c.text('禁止访问: CSRF验证失败', 403);
    }
  }
  
  return next();
});

// 生成CSRF令牌并添加到cookie和响应中
app.get('*', async (c, next) => {
  // 如果cookie中没有CSRF令牌，生成一个新的
  if (!c.cookie.get('csrf_token')) {
    const token = generateRandomToken();
    c.cookie.set('csrf_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/'
    });
  }
  
  return next();
});

// 生成随机令牌的辅助函数
function generateRandomToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    token += chars.charAt(randomValues[i] % chars.length);
  }
  return token;
}

// 错误处理中间件
app.use(async (c, next) => {
  try {
    return await next();
  } catch (err) {
    console.error('应用错误:', err);
    
    // 记录错误日志
    if (c.env.LOGS_KV) {
      try {
        const logKey = `error:${Date.now()}`;
        const logData = {
          timestamp: new Date().toISOString(),
          error: err.message,
          stack: err.stack,
          path: c.req.path,
          method: c.req.method,
          ip: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'
        };
        await c.env.LOGS_KV.put(logKey, JSON.stringify(logData));
      } catch (logError) {
        console.error('日志记录失败:', logError);
      }
    }
    
    // 对API请求返回JSON错误
    if (c.req.path.startsWith('/api/') || c.req.header('Accept')?.includes('application/json')) {
      return c.json({ error: '服务器内部错误' }, 500);
    }
    
    // 对网页请求返回错误页面
    return c.text('服务器内部错误', 500);
  }
});

// 文件访问接口
app.get('/file/:id', fileHandler);

// 根路径重定向到index.html
app.get('/', (c) => c.redirect('/index.html'));

// 用户认证相关API
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/user', authMiddleware, getCurrentUser);

// 用户图片管理相关API
app.get('/api/images', authMiddleware, getUserImages);
app.get('/api/images/search', authMiddleware, searchUserImages);
app.delete('/api/images/:id', authMiddleware, deleteUserImage);
app.put('/api/images/:id', authMiddleware, updateImageInfo);

export default app;