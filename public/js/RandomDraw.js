/**
 * 随机抽签模块
 * 管理参与人员、抽签动画、结果展示和历史记录
 */
import { showToast, getCurrentTime, randomPick } from './utils.js';

export class RandomDraw {
  constructor() {
    // 数据状态
    this.names = ['张三', '李四', '王五', '赵六', '孙七', '周八'];
    this.rolling = false;
    this.rollTimer = null;
    this.currentDisplay = [];
    this.history = [];
    
    // DOM 元素引用
    this.elements = {};
    
    // 事件监听器引用（用于清理）
    this.eventListeners = [];
    
    this.init();
  }
  
  /**
   * 绑定事件并保存引用，便于清理
   * @param {HTMLElement} element
   * @param {string} event
   * @param {Function} handler
   */
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.eventListeners.push({ element, event, handler });
  }
  
  /**
   * 清理所有事件监听器
   */
  destroy() {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
    
    if (this.rolling) {
      cancelAnimationFrame(this.rollTimer);
    }
  }
  
  /**
   * 初始化：获取 DOM 元素并绑定事件
   */
  init() {
    this.elements = {
      nameList: document.getElementById('nameList'),
      nameInput: document.getElementById('nameInput'),
      slotDisplay: document.getElementById('slotDisplay'),
      startBtn: document.getElementById('startBtn'),
      stopBtn: document.getElementById('stopBtn'),
      modalOverlay: document.getElementById('modalOverlay'),
      resultList: document.getElementById('resultList'),
      historyList: document.getElementById('historyList')
    };
    
    this.bindEvents();
    this.renderNames();
  }
  
  /**
   * 绑定事件监听
   */
  bindEvents() {
    // 回车添加名字
    const nameInputHandler = (e) => {
      if (e.key === 'Enter') this.addName();
    };
    this.addEventListener(this.elements.nameInput, 'keydown', nameInputHandler);
    
    // 点击遮罩关闭弹窗
    const modalClickHandler = (e) => {
      if (e.target === this.elements.modalOverlay) this.closeModal();
    };
    this.addEventListener(this.elements.modalOverlay, 'click', modalClickHandler);
  }
  
  /**
   * 渲染名字列表
   */
  renderNames() {
    const { nameList } = this.elements;
    nameList.innerHTML = '';
    
    this.names.forEach((name, i) => {
      const tag = document.createElement('span');
      tag.className = 'name-tag';
      tag.innerHTML = `${name} <button class="del-btn" data-index="${i}">&times;</button>`;
      nameList.appendChild(tag);
    });
    
    // 绑定删除按钮事件（事件委托）
    nameList.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.removeName(index);
      });
    });
  }
  
  /**
   * 添加名字
   */
  addName() {
    const { nameInput } = this.elements;
    const val = nameInput.value.trim();
    
    if (!val) return;
    
    if (this.names.includes(val)) {
      showToast('该名字已存在~');
      nameInput.value = '';
      nameInput.focus();
      return;
    }
    
    this.names.push(val);
    nameInput.value = '';
    nameInput.focus();
    this.renderNames();
  }
  
  /**
   * 删除名字
   * @param {number} index
   */
  removeName(index) {
    this.names.splice(index, 1);
    this.renderNames();
  }
  
  /**
   * 获取抽取人数
   * @returns {number}
   */
  getDrawCount() {
    const checked = document.querySelector('input[name="drawCount"]:checked');
    return checked ? parseInt(checked.value) : 1;
  }
  
  /**
   * 开始抽签动画（使用 requestAnimationFrame 优化性能）
   */
  startDraw() {
    const count = this.getDrawCount();
    
    if (this.names.length < count) {
      this.elements.slotDisplay.innerHTML = '<span class="slot-placeholder">人数不足，请添加更多名字</span>';
      return;
    }
    
    this.rolling = true;
    this.elements.startBtn.style.display = 'none';
    this.elements.stopBtn.style.display = '';
    this.elements.slotDisplay.classList.add('rolling');
    
    // 使用 requestAnimationFrame 替代 setInterval，更平滑且性能更好
    let lastFrameTime = 0;
    const frameInterval = 60; // 约 16fps，与原来 60ms 间隔相当
    
    const animate = (timestamp) => {
      if (!this.rolling) return;
      
      if (timestamp - lastFrameTime >= frameInterval) {
        const pool = [];
        for (let i = 0; i < count; i++) {
          pool.push(this.names[Math.floor(Math.random() * this.names.length)]);
        }
        this.currentDisplay = pool;
        // 使用 textContent 避免 innerHTML 解析开销
        this.elements.slotDisplay.innerHTML = pool.map(n => `<span>${n}</span>`).join('');
        lastFrameTime = timestamp;
      }
      
      this.rollTimer = requestAnimationFrame(animate);
    };
    
    this.rollTimer = requestAnimationFrame(animate);
  }
  
  /**
   * 停止抽签，显示结果
   */
  stopDraw() {
    if (!this.rolling) return;
    
    this.rolling = false;
    cancelAnimationFrame(this.rollTimer);
    this.elements.slotDisplay.classList.remove('rolling');
    this.elements.startBtn.style.display = '';
    this.elements.stopBtn.style.display = 'none';
    
    const count = this.getDrawCount();
    const drawn = randomPick(this.names, count);
    
    // 显示在滚动区
    this.elements.slotDisplay.innerHTML = drawn.map(n => `<span>${n}</span>`).join('');
    
    // 弹窗展示结果
    this.showResult(drawn);
  }
  
  /**
   * 显示结果弹窗
   * @param {string[]} drawn
   */
  showResult(drawn) {
    const { resultList } = this.elements;
    resultList.innerHTML = '';
    
    drawn.forEach(name => {
      const item = document.createElement('div');
      item.className = 'result-item';
      item.innerHTML = `
        <span class="result-name">${name}</span>
        <div class="result-actions">
          <button class="btn btn-keep" data-action="keep" data-name="${name}">保留</button>
          <button class="btn btn-remove" data-action="remove" data-name="${name}">移除</button>
        </div>
      `;
      resultList.appendChild(item);
    });
    
    // 绑定按钮事件
    resultList.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const name = e.target.dataset.name;
        if (action === 'keep') {
          this.keepName(e.target);
        } else {
          this.removeDrawn(e.target, name);
        }
      });
    });
    
    this.elements.modalOverlay.classList.add('active');
  }
  
  /**
   * 保留名字（仅标记）
   * @param {HTMLElement} btn
   */
  keepName(btn) {
    btn.closest('.result-item').style.opacity = '0.5';
    btn.disabled = true;
    btn.nextElementSibling.disabled = true;
  }
  
  /**
   * 从名单中移除
   * @param {HTMLElement} btn
   * @param {string} name
   */
  removeDrawn(btn, name) {
    const idx = this.names.indexOf(name);
    if (idx !== -1) {
      this.names.splice(idx, 1);
      this.renderNames();
    }
    btn.closest('.result-item').style.opacity = '0.5';
    btn.disabled = true;
    btn.previousElementSibling.disabled = true;
  }
  
  /**
   * 关闭弹窗并记录历史
   */
  closeModal() {
    const items = this.elements.resultList.querySelectorAll('.result-item .result-name');
    const drawnNames = Array.from(items).map(el => el.textContent);
    
    if (drawnNames.length > 0) {
      this.history.unshift({
        time: getCurrentTime(),
        names: [...drawnNames]
      });
      
      if (this.history.length > 20) this.history.pop();
      this.renderHistory();
    }
    
    this.elements.modalOverlay.classList.remove('active');
  }
  
  /**
   * 渲染历史记录
   */
  renderHistory() {
    const { historyList } = this.elements;
    
    if (this.history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">暂无记录</div>';
      return;
    }
    
    historyList.innerHTML = this.history.map(record => `
      <div class="history-item">[${record.time}] ${record.names.join('、')}</div>
    `).join('');
  }
}
