/**
 * 简单的API认证中间件
 * 使用API密钥进行认证
 */
export async function apiAuth(c, requiredKey) {
    // 从请求头中获取API密钥
    const apiKey = c.req.header('X-API-Key');
    
    // 检查API密钥是否存在且匹配
    if (!apiKey || apiKey !== requiredKey) {
        return {
            authenticated: false,
            response: c.json({ 
                error: '未授权访问', 
                message: '缺少有效的API密钥' 
            }, 401)
        };
    }
    
    return {
        authenticated: true
    };
}
