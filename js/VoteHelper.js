/**
 * 投票小助手模块
 * 管理投票创建、选项管理、投票统计和结果展示
 */
import { showToast, escapeHtml } from './utils.js';

export class VoteHelper {
  constructor() {
    // 投票数据
    this.topic = '团建去哪里？';
    this.options = [
      { name: '爬山', votes: 0 },
      { name: '烧烤', votes: 0 },
      { name: 'KTV', votes: 0 },
      { name: '看电影', votes: 0 }
    ];
    this.votedIndex = -1;
    this.votingStarted = false;
    
    // DOM 元素引用
    this.elements = {};
    
    this.init();
  }
  
  /**
   * 初始化
   */
  init() {
    this.elements = {
      topicInput: document.getElementById('topicInput'),
      optionInput: document.getElementById('optionInput'),
      createCard: document.getElementById('createCard'),
      voteCard: document.getElementById('voteCard'),
      voteTopic: document.getElementById('voteTopic'),
      optionList: document.getElementById('optionList'),
      totalVotes: document.getElementById('totalVotes'),
      addOptionWrap: document.getElementById('addOptionWrap'),
      newOptionInput: document.getElementById('newOptionInput')
    };
    
    // 填入默认示例
    this.elements.topicInput.value = this.topic;
    
    this.bindEvents();
  }
  
  /**
   * 绑定事件
   */
  bindEvents() {
    // 回车快捷键
    this.elements.optionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.addOption();
    });
    
    this.elements.newOptionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.addNewOption();
    });
  }
  
  /**
   * 添加选项（创建阶段）
   */
  addOption() {
    const input = this.elements.optionInput;
    const name = input.value.trim();
    
    if (!name) {
      showToast('请输入选项名称~');
      return;
    }
    
    if (this.options.some(o => o.name === name)) {
      showToast('该选项已存在哦~');
      return;
    }
    
    this.options.push({ name, votes: 0 });
    input.value = '';
    showToast(`已添加选项：${name}`);
  }
  
  /**
   * 开始投票
   */
  startVote() {
    this.topic = this.elements.topicInput.value.trim();
    
    if (!this.topic) {
      showToast('请输入投票主题~');
      return;
    }
    
    if (this.options.length < 2) {
      showToast('至少需要两个选项哦~');
      return;
    }
    
    this.votingStarted = true;
    this.votedIndex = -1;
    this.options.forEach(o => o.votes = 0);
    
    this.elements.createCard.style.display = 'none';
    this.elements.voteCard.style.display = 'block';
    this.elements.voteTopic.textContent = this.topic;
    
    this.renderOptions();
  }
  
  /**
   * 渲染选项列表
   */
  renderOptions() {
    const { optionList, totalVotes } = this.elements;
    optionList.innerHTML = '';
    
    const total = this.options.reduce((sum, o) => sum + o.votes, 0);
    
    this.options.forEach((opt, i) => {
      const percent = total > 0 ? Math.round(opt.votes / total * 100) : 0;
      
      const li = document.createElement('li');
      li.className = `option-item${this.votedIndex === i ? ' voted' : ''}`;
      li.innerHTML = `
        <div class="option-header">
          <div class="option-name"><span class="option-radio"></span>${escapeHtml(opt.name)}</div>
          <div class="option-votes">${opt.votes} 票</div>
        </div>
        <div class="option-bar-wrap">
          <span class="option-percent">${percent}%</span>
          <div class="option-bar" style="width:${percent}%"></div>
        </div>
      `;
      
      li.addEventListener('click', () => this.vote(i));
      optionList.appendChild(li);
    });
    
    totalVotes.textContent = total;
  }
  
  /**
   * 投票
   * @param {number} index
   */
  vote(index) {
    this.votedIndex = index;
    this.options[index].votes++;
    this.renderOptions();
    showToast(`已投票给：${this.options[index].name}`);
  }
  
  /**
   * 显示/隐藏添加选项区域
   */
  showAddOption() {
    const wrap = this.elements.addOptionWrap;
    const isHidden = wrap.style.display === 'none';
    wrap.style.display = isHidden ? 'block' : 'none';
    
    if (isHidden) {
      this.elements.newOptionInput.focus();
    }
  }
  
  /**
   * 添加新选项（投票阶段）
   */
  addNewOption() {
    const input = this.elements.newOptionInput;
    const name = input.value.trim();
    
    if (!name) {
      showToast('请输入选项名称~');
      return;
    }
    
    if (this.options.some(o => o.name === name)) {
      showToast('该选项已存在哦~');
      return;
    }
    
    this.options.push({ name, votes: 0 });
    input.value = '';
    this.renderOptions();
    showToast(`已添加新选项：${name}`);
  }
  
  /**
   * 重置投票（票数清零）
   */
  resetVote() {
    this.options.forEach(o => o.votes = 0);
    this.votedIndex = -1;
    this.renderOptions();
    showToast('投票已重置~');
  }
  
  /**
   * 新建投票（完全重置）
   */
  newVote() {
    this.votingStarted = false;
    this.options = [];
    this.votedIndex = -1;
    this.topic = '';
    
    this.elements.topicInput.value = '';
    this.elements.createCard.style.display = 'block';
    this.elements.voteCard.style.display = 'none';
    this.elements.addOptionWrap.style.display = 'none';
    
    showToast('已清空，请创建新投票~');
  }
}
