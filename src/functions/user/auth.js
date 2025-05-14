/**
 * 用户认证相关API
 */
import { generateToken, hashPassword, verifyPassword } from '../utils/auth';
import { errorHandling, telemetryData } from '../utils/middleware';

// 用户注册
export async function register(c) {
  try {
    // 错误处理和遥测数据
    await errorHandling(c);
    telemetryData(c);

    const { username, password, email } = await c.req.json();
    
    // 验证输入
    if (!username || !password || !email) {
      return c.json({ error: '用户名、密码和邮箱都是必填项' }, 400);
    }
    
    // 检查用户名是否已存在
    const existingUser = await c.env.users.get(`user:${username}`);
    if (existingUser) {
      return c.json({ error: '用户名已存在' }, 409);
    }
    
    // 检查邮箱是否已存在
    const emailKey = `email:${email}`;
    const existingEmail = await c.env.users.get(emailKey);
    if (existingEmail) {
      return c.json({ error: '邮箱已被注册' }, 409);
    }
    
    // 哈希密码
    const hashedPassword = await hashPassword(password);
    
    // 创建用户对象
    const userId = crypto.randomUUID();
    const user = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // 存储用户信息
    await c.env.users.put(`user:${username}`, JSON.stringify(user));
    await c.env.users.put(`userid:${userId}`, username);
    await c.env.users.put(emailKey, username);
    
    // 生成令牌
    const token = await generateToken({ id: userId, username }, c.env);
    
    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    return c.json({ 
      message: '注册成功', 
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('注册错误:', error);
    return c.json({ error: '注册失败' }, 500);
  }
}

// 用户登录
export async function login(c) {
  try {
    // 错误处理和遥测数据
    await errorHandling(c);
    telemetryData(c);

    const { username, password } = await c.req.json();
    
    // 验证输入
    if (!username || !password) {
      return c.json({ error: '用户名和密码都是必填项' }, 400);
    }
    
    // 获取用户信息
    const userJson = await c.env.users.get(`user:${username}`);
    if (!userJson) {
      return c.json({ error: '用户名或密码错误' }, 401);
    }
    
    const user = JSON.parse(userJson);
    
    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return c.json({ error: '用户名或密码错误' }, 401);
    }
    
    // 生成令牌
    const token = await generateToken({ id: user.id, username }, c.env);
    
    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    return c.json({ 
      message: '登录成功', 
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('登录错误:', error);
    return c.json({ error: '登录失败' }, 500);
  }
}

// 获取当前用户信息
export async function getCurrentUser(c) {
  try {
    const user = c.get('user');
    
    // 获取完整的用户信息
    const username = user.username;
    const userJson = await c.env.users.get(`user:${username}`);
    
    if (!userJson) {
      return c.json({ error: '用户不存在' }, 404);
    }
    
    const userFull = JSON.parse(userJson);
    
    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = userFull;
    return c.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return c.json({ error: '获取用户信息失败' }, 500);
  }
}
