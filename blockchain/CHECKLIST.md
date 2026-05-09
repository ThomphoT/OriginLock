# OriginLock — Blockchain Checklist

> Use this to track release readiness. Check off items as they're completed.

---

## 🟢 Phase 1: Environment Setup

- [x] Solana CLI installed & configured
- [x] Solana wallet generated & funded (devnet airdrop)
- [x] Anchor CLI installed (avm)
- [x] Rust + BPF target installed
- [x] Node.js + npm installed
- [x] `blockchain/` directory scaffolded
- [x] `Anchor.toml` configured
- [x] `package.json` with dependencies
- [x] `tsconfig.json` configured
- [x] `.env.example` created (never commit `.env`)
- [x] `.gitignore` covers build artifacts
- [x] `anchor build` compiles without errors

---

## 🔵 Phase 2: Core Foundation

### Smart Contract

- [x] `register_idea` instruction implemented
- [x] `verify_ownership` instruction implemented
- [x] `IdeaRecord` account defined (owner, hash, title, timestamp, exists)
- [x] PDA derived from content hash seed
- [x] `IdeaRegistered` event defined
- [x] `ProofOfOwnership` return struct defined
- [x] Custom error codes: `HashAlreadyRegistered`, `HashNotFound`

### Tests

- [x] Test: `registerIdea` succeeds with correct state
- [x] Test: `verifyOwnership` returns accurate data
- [x] Test: duplicate hash rejects with appropriate error
- [x] Test: unknown hash rejects with `HashNotFound`
- [x] Test: different hashes create distinct PDAs

### Build & Deploy

- [ ] `anchor build` passes
- [ ] `anchor test` passes (all tests green)
- [ ] Deployed to Solana Devnet
- [ ] Program ID updated in `lib.rs` and `Anchor.toml`
- [ ] `scripts/deploy.js` writes `artifacts/deployed-addresses.json`
- [ ] IDL generated in `target/idl/`

### Share

- [ ] Program ID shared with Frontend + Backend
- [ ] IDL exported to frontend (`npm run export-idl`)

---

## 🟡 Phase 3: MVP Integration

- [ ] `scripts/verify.ts` CLI tool works end-to-end
- [ ] All error paths tested (duplicate, not found, insufficient funds)
- [ ] Contract verified on Solana Explorer
- [ ] `blockchain/README.md` written with:
  - Deployed program address
  - Network info
  - All instructions with params/returns
  - All events and custom errors
- [ ] Manual QA: register + verify flow works

---

## 🔴 Phase 4: Testing, README & Deployment

- [ ] Final test run: `anchor test` — all green
- [ ] Root `README.md` includes contract address
- [ ] Demo flow works end-to-end
- [ ] No unused files in `blockchain/`
- [ ] `.gitignore` finalized
- [ ] Deployment process documented in README

---

## ✅ Release Gate

All items below must be checked before marking blockchain as **MVP Complete**:

- [ ] Smart contract deployed on Solana Devnet
- [ ] Program ID is stable (not a placeholder)
- [ ] All tests pass
- [ ] Frontend can call the program (IDL exported)
- [ ] Backend can verify on-chain ownership
- [ ] `blockchain/README.md` is complete
- [ ] Root `README.md` has contract address
