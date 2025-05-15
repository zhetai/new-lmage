/**
 * 用户图片管理相关功能
 * 升级版 - 增强用户体验和功能
 */

// 全局变量
let currentPage = 1;
let totalPages = 1;
let currentImages = [];
let currentTags = [];
let currentEditingImageId = null;
let allTags = new Set(); // 存储所有标签
let currentSortMethod = 'newest'; // 默认排序方式
let currentTagFilter = ''; // 当前标签过滤器

// 初始化仪表盘
function initDashboard() {
    // 加载用户图片
    loadUserImages();

    // 初始化搜索功能
    initSearch();

    // 初始化排序功能
    initSortFilter();

    // 初始化编辑模态框
    initEditModal();

    // 初始化图片查看器
    initImageViewer();
}

// 加载用户图片
async function loadUserImages(page = 1, query = '', tag = '') {
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
        if (tag) {
            url += `&tag=${encodeURIComponent(tag)}`;
        }

        // 发送请求
        const response = await fetch(url, {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            throw new Error('获取图片失败');
        }

        const data = await response.json();
        let images = data.files || [];

        // 更新分页信息
        if (data.pagination) {
            currentPage = data.pagination.page;
            totalPages = data.pagination.totalPages;
        }

        // 应用排序
        images = sortImages(images, currentSortMethod);

        // 应用标签过滤
        if (currentTagFilter && !tag) {
            images = images.filter(img =>
                img.tags && img.tags.includes(currentTagFilter)
            );
        }

        // 保存当前图片列表
        currentImages = images;

        // 收集所有标签
        collectAllTags(images);

        // 更新统计信息
        updateStatistics(data);

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

        // 渲染标签过滤器
        renderTagFilters();
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

// 收集所有标签
function collectAllTags(images) {
    allTags.clear();
    images.forEach(image => {
        if (image.tags && Array.isArray(image.tags)) {
            image.tags.forEach(tag => allTags.add(tag));
        }
    });
}

// 更新统计信息
function updateStatistics(data) {
    // 总图片数
    const totalImages = document.getElementById('totalImages');
    totalImages.textContent = data.pagination ? data.pagination.total : currentImages.length;

    // 总存储空间
    const totalSize = document.getElementById('totalSize');
    let sizeSum = 0;
    currentImages.forEach(img => {
        sizeSum += img.fileSize || 0;
    });
    totalSize.textContent = formatFileSize(sizeSum);

    // 最近上传数量（7天内）
    const recentUploads = document.getElementById('recentUploads');
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentCount = currentImages.filter(img => img.uploadTime > oneWeekAgo).length;
    recentUploads.textContent = recentCount;
}

// 排序图片
function sortImages(images, method) {
    const sortedImages = [...images];

    switch (method) {
        case 'newest':
            sortedImages.sort((a, b) => b.uploadTime - a.uploadTime);
            break;
        case 'oldest':
            sortedImages.sort((a, b) => a.uploadTime - b.uploadTime);
            break;
        case 'name':
            sortedImages.sort((a, b) => a.fileName.localeCompare(b.fileName));
            break;
        case 'size':
            sortedImages.sort((a, b) => b.fileSize - a.fileSize);
            break;
        default:
            // 默认按最新上传排序
            sortedImages.sort((a, b) => b.uploadTime - a.uploadTime);
    }

    return sortedImages;
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
        const uploadTime = new Date(image.uploadTime).toLocaleTimeString();

        // 创建标签HTML
        const tagsHtml = image.tags && image.tags.length > 0
            ? `<div class="image-tags">
                ${image.tags.map(tag => `<span class="image-tag" data-tag="${tag}">${tag}</span>`).join('')}
               </div>`
            : '';

        card.innerHTML = `
            <div class="image-preview" data-id="${image.id}" data-url="${image.url}">
                <img src="${image.url}" alt="${image.fileName}" loading="lazy">
                <div class="image-zoom-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                </div>
            </div>
            <div class="image-info">
                <div class="image-name" title="${image.fileName}">${image.fileName}</div>
                <div class="image-meta">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                            <line x1="6" y1="6" x2="6.01" y2="6"></line>
                            <line x1="6" y1="18" x2="6.01" y2="18"></line>
                        </svg>
                        ${fileSize}
                    </span>
                    <span title="${uploadDate} ${uploadTime}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${uploadDate}
                    </span>
                </div>
                ${tagsHtml}
            </div>
            <div class="image-actions">
                <button class="image-btn copy-btn" data-clipboard-text="${window.location.origin}${image.url}" title="复制图片链接">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    复制
                </button>
                <button class="image-btn edit-btn" data-id="${image.id}" title="编辑图片信息">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    编辑
                </button>
                <button class="image-btn delete-btn" data-id="${image.id}" title="删除图片">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        e.trigger.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            已复制!
        `;
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

    // 添加图片预览点击事件
    document.querySelectorAll('.image-preview').forEach(preview => {
        preview.addEventListener('click', () => {
            const imageId = preview.dataset.id;
            const imageUrl = preview.dataset.url;
            openImageViewer(imageId, imageUrl);
        });
    });

    // 添加标签点击事件
    document.querySelectorAll('.image-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止触发父元素的点击事件
            const tagName = tag.dataset.tag;
            filterByTag(tagName);
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

    // 添加输入实时搜索（延迟执行）
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = searchInput.value.trim();
            if (query.length >= 2 || query.length === 0) {
                loadUserImages(1, query);
            }
        }, 500);
    });
}

// 初始化排序功能
function initSortFilter() {
    const sortSelect = document.getElementById('sortSelect');

    sortSelect.addEventListener('change', () => {
        currentSortMethod = sortSelect.value;

        // 重新排序当前图片并渲染
        const sortedImages = sortImages(currentImages, currentSortMethod);
        currentImages = sortedImages;
        renderImages(currentImages);
    });
}

// 渲染标签过滤器
function renderTagFilters() {
    const tagFilters = document.getElementById('tagFilters');

    // 如果没有标签，隐藏过滤器
    if (allTags.size === 0) {
        tagFilters.style.display = 'none';
        return;
    }

    tagFilters.style.display = 'flex';

    // 只显示前5个最常用的标签
    const tagArray = Array.from(allTags);
    const topTags = tagArray.slice(0, 5);

    // 创建标签过滤器HTML
    let filtersHtml = '<span class="filter-label">标签:</span>';

    // 添加"全部"选项
    filtersHtml += `<span class="image-tag ${currentTagFilter === '' ? 'active' : ''}" data-tag="">全部</span>`;

    // 添加标签选项
    topTags.forEach(tag => {
        filtersHtml += `<span class="image-tag ${currentTagFilter === tag ? 'active' : ''}" data-tag="${tag}">${tag}</span>`;
    });

    tagFilters.innerHTML = filtersHtml;

    // 添加标签点击事件
    tagFilters.querySelectorAll('.image-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const tagName = tag.dataset.tag;
            filterByTag(tagName);
        });
    });
}

// 按标签过滤
function filterByTag(tag) {
    currentTagFilter = tag;
    loadUserImages(1, '', tag);

    // 更新标签过滤器UI
    document.querySelectorAll('#tagFilters .image-tag').forEach(el => {
        if (el.dataset.tag === tag) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

// 初始化图片查看器
function initImageViewer() {
    const imageViewer = document.getElementById('imageViewer');
    const closeViewer = document.getElementById('closeViewer');
    const viewerImage = document.getElementById('viewerImage');

    // 关闭查看器
    closeViewer.addEventListener('click', () => {
        imageViewer.classList.remove('active');
        setTimeout(() => {
            imageViewer.style.display = 'none';
        }, 300);
    });

    // 点击背景关闭查看器
    imageViewer.addEventListener('click', (e) => {
        if (e.target === imageViewer) {
            closeViewer.click();
        }
    });

    // 键盘事件
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageViewer.classList.contains('active')) {
            closeViewer.click();
        }
    });
}

// 打开图片查看器
function openImageViewer(imageId, imageUrl) {
    const imageViewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const viewerInfo = document.getElementById('viewerInfo');

    // 查找图片信息
    const image = currentImages.find(img => img.id === imageId);
    if (!image) return;

    // 设置图片
    viewerImage.src = imageUrl;
    viewerImage.alt = image.fileName;

    // 设置信息
    viewerInfo.textContent = `${image.fileName} (${formatFileSize(image.fileSize)})`;

    // 显示查看器
    imageViewer.style.display = 'flex';
    setTimeout(() => {
        imageViewer.classList.add('active');
    }, 10);
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
