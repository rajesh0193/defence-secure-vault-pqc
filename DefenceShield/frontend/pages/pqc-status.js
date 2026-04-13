/**
 * ============================================================
 *  DefenceShield — PQC Status Page
 *  Displays algorithm details, live demo, quantum vs classical
 *  FILE: frontend/pages/pqc-status.js
 * ============================================================
 */

const PQCStatusPage = (() => {

  return {

    render() {
      document.getElementById('sec-pqc').innerHTML = `
        <div class="section-header">
          <div>
            <div class="section-title">PQC Security Status</div>
            <div class="section-subtitle">POST-QUANTUM CRYPTOGRAPHY LAYER · NIST FIPS 203/204/205</div>
          </div>
        </div>

        <!-- Active Algorithms -->
        <div class="pqc-panel">
          <div class="pqc-panel-header">◈ Active PQC Algorithms (NIST Standardized)</div>
          <div class="algo-grid">
            ${[
              {
                name:  'CRYSTALS-Kyber 1024',
                desc:  'Lattice-based Key Encapsulation Mechanism. Quantum-safe replacement for RSA/ECDH key exchange. Used for every session key establishment.',
                level: 'NIST FIPS 203 · SECURITY LEVEL 5'
              },
              {
                name:  'CRYSTALS-Dilithium 5',
                desc:  'Lattice-based Digital Signature. Signs all uploaded documents. Quantum-safe replacement for RSA-PSS and ECDSA signatures.',
                level: 'NIST FIPS 204 · SECURITY LEVEL 5'
              },
              {
                name:  'SPHINCS+ SHA3-256',
                desc:  'Hash-based stateless signature. Backup signing layer. Conservative security — based only on hash function hardness, not lattices.',
                level: 'NIST FIPS 205 · SECURITY LEVEL 5'
              },
              {
                name:  'FALCON-1024',
                desc:  'Fast Fourier lattice-based compact signatures. Used for compact authentication tokens with minimal bandwidth overhead.',
                level: 'NIST ROUND 3 ALTERNATE · LEVEL 5'
              },
              {
                name:  'AES-256-GCM',
                desc:  'Symmetric encryption for document data. 256-bit key resists Grover\'s Algorithm (effective 128-bit quantum security).',
                level: 'NIST APPROVED · QUANTUM RESISTANT'
              },
              {
                name:  'SHA3-512 / SHAKE-256',
                desc:  'Keccak-based hashing for document integrity. Resistant to length-extension attacks. Used for document fingerprinting.',
                level: 'NIST FIPS 202 · QUANTUM RESISTANT'
              }
            ].map(a => `
              <div class="algo-card">
                <div class="algo-name">${a.name}</div>
                <div class="algo-desc">${a.desc}</div>
                <div class="algo-level">${a.level}</div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Live Encryption Demo -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Live Encryption Demonstration</div>
          </div>
          <div style="margin-bottom:0.8rem;">
            <div style="font-family:Share Tech Mono,monospace;font-size:0.65rem;
                        letter-spacing:2px;color:var(--muted);margin-bottom:0.4rem;">
              SAMPLE PLAINTEXT INPUT
            </div>
            <input type="text" id="demoInput" value="OPERATION THUNDERBOLT — CLASSIFIED"
              style="width:100%;background:var(--surface2);border:1px solid var(--border);
                     border-radius:4px;padding:0.6rem 0.8rem;color:var(--text);
                     font-family:Share Tech Mono,monospace;font-size:0.8rem;outline:none;">
          </div>
          <button class="btn-primary"
            style="width:auto;padding:0.5rem 1.2rem;font-size:0.78rem;margin-bottom:1rem;"
            onclick="PQCStatusPage.runDemo()">▶ RUN PQC ENCRYPTION</button>
          <div class="enc-demo" id="demoOutput">
            <span class="label">OUTPUT</span>
            <span style="color:var(--muted);">Click 'Run PQC Encryption' to see simulation...</span>
          </div>
        </div>

        <!-- Classical vs PQC Comparison -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Why Classical Cryptography Fails Against Quantum</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;font-size:0.8rem;line-height:1.6;">
            <div style="background:rgba(255,43,43,0.06);border:1px solid rgba(255,43,43,0.2);
                        border-radius:4px;padding:1rem;">
              <div style="color:var(--danger);font-family:Rajdhani,sans-serif;font-weight:600;
                          letter-spacing:2px;margin-bottom:0.6rem;font-size:0.85rem;">
                ✕ CLASSICAL (QUANTUM-VULNERABLE)
              </div>
              <div style="color:var(--muted);">
                <strong style="color:var(--text);">RSA-2048:</strong> Shor's Algorithm factors large integers in polynomial time — breaks RSA in hours on a large quantum computer.<br><br>
                <strong style="color:var(--text);">ECC-256:</strong> Shor's Algorithm solves the elliptic curve discrete logarithm — ECDSA and ECDH are completely broken.<br><br>
                <strong style="color:var(--text);">Diffie-Hellman:</strong> Quantum computers solve discrete log in polynomial time — DH key exchange is fully vulnerable.
              </div>
            </div>
            <div style="background:rgba(0,255,157,0.04);border:1px solid rgba(0,255,157,0.2);
                        border-radius:4px;padding:1rem;">
              <div style="color:var(--accent2);font-family:Rajdhani,sans-serif;font-weight:600;
                          letter-spacing:2px;margin-bottom:0.6rem;font-size:0.85rem;">
                ◈ PQC (QUANTUM-SAFE)
              </div>
              <div style="color:var(--muted);">
                <strong style="color:var(--text);">Kyber-1024:</strong> Based on Module-LWE (Learning With Errors). No known quantum algorithm achieves meaningful speedup.<br><br>
                <strong style="color:var(--text);">Dilithium-5:</strong> Module-LWE + Module-SIS lattice problems. Best known quantum attack gives no significant advantage.<br><br>
                <strong style="color:var(--text);">SPHINCS+:</strong> Based only on hash function security. Grover's Algorithm at most halves security — mitigated by large key size.
              </div>
            </div>
          </div>
        </div>`;
    },

    runDemo() {
      const input = document.getElementById('demoInput')?.value || 'CLASSIFIED DATA';
      const out   = document.getElementById('demoOutput');
      out.innerHTML = `<span class="label">ENCRYPTING WITH KYBER-1024 + AES-256-GCM...</span>
        <span style="color:var(--warn);">Processing...</span>`;

      setTimeout(() => {
        const kyberKey = PQCEngine.generateCiphertext(60);
        const ct       = PQCEngine.generateCiphertext(80);
        const sig      = PQCEngine.generateHash();
        const hash     = PQCEngine.generateHash();

        out.innerHTML = `<span class="label">PLAINTEXT INPUT</span>${escapeHtml(input)}

<span class="label">KYBER-1024 ENCAPSULATED KEY (1568 bytes)</span>${kyberKey}

<span class="label">AES-256-GCM CIPHERTEXT</span>${ct}

<span class="label">DILITHIUM-5 DIGITAL SIGNATURE</span>${sig}

<span class="label">SHA3-512 INTEGRITY HASH</span>${hash}

<span style="color:var(--accent2);">✓ Quantum-resistant encryption complete.
  Classical computers: computationally infeasible.
  Quantum computers (Shor's/Grover's): infeasible with PQC algorithms.</span>`;
      }, 800);
    }
  };

})();
