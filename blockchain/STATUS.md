# OriginLock — Blockchain Status

> **Last Updated:** 2026-05-09  
> **Current Phase:** Phase 2 (Core Foundation)  
> **Branch:** `blockchain-rust`

---

## Overall Progress

| Phase | Status | % Complete |
|-------|--------|-----------|
| Phase 1: Environment Setup | ✅ Complete | 100% |
| Phase 2: Core Foundation | 🔄 In Progress | 60% |
| Phase 3: MVP Integration | ⏳ Not Started | 0% |
| Phase 4: Testing & Deploy | ⏳ Not Started | 0% |

---

## Current Sprint

**Goal:** Finish smart contract → deployed to Devnet with passing tests.

| Task | Status | Assignee |
|------|--------|----------|
| Write Anchor program (lib.rs) | ✅ Done | Blockchain |
| Write test suite | ✅ Done | Blockchain |
| Build program | ✅ Done | Blockchain |
| Run local tests | 🔄 Pending | Blockchain |
| Deploy to Devnet | ⏳ Pending | Blockchain |
| Update Program ID | ⏳ Pending | Blockchain |

---

## Blockers

- None currently.

---

## Recently Completed

- Scaffolded Anchor project structure
- Created `IdeaRecord` account with PDA derivation from content hash
- Implemented `register_idea` instruction with event emission
- Implemented `verify_ownership` instruction returning proof
- Wrote 5 test cases covering all paths
- Created deploy, verify, and export-idl scripts

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| PDA seed = `"idea" + content_hash` | Deterministic account derivation — one PDA per unique hash |
| Solana Devnet (not Amoy) | Anchor/Solana ecosystem; Mainnet-ready for hackathon |
| Single `IdeaRecord` account per idea | Simple, flat model; no need for complex hierarchy |
| `declare_id!` placeholder `ORILOCk...` | Replaced after first deploy with actual program ID |

---

## Contract Details

- **Network:** Solana Devnet
- **Program ID:** `ORILOCk111111111111111111111111111111111111` (placeholder)
- **Explorer:** [Solana Devnet Explorer](https://explorer.solana.com/?cluster=devnet)

---

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `anchor-lang` | 0.30.1 | Anchor framework for Solana |
| `@coral-xyz/anchor` | 0.30.1 | TypeScript SDK |
| `@solana/web3.js` | 1.95.x | Solana RPC interaction |
| Solana CLI | 1.18.26 | Deploy + key management |
| Rust | 1.95.0 | Program compilation |

---

## Resources

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Docs](https://docs.solana.com/)
- [Solana Devnet Faucet](https://faucet.solana.com/)
