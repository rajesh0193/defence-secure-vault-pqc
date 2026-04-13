/**
 * ============================================================
 *  DefenceShield — Documents Page
 *  Document repository with filter, view, delete actions
 *  FILE: frontend/pages/documents.js
 * ============================================================
 */

const DocumentsPage = (() => {

  return {

    render() {
      const user = AuthController.getCurrentUser();

      document.getElementById('sec-documents').innerHTML = `
        <div class="section-header">
          <div>
            <div class="section-title">Document Repository</div>
            <div class="section-subtitle">CLASSIFIED DOCUMENT STORE · PQC ENCRYPTED</div>
          </div>
          <button class="btn-primary" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem;"
            onclick="UIController.showSection('upload')">+ UPLOAD</button>
        </div>

        <div class="card">
          <div style="display:flex;gap:0.8rem;margin-bottom:1rem;flex-wrap:wrap;">
            <select id="filterClass" onchange="DocumentsPage.render()"
              style="background:var(--surface2);border:1px solid var(--border);border-radius:4px;
                     padding:0.4rem 0.7rem;color:var(--text);font-family:Share Tech Mono,monospace;
                     font-size:0.72rem;outline:none;">
              <option value="">All Classifications</option>
              <option value="TOP SECRET">Top Secret</option>
              <option value="SECRET">Secret</option>
              <option value="CONFIDENTIAL">Confidential</option>
              <option value="UNCLASSIFIED">Unclassified</option>
            </select>
            <select id="filterType" onchange="DocumentsPage.render()"
              style="background:var(--surface2);border:1px solid var(--border);border-radius:4px;
                     padding:0.4rem 0.7rem;color:var(--text);font-family:Share Tech Mono,monospace;
                     font-size:0.72rem;outline:none;">
              <option value="">All Types</option>
              <option value="PDF">PDF</option>
              <option value="Image">Image</option>
              <option value="Video">Video</option>
              <option value="Spreadsheet">Spreadsheet</option>
              <option value="Document">Document</option>
              <option value="Presentation">Presentation</option>
            </select>
          </div>
          <div id="docTableContainer"></div>
        </div>`;

      this._renderTable(user);
    },

    _renderTable(user) {
      const filterC = document.getElementById('filterClass')?.value || '';
      const filterT = document.getElementById('filterType')?.value  || '';

      let docs = DocumentModel.getVisibleTo(user.level);
      if (filterC) docs = docs.filter(d => d.classification === filterC);
      if (filterT) docs = docs.filter(d => d.fileType === filterT);

      const el = document.getElementById('docTableContainer');
      if (!el) return;

      if (docs.length === 0) {
        el.innerHTML = `<div style="color:var(--muted);font-size:0.8rem;
          font-family:Share Tech Mono,monospace;padding:1rem 0;">
          No documents match the current filter.</div>`;
        return;
      }

      el.innerHTML = `
        <table class="doc-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Classification</th>
              <th>Type</th>
              <th>Encryption</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${docs.map(d => `
              <tr>
                <td>
                  <div class="doc-name">
                    <span class="doc-icon">${DocumentController.getFileIcon(d.fileType)}</span>
                    <div>
                      <div>${escapeHtml(truncate(d.title, 38))}</div>
                      <div style="font-family:Share Tech Mono,monospace;font-size:0.6rem;color:var(--muted);">
                        ${d.size} · ${d.fileType}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="tag ${DocumentController.getClassTag(d.classification)}">
                    ${d.classification}
                  </span>
                </td>
                <td style="font-size:0.75rem;color:var(--muted);">${d.type}</td>
                <td>
                  <div class="enc-label">Kyber-1024</div>
                  <div style="font-family:Share Tech Mono,monospace;font-size:0.55rem;color:var(--muted);">
                    SHA3: ${d.hash.slice(0,12)}…
                  </div>
                </td>
                <td style="font-family:Share Tech Mono,monospace;font-size:0.7rem;color:var(--muted);">
                  ${d.date}<br>${d.uploader.split(' ').pop()}
                </td>
                <td>
                  <button class="action-btn" onclick="DocumentController.view(${d.id})">VIEW</button>
                  ${user.level >= 4
                    ? `<button class="action-btn danger" onclick="DocumentController.delete(${d.id})">DEL</button>`
                    : ''}
                </td>
              </tr>`).join('')}
          </tbody>
        </table>`;
    }
  };

})();
