# OriginLock — Blockchain Tasks

> **Role:** Blockchain Developer  
> **Stack:** Rust · Anchor · Solana  
> **Network:** Solana Devnet (primary) / Localnet (development)  
> **Owner:** `blockchain/` directory only

---

## Phase 1 — Environment Setup (1–2 days)

Goal: Install all tools, scaffold Anchor project, verify everything works.

- [ ] **1.1 Install Solana CLI**
  - `solana --version` should print `1.18.x`
  - Run: `solana config set --url https://api.devnet.solana.com`
- [ ] **1.2 Generate Solana wallet**
  - `solana-keygen new --force` → creates `~/.config/solana/id.json`
  - `solana address` — copy this address
- [ ] **1.3 Airdrop SOL (Devnet)**
  - `solana airdrop 2` — repeat if needed
  - Verify: `solana balance`
- [ ] **1.4 Install Anchor CLI**
  - `cargo install --git https://github.com/coral-xyz/anchor avm --locked --force`
  - `avm install 0.30.1 && avm use 0.30.1`
  - Verify: `anchor --version`
- [ ] **1.5 Install Rust + BPF target**
  - `rustup target add bpfel-unknown-unknown`
  - Verify: `rustc --version`
- [ ] **1.6 Scaffold Anchor project**
  - `anchor init originlock` or verify existing structure at `blockchain/`
- [ ] **1.7 Install Node dependencies**
  - `cd blockchain && npm install`
- [ ] **1.8 Configure Anchor.toml**
  - Set `cluster = "devnet"` (or `localnet`)
  - Set `wallet` path to your keypair
- [ ] **1.9 Verify build**
  - `anchor build` — should compile without errors
- [ ] **1.10 Create `blockchain/.env`** (from `.env.example`)
  - Add `ANCHOR_WALLET`, `SOLANA_RPC_URL_DEVNET`

---

## Phase 2 — Core Foundation: Smart Contract (3–4 days)

Goal: Write, test, and deploy the OriginLock Anchor program.

- [ ] **2.1 Write Anchor program** (`programs/originlock/src/lib.rs`)
  - `register_idea` instruction — creates PDA, stores owner + hash + title + timestamp
  - `verify_ownership` instruction — reads PDA, returns proof
  - Custom error codes: `HashAlreadyRegistered`, `HashNotFound`
  - Event: `IdeaRegistered { hash, owner, timestamp }`
- [ ] **2.2 Write Anchor tests** (`tests/originlock.ts`)
  - Test: `registerIdea` succeeds, stores correct data, emits event
  - Test: `verifyOwnership` returns correct owner/timestamp/title
  - Test: duplicate hash → `HashAlreadyRegistered`
  - Test: unknown hash → `HashNotFound`
  - Test: separate content hashes create distinct PDAs
- [ ] **2.3 Build program**
  - `anchor build` — generates IDL in `target/idl/`
- [ ] **2.4 Run tests locally**
  - Start local validator: `solana-test-validator`
  - `anchor test --skip-local-validator`
  - All 5+ tests should pass green
- [ ] **2.5 Deploy to Devnet**
  - `anchor deploy --provider.cluster devnet`
  - Copy the deployed Program ID
- [ ] **2.6 Update Program ID**
  - Update `declare_id!()` in `lib.rs`
  - Update `Anchor.toml` with deployed program ID
  - Update `blockchain/.env` with `PROGRAM_ID`
- [ ] **2.7 Save deployed address**
  - Run `node scripts/deploy.js` to write `artifacts/deployed-addresses.json`
- [ ] **2.8 Write deploy script** (`scripts/deploy.js`)
  - Read IDL, create Program instance
  - Print deployer address, program ID, SOL balance
  - Save to `artifacts/deployed-addresses.json`
- [ ] **2.9 Manual interaction test**
  - Use Solana Explorer to verify the program exists
  - `solana program show <PROGRAM_ID>`
- [ ] **2.10 Share with team**
  - Provide Program ID to Frontend + Backend devs
  - Export IDL: `npm run export-idl` → copies to `frontend/src/services/abi.json`

---

## Phase 3 — MVP Integration (4–5 days)

Goal: Interaction scripts, ABI export, verification tools, documentation.

- [ ] **3.1 Write verify script** (`scripts/verify.ts`)
  - Usage: `npm run verify -- <64-char-hex>`
  - Fetches `IdeaRecord` PDA, prints owner/title/timestamp
  - Shows Explorer link
- [ ] **3.2 Export IDL to frontend** (`scripts/export-idl.js`)
  - `npm run export-idl` → copies to `../frontend/src/services/abi.json`
  - Add as post-build step
- [ ] **3.3 Test all error paths**
  - Duplicate hash → custom error (PDA collision)
  - Non-existent hash → `HashNotFound`
  - Insufficient funds → Anchor's `InsufficientFunds`
- [ ] **3.4 Verify on Solana Explorer**
  - Confirm program shows verified source
  - Test with a known hash
- [ ] **3.5 Document the program**
  - `blockchain/README.md` — address, network, instructions, events, errors
- [ ] **3.6 Create interaction script** for QA
  - Register an idea from CLI
  - Verify ownership from CLI
- [ ] **3.7 Deploy to Mainnet (optional for hackathon)**
  - Only if budget allows

---

## Phase 4 — Testing, README & Deployment (2 days)

Goal: Finalize tests, document setup, ensure deploy reproducibility.

- [ ] **4.1 Full test suite passes**
  - `anchor test` — all green
- [ ] **4.2 README complete**
  - Program ID, network, instructions, events, errors
  - Setup instructions (Anchor, Solana, deploy steps)
  - Quick reference for all commands
- [ ] **4.3 Deployment pipeline documented**
  - How to deploy to devnet
  - How to upgrade (if applicable)
- [ ] **4.4 Contract address in root README.md**
  - Added to the project-level README
- [ ] **4.5 Demo flow works end-to-end**
  - Register idea via Anchor client → verify via Explorer
- [ ] **4.6 Clean up**
  - Remove unused files
  - Verify `.gitignore` covers `target/`, `node_modules/`, `.env`

---

## Quick Reference

```bash
cd blockchain

# Build
anchor build

# Test (start solana-test-validator first)
solana-test-validator &
anchor test --skip-local-validator

# Deploy
anchor deploy --provider.cluster devnet

# Export IDL to frontend
npm run export-idl

# Verify ownership from CLI
npm run verify -- <64-char-hex-content-hash>
```
