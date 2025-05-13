import { errorHandling, telemetryData } from "./utils/middleware";
import { apiAuth } from "./utils/auth";

/**
 * 直接上传API - 仅供个人使用
 * 不返回链接，只返回上传状态和文件ID
 */
export async function directUpload(c) {
    const env = c.env;
    
    // API认证检查
    const authResult = await apiAuth(c, env.API_KEY || 'your-api-key-here');
    if (!authResult.authenticated) {
        return authResult.response;
    }

    try {
        const formData = await c.req.formData();

        // 错误处理和遥测数据
        await errorHandling(c);
        telemetryData(c);

        const uploadFile = formData.get('file');
        if (!uploadFile) {
            throw new Error('未上传文件');
        }

        const fileName = uploadFile.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();

        const telegramFormData = new FormData();
        telegramFormData.append("chat_id", env.TG_Chat_ID);

        // 根据文件类型选择合适的上传方式
        let apiEndpoint;
        if (uploadFile.type.startsWith('image/')) {
            // 对于图片类型，使用sendDocument以保持原图质量
            telegramFormData.append("document", uploadFile);
            apiEndpoint = 'sendDocument';
        } else if (uploadFile.type.startsWith('audio/')) {
            telegramFormData.append("audio", uploadFile);
            apiEndpoint = 'sendAudio';
        } else if (uploadFile.type.startsWith('video/')) {
            telegramFormData.append("video", uploadFile);
            apiEndpoint = 'sendVideo';
        } else {
            telegramFormData.append("document", uploadFile);
            apiEndpoint = 'sendDocument';
        }

        const result = await sendToTelegram(telegramFormData, apiEndpoint, env);

        if (!result.success) {
            throw new Error(result.error);
        }

        const fileId = getFileId(result.data);

        if (!fileId) {
            throw new Error('获取文件ID失败');
        }

        // 将文件信息保存到 KV 存储
        if (env.img_url) {
            await env.img_url.put(`${fileId}.${fileExtension}`, "", {
                metadata: {
                    TimeStamp: Date.now(),
                    ListType: "None",
                    Label: "None",
                    liked: false,
                    fileName: fileName,
                    fileSize: uploadFile.size,
                }
            });
        }

        // 只返回上传成功状态和文件ID，不返回链接
        return c.json({
            success: true,
            message: '上传成功',
            file_id: fileId,
            file_extension: fileExtension,
            original_name: fileName,
            size: uploadFile.size,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('上传错误:', error);
        return c.json({ 
            success: false,
            error: error.message 
        }, 500);
    }
}

/**
 * 获取上传文件的ID
 * 对于图片，我们使用document类型上传以保持原图质量
 */
function getFileId(response) {
    if (!response.ok || !response.result) return null;

    const result = response.result;
    // 保留photo处理逻辑以兼容旧数据，但新上传的图片会走document逻辑
    if (result.photo) {
        return result.photo.reduce((prev, current) =>
            (prev.file_size > current.file_size) ? prev : current
        ).file_id;
    }
    if (result.document) return result.document.file_id;
    if (result.video) return result.video.file_id;
    if (result.audio) return result.audio.file_id;

    return null;
}

/**
 * 发送文件到Telegram
 */
async function sendToTelegram(formData, apiEndpoint, env, retryCount = 0) {
    const MAX_RETRIES = 2;
    const apiUrl = `https://api.telegram.org/bot${env.TG_Bot_Token}/${apiEndpoint}`;

    try {
        const response = await fetch(apiUrl, { method: "POST", body: formData });
        const responseData = await response.json();

        if (response.ok) {
            return { success: true, data: responseData };
        }

        return {
            success: false,
            error: responseData.description || '上传到Telegram失败'
        };
    } catch (error) {
        console.error('网络错误:', error);
        if (retryCount < MAX_RETRIES) {
            // 网络错误时的重试逻辑
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return await sendToTelegram(formData, apiEndpoint, env, retryCount + 1);
        }
        return { success: false, error: '发生网络错误' };
    }
}
