/**
 * ============================================================
 *  DefenceShield — UI Controller
 *  Manages section switching, notifications, and layout
 *  FILE: frontend/js/ui.controller.js
 * ============================================================
 */

const UIController = (() => {

  // Section → nav label mapping
  const NAV_MAP = {
    overview:  'overview',
    documents: 'doc',
    upload:    'upload',
    pqc:       'pqc',
    access:    'access',
    logs:      'log'
  };

  // Section → page renderer mapping
  const PAGE_RENDERERS = {
    overview:  () => OverviewPage.render(),
    documents: () => DocumentsPage.render(),
    upload:    () => UploadPage.render(),
    pqc:       () => PQCStatusPage.render(),
    access:    () => AccessControlPage.render(),
    logs:      () => AuditLogsPage.render()
  };

  return {

    /** Initialize the dashboard after login */
    init() {
      // Inject all section containers into main content
      document.getElementById('mainContent').innerHTML = `
        <div class="section active" id="sec-overview"></div>
        <div class="section" id="sec-documents"></div>
        <div class="section" id="sec-upload"></div>
        <div class="section" id="sec-pqc"></div>
        <div class="section" id="sec-access"></div>
        <div class="section" id="sec-logs"></div>
      `;
    },

    /**
     * Switch to a named section
     * @param {string} sectionId
     */
    showSection(sectionId) {
      // Hide all sections
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      // Remove active from all nav items
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

      // Activate target section
      const sec = document.getElementById('sec-' + sectionId);
      if (sec) sec.classList.add('active');

      // Activate nav item
      const keyword = NAV_MAP[sectionId] || sectionId;
      document.querySelectorAll('.nav-item').forEach(n => {
        if (n.textContent.toLowerCase().includes(keyword)) n.classList.add('active');
      });

      // Render the page content
      const renderer = PAGE_RENDERERS[sectionId];
      if (renderer) renderer();
    },

    /**
     * Show a toast notification
     * @param {string} msg
     * @param {number} duration - ms
     */
    showNotif(msg, duration = 3500) {
      const n = document.getElementById('notif');
      n.textContent = msg;
      n.classList.add('show');
      setTimeout(() => n.classList.remove('show'), duration);
    }
  };

})();
