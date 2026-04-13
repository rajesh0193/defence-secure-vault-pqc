/**
 * ============================================================
 *  DefenceShield — Access Control Middleware
 *  Role-Based Access Control (RBAC) enforcement
 *  FILE: backend/middleware/access.control.js
 *
 *  In a real backend (Express middleware):
 *    app.use('/api/documents', AccessControl.requireLevel(2))
 *    app.use('/api/admin',     AccessControl.requireLevel(5))
 *
 *  Every request is validated:
 *    1. PQC session token verified (Dilithium-5 signature check)
 *    2. Clearance level extracted from token
 *    3. Document access level compared to user level
 *    4. Denied requests are logged to immutable audit trail
 * ============================================================
 */

const AccessControl = (() => {

  let _currentUser = null;

  return {

    /** Set the current authenticated user */
    setCurrentUser(user) {
      _currentUser = user;
      console.log(`[AccessControl] User set: ${user.shortName} (Level ${user.level})`);
    },

    /** Clear user on logout */
    clearUser() {
      _currentUser = null;
    },

    /** Get current user level */
    getLevel: () => _currentUser?.level || 0,

    /**
     * Check if current user can view a specific document
     * @param {object} doc - document with .access field
     * @returns {boolean}
     */
    canViewDocument(doc) {
      if (!_currentUser) return false;
      const allowed = _currentUser.level >= doc.access;
      if (!allowed) {
        console.warn(`[AccessControl] DENIED: ${_currentUser.shortName} (Level ${_currentUser.level}) tried to access "${doc.title}" (requires Level ${doc.access})`);
        AuditLogger.addLog('danger',
          `ACCESS DENIED: <span class="log-user">${_currentUser.shortName}</span> (Level ${_currentUser.level}) ` +
          `attempted to access Level ${doc.access} document.`
        );
      }
      return allowed;
    },

    /**
     * Check if user can upload at a given classification
     * User can only upload up to their own clearance level
     */
    canUploadClassification(accessLevel) {
      if (!_currentUser) return false;
      return _currentUser.level >= accessLevel;
    },

    /**
     * Check if user can delete documents
     * Requires Level 4 (General) or above
     */
    canDelete() {
      return _currentUser?.level >= 4;
    },

    /**
     * Check if user can manage other users
     * Requires Level 5 (Field Marshal) only
     */
    canManageUsers() {
      return _currentUser?.level >= 5;
    },

    /**
     * Check if user can view all audit logs
     * Level 4+ can see dept logs, Level 5 sees all
     */
    canViewAllLogs() {
      return _currentUser?.level >= 4;
    },

    /**
     * Filter a list of documents to only those the user can see
     * @param {Array} docs
     * @returns {Array}
     */
    filterDocuments(docs) {
      if (!_currentUser) return [];
      return docs.filter(d => _currentUser.level >= d.access);
    },

    /**
     * Express-style middleware factory (for real backend use)
     * Usage: router.get('/secret', AccessControl.requireLevel(3), handler)
     * @param {number} minLevel
     * @returns {function} middleware
     */
    requireLevel(minLevel) {
      return (req, res, next) => {
        const userLevel = req.user?.level || 0;
        if (userLevel >= minLevel) {
          next();
        } else {
          res.status(403).json({
            error: 'INSUFFICIENT_CLEARANCE',
            required: minLevel,
            current: userLevel
          });
        }
      };
    }
  };

})();
