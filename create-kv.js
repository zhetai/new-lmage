#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('创建 Cloudflare KV 命名空间...');

try {
  // 创建 img_url KV 命名空间（如果不存在）
  console.log('1. 创建 img_url KV 命名空间...');
  try {
    const imgUrlOutput = execSync('npx wrangler kv:namespace list', { encoding: 'utf8' });
    if (!imgUrlOutput.includes('img_url')) {
      console.log('   img_url 命名空间不存在，正在创建...');
      const createImgUrlOutput = execSync('npx wrangler kv:namespace create "img_url"', { encoding: 'utf8' });
      console.log('   创建成功！请将生成的 ID 复制到 wrangler.toml 文件中。');
      console.log(createImgUrlOutput);
    } else {
      console.log('   img_url 命名空间已存在。');
    }
  } catch (error) {
    console.error('   检查 img_url 命名空间时出错:', error.message);
  }

  // 创建 users KV 命名空间（如果不存在）
  console.log('2. 创建 users KV 命名空间...');
  try {
    const usersOutput = execSync('npx wrangler kv:namespace list', { encoding: 'utf8' });
    if (!usersOutput.includes('users')) {
      console.log('   users 命名空间不存在，正在创建...');
      const createUsersOutput = execSync('npx wrangler kv:namespace create "users"', { encoding: 'utf8' });
      console.log('   创建成功！请将生成的 ID 复制到 wrangler.toml 文件中。');
      console.log(createUsersOutput);
    } else {
      console.log('   users 命名空间已存在。');
    }
  } catch (error) {
    console.error('   检查 users 命名空间时出错:', error.message);
  }

  console.log('✅ KV 命名空间检查/创建完成！');
} catch (error) {
  console.error('❌ 创建 KV 命名空间过程中发生错误:', error.message);
  process.exit(1);
}
