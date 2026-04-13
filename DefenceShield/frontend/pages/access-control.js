/**
 * ============================================================
 *  DefenceShield — Access Control Page
 *  Displays clearance hierarchy and PQC auth flow
 *  FILE: frontend/pages/access-control.js
 * ============================================================
 */

const AccessControlPage = (() => {

  return {

    render() {
      document.getElementById('sec-access').innerHTML = `
        <div class="section-header">
          <div>
            <div class="section-title">Access Control</div>
            <div class="section-subtitle">ROLE-BASED CLEARANCE SYSTEM · RBAC</div>
          </div>
        </div>

        <!-- Clearance Hierarchy -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Security Clearance Hierarchy</div>
          </div>
          <div class="role-grid">
            <div class="role-card l5">
              <div class="role-level">LEVEL 5 · TS/SCI</div>
              <div class="role-name">Field Marshal / CDS</div>
              <ul class="role-perms">
                <li>Access all documents (Level 1–5)</li>
                <li>Upload any classification</li>
                <li>Delete documents</li>
                <li>Manage all users</li>
                <li>View complete audit logs</li>
              </ul>
            </div>
            <div class="role-card l4">
              <div class="role-level">LEVEL 4 · TOP SECRET</div>
              <div class="role-name">General / Admiral</div>
              <ul class="role-perms">
                <li>Access Level 1–4 documents</li>
                <li>Upload TOP SECRET</li>
                <li>Delete documents</li>
                <li>View department audit logs</li>
              </ul>
            </div>
            <div class="role-card l3">
              <div class="role-level">LEVEL 3 · SECRET</div>
              <div class="role-name">Brigadier / Colonel</div>
              <ul class="role-perms">
                <li>Access Level 1–3 documents</li>
                <li>Upload SECRET and below</li>
                <li>View own activity logs</li>
              </ul>
            </div>
            <div class="role-card l2">
              <div class="role-level">LEVEL 2 · CONFIDENTIAL</div>
              <div class="role-name">Major / Captain</div>
              <ul class="role-perms">
                <li>Access Level 1–2 documents</li>
                <li>Upload CONFIDENTIAL and below</li>
                <li>View own uploads</li>
              </ul>
            </div>
            <div class="role-card l1">
              <div class="role-level">LEVEL 1 · UNCLASSIFIED</div>
              <div class="role-name">Lieutenant / Junior Officer</div>
              <ul class="role-perms">
                <li>Access Level 1 documents only</li>
                <li>Upload UNCLASSIFIED only</li>
                <li>Read-only access</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- PQC Auth Flow -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">PQC Authentication Flow</div>
          </div>
          <div style="font-family:Share Tech Mono,monospace;font-size:0.72rem;line-height:2.4;color:var(--muted);">
            ${[
              ['Step 1', 'Officer submits credentials (Biometric + Officer ID) over TLS 1.3'],
              ['Step 2', 'Server generates Kyber-1024 key pair for this session (NIST FIPS 203)'],
              ['Step 3', 'Kyber KEM produces shared secret — sent as ciphertext to client'],
              ['Step 4', 'Dilithium-5 signature verifies server identity — prevents MITM attacks'],
              ['Step 5', 'Clearance level fetched from Hardware Security Module (HSM)'],
              ['Step 6', 'AES-256 session key derived from Kyber shared secret via HKDF'],
              ['Step 7', 'All API traffic encrypted with session key; key rotated every 15 min'],
              ['Step 8', 'Document decryption keys only released if clearance ≥ document level'],
            ].map(([step, desc]) => `
              <div>
                <span style="color:var(--accent);">${step}</span>
                &nbsp;→&nbsp; ${desc}
              </div>`).join('')}
          </div>
        </div>

        <!-- Document Classification Guide -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Document Classification Standards</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.8rem;">
            ${[
              { tag: 'tag-ts',     label: 'TOP SECRET',   desc: 'Exceptionally grave damage to national security. Field Marshal / General access only.' },
              { tag: 'tag-secret', label: 'SECRET',        desc: 'Serious damage to national security. Brigadier and above.' },
              { tag: 'tag-conf',   label: 'CONFIDENTIAL',  desc: 'Damage to national security. Major and above.' },
              { tag: 'tag-unclass',label: 'UNCLASSIFIED',  desc: 'No damage to national security. All officers.' }
            ].map(c => `
              <div style="background:var(--surface2);border-radius:4px;padding:0.8rem;">
                <div style="margin-bottom:0.5rem;"><span class="tag ${c.tag}">${c.label}</span></div>
                <div style="font-size:0.72rem;color:var(--muted);line-height:1.5;">${c.desc}</div>
              </div>`).join('')}
          </div>
        </div>`;
    }
  };

})();
