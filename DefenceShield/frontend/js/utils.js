/**
 * ============================================================
 *  DefenceShield — Frontend Utilities
 *  Shared helper functions used across all frontend pages
 *  FILE: frontend/js/utils.js
 * ============================================================
 */

/**
 * Audit Logger
 * Maintains an in-memory log of all system events
 * In a real system: sent to backend append-only audit database
 */
const AuditLogger = (() => {
  let _logs = [];

  return {
    addLog(type, msg) {
      const now  = new Date();
      const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(n => String(n).padStart(2, '0')).join(':');
      _logs.unshift({ time, type, msg });
      if (_logs.length > 100) _logs.pop();
      console.log(`[AuditLog][${type.toUpperCase()}] ${msg.replace(/<[^>]+>/g, '')}`);
    },
    getLogs:   () => [..._logs],
    clearLogs: () => { _logs = []; }
  };
})();


/**
 * Format file size to human-readable string
 */
function formatFileSize(bytes) {
  if (bytes < 1024)       return bytes + ' B';
  if (bytes < 1024*1024)  return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024*1024)).toFixed(1) + ' MB';
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * Escape HTML special characters
 * Prevents XSS in dynamic content rendering
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Truncate a string to given length with ellipsis
 */
function truncate(str, len = 40) {
  return str.length > len ? str.slice(0, len) + '…' : str;
}
