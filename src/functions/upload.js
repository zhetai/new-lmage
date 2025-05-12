import { errorHandling, telemetryData } from "./utils/middleware";

export async function upload(c) {
    const env = c.env;
    
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
            telegramFormData.append("photo", uploadFile);
            apiEndpoint = 'sendPhoto';
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
        
        return c.json([{ 'src': `/file/${fileId}.${fileExtension}` }]);
    } catch (error) {
        console.error('上传错误:', error);
        return c.json({ error: error.message }, 500);
    }
}

function getFileId(response) {
    if (!response.ok || !response.result) return null;
    
    const result = response.result;
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

async function sendToTelegram(formData, apiEndpoint, env, retryCount = 0) {
    const MAX_RETRIES = 2;
    const apiUrl = `https://api.telegram.org/bot${env.TG_Bot_Token}/${apiEndpoint}`;
    
    try {
        const response = await fetch(apiUrl, { method: "POST", body: formData });
        const responseData = await response.json();
        
        if (response.ok) {
            return { success: true, data: responseData };
        }
        
        // 图片上传失败时转为文档方式重试
        if (retryCount < MAX_RETRIES && apiEndpoint === 'sendPhoto') {
            console.log('以文档方式重试图片上传...');
            const newFormData = new FormData();
            newFormData.append('chat_id', formData.get('chat_id'));
            newFormData.append('document', formData.get('photo'));
            return await sendToTelegram(newFormData, 'sendDocument', env, retryCount + 1);
        }
        
        return {
            success: false,
            error: responseData.description || '上传到Telegram失败'
        };
    } catch (error) {
        console.error('网络错误:', error);
        if (retryCount < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return await sendToTelegram(formData, apiEndpoint, env, retryCount + 1);
        }
        return { success: false, error: '发生网络错误' };
    }
} 