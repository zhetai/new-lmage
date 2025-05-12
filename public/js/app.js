document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题
    initTheme();

    // 初始化剪贴板功能
    initClipboard();

    // 初始化上传功能
    initUpload();

    // 初始化图片预览
    initImagePreview();
});

// 主题切换功能
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const darkIcon = document.getElementById('darkIcon');
    const lightIcon = document.getElementById('lightIcon');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');

    // 根据保存的主题或系统偏好设置初始主题
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        darkIcon.style.display = 'none';
        lightIcon.style.display = 'block';
    } else {
        document.body.classList.remove('dark-mode');
        darkIcon.style.display = 'block';
        lightIcon.style.display = 'none';
    }

    // 主题切换事件
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            darkIcon.style.display = 'none';
            lightIcon.style.display = 'block';
        } else {
            localStorage.setItem('theme', 'light');
            darkIcon.style.display = 'block';
            lightIcon.style.display = 'none';
        }
    });

    // 监听系统主题变化
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                darkIcon.style.display = 'none';
                lightIcon.style.display = 'block';
            } else {
                document.body.classList.remove('dark-mode');
                darkIcon.style.display = 'block';
                lightIcon.style.display = 'none';
            }
        }
    });
}

// 剪贴板功能
function initClipboard() {
    const clipboard = new ClipboardJS('.copy-btn');

    clipboard.on('success', (e) => {
        const originalText = e.trigger.textContent;
        e.trigger.textContent = '已复制！';
        e.trigger.classList.add('success');

        setTimeout(() => {
            e.trigger.textContent = originalText;
            e.trigger.classList.remove('success');
        }, 2000);

        e.clearSelection();
    });

    clipboard.on('error', (e) => {
        const originalText = e.trigger.textContent;
        e.trigger.textContent = '复制失败';
        e.trigger.classList.add('error');

        setTimeout(() => {
            e.trigger.textContent = originalText;
            e.trigger.classList.remove('error');
        }, 2000);
    });
}

// 上传功能
function initUpload() {
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
    dropArea.addEventListener('click', (e) => {
        // 防止点击到上传状态区域时触发文件选择
        if (e.target !== uploadStatus && !uploadStatus.contains(e.target)) {
            fileInput.click();
        }
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
            showError('请上传图片文件！');
            return;
        }

        // 文件大小检查 (限制为10MB)
        if (file.size > 10 * 1024 * 1024) {
            showError('图片大小不能超过10MB！');
            return;
        }

        // 显示上传中状态
        uploadStatus.innerHTML = '<span class="loading-text">上传中</span>';
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
            showError(`上传失败: ${error.message}`);
        });
    }

    // 显示错误信息
    function showError(message) {
        uploadStatus.textContent = message;
        uploadStatus.className = 'upload-status error';

        // 震动效果
        dropArea.classList.add('shake');
        setTimeout(() => {
            dropArea.classList.remove('shake');
        }, 500);
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
}

// 图片预览功能
function initImagePreview() {
    const previewImage = document.getElementById('previewImage');

    if (previewImage) {
        previewImage.addEventListener('click', () => {
            // 创建全屏预览
            const fullscreenPreview = document.createElement('div');
            fullscreenPreview.className = 'fullscreen-preview';
            fullscreenPreview.innerHTML = `
                <div class="fullscreen-preview-content">
                    <img src="${previewImage.src}" alt="${previewImage.alt}">
                    <button class="close-preview">×</button>
                </div>
            `;

            document.body.appendChild(fullscreenPreview);
            document.body.style.overflow = 'hidden';

            // 添加关闭功能
            fullscreenPreview.addEventListener('click', (e) => {
                if (e.target === fullscreenPreview || e.target.classList.contains('close-preview')) {
                    document.body.removeChild(fullscreenPreview);
                    document.body.style.overflow = '';
                }
            });

            // ESC键关闭
            document.addEventListener('keydown', function escClose(e) {
                if (e.key === 'Escape') {
                    document.body.removeChild(fullscreenPreview);
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', escClose);
                }
            });
        });
    }
}