#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('创建 Cloudflare KV 命名空间...');

// 读取 wrangler.toml 文件
const wranglerTomlPath = path.join(process.cwd(), 'wrangler.toml');
let wranglerToml = fs.readFileSync(wranglerTomlPath, 'utf8');

// 提取现有的 KV 命名空间 ID
const imgUrlIdMatch = wranglerToml.match(/binding\s*=\s*"img_url"\s*\nid\s*=\s*"([^"]+)"/);
const usersIdMatch = wranglerToml.match(/binding\s*=\s*"users"\s*\nid\s*=\s*"([^"]+)"/);

const imgUrlId = imgUrlIdMatch ? imgUrlIdMatch[1] : null;
const usersId = usersIdMatch ? usersIdMatch[1] : null;

try {
  // 创建 img_url KV 命名空间（如果不存在）
  console.log('1. 检查 img_url KV 命名空间...');
  let newImgUrlId = imgUrlId;

  try {
    // 检查 KV 命名空间是否存在
    const kvListOutput = execSync('npx wrangler kv:namespace list', { encoding: 'utf8' });
    const imgUrlExists = kvListOutput.includes('img_url');

    if (!imgUrlExists) {
      console.log('   img_url 命名空间不存在，正在创建...');
      const createOutput = execSync('npx wrangler kv:namespace create "img_url"', { encoding: 'utf8' });
      console.log('   创建成功！');

      // 提取新创建的 KV 命名空间 ID
      const idMatch = createOutput.match(/id\s*=\s*"([^"]+)"/);
      if (idMatch) {
        newImgUrlId = idMatch[1];
        console.log(`   新的 img_url KV 命名空间 ID: ${newImgUrlId}`);
      }
    } else {
      console.log('   img_url 命名空间已存在。');

      // 如果命名空间存在但 ID 不存在，尝试获取 ID
      if (!newImgUrlId) {
        const kvInfo = kvListOutput.split('\n').find(line => line.includes('img_url'));
        if (kvInfo) {
          const idMatch = kvInfo.match(/id:\s*([a-f0-9]+)/);
          if (idMatch) {
            newImgUrlId = idMatch[1];
            console.log(`   找到 img_url KV 命名空间 ID: ${newImgUrlId}`);
          }
        }
      }
    }

    // 更新 wrangler.toml 文件中的 img_url KV 命名空间 ID
    if (newImgUrlId && newImgUrlId !== imgUrlId) {
      wranglerToml = wranglerToml.replace(
        /binding\s*=\s*"img_url"\s*\nid\s*=\s*"[^"]*"/,
        `binding = "img_url"\nid = "${newImgUrlId}"`
      );
      console.log(`   已更新 wrangler.toml 文件中的 img_url KV 命名空间 ID。`);
    }
  } catch (error) {
    console.error('   检查/创建 img_url 命名空间时出错:', error.message);
  }

  // 创建 users KV 命名空间（如果不存在）
  console.log('2. 检查 users KV 命名空间...');
  let newUsersId = usersId;

  try {
    // 检查 KV 命名空间是否存在
    const kvListOutput = execSync('npx wrangler kv:namespace list', { encoding: 'utf8' });
    const usersExists = kvListOutput.includes('users');

    if (!usersExists) {
      console.log('   users 命名空间不存在，正在创建...');
      const createOutput = execSync('npx wrangler kv:namespace create "users"', { encoding: 'utf8' });
      console.log('   创建成功！');

      // 提取新创建的 KV 命名空间 ID
      const idMatch = createOutput.match(/id\s*=\s*"([^"]+)"/);
      if (idMatch) {
        newUsersId = idMatch[1];
        console.log(`   新的 users KV 命名空间 ID: ${newUsersId}`);
      }
    } else {
      console.log('   users 命名空间已存在。');

      // 如果命名空间存在但 ID 不存在，尝试获取 ID
      if (!newUsersId) {
        const kvInfo = kvListOutput.split('\n').find(line => line.includes('users'));
        if (kvInfo) {
          const idMatch = kvInfo.match(/id:\s*([a-f0-9]+)/);
          if (idMatch) {
            newUsersId = idMatch[1];
            console.log(`   找到 users KV 命名空间 ID: ${newUsersId}`);
          }
        }
      }
    }

    // 更新 wrangler.toml 文件中的 users KV 命名空间 ID
    if (newUsersId && newUsersId !== usersId) {
      wranglerToml = wranglerToml.replace(
        /binding\s*=\s*"users"\s*\nid\s*=\s*"[^"]*"/,
        `binding = "users"\nid = "${newUsersId}"`
      );
      console.log(`   已更新 wrangler.toml 文件中的 users KV 命名空间 ID。`);
    }
  } catch (error) {
    console.error('   检查/创建 users 命名空间时出错:', error.message);
  }

  // 保存更新后的 wrangler.toml 文件
  fs.writeFileSync(wranglerTomlPath, wranglerToml);
  console.log('✅ KV 命名空间检查/创建完成！wrangler.toml 文件已更新。');
} catch (error) {
  console.error('❌ 创建 KV 命名空间过程中发生错误:', error.message);
  process.exit(1);
}
