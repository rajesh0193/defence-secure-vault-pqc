# DefenceShield — Post-Quantum Defence Management System

**College Project | Post-Quantum Cryptography (PQC) Integration**

---

## Project Overview

DefenceShield is a secure document management system designed for defence and government use. It integrates **Post-Quantum Cryptography (PQC)** to protect classified documents against both classical and quantum computer attacks.

---

## Folder Structure

```
DefenceShield/
│
├── frontend/                      ← All UI code lives here
│   ├── index.html                 ← Main entry point (open this in browser)
│   ├── css/
│   │   ├── base.css               ← CSS variables, reset, typography
│   │   ├── login.css              ← Login screen styles
│   │   ├── dashboard.css          ← Topbar, sidebar, layout styles
│   │   └── components.css         ← Cards, tables, modals, buttons
│   ├── js/
│   │   ├── app.js                 ← App entry point — initializes everything
│   │   ├── ui.controller.js       ← Section switching, notifications
│   │   └── utils.js               ← AuditLogger, helper functions
│   └── pages/
│       ├── overview.js            ← Dashboard overview page
│       ├── documents.js           ← Document repository page
│       ├── upload.js              ← Secure upload page
│       ├── pqc-status.js          ← PQC algorithm status + live demo
│       ├── access-control.js      ← Clearance hierarchy page
│       └── audit-logs.js          ← Audit log viewer page
│
├── backend/                       ← Business logic and data layer
│   ├── controllers/
│   │   ├── auth.controller.js     ← Login, logout, session management
│   │   └── document.controller.js ← Upload, view, delete documents
│   ├── middleware/
│   │   └── access.control.js      ← Role-Based Access Control (RBAC)
│   ├── models/
│   │   ├── user.model.js          ← Officer clearance levels & permissions
│   │   └── document.model.js      ← Document store & CRUD operations
│   └── routes/
│       └── api.routes.js          ← REST API route definitions
│
├── pqc/                           ← Post-Quantum Cryptography layer
│   ├── pqc-engine.js              ← Core PQC orchestrator
│   ├── pqc-kyber.js               ← CRYSTALS-Kyber-1024 (Key Encapsulation)
│   ├── pqc-dilithium.js           ← CRYSTALS-Dilithium-5 (Digital Signatures)
│   └── pqc-sphincs.js             ← SPHINCS+ (Hash-Based Backup Signatures)
│
├── config/
│   └── config.js                  ← App configuration constants
│
└── docs/
    └── README.md                  ← This file
```

---

## How to Run

1. Open the `frontend/` folder
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge)
3. Select a clearance level, enter any Officer ID and pass-key (min 4 chars)
4. Click **Authenticate & Access**

> No server or installation required — runs entirely in the browser.

---

## PQC Algorithms Used

| Algorithm | Standard | Purpose | Security Level |
|-----------|----------|---------|----------------|
| CRYSTALS-Kyber-1024 | NIST FIPS 203 | Key Encapsulation (replaces RSA/ECDH) | Level 5 |
| CRYSTALS-Dilithium-5 | NIST FIPS 204 | Digital Signatures (replaces ECDSA) | Level 5 |
| SPHINCS+-SHA3-256 | NIST FIPS 205 | Hash-Based Backup Signatures | Level 5 |
| AES-256-GCM | NIST FIPS 197 | Symmetric Document Encryption | Quantum-Resistant |
| SHA3-512 | NIST FIPS 202 | Integrity Hashing | Quantum-Resistant |

---

## Why PQC?

Classical cryptography (RSA, ECC) is vulnerable to **Shor's Algorithm** running on a quantum computer, which can factor large numbers and solve discrete logarithms in polynomial time.

PQC algorithms are based on mathematical problems with **no known quantum speedup**:
- **Module-LWE** (Learning With Errors) — Kyber & Dilithium
- **Hash function security** — SPHINCS+

These were standardized by NIST in 2024 as FIPS 203, 204, and 205.

---

## Access Control (5 Levels)

| Level | Role | Classification |
|-------|------|----------------|
| Level 5 | Field Marshal / CDS | TOP SECRET / SCI |
| Level 4 | General / Admiral | TOP SECRET |
| Level 3 | Brigadier / Colonel | SECRET |
| Level 2 | Major / Captain | CONFIDENTIAL |
| Level 1 | Lieutenant / Junior Officer | UNCLASSIFIED |

Higher levels can access all documents at lower levels.
Lower levels **cannot** access documents above their clearance.

---

## File Type Support

| File Type | Preview |
|-----------|---------|
| PDF | Rendered page-by-page via PDF.js |
| PNG / JPG / GIF | Displayed inline |
| MP4 / AVI / MKV | Played with browser video player |
| TXT / CSV | Text viewer |
| DOCX / XLSX / PPTX | Download to open in Office |

---

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules pattern)
- **PQC Simulation**: JavaScript simulation of NIST FIPS 203/204/205 APIs
- **PDF Rendering**: PDF.js (Mozilla, CDN)
- **Fonts**: Google Fonts (Rajdhani, Share Tech Mono, Exo 2)
- **Storage**: In-memory (browser session only — no server needed)

---

## College Project Notes

This project demonstrates:
1. **PQC Integration** — How Kyber, Dilithium, and SPHINCS+ replace classical crypto
2. **Role-Based Access Control** — 5-level clearance hierarchy with document-level enforcement
3. **Secure Document Management** — Upload, encrypt, classify, and retrieve defence documents
4. **Audit Trail** — Immutable tamper-evident log of all system activity
5. **Separation of Concerns** — Clean frontend / backend / PQC layer architecture

---

*Developed as a college project demonstrating Post-Quantum Cryptography in a Defence Management System.*
