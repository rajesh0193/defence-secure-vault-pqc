/**
 * ============================================================
 *  DefenceShield — Audit Logs Page
 *  Immutable tamper-evident activity log viewer
 *  FILE: frontend/pages/audit-logs.js
 * ============================================================
 */

const AuditLogsPage = (() => {

  return {

    render() {
      const logs = AuditLogger.getLogs();

      document.getElementById('sec-logs').innerHTML = `
        <div class="section-header">
          <div>
            <div class="section-title">Audit Logs</div>
            <div class="section-subtitle">IMMUTABLE ACTIVITY LOG · TAMPER-EVIDENT · DILITHIUM-5 SIGNED</div>
          </div>
        </div>

        <!-- Log Legend -->
        <div style="display:flex;gap:1.5rem;margin-bottom:1rem;font-family:Share Tech Mono,monospace;
                    font-size:0.65rem;color:var(--muted);letter-spacing:1px;flex-wrap:wrap;">
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--accent2);margin-right:5px;"></span>SUCCESS</span>
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--accent);margin-right:5px;"></span>INFO</span>
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--warn);margin-right:5px;"></span>WARNING</span>
          <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--danger);margin-right:5px;"></span>DENIED / THREAT</span>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">System Activity Log</div>
            <div style="font-family:Share Tech Mono,monospace;font-size:0.62rem;color:var(--accent2);">
              ${logs.length} ENTRIES · SIGNED WITH DILITHIUM-5
            </div>
          </div>
          <div id="auditLogContainer">
            ${logs.length === 0
              ? '<div style="color:var(--muted);font-size:0.78rem;font-family:Share Tech Mono,monospace;">No log entries yet.</div>'
              : logs.map(l => `
                <div class="log-entry">
                  <div class="log-time">${l.time}</div>
                  <div class="log-dot ${l.type}"></div>
                  <div class="log-msg">${l.msg}</div>
                </div>`).join('')}
          </div>
        </div>

        <!-- Audit Integrity Note -->
        <div class="card" style="background:rgba(0,255,157,0.03);border-color:rgba(0,255,157,0.15);">
          <div style="font-family:Share Tech Mono,monospace;font-size:0.68rem;color:var(--muted);line-height:2;">
            <div><span style="color:var(--accent2);">◈ INTEGRITY</span> &nbsp; Every log entry is signed with Dilithium-5 and chained via SHA3-512 hash tree.</div>
            <div><span style="color:var(--accent2);">◈ IMMUTABLE</span> &nbsp; Logs are append-only. No entry can be modified or deleted after creation.</div>
            <div><span style="color:var(--accent2);">◈ COMPLIANT</span> &nbsp; Audit trail complies with MoD information security standards and NIST SP 800-92.</div>
            <div><span style="color:var(--accent2);">◈ RETENTION</span> &nbsp; Logs retained for 7 years per defence archival policy.</div>
          </div>
        </div>`;
    }
  };

})();
