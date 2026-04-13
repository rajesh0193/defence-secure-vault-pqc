/**
 * ============================================================
 *  DefenceShield — Document Model
 *  In-memory document store with CRUD operations
 *  FILE: backend/models/document.model.js
 *
 *  In a real backend:
 *    - Documents stored in encrypted PostgreSQL / MongoDB
 *    - File blobs in S3 / Azure Blob with server-side PQC encryption
 *    - Each document encrypted with a unique Kyber-derived key
 *    - Keys stored in Hardware Security Module (HSM)
 *    - Audit trail stored in immutable append-only database
 * ============================================================
 */

const DocumentModel = (() => {

  // ── In-Memory Store ─────────────────────────────────────────
  let _documents = [];
  let _idCounter = 1;

  // ── Pre-loaded Sample Defence Documents ─────────────────────
  const SAMPLE_DOCUMENTS = [
    {
      title:          'Operation Himveera — Strategic Plan',
      type:           'Operational Plan',
      classification: 'TOP SECRET',
      access:         5,
      uploader:       'Field Marshal Sharma',
      fileType:       'PDF',
      size:           '4.2 MB',
      description:    'Classified operational plan for northern border defence exercise.'
    },
    {
      title:          'Northern Border Intelligence Assessment Q1',
      type:           'Intelligence Report',
      classification: 'TOP SECRET',
      access:         4,
      uploader:       'General Verma',
      fileType:       'PDF',
      size:           '2.8 MB',
      description:    'Quarterly intelligence summary for northern theatre command.'
    },
    {
      title:          'Advanced Missile Defence Specifications',
      type:           'Weapons Specification',
      classification: 'SECRET',
      access:         3,
      uploader:       'Brigadier Mehta',
      fileType:       'PDF',
      size:           '8.1 MB',
      description:    'Technical specifications for next-gen missile interception system.'
    },
    {
      title:          'Personnel Roster — Alpha Battalion',
      type:           'Personnel File',
      classification: 'CONFIDENTIAL',
      access:         2,
      uploader:       'Major Patel',
      fileType:       'Spreadsheet',
      size:           '1.1 MB',
      description:    'Complete officer and enlisted personnel roster for Alpha Battalion.'
    },
    {
      title:          'Annual Defence Budget FY2024-25',
      type:           'Budget Report',
      classification: 'SECRET',
      access:         3,
      uploader:       'General Verma',
      fileType:       'Spreadsheet',
      size:           '3.4 MB',
      description:    'Classified defence expenditure breakdown for fiscal year 2024-25.'
    },
    {
      title:          'Standard Operating Procedures Manual',
      type:           'Other',
      classification: 'UNCLASSIFIED',
      access:         1,
      uploader:       'Lt. Kumar',
      fileType:       'PDF',
      size:           '5.6 MB',
      description:    'General SOP manual for base operations and daily procedures.'
    }
  ];

  /** Build a full document object from partial data */
  function buildDocument(data) {
    return {
      id:             _idCounter++,
      title:          data.title,
      type:           data.type,
      classification: data.classification,
      access:         data.access,
      uploader:       data.uploader,
      fileType:       data.fileType,
      size:           data.size,
      description:    data.description || '',
      date:           data.date || new Date().toISOString().slice(0, 10),
      encrypted:      true,
      hash:           PQCEngine.generateHash(),
      fileData:       data.fileData || null,
      fileName:       data.fileName || null,
      // PQC metadata
      encryptionAlgo: 'Kyber-1024 + AES-256-GCM',
      signatureAlgo:  'Dilithium-5 + SPHINCS+',
      nistStandard:   'FIPS 203 / FIPS 204 / FIPS 205'
    };
  }

  return {

    /** Load sample documents into store */
    loadSamples() {
      _documents = [];
      _idCounter = 1;
      SAMPLE_DOCUMENTS.forEach(d => _documents.push(buildDocument(d)));
      console.log(`[DocumentModel] Loaded ${_documents.length} sample documents`);
    },

    /** Get all documents visible to a user based on clearance */
    getVisibleTo(userLevel) {
      return _documents.filter(d => d.access <= userLevel);
    },

    /** Get a document by ID (access check done by controller) */
    findById(id) {
      return _documents.find(d => d.id === id) || null;
    },

    /**
     * Add a new document
     * @param {object} data - document fields + fileData
     * @returns {object} saved document
     */
    create(data) {
      const doc = buildDocument(data);
      _documents.push(doc);
      console.log(`[DocumentModel] Document saved: "${doc.title}" (ID: ${doc.id})`);
      return doc;
    },

    /**
     * Delete a document by ID
     * @param {number} id
     * @returns {boolean} success
     */
    delete(id) {
      const before = _documents.length;
      _documents = _documents.filter(d => d.id !== id);
      return _documents.length < before;
    },

    /** Count documents by classification */
    countByClassification(userLevel) {
      const visible = this.getVisibleTo(userLevel);
      return {
        total:        visible.length,
        topSecret:    visible.filter(d => d.classification === 'TOP SECRET').length,
        secret:       visible.filter(d => d.classification === 'SECRET').length,
        confidential: visible.filter(d => d.classification === 'CONFIDENTIAL').length,
        unclassified: visible.filter(d => d.classification === 'UNCLASSIFIED').length,
        encrypted:    visible.filter(d => d.encrypted).length
      };
    }
  };

})();
