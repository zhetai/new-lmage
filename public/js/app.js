document.addEventListener('DOMContentLoaded', () => {
    // 初始化剪贴板功能
    const clipboard = new ClipboardJS('.copy-btn');
    
    clipboard.on('success', (e) => {
        const originalText = e.trigger.textContent;
        e.trigger.textContent = '已复制！';
        setTimeout(() => {
            e.trigger.textContent = originalText;
        }, 2000);
        e.clearSelection();
    });
    
    clipboard.on('error', (e) => {
        const originalText = e.trigger.textContent;
        e.trigger.textContent = '复制失败';
        setTimeout(() => {
            e.trigger.textContent = originalText;
        }, 2000);
    });

    // 获取元素
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const uploadStatus = document.getElementById('uploadStatus');
    const resultContainer = document.getElementById('resultContainer');
    const previewImage = document.getElementById('previewImage');
    const directLink = document.getElementById('directLink');
    const htmlCode = document.getElementById('htmlCode');
    const mdCode = document.getElementById('mdCode');
    const uploadAgainBtn = document.getElementById('uploadAgainBtn');

    // 点击上传区域触发文件选择
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    // 监听拖拽事件
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // 拖拽效果
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add('drag-over');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('drag-over');
        }, false);
    });

    // 处理文件拖放
    dropArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length) {
            fileInput.files = files;
            handleFile(files[0]);
        }
    });

    // 监听文件选择
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });

    // 处理文件上传
    function handleFile(file) {
        // 检查是否是图片
        if (!file.type.match('image.*')) {
            uploadStatus.textContent = '请上传图片文件！';
            uploadStatus.className = 'upload-status error';
            return;
        }

        // 显示上传中状态
        uploadStatus.textContent = '上传中...';
        uploadStatus.className = 'upload-status loading';

        // 准备表单数据
        const formData = new FormData();
        formData.append('file', file);

        // 发送请求
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('上传失败，服务器响应错误');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            // 上传成功
            uploadStatus.textContent = '上传成功！';
            uploadStatus.className = 'upload-status success';
            
            // 显示结果
            showResult(data[0].src, file);
        })
        .catch(error => {
            uploadStatus.textContent = `上传失败: ${error.message}`;
            uploadStatus.className = 'upload-status error';
        });
    }

    // 显示上传结果
    function showResult(filePath, file) {
        // 构建完整URL
        const baseUrl = window.location.origin;
        const fileUrl = baseUrl + filePath;
        
        // 设置图片预览
        previewImage.src = fileUrl;
        previewImage.alt = file.name;
        
        // 设置各种代码
        directLink.value = fileUrl;
        htmlCode.value = `<img src="${fileUrl}" alt="${file.name}" />`;
        mdCode.value = `![${file.name}](${fileUrl})`;
        
        // 隐藏上传区域，显示结果
        dropArea.style.display = 'none';
        resultContainer.style.display = 'block';
    }

    // 再次上传
    uploadAgainBtn.addEventListener('click', () => {
        // 清空文件输入
        fileInput.value = '';
        uploadStatus.textContent = '';
        uploadStatus.className = 'upload-status';
        
        // 隐藏结果，显示上传区域
        resultContainer.style.display = 'none';
        dropArea.style.display = 'block';
    });
}); 