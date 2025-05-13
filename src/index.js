import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { upload } from './functions/upload';
import { fileHandler } from './functions/file/[id]';

const app = new Hono();

// 静态文件服务
app.get('/*', serveStatic({ root: './' }));

// 上传接口
app.post('/upload', upload);

// 文件访问接口
app.get('/file/:id', fileHandler);

// 根路径重定向到index.html
app.get('/', (c) => c.redirect('/index.html'));

export default app; 