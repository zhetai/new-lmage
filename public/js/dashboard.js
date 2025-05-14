/**
 * 用户图片管理相关功能
 */

// 全局变量
let currentPage = 1;
let totalPages = 1;
let currentImages = [];
let currentTags = [];
let currentEditingImageId = null;

// 初始化仪表盘
function initDashboard() {
    // 加载用户图片
    loadUserImages();
    
    // 初始化搜索功能
    initSearch();
    
    // 初始化编辑模态框
    initEditModal();
}

// 加载用户图片
async function loadUserImages(page = 1, query = '') {
    try {
        const imageGrid = document.getElementById('imageGrid');
        const emptyState = document.getElementById('emptyState');
        const pagination = document.getElementById('pagination');
        
        // 显示加载状态
        imageGrid.innerHTML = '<div class="loading-text">加载中...</div>';
        
        // 构建API URL
        let url = `/api/images?page=${page}`;
        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        }
        
        // 发送请求
        const response = await fetch(url, {
            headers: getAuthHeader()
        });
        
        if (!response.ok) {
            throw new Error('获取图片失败');
        }
        
        const data = await response.json();
        currentImages = data.files || [];
        
        // 更新分页信息
        if (data.pagination) {
            currentPage = data.pagination.page;
            totalPages = data.pagination.totalPages;
        }
        
        // 检查是否有图片
        if (currentImages.length === 0) {
            imageGrid.innerHTML = '';
            emptyState.style.display = 'block';
            pagination.style.display = 'none';
            return;
        }
        
        // 隐藏空状态
        emptyState.style.display = 'none';
        
        // 渲染图片
        renderImages(currentImages);
        
        // 渲染分页
        renderPagination();
    } catch (error) {
        console.error('加载图片错误:', error);
        document.getElementById('imageGrid').innerHTML = `
            <div class="error-message">
                加载图片失败: ${error.message}
                <button onclick="loadUserImages()" class="retry-btn">重试</button>
            </div>
        `;
    }
}

// 渲染图片
function renderImages(images) {
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = '';
    
    images.forEach(image => {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.dataset.id = image.id;
        
        // 格式化文件大小
        const fileSize = formatFileSize(image.fileSize);
        
        // 格式化上传时间
        const uploadDate = new Date(image.uploadTime).toLocaleDateString();
        
        card.innerHTML = `
            <div class="image-preview">
                <img src="${image.url}" alt="${image.fileName}" loading="lazy">
            </div>
            <div class="image-info">
                <div class="image-name">${image.fileName}</div>
                <div class="image-meta">
                    <span>${fileSize}</span>
                    <span>${uploadDate}</span>
                </div>
                ${image.tags ? `
                <div class="image-tags">
                    ${image.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                ` : ''}
            </div>
            <div class="image-actions">
                <button class="image-btn copy-btn" data-clipboard-text="${window.location.origin}${image.url}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    复制
                </button>
                <button class="image-btn edit-btn" data-id="${image.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    编辑
                </button>
                <button class="image-btn delete-btn" data-id="${image.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    删除
                </button>
            </div>
        `;
        
        imageGrid.appendChild(card);
    });
    
    // 初始化复制按钮
    new ClipboardJS('.copy-btn').on('success', function(e) {
        const originalText = e.trigger.innerHTML;
        e.trigger.innerHTML = '已复制!';
        setTimeout(() => {
            e.trigger.innerHTML = originalText;
        }, 2000);
    });
    
    // 添加编辑按钮事件
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const imageId = btn.dataset.id;
            openEditModal(imageId);
        });
    });
    
    // 添加删除按钮事件
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const imageId = btn.dataset.id;
            confirmDeleteImage(imageId);
        });
    });
}

// 渲染分页
function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // 上一页按钮
    const prevBtn = document.createElement('button');
    prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.textContent = '上一页';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            loadUserImages(currentPage - 1);
        }
    });
    pagination.appendChild(prevBtn);
    
    // 页码按钮
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            if (i !== currentPage) {
                loadUserImages(i);
            }
        });
        pagination.appendChild(pageBtn);
    }
    
    // 下一页按钮
    const nextBtn = document.createElement('button');
    nextBtn.className = `page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
    nextBtn.textContent = '下一页';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            loadUserImages(currentPage + 1);
        }
    });
    pagination.appendChild(nextBtn);
}

// 初始化搜索功能
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        loadUserImages(1, query);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            loadUserImages(1, query);
        }
    });
}

// 初始化编辑模态框
function initEditModal() {
    const editModal = document.getElementById('editModal');
    const closeModal = document.getElementById('closeModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const saveEdit = document.getElementById('saveEdit');
    const tagInput = document.getElementById('tagInput');
    const tagsInput = document.getElementById('tagsInput');
    
    // 关闭模态框
    function closeEditModal() {
        editModal.style.display = 'none';
        currentEditingImageId = null;
        currentTags = [];
        
        // 清空标签输入
        const tagElements = tagsInput.querySelectorAll('.tag');
        tagElements.forEach(tag => tag.remove());
    }
    
    // 关闭按钮
    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    // 添加标签
    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            
            const tag = tagInput.value.trim();
            if (tag && !currentTags.includes(tag)) {
                addTag(tag);
                tagInput.value = '';
            }
        }
    });
    
    // 保存编辑
    saveEdit.addEventListener('click', async () => {
        if (!currentEditingImageId) return;
        
        const fileName = document.getElementById('editFileName').value.trim();
        
        if (!fileName) {
            alert('文件名不能为空');
            return;
        }
        
        try {
            const response = await fetch(`/api/images/${currentEditingImageId}`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fileName,
                    tags: currentTags
                })
            });
            
            if (!response.ok) {
                throw new Error('更新图片信息失败');
            }
            
            // 关闭模态框
            closeEditModal();
            
            // 重新加载图片
            loadUserImages(currentPage);
        } catch (error) {
            console.error('更新图片信息错误:', error);
            alert(`更新失败: ${error.message}`);
        }
    });
}

// 打开编辑模态框
function openEditModal(imageId) {
    const editModal = document.getElementById('editModal');
    const editFileName = document.getElementById('editFileName');
    const tagsInput = document.getElementById('tagsInput');
    const tagInput = document.getElementById('tagInput');
    
    // 查找图片
    const image = currentImages.find(img => img.id === imageId);
    if (!image) return;
    
    // 设置当前编辑的图片ID
    currentEditingImageId = imageId;
    
    // 设置文件名
    editFileName.value = image.fileName;
    
    // 清空标签
    const tagElements = tagsInput.querySelectorAll('.tag');
    tagElements.forEach(tag => tag.remove());
    
    // 设置标签
    currentTags = image.tags || [];
    currentTags.forEach(tag => {
        addTagElement(tag);
    });
    
    // 显示模态框
    editModal.style.display = 'flex';
}

// 添加标签
function addTag(tag) {
    if (!tag || currentTags.includes(tag)) return;
    
    currentTags.push(tag);
    addTagElement(tag);
}

// 添加标签元素
function addTagElement(tag) {
    const tagsInput = document.getElementById('tagsInput');
    const tagInput = document.getElementById('tagInput');
    
    const tagElement = document.createElement('div');
    tagElement.className = 'tag';
    tagElement.innerHTML = `
        ${tag}
        <span class="tag-remove" data-tag="${tag}">&times;</span>
    `;
    
    // 添加删除标签事件
    tagElement.querySelector('.tag-remove').addEventListener('click', () => {
        removeTag(tag);
        tagElement.remove();
    });
    
    tagsInput.insertBefore(tagElement, tagInput);
}

// 删除标签
function removeTag(tag) {
    const index = currentTags.indexOf(tag);
    if (index !== -1) {
        currentTags.splice(index, 1);
    }
}

// 确认删除图片
function confirmDeleteImage(imageId) {
    if (confirm('确定要删除这张图片吗？此操作不可撤销。')) {
        deleteImage(imageId);
    }
}

// 删除图片
async function deleteImage(imageId) {
    try {
        const response = await fetch(`/api/images/${imageId}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        
        if (!response.ok) {
            throw new Error('删除图片失败');
        }
        
        // 重新加载图片
        loadUserImages(currentPage);
    } catch (error) {
        console.error('删除图片错误:', error);
        alert(`删除失败: ${error.message}`);
    }
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否在仪表盘页面
    if (window.location.pathname === '/dashboard.html') {
        // 初始化仪表盘
        initDashboard();
    }
});
