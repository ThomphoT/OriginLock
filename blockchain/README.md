# OriginLock — Blockchain

> **Smart contract for decentralized intellectual property ownership on Solana.**

---

## Overview

The OriginLock blockchain component is an [Anchor](https://www.anchor-lang.com/) program deployed on Solana Devnet. It provides immutable timestamped proof of idea ownership through PDA-based account storage.

---

## Deployed Address

| Network | Program ID | Status |
|---------|-----------|--------|
| Devnet | `ORILOCk111111111111111111111111111111111111` | Placeholder — update after deploy |

**Explorer:** [Solana Devnet](https://explorer.solana.com/?cluster=devnet)

---

## Instructions

### `registerIdea`

Creates a new `IdeaRecord` account seeded by the content hash.

| Parameter | Type | Description |
|-----------|------|-------------|
| `contentHash` | `string` (64 hex chars) | SHA-256 hash of the idea content |
| `title` | `string` (max 200 chars) | Human-readable title |

**Accounts:**

| Account | Signer | Writable | Description |
|---------|--------|----------|-------------|
| `idea` | No | Yes | PDA derived from `["idea", contentHash]` |
| `authority` | Yes | Yes | Fee payer and owner |
| `systemProgram` | No | No | Solana system program |

**Event emitted:** `IdeaRegistered { hash, owner, timestamp }`

### `verifyOwnership`

Reads an existing `IdeaRecord` and returns proof of ownership.

| Returns | Type | Description |
|---------|------|-------------|
| `owner` | `PublicKey` | Wallet address of the registrant |
| `timestamp` | `i64` | Unix timestamp of registration |
| `title` | `string` | Title of the registered idea |

**Accounts:**

| Account | Signer | Writable | Description |
|---------|--------|----------|-------------|
| `idea` | No | No | PDA of the idea to verify |

---

## Account Structure

### `IdeaRecord` (8 + 32 + 4 + 64 + 4 + 200 + 8 + 1 = 321 bytes)

| Field | Type | Offset |
|-------|------|--------|
| `owner` | `Pubkey` (32) | 8 |
| `contentHash` | `String` (4+64) | 40 |
| `title` | `String` (4+200) | 108 |
| `timestamp` | `i64` (8) | 312 |
| `exists` | `bool` (1) | 320 |

---

## Events

### `IdeaRegistered`

| Field | Type | Index |
|-------|------|-------|
| `hash` | `string` | Yes |
| `owner` | `Pubkey` | Yes |
| `timestamp` | `i64` | No |

---

## Errors

| Code | Name | Message |
|------|------|---------|
| 6000 | `HashAlreadyRegistered` | Hash already registered |
| 6001 | `HashNotFound` | Hash not found |

---

## Setup

### Prerequisites

- Solana CLI 1.18.x
- Anchor CLI 0.30.x
- Rust 1.75+ with `bpfel-unknown-unknown` target
- Node.js 20+

### Install

```bash
cd blockchain
npm install
```

### Build

```bash
anchor build
```

### Test

```bash
# Terminal 1: Start local validator
solana-test-validator

# Terminal 2: Run tests
anchor test --skip-local-validator
```

### Deploy

```bash
# Devnet
anchor deploy --provider.cluster devnet

# After deploy, update Program ID in:
# - programs/originlock/src/lib.rs (declare_id!)
# - Anchor.toml ([programs.devnet])
# - artifacts/deployed-addresses.json
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run export-idl` | Copy IDL to `frontend/src/services/abi.json` |
| `npm run verify -- <hash>` | Verify ownership from CLI |

---

## Quick Reference

```bash
# Build the program
anchor build

# Run tests
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Export IDL for frontend
npm run export-idl

# Verify an idea from CLI
npm run verify -- abc123...  # 64-char hex hash
```

---

## Links

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Documentation](https://docs.solana.com/)
- [Solana Devnet Faucet](https://faucet.solana.com/)
- [Solana Explorer](https://explorer.solana.com/?cluster=devnet)
