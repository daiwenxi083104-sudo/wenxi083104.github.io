/**
 * 工具函数共享模块
 * 提供各工具页面通用的辅助函数
 */

/**
 * 显示 Toast 提示
 * @param {string} msg - 提示消息
 * @param {number} duration - 显示时长（毫秒）
 */
export function showToast(msg, duration = 2000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * 转义 HTML 特殊字符
 * @param {string} str - 原始字符串
 * @returns {string} - 转义后的字符串
 */
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/**
 * 获取当前时间字符串（HH:MM:SS）
 * @returns {string}
 */
export function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

/**
 * 获取当前日期字符串（YYYY年M月D日）
 * @returns {string}
 */
export function getToday() {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return fallbackCopy(text);
    }
  }
  return fallbackCopy(text);
}

/**
 * 降级复制方案
 * @param {string} text
 * @returns {boolean}
 */
function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch (e) {
    document.body.removeChild(textarea);
    return false;
  }
}

/**
 * 打乱数组（Fisher-Yates 算法）
 * @param {Array} array
 * @returns {Array}
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 从数组中随机选择 N 个不重复元素
 * @param {Array} array
 * @param {number} count
 * @returns {Array}
 */
export function randomPick(array, count) {
  if (count >= array.length) return [...array];
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}
