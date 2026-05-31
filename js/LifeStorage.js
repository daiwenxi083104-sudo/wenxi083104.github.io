/**
 * LifeStorage - 帖子持久化存储模块
 * 
 * 存储策略（三层保障）：
 * 1. IndexedDB：大容量持久化存储（即使清理缓存也不会丢失）
 * 2. localStorage：快速读取的缓存层
 * 3. 导出/导入 JSON：用户手动备份到本地文件
 * 
 * 数据迁移：自动从 localStorage 迁移到 IndexedDB
 */

const LifeStorage = {
    DB_NAME: 'LifePostsDB',
    DB_VERSION: 1,
    STORE_NAME: 'posts',
    LS_KEY: 'lifePosts',
    db: null,

    /**
     * 初始化 IndexedDB
     */
    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
                }
            };
            
            request.onsuccess = (e) => {
                this.db = e.target.result;
                console.log('IndexedDB 初始化成功');
                // 自动迁移 localStorage 数据
                this._migrateFromLocalStorage().then(resolve);
            };
            
            request.onerror = (e) => {
                console.warn('IndexedDB 不可用，降级使用 localStorage', e);
                resolve(); // 降级方案，不阻塞
            };
        });
    },

    /**
     * 从 localStorage 迁移数据到 IndexedDB
     */
    async _migrateFromLocalStorage() {
        try {
            const lsData = localStorage.getItem(this.LS_KEY);
            if (lsData) {
                const posts = JSON.parse(lsData);
                if (posts && posts.length > 0 && this.db) {
                    // 检查 IndexedDB 是否已有数据
                    const existing = await this.getAll();
                    if (existing.length === 0) {
                        // IndexedDB 为空，从 localStorage 迁移
                        console.log('从 localStorage 迁移', posts.length, '条帖子到 IndexedDB');
                        for (const post of posts) {
                            await this._saveToIDB(post);
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('localStorage 数据迁移失败:', e);
        }
    },

    /**
     * 保存单条帖子到 IndexedDB
     */
    _saveToIDB(post) {
        return new Promise((resolve, reject) => {
            if (!this.db) { resolve(); return; }
            const tx = this.db.transaction(this.STORE_NAME, 'readwrite');
            const store = tx.objectStore(this.STORE_NAME);
            store.put(post);
            tx.oncomplete = resolve;
            tx.onerror = () => reject(tx.error);
        });
    },

    /**
     * 保存所有帖子（双重存储）
     */
    async saveAll(posts) {
        // 1. 保存到 localStorage（快速读取缓存）
        try {
            localStorage.setItem(this.LS_KEY, JSON.stringify(posts));
        } catch (e) {
            console.warn('localStorage 保存失败:', e);
        }

        // 2. 保存到 IndexedDB（持久化存储）
        if (this.db) {
            try {
                const tx = this.db.transaction(this.STORE_NAME, 'readwrite');
                const store = tx.objectStore(this.STORE_NAME);
                // 清空旧数据
                store.clear();
                // 写入新数据
                posts.forEach(post => store.put(post));
                await new Promise((resolve, reject) => {
                    tx.oncomplete = resolve;
                    tx.onerror = () => reject(tx.error);
                });
                console.log('帖子已保存到 IndexedDB + localStorage，共', posts.length, '条');
            } catch (e) {
                console.warn('IndexedDB 保存失败，已降级到 localStorage:', e);
            }
        }
    },

    /**
     * 获取所有帖子（优先 IndexedDB，降级 localStorage）
     */
    async getAll() {
        // 1. 尝试从 IndexedDB 读取
        if (this.db) {
            try {
                const tx = this.db.transaction(this.STORE_NAME, 'readonly');
                const store = tx.objectStore(this.STORE_NAME);
                const request = store.getAll();
                const result = await new Promise((resolve, reject) => {
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
                if (result && result.length > 0) {
                    console.log('从 IndexedDB 读取到', result.length, '条帖子');
                    return result;
                }
            } catch (e) {
                console.warn('IndexedDB 读取失败，降级到 localStorage:', e);
            }
        }

        // 2. 降级从 localStorage 读取
        try {
            const data = localStorage.getItem(this.LS_KEY);
            if (data) {
                const posts = JSON.parse(data);
                console.log('从 localStorage 读取到', posts.length, '条帖子');
                return posts;
            }
        } catch (e) {
            console.warn('localStorage 读取失败:', e);
        }

        return [];
    },

    /**
     * 添加单条帖子
     */
    async add(post) {
        // 读取当前所有帖子
        const posts = await this.getAll();
        posts.unshift(post);
        await this.saveAll(posts);
        return posts;
    },

    /**
     * 删除帖子
     */
    async delete(postId) {
        // 从 IndexedDB 删除
        if (this.db) {
            try {
                const tx = this.db.transaction(this.STORE_NAME, 'readwrite');
                tx.objectStore(this.STORE_NAME).delete(postId);
            } catch (e) {
                console.warn('IndexedDB 删除失败:', e);
            }
        }
        // 更新 localStorage
        const posts = await this.getAll();
        const filtered = posts.filter(p => p.id !== postId);
        await this.saveAll(filtered);
        return filtered;
    },

    /**
     * 更新帖子
     */
    async update(postId, updates) {
        const posts = await this.getAll();
        const index = posts.findIndex(p => p.id === postId);
        if (index !== -1) {
            posts[index] = { ...posts[index], ...updates };
            await this.saveAll(posts);
        }
        return posts;
    },

    /**
     * 导出帖子为 JSON 文件（备份）
     */
    async exportToFile() {
        const posts = await this.getAll();
        if (posts.length === 0) {
            return false;
        }
        
        const exportData = {
            version: '1.0',
            exportTime: new Date().toISOString(),
            count: posts.length,
            posts: posts
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '我的生活_备份_' + new Date().toLocaleDateString('zh-CN').replace(/\//g, '-') + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return true;
    },

    /**
     * 从 JSON 文件导入帖子（恢复）
     */
    async importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (!data.posts || !Array.isArray(data.posts)) {
                        reject(new Error('文件格式不正确'));
                        return;
                    }
                    
                    // 合并现有数据和新数据（按 ID 去重）
                    const existingPosts = await this.getAll();
                    const existingIds = new Set(existingPosts.map(p => p.id));
                    const newPosts = data.posts.filter(p => !existingIds.has(p.id));
                    
                    if (newPosts.length === 0) {
                        resolve({ total: existingPosts.length, imported: 0, message: '所有帖子已存在，无需导入' });
                        return;
                    }
                    
                    const merged = [...newPosts, ...existingPosts];
                    await this.saveAll(merged);
                    
                    resolve({
                        total: merged.length,
                        imported: newPosts.length,
                        message: '成功导入 ' + newPosts.length + ' 条帖子'
                    });
                } catch (err) {
                    reject(new Error('文件解析失败：' + err.message));
                }
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file);
        });
    }
};
