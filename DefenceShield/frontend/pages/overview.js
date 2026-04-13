/**
 * ============================================================
 *  DefenceShield — Overview Page
 *  Command dashboard with stats, recent docs, PQC status
 *  FILE: frontend/pages/overview.js
 * ============================================================
 */

const OverviewPage = (() => {

  return {

    render() {
      const user  = AuthController.getCurrentUser();
      const stats = DocumentModel.countByClassification(user.level);
      const recent= DocumentModel.getVisibleTo(user.level).slice(-4).reverse();

      document.getElementById('sec-overview').innerHTML = `
        <div class="section-header">
          <div>
            <div class="section-title">Command Overview</div>
            <div class="section-subtitle">REAL-TIME SYSTEM STATUS · CLASSIFIED DASHBOARD</div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card blue">
            <div class="stat-label">Total Documents</div>
            <div class="stat-value">${stats.total}</div>
            <div class="stat-note">Across all clearance levels</div>
          </div>
          <div class="stat-card green">
            <div class="stat-label">PQC Encrypted</div>
            <div class="stat-value">${stats.encrypted}</div>
            <div class="stat-note">Kyber-1024 protected</div>
          </div>
          <div class="stat-card orange">
            <div class="stat-label">TS/SCI Files</div>
            <div class="stat-value">${stats.topSecret}</div>
            <div class="stat-note">Top Secret · Compartmented</div>
          </div>
          <div class="stat-card red">
            <div class="stat-label">Threat Level</div>
            <div class="stat-value">ALPHA</div>
            <div class="stat-note">Quantum: Elevated</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="card">
            <div class="card-header"><div class="card-title">Recent Documents</div></div>
            ${recent.length ? recent.map(d => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid rgba(0,212,255,0.06);">
                <div>
                  <div style="font-size:0.8rem;color:var(--text);font-weight:500;">${truncate(d.title, 35)}</div>
                  <div style="font-family:Share Tech Mono,monospace;font-size:0.6rem;color:var(--muted);">${d.date} · ${d.fileType}</div>
                </div>
                <span class="tag ${DocumentController.getClassTag(d.classification)}">${d.classification}</span>
              </div>`).join('')
            : '<div style="color:var(--muted);font-size:0.78rem;font-family:Share Tech Mono,monospace;">No documents yet</div>'}
          </div>

          <div class="card">
            <div class="card-header"><div class="card-title">PQC Algorithm Status</div></div>
            <div style="font-family:Share Tech Mono,monospace;font-size:0.72rem;line-height:2.2;">
              ${[
                ['CRYSTALS-Kyber-1024', true],
                ['CRYSTALS-Dilithium-5', true],
                ['SPHINCS+-SHA3-256', true],
                ['FALCON-1024', true],
                ['RSA-2048', false],
                ['ECC-256', false]
              ].map(([algo, active]) => `
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:var(--muted);">${algo}</span>
                  <span style="color:${active ? 'var(--accent2)' : 'var(--danger)'};">${active ? '● ACTIVE' : '✕ DEPRECATED'}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>

        <div class="card" style="background:rgba(0,255,157,0.03);border-color:rgba(0,255,157,0.2);">
          <div class="card-header">
            <div class="card-title" style="color:var(--accent2);">Why Post-Quantum Cryptography?</div>
          </div>
          <div style="font-size:0.82rem;color:var(--muted);line-height:1.7;">
            Quantum computers running <strong style="color:var(--text);">Shor's Algorithm</strong> can break RSA and ECC in polynomial time.
            NIST standardized PQC algorithms (FIPS 203/204/205) are based on mathematical problems —
            <strong style="color:var(--accent2);">lattice-based</strong> (Kyber, Dilithium),
            <strong style="color:var(--accent2);">hash-based</strong> (SPHINCS+) — that quantum computers cannot solve efficiently.
            DefenceShield implements <strong style="color:var(--text);">hybrid encryption</strong>: PQC key encapsulation + AES-256-GCM, ensuring future quantum security.
          </div>
        </div>`;
    },

    refresh() { this.render(); }
  };

})();
