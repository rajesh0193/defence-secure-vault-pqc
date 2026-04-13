/**
 * ============================================================
 *  DefenceShield — Upload Page
 *  Secure document upload with PQC encryption pipeline
 *  FILE: frontend/pages/upload.js
 * ============================================================
 */

const UploadPage = (() => {

  return {

    render() {
      document.getElementById('sec-upload').innerHTML = `
        <div class="section-header">
          <div>
            <div class="section-title">Upload Document</div>
            <div class="section-subtitle">SECURE UPLOAD · AUTO PQC ENCRYPTION</div>
          </div>
        </div>

        <div class="card">
          <!-- Drop Zone -->
          <div class="upload-zone" onclick="document.getElementById('fileInput').click()">
            <div class="upload-icon">📁</div>
            <div class="upload-text"><strong>Click to select file</strong> or drag and drop</div>
            <div class="upload-formats">
              PDF · DOCX · XLSX · CSV · TXT · PNG · JPG · MP4 · AVI · PPTX
            </div>
          </div>

          <input type="file" id="fileInput" style="display:none"
            onchange="DocumentController.handleFileSelect(this)"
            accept=".pdf,.docx,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.mp4,.avi,.mkv,.pptx,.ppt,.xls">

          <!-- Upload Form (shown after file selected) -->
          <div id="filePreview" style="display:none;margin-top:1.5rem;">

            <div class="form-row">
              <label>Selected File</label>
              <input type="text" id="selectedFileName" readonly style="color:var(--accent2);">
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
              <div class="form-row">
                <label>Document Title</label>
                <input type="text" id="docTitle" placeholder="Enter document title">
              </div>
              <div class="form-row">
                <label>Classification Level</label>
                <select id="docClass">
                  <option value="TOP SECRET">Top Secret</option>
                  <option value="SECRET">Secret</option>
                  <option value="CONFIDENTIAL">Confidential</option>
                  <option value="UNCLASSIFIED">Unclassified</option>
                </select>
              </div>
              <div class="form-row">
                <label>Document Category</label>
                <select id="docType">
                  <option value="Intelligence Report">Intelligence Report</option>
                  <option value="Operational Plan">Operational Plan</option>
                  <option value="Personnel File">Personnel File</option>
                  <option value="Weapons Specification">Weapons Specification</option>
                  <option value="Strategic Assessment">Strategic Assessment</option>
                  <option value="Communications Log">Communications Log</option>
                  <option value="Budget Report">Budget Report</option>
                  <option value="Mission Brief">Mission Brief</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-row">
                <label>Minimum Access Level Required</label>
                <select id="docAccess">
                  <option value="5">Level 5 — Field Marshal only</option>
                  <option value="4">Level 4+ — General and above</option>
                  <option value="3">Level 3+ — Brigadier and above</option>
                  <option value="2">Level 2+ — Major and above</option>
                  <option value="1">Level 1+ — All Officers</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <label>Description / Notes (Optional)</label>
              <textarea id="docDesc" rows="2"
                placeholder="Brief description of document contents..."
                style="resize:vertical;"></textarea>
            </div>

            <!-- PQC Pipeline Info -->
            <div style="background:var(--surface2);border:1px solid rgba(0,255,157,0.2);
                        border-radius:6px;padding:1rem;margin:1rem 0;">
              <div style="font-family:Share Tech Mono,monospace;font-size:0.65rem;
                          color:var(--accent2);letter-spacing:2px;margin-bottom:0.8rem;">
                ◈ PQC ENCRYPTION PIPELINE — APPLIED ON UPLOAD
              </div>
              <div style="font-family:Share Tech Mono,monospace;font-size:0.67rem;
                          color:var(--muted);line-height:2.2;">
                <div>1. CRYSTALS-Kyber-1024 &nbsp;&nbsp;&nbsp;&nbsp; → Key Encapsulation Mechanism (NIST FIPS 203)</div>
                <div>2. AES-256-GCM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; → Symmetric Document Encryption</div>
                <div>3. CRYSTALS-Dilithium-5 &nbsp;&nbsp;&nbsp; → Digital Signature (NIST FIPS 204)</div>
                <div>4. SHA3-512 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; → Integrity Hash (NIST FIPS 202)</div>
                <div>5. SPHINCS+-SHA3-256 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; → Hash-Based Backup Signature (NIST FIPS 205)</div>
              </div>
            </div>

            <button class="btn-primary" onclick="DocumentController.upload()" style="margin-top:0.5rem;">
              ⬡ ENCRYPT &amp; UPLOAD DOCUMENT
            </button>

          </div>
        </div>`;
    }
  };

})();
