/**
 * 通知生成器模块
 * 管理模板切换、表单数据、通知预览和复制功能
 */
import { showToast, getToday, copyToClipboard } from './utils.js';

export class NoticeGenerator {
  constructor() {
    // 当前模板
    this.currentTemplate = 'holiday';
    
    // 模板配置
    this.templates = {
      holiday: {
        name: '节假日通知',
        fields: ['holiday_name', 'holiday_date', 'holiday_workday', 'holiday_wish', 'holiday_dept']
      },
      activity: {
        name: '活动通知',
        fields: ['activity_name', 'activity_time', 'activity_place', 'activity_people', 'activity_content', 'activity_note', 'activity_dept']
      },
      meeting: {
        name: '会议通知',
        fields: ['meeting_topic', 'meeting_time', 'meeting_place', 'meeting_people', 'meeting_agenda', 'meeting_prepare', 'meeting_dept']
      },
      leave: {
        name: '放假通知',
        fields: ['leave_reason', 'leave_date', 'leave_resume', 'leave_note', 'leave_contact', 'leave_dept']
      }
    };
    
    // DOM 元素引用
    this.elements = {};
    
    this.init();
  }
  
  /**
   * 初始化
   */
  init() {
    this.elements = {
      previewContent: document.getElementById('previewContent'),
      copyBtn: document.getElementById('copyBtn')
    };
    
    this.bindEvents();
    this.updatePreview();
  }
  
  /**
   * 绑定事件
   */
  bindEvents() {
    // 为所有输入框添加回车切换焦点
    document.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const inputs = Array.from(document.querySelectorAll('.form-area.active input, .form-area.active textarea'));
          const index = inputs.indexOf(e.target);
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        }
      });
    });
  }
  
  /**
   * 切换模板
   * @param {string} type - 模板类型
   */
  switchTemplate(type) {
    this.currentTemplate = type;
    
    // 切换标签样式
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 切换表单
    document.querySelectorAll('.form-area').forEach(form => {
      form.classList.remove('active');
    });
    document.getElementById(`form-${type}`).classList.add('active');
    
    this.updatePreview();
  }
  
  /**
   * 获取输入值
   * @param {string} id
   * @returns {string}
   */
  getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  
  /**
   * 生成占位符 HTML
   * @param {string} text
   * @returns {string}
   */
  placeholder(text) {
    return `<span class="placeholder-empty">[${text}]</span>`;
  }
  
  /**
   * 更新预览
   */
  updatePreview() {
    let content = '';
    const today = getToday();
    
    switch (this.currentTemplate) {
      case 'holiday':
        content = this.generateHolidayNotice(today);
        break;
      case 'activity':
        content = this.generateActivityNotice(today);
        break;
      case 'meeting':
        content = this.generateMeetingNotice(today);
        break;
      case 'leave':
        content = this.generateLeaveNotice(today);
        break;
    }
    
    this.elements.previewContent.innerHTML = content;
  }
  
  /**
   * 生成节假日通知
   */
  generateHolidayNotice(today) {
    const name = this.getVal('holiday_name') || this.placeholder('节日名称');
    const date = this.getVal('holiday_date') || this.placeholder('放假日期');
    const workday = this.getVal('holiday_workday');
    const wish = this.getVal('holiday_wish');
    const dept = this.getVal('holiday_dept') || this.placeholder('发布部门');
    
    return `【${name}放假通知】\n\n` +
           `各位同事：\n\n` +
           `根据国家法定节假日安排，现将${name}放假安排通知如下：\n\n` +
           `放假时间：${date}\n\n` +
           (workday ? `补班安排：${workday}\n\n` : '') +
           `请各部门提前做好工作安排，确保假期期间各项工作正常运转。\n\n` +
           (wish ? `${wish}\n\n` : '') +
           `${dept}\n` +
           today;
  }
  
  /**
   * 生成活动通知
   */
  generateActivityNotice(today) {
    const name = this.getVal('activity_name') || this.placeholder('活动名称');
    const time = this.getVal('activity_time') || this.placeholder('活动时间');
    const place = this.getVal('activity_place') || this.placeholder('活动地点');
    const people = this.getVal('activity_people') || this.placeholder('参加人员');
    const content = this.getVal('activity_content');
    const note = this.getVal('activity_note');
    const dept = this.getVal('activity_dept') || this.placeholder('发布部门');
    
    return `【${name}通知】\n\n` +
           `各位同事：\n\n` +
           `为丰富大家的业余生活，增进同事之间的交流与友谊，公司决定举办${name}，具体安排如下：\n\n` +
           `活动时间：${time}\n` +
           `活动地点：${place}\n` +
           `参加人员：${people}\n\n` +
           (content ? `活动内容：\n${content}\n\n` : '') +
           (note ? `注意事项：\n${note}\n\n` : '') +
           `欢迎大家踊跃参加！\n\n` +
           `${dept}\n` +
           today;
  }
  
  /**
   * 生成会议通知
   */
  generateMeetingNotice(today) {
    const topic = this.getVal('meeting_topic') || this.placeholder('会议主题');
    const time = this.getVal('meeting_time') || this.placeholder('会议时间');
    const place = this.getVal('meeting_place') || this.placeholder('会议地点');
    const people = this.getVal('meeting_people') || this.placeholder('参会人员');
    const agenda = this.getVal('meeting_agenda');
    const prepare = this.getVal('meeting_prepare');
    const dept = this.getVal('meeting_dept') || this.placeholder('发布部门');
    
    return `【会议通知】\n\n` +
           `各位同事：\n\n` +
           `现定于${time}召开"${topic}"，请相关人员准时参加。\n\n` +
           `会议时间：${time}\n` +
           `会议地点：${place}\n` +
           `参会人员：${people}\n\n` +
           (agenda ? `会议议程：\n${agenda}\n\n` : '') +
           (prepare ? `准备事项：\n${prepare}\n\n` : '') +
           `请各位参会人员提前安排好工作，准时出席。如因特殊情况无法参加，请提前告知。\n\n` +
           `${dept}\n` +
           today;
  }
  
  /**
   * 生成放假通知
   */
  generateLeaveNotice(today) {
    const reason = this.getVal('leave_reason') || this.placeholder('放假原因');
    const date = this.getVal('leave_date') || this.placeholder('放假日期');
    const resume = this.getVal('leave_resume') || this.placeholder('复工日期');
    const note = this.getVal('leave_note');
    const contact = this.getVal('leave_contact');
    const dept = this.getVal('leave_dept') || this.placeholder('发布部门');
    
    return `【放假通知】\n\n` +
           `各位同事：\n\n` +
           `因${reason}，经公司研究决定，现将放假安排通知如下：\n\n` +
           `放假时间：${date}\n` +
           `复工时间：${resume}\n\n` +
           (note ? `注意事项：\n${note}\n\n` : '') +
           (contact ? `紧急联系人：${contact}\n\n` : '') +
           `请大家合理安排假期时间，注意安全。\n\n` +
           `${dept}\n` +
           today;
  }
  
  /**
   * 获取纯文本内容（去除占位符 HTML）
   * @returns {string}
   */
  getPlainText() {
    const el = this.elements.previewContent;
    const clone = el.cloneNode(true);
    const spans = clone.querySelectorAll('.placeholder-empty');
    
    spans.forEach(span => {
      span.replaceWith(document.createTextNode(span.textContent));
    });
    
    return clone.textContent;
  }
  
  /**
   * 复制通知内容
   */
  async copyNotice() {
    const text = this.getPlainText();
    const btn = this.elements.copyBtn;
    
    const success = await copyToClipboard(text);
    
    if (success) {
      this.showCopied(btn);
    } else {
      showToast('复制失败，请手动复制~');
    }
  }
  
  /**
   * 显示复制成功状态
   * @param {HTMLElement} btn
   */
  showCopied(btn) {
    const originalText = btn.textContent;
    btn.textContent = '复制成功!';
    btn.classList.add('copied');
    showToast('已复制到剪贴板~');
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('copied');
    }, 2000);
  }
}
