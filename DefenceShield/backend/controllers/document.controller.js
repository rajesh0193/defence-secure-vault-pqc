/**
 * ============================================================
 *  DefenceShield — Document Controller
 *  Upload, view, delete, and search documents
 *  FILE: backend/controllers/document.controller.js
 *
 *  In a real backend (Node.js + Express):
 *    POST   /api/documents/upload  → multer → PQC encrypt → store
 *    GET    /api/documents         → fetch with clearance filter
 *    GET    /api/documents/:id     → decrypt + verify → stream
 *    DELETE /api/documents/:id     → access check → remove
 * ============================================================
 */

const DocumentController = (() => {

  // File type detection map
  const FILE_TYPE_MAP = {
    pdf:  'PDF',
    png:  'Image', jpg: 'Image', jpeg: 'Image', gif: 'Image', webp: 'Image',
    mp4:  'Video', avi: 'Video', mkv: 'Video', mov: 'Video',
    xlsx: 'Spreadsheet', csv: 'Spreadsheet', xls: 'Spreadsheet',
    docx: 'Document', txt: 'Document', doc: 'Document',
    pptx: 'Presentation', ppt: 'Presentation',
    zip:  'Archive', rar: 'Archive'
  };

  const FILE_ICONS = {
    PDF:          '📄',
    Image:        '🖼',
    Video:        '🎬',
    Spreadsheet:  '📊',
    Document:     '📝',
    Presentation: '📋',
    Archive:      '🗜',
    Other:        '📁'
  };

  const CLASSIFICATION_TAG = {
    'TOP SECRET':   'tag-ts',
    'SECRET':       'tag-secret',
    'CONFIDENTIAL': 'tag-conf',
    'UNCLASSIFIED': 'tag-unclass'
  };

  // ── Helpers ──────────────────────────────────────────────────

  function detectFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    return FILE_TYPE_MAP[ext] || 'Other';
  }

  function getFileIcon(fileType) {
    return FILE_ICONS[fileType] || '📁';
  }

  function getClassTag(classification) {
    return CLASSIFICATION_TAG[classification] || 'tag-unclass';
  }

  // ── PQC Encryption Steps for Upload Animation ─────────────────
  const ENCRYPTION_STEPS = [
    'Generating Kyber-1024 key pair...',
    'Encapsulating shared secret with Kyber-1024...',
    'Deriving AES-256-GCM session key via HKDF...',
    'Encrypting document with AES-256-GCM (256-bit)...',
    'Signing with CRYSTALS-Dilithium-5...',
    'Computing SHA3-512 integrity hash...',
    'Applying SPHINCS+ backup hash-based signature...',
    'Uploading encrypted ciphertext to secure store...',
    'Verifying upload integrity...',
    'Document secured and stored successfully!'
  ];

  return {

    getFileIcon,
    getClassTag,
    detectFileType,

    /**
     * Handle file input selection
     * Shows upload form once a file is picked
     */
    handleFileSelect(input) {
      if (!input.files.length) return;
      const f = input.files[0];
      document.getElementById('selectedFileName').value = f.name;
      document.getElementById('docTitle').value = f.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
      document.getElementById('filePreview').style.display = 'block';
    },

    /**
     * Upload a document with PQC encryption simulation
     */
    upload() {
      const user  = AuthController.getCurrentUser();
      const title = document.getElementById('docTitle').value.trim();
      const cls   = document.getElementById('docClass').value;
      const type  = document.getElementById('docType').value;
      const access= parseInt(document.getElementById('docAccess').value);
      const desc  = document.getElementById('docDesc')?.value?.trim() || '';
      const file  = document.getElementById('fileInput').files[0];

      if (!file || !title) { UIController.showNotif('⚠ Fill in all required fields'); return; }
      if (access > user.level) {
        UIController.showNotif('⚠ Cannot set access level above your own clearance');
        return;
      }

      const fileType = detectFileType(file.name);

      // Show PQC encryption animation
      const modal  = document.getElementById('uploadModal');
      const progBar= document.getElementById('uploadProgBar');
      const stepEl = document.getElementById('uploadStep');
      const keyEl  = document.getElementById('keyBytes');

      modal.style.display = 'flex';
      keyEl.textContent = PQCEngine.generateCiphertext(120);

      let step = 0;
      const interval = setInterval(() => {
        if (step >= ENCRYPTION_STEPS.length) {
          clearInterval(interval);
          modal.style.display = 'none';

          // Read file and store with PQC metadata
          const reader = new FileReader();
          reader.onload = (e) => {
            const doc = DocumentModel.create({
              title, type, classification: cls, access, fileType,
              uploader:    user.shortName,
              size:        (file.size / (1024*1024)).toFixed(1) + ' MB',
              description: desc,
              fileData:    e.target.result,
              fileName:    file.name
            });

            AuditLogger.addLog('success',
              `<span class="log-user">${user.shortName}</span> uploaded: <em>${title}</em>. ` +
              `Classification: ${cls}. PQC encryption applied (Kyber-1024 + AES-256-GCM + Dilithium-5).`
            );

            document.getElementById('filePreview').style.display = 'none';
            document.getElementById('fileInput').value = '';
            UIController.showNotif('◈ Document encrypted & uploaded successfully');
            UIController.showSection('documents');
          };
          reader.readAsDataURL(file);
          return;
        }

        stepEl.textContent = ENCRYPTION_STEPS[step];
        progBar.style.width = ((step + 1) / ENCRYPTION_STEPS.length * 100) + '%';
        keyEl.textContent = PQCEngine.generateCiphertext(120);
        step++;
      }, 400);
    },

    /**
     * Open document viewer modal
     * Handles: PDF (PDF.js), Image, Video, Text, Binary fallback
     */
    view(id) {
      const user = AuthController.getCurrentUser();
      const d = DocumentModel.findById(id);
      if (!d) return;

      if (!AccessControl.canViewDocument(d)) {
        UIController.showNotif('⚠ Access Denied — Insufficient clearance');
        AuditLogger.addLog('warn',
          `<span class="log-user">${user.shortName}</span> attempted to access: <em>${d.title}</em> — ACCESS DENIED.`
        );
        return;
      }

      AuditLogger.addLog('info',
        `<span class="log-user">${user.shortName}</span> accessed: <em>${d.title}</em>. Dilithium-5 signature verified.`
      );

      // Populate modal
      document.getElementById('viewerTitle').textContent = d.title;
      const badge = document.getElementById('viewerBadge');
      badge.textContent = d.classification;
      badge.className = 'tag ' + getClassTag(d.classification);
      document.getElementById('viewerMeta').textContent =
        `${d.type} · ${d.fileType} · ${d.size} · Uploaded by ${d.uploader} on ${d.date}`;

      const dlBtn = document.getElementById('viewerDownload');
      const body  = document.getElementById('viewerBody');
      dlBtn.style.display = d.fileData ? 'inline-block' : 'none';
      dlBtn.onclick = () => {
        if (!d.fileData) return;
        const a = document.createElement('a');
        a.href = d.fileData;
        a.download = d.fileName || d.title;
        a.click();
      };

      if (!d.fileData) {
        body.innerHTML = this._defaultView(d);
      } else if (d.fileType === 'Image') {
        body.innerHTML = `<div style="text-align:center;padding:1rem 0;">
          <img src="${d.fileData}" style="max-width:100%;max-height:62vh;border-radius:4px;border:1px solid var(--border);" /></div>`;
      } else if (d.fileType === 'Video') {
        body.innerHTML = `<video controls style="width:100%;max-height:55vh;border-radius:4px;background:#000;display:block;">
          <source src="${d.fileData}">Your browser does not support this video format.</video>`;
      } else if (d.fileType === 'PDF') {
        this._renderPDF(d, body);
      } else if (d.fileType === 'Presentation') {
        body.innerHTML = this._binaryFallback(d, 'PowerPoint (PPTX)');
      } else if (d.fileType === 'Document' || d.fileType === 'Spreadsheet') {
        this._renderText(d, body);
      } else {
        body.innerHTML = this._binaryFallback(d, d.fileType);
      }

      document.getElementById('viewerModal').style.display = 'flex';
      UIController.showNotif('◈ Document decrypted. Signature verified.');
    },

    /**
     * Delete a document (requires Level 4+ permission)
     */
    delete(id) {
      const user = AuthController.getCurrentUser();
      if (!AccessControl.canDelete()) {
        UIController.showNotif('⚠ Insufficient clearance to delete documents');
        return;
      }
      const d = DocumentModel.findById(id);
      if (!d) return;
      DocumentModel.delete(id);
      AuditLogger.addLog('warn',
        `<span class="log-user">${user.shortName}</span> permanently deleted: <em>${d.title}</em>.`
      );
      UIController.showNotif('Document deleted.');
      OverviewPage.refresh();
      DocumentsPage.render();
    },

    // ── Private Renderers ──────────────────────────────────────

    _defaultView(d) {
      return `
        <div style="background:var(--surface2);border-radius:6px;padding:1.5rem;text-align:center;">
          <div style="font-size:3rem;margin-bottom:1rem;">${getFileIcon(d.fileType)}</div>
          <div style="font-family:Rajdhani,sans-serif;font-size:1.1rem;font-weight:600;color:var(--text);margin-bottom:0.5rem;">${d.title}</div>
          <div style="font-family:Share Tech Mono,monospace;font-size:0.65rem;color:var(--muted);margin-bottom:1.5rem;">${d.fileType} · ${d.size}</div>
          <div style="background:var(--surface);border:1px solid rgba(0,255,157,0.2);border-radius:4px;padding:1rem;text-align:left;font-family:Share Tech Mono,monospace;font-size:0.68rem;color:var(--muted);line-height:2.2;">
            <div><span style="color:var(--accent2);">Classification</span> : ${d.classification}</div>
            <div><span style="color:var(--accent2);">Document Type </span> : ${d.type}</div>
            <div><span style="color:var(--accent2);">Uploaded By   </span> : ${d.uploader}</div>
            <div><span style="color:var(--accent2);">Upload Date   </span> : ${d.date}</div>
            <div><span style="color:var(--accent2);">Encryption    </span> : Kyber-1024 + AES-256-GCM ✓</div>
            <div><span style="color:var(--accent2);">Signature     </span> : Dilithium-5 ✓ VERIFIED</div>
            <div><span style="color:var(--accent2);">SHA3-512 Hash </span> : ${d.hash}</div>
          </div>
          ${d.description ? `<div style="margin-top:1rem;font-size:0.8rem;color:var(--muted);text-align:left;line-height:1.6;"><strong style="color:var(--text);">Notes:</strong> ${d.description}</div>` : ''}
          <div style="margin-top:1.2rem;font-family:Share Tech Mono,monospace;font-size:0.65rem;color:rgba(0,212,255,0.4);">
            This is a pre-loaded sample document. Upload a real file to preview contents.
          </div>
        </div>`;
    },

    _binaryFallback(d, label) {
      return `
        <div style="background:var(--surface2);border-radius:6px;padding:1.5rem;text-align:center;">
          <div style="font-size:2.5rem;margin-bottom:0.8rem;">${getFileIcon(d.fileType)}</div>
          <div style="font-family:Rajdhani,sans-serif;font-size:1rem;font-weight:600;color:var(--text);margin-bottom:0.4rem;">${d.fileName || d.title}</div>
          <div style="font-size:0.72rem;color:var(--muted);margin-bottom:1.2rem;">${label} files cannot be previewed in browser. Download to open.</div>
          <div style="background:var(--surface);border:1px solid rgba(0,255,157,0.2);border-radius:4px;padding:0.8rem;text-align:left;font-family:Share Tech Mono,monospace;font-size:0.66rem;color:var(--muted);line-height:2.2;margin-bottom:1.2rem;">
            <div><span style="color:var(--accent2);">Encryption</span> : Kyber-1024 + AES-256-GCM ✓</div>
            <div><span style="color:var(--accent2);">Signature </span> : Dilithium-5 ✓ VERIFIED</div>
            <div><span style="color:var(--accent2);">SHA3-512  </span> : ${d.hash}</div>
          </div>
          <button class="btn-primary" style="width:auto;padding:0.5rem 1.5rem;font-size:0.8rem;" onclick="document.getElementById('viewerDownload').click()">⬇ DOWNLOAD TO OPEN</button>
        </div>`;
    },

    _renderText(d, body) {
      try {
        const base64 = d.fileData.split(',')[1];
        const bytes = new Uint8Array([...atob(base64)].map(c => c.charCodeAt(0)));
        const text  = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
        const printable = text.replace(/[\x00-\x08\x0e-\x1f\x7f-\x9f]/g, '');
        if ((text.length - printable.length) / text.length > 0.1) {
          body.innerHTML = this._binaryFallback(d, d.fileType);
        } else {
          const escaped = printable.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          body.innerHTML = `<pre style="font-family:Share Tech Mono,monospace;font-size:0.72rem;color:var(--text);background:var(--surface2);padding:1rem;border-radius:4px;overflow:auto;max-height:55vh;white-space:pre-wrap;word-break:break-word;line-height:1.6;">${escaped}</pre>`;
        }
      } catch(e) {
        body.innerHTML = this._defaultView(d);
      }
    },

    _renderPDF(d, body) {
      body.innerHTML = `<div id="pdfLoading" style="text-align:center;padding:2rem;font-family:Share Tech Mono,monospace;font-size:0.75rem;color:var(--accent2);">
        <div>Rendering PDF with PDF.js...</div><div id="pdfPageContainer"></div></div>`;
      body._docRef = d;

      const doRender = () => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const base64 = d.fileData.split(',')[1];
        const bytes  = new Uint8Array([...atob(base64)].map(c => c.charCodeAt(0)));
        const cont   = document.getElementById('pdfPageContainer');
        const load   = document.getElementById('pdfLoading');

        pdfjsLib.getDocument({ data: bytes }).promise.then(pdf => {
          if (load) load.querySelector('div').textContent = `Rendering ${pdf.numPages} page(s)...`;
          cont.innerHTML = '';
          cont.style.cssText = 'overflow-y:auto;max-height:62vh;';
          let chain = Promise.resolve();
          for (let i = 1; i <= pdf.numPages; i++) {
            const num = i;
            chain = chain.then(() => pdf.getPage(num).then(page => {
              const vp = page.getViewport({ scale: 1.5 });
              const canvas = document.createElement('canvas');
              canvas.width = vp.width; canvas.height = vp.height;
              canvas.style.cssText = 'width:100%;display:block;border:1px solid var(--border);border-radius:4px;margin-bottom:8px;background:#fff;';
              cont.appendChild(canvas);
              return page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
            }));
          }
          if (load) load.querySelector('div').style.display = 'none';
        }).catch(err => {
          body.innerHTML = this._binaryFallback(d, 'PDF') + `<div style="color:var(--danger);font-family:Share Tech Mono,monospace;font-size:0.62rem;margin-top:0.5rem;">${err.message}</div>`;
        });
      };

      if (!window.pdfjsLib) {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        s.onload = doRender;
        s.onerror = () => { body.innerHTML = this._binaryFallback(d, 'PDF'); };
        document.head.appendChild(s);
      } else {
        doRender();
      }
    }
  };

})();
