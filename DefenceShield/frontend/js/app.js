/**
 * ============================================================
 *  DefenceShield — App Entry Point
 *  Initializes all modules and starts the application
 *  FILE: frontend/js/app.js
 *
 *  Load Order (defined in index.html):
 *    1. pqc/pqc-engine.js       — PQC crypto engine
 *    2. pqc/pqc-kyber.js        — Kyber KEM
 *    3. pqc/pqc-dilithium.js    — Dilithium signatures
 *    4. pqc/pqc-sphincs.js      — SPHINCS+ backup signatures
 *    5. backend/models/*.js     — Data models
 *    6. backend/controllers/*.js— Business logic
 *    7. backend/middleware/*.js  — Access control
 *    8. backend/routes/*.js     — API route definitions
 *    9. frontend/js/utils.js    — Shared utilities
 *   10. frontend/js/ui.js       — UI controller
 *   11. frontend/pages/*.js     — Page renderers
 *   12. frontend/js/app.js      — THIS FILE (boot)
 * ============================================================
 */

(function initApp() {

  console.log('============================================================');
  console.log('  DefenceShield — Post-Quantum Defence Management System');
  console.log('  Version: 3.2.1 | PQC Standard: NIST FIPS 203/204/205');
  console.log('============================================================');

  // ── Step 1: Boot PQC Engine ──────────────────────────────────
  PQCEngine.init();

  // ── Step 2: Log all API routes (for debugging) ───────────────
  ApiRoutes.listRoutes();

  // ── Step 3: Log app ready ────────────────────────────────────
  console.log('[App] All modules loaded. Awaiting authentication...');

  // ── Step 4: Keyboard shortcut (Enter to login) ───────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const loginScreen = document.getElementById('loginScreen');
      if (loginScreen && loginScreen.style.display !== 'none') {
        AuthController.login();
      }
    }
  });

  // ── Step 5: Log initial audit entry ─────────────────────────
  AuditLogger.addLog('info', 'DefenceShield system initialized. PQC engine active. Awaiting officer authentication.');

})();
