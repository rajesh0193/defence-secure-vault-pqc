/**
 * ============================================================
 *  DefenceShield — User Model
 *  Defines officer roles, clearance levels, and permissions
 *  FILE: backend/models/user.model.js
 *
 *  In a real backend (Node.js + Express + PostgreSQL):
 *    - This would be a Sequelize / Prisma ORM model
 *    - Passwords stored as Argon2id hashes
 *    - Officer biometrics stored in Hardware Security Module (HSM)
 *    - Sessions managed via PQC-authenticated JWT tokens
 * ============================================================
 */

const UserModel = (() => {

  /**
   * Clearance Level Definitions
   * Level 5 = Highest (Field Marshal / CDS)
   * Level 1 = Lowest  (Junior Officer)
   */
  const CLEARANCE_LEVELS = {
    l5: {
      id:           'l5',
      level:        5,
      name:         'Field Marshal / Chief of Defence Staff',
      shortName:    'Field Marshal Sharma',
      rank:         'Chief of Defence Staff',
      badge:        'LEVEL 5 · TS/SCI',
      badgeClass:   'clearance-level5',
      classification:'TOP SECRET / SCI',
      permissions: {
        viewAllDocs:     true,
        uploadAny:       true,
        deleteDocuments: true,
        manageAllUsers:  true,
        viewAllLogs:     true,
        accessLevel:     5
      }
    },
    l4: {
      id:           'l4',
      level:        4,
      name:         'General / Admiral',
      shortName:    'General Verma',
      rank:         'Army Commander Northern Command',
      badge:        'LEVEL 4 · TOP SECRET',
      badgeClass:   'clearance-level4',
      classification:'TOP SECRET',
      permissions: {
        viewAllDocs:     false,
        uploadAny:       false,
        deleteDocuments: true,
        manageAllUsers:  false,
        viewAllLogs:     false,
        accessLevel:     4
      }
    },
    l3: {
      id:           'l3',
      level:        3,
      name:         'Brigadier / Colonel',
      shortName:    'Brigadier Mehta',
      rank:         'Brigade Commander',
      badge:        'LEVEL 3 · SECRET',
      badgeClass:   'clearance-level3',
      classification:'SECRET',
      permissions: {
        viewAllDocs:     false,
        uploadAny:       false,
        deleteDocuments: false,
        manageAllUsers:  false,
        viewAllLogs:     false,
        accessLevel:     3
      }
    },
    l2: {
      id:           'l2',
      level:        2,
      name:         'Major / Captain',
      shortName:    'Major Patel',
      rank:         'Company Commander',
      badge:        'LEVEL 2 · CONFIDENTIAL',
      badgeClass:   'clearance-level2',
      classification:'CONFIDENTIAL',
      permissions: {
        viewAllDocs:     false,
        uploadAny:       false,
        deleteDocuments: false,
        manageAllUsers:  false,
        viewAllLogs:     false,
        accessLevel:     2
      }
    },
    l1: {
      id:           'l1',
      level:        1,
      name:         'Lieutenant / Junior Officer',
      shortName:    'Lt. Kumar',
      rank:         'Junior Officer',
      badge:        'LEVEL 1 · UNCLASSIFIED',
      badgeClass:   'clearance-level1',
      classification:'UNCLASSIFIED',
      permissions: {
        viewAllDocs:     false,
        uploadAny:       false,
        deleteDocuments: false,
        manageAllUsers:  false,
        viewAllLogs:     false,
        accessLevel:     1
      }
    }
  };

  return {

    /**
     * Get user profile by role key
     * @param {string} roleKey - e.g. 'l5', 'l4'
     * @returns {object|null}
     */
    findByRole(roleKey) {
      return CLEARANCE_LEVELS[roleKey] || null;
    },

    /**
     * Check if a user can access a document of given access level
     * @param {object} user
     * @param {number} docAccessLevel
     * @returns {boolean}
     */
    canAccess(user, docAccessLevel) {
      return user.level >= docAccessLevel;
    },

    /**
     * Check if a user has a specific permission
     * @param {object} user
     * @param {string} permission - e.g. 'deleteDocuments'
     * @returns {boolean}
     */
    hasPermission(user, permission) {
      return user.permissions?.[permission] === true;
    },

    /** Get all clearance levels (for Access Control page) */
    getAllLevels: () => Object.values(CLEARANCE_LEVELS)
  };

})();
