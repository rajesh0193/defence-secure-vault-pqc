/**
 * ============================================================
 *  DefenceShield — Configuration
 *  Central configuration constants for the application
 *  FILE: config/config.js
 * ============================================================
 */

const AppConfig = {

  // ── App Info ─────────────────────────────────────────────────
  APP_NAME:    'DefenceShield',
  VERSION:     '3.2.1',
  DESCRIPTION: 'Post-Quantum Defence Management System',

  // ── PQC Settings ─────────────────────────────────────────────
  PQC: {
    KEY_ROTATION_INTERVAL_MS: 15 * 60 * 1000,   // 15 minutes
    SESSION_EXPIRY_MS:         8 * 60 * 60 * 1000, // 8 hours
    ALGORITHMS: {
      KEM:            'CRYSTALS-Kyber-1024',
      SIGNATURE:      'CRYSTALS-Dilithium-5',
      BACKUP_SIG:     'SPHINCS+-SHA3-256',
      SYMMETRIC:      'AES-256-GCM',
      HASH:           'SHA3-512'
    },
    NIST_STANDARDS: ['FIPS 203', 'FIPS 204', 'FIPS 205']
  },

  // ── Security ──────────────────────────────────────────────────
  SECURITY: {
    MIN_PASSKEY_LENGTH:    4,
    MAX_FAILED_ATTEMPTS:   3,
    LOCKOUT_DURATION_MS:   5 * 60 * 1000,   // 5 minutes
    MAX_DOCUMENT_SIZE_MB:  100,
    AUDIT_LOG_RETENTION:   365 * 7,          // 7 years in days
  },

  // ── Classification Levels ─────────────────────────────────────
  CLASSIFICATIONS: [
    { value: 'TOP SECRET',   minLevel: 3 },
    { value: 'SECRET',       minLevel: 2 },
    { value: 'CONFIDENTIAL', minLevel: 1 },
    { value: 'UNCLASSIFIED', minLevel: 1 }
  ],

  // ── Supported File Types ──────────────────────────────────────
  SUPPORTED_EXTENSIONS: [
    '.pdf', '.docx', '.xlsx', '.csv', '.txt',
    '.png', '.jpg', '.jpeg', '.gif', '.webp',
    '.mp4', '.avi', '.mkv', '.mov',
    '.pptx', '.ppt', '.xls', '.doc',
    '.zip', '.rar'
  ],

  // ── Backend API Base URL (for real deployment) ────────────────
  API_BASE_URL: 'http://localhost:3000/api',

};
