/**
 * ============================================================
 *  DefenceShield — Authentication Controller
 *  Handles login, logout, session management
 *  FILE: backend/controllers/auth.controller.js
 *
 *  In a real backend (Node.js + Express):
 *    POST /api/auth/login   → validate credentials → return PQC JWT
 *    POST /api/auth/logout  → invalidate session token
 *    GET  /api/auth/session → verify current session
 *
 *  PQC Authentication Flow:
 *    1. Client sends credentials over TLS 1.3 + Kyber hybrid
 *    2. Server validates officer ID + biometric hash (via HSM)
 *    3. Server generates Kyber-1024 shared secret for session
 *    4. Server signs session token with Dilithium-5
 *    5. Client verifies server signature with Dilithium public key
 *    6. AES-256-GCM session key derived from Kyber shared secret
 *    7. All subsequent API calls use this session key
 * ============================================================
 */

const AuthController = (() => {

  // ── Session State ────────────────────────────────────────────
  let _currentUser   = null;
  let _sessionToken  = null;
  let _loginTime     = null;

  // ── Validation ───────────────────────────────────────────────
  function validateInputs(role, officerId, passKey) {
    if (!role)              return 'Select a clearance level';
    if (!officerId.trim())  return 'Enter your Officer ID';
    if (passKey.length < 4) return 'Invalid pass-key (minimum 4 characters)';
    return null; // no error
  }

  // ── Session Token Generator (Simulated PQC JWT) ───────────────
  function generateSessionToken(user) {
    const payload = btoa(JSON.stringify({
      sub:   user.id,
      level: user.level,
      iat:   Date.now(),
      exp:   Date.now() + (8 * 60 * 60 * 1000), // 8 hour expiry
      alg:   'Dilithium-5'
    }));
    const signature = PQCEngine.randomHex(32); // Simulated Dilithium signature
    return `${payload}.${signature}`;
  }

  return {

    /** Get current logged-in user */
    getCurrentUser: () => _currentUser,

    /** Check if user is authenticated */
    isAuthenticated: () => _currentUser !== null,

    /**
     * Login
     * Validates credentials, sets up PQC session, loads dashboard
     */
    login() {
      const role    = document.getElementById('loginRole').value;
      const id      = document.getElementById('loginId').value.trim();
      const pass    = document.getElementById('loginPass').value;
      const errEl   = document.getElementById('loginError');

      // Input validation
      const validationError = validateInputs(role, id, pass);
      if (validationError) {
        errEl.textContent = '⚠ ' + validationError;
        return;
      }

      errEl.textContent = 'Authenticating via Kyber-1024...';

      // Simulate PQC authentication delay (network + crypto)
      setTimeout(() => {
        const user = UserModel.findByRole(role);
        if (!user) {
          errEl.textContent = '⚠ Invalid clearance level';
          return;
        }

        // Set session
        _currentUser  = user;
        _sessionToken = generateSessionToken(user);
        _loginTime    = new Date();

        // Access middleware check
        AccessControl.setCurrentUser(user);

        // Initialize document store
        DocumentModel.loadSamples();

        // Update UI
        document.getElementById('loginScreen').style.display  = 'none';
        document.getElementById('dashboard').style.display    = 'block';
        document.getElementById('topUserName').textContent     = user.shortName.toUpperCase();
        document.getElementById('topUserRank').textContent     = user.rank.toUpperCase();
        const badge = document.getElementById('clearanceBadge');
        badge.textContent = user.badge;
        badge.className   = 'clearance-badge ' + user.badgeClass;

        // Log the login event
        AuditLogger.addLog('success',
          `<span class="log-user">${user.shortName}</span> authenticated. ` +
          `Kyber-1024 session established. Clearance: ${user.classification}.`
        );

        // Boot the UI
        UIController.init();
        UIController.showSection('overview');
        UIController.showNotif('◈ Authentication successful — Welcome, ' + user.shortName);

        console.log(`[AuthController] Login successful: ${user.shortName} (Level ${user.level})`);
      }, 1200);
    },

    /**
     * Logout
     * Destroys session, clears PQC keys, returns to login
     */
    logout() {
      if (!_currentUser) return;

      AuditLogger.addLog('info',
        `<span class="log-user">${_currentUser.shortName}</span> logged out. Session key destroyed.`
      );

      PQCEngine.stopKeyRotation();
      _currentUser  = null;
      _sessionToken = null;
      _loginTime    = null;
      AccessControl.clearUser();

      document.getElementById('dashboard').style.display  = 'none';
      document.getElementById('loginScreen').style.display = 'flex';
      document.getElementById('loginRole').value  = '';
      document.getElementById('loginId').value    = '';
      document.getElementById('loginPass').value  = '';
      document.getElementById('loginError').textContent = '';

      console.log('[AuthController] Session terminated. PQC session key destroyed.');
    },

    /** Get session info (for display) */
    getSessionInfo() {
      if (!_currentUser) return null;
      return {
        user:      _currentUser,
        loginTime: _loginTime,
        tokenAlgo: 'Dilithium-5 signed JWT'
      };
    }
  };

})();
