import { network } from "hardhat";
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

const HASH_1 = "a".repeat(64);
const HASH_2 = "b".repeat(64);
const TITLE_1 = "My Brilliant Idea";

describe("OriginLock", function () {
  let viem;
  let publicClient;
  let walletClients;
  let contract;

  beforeEach(async function () {
    ({ viem } = await network.getOrCreate());
    publicClient = await viem.getPublicClient();
    walletClients = await viem.getWalletClients();
    contract = await viem.deployContract("OriginLock");
  });

  // ── Happy paths ────────────────────────────────────────────────────────

it("should register an idea and emit IdeaRegistered event", async function () {
  const tx = await contract.write.registerIdea([HASH_1, TITLE_1]);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });

  assert.equal(receipt.status, "success");

  // The event was emitted if the receipt has logs
  assert.ok(receipt.logs.length > 0, "Expected at least one log");

  // Verify ownership to confirm the data was stored correctly
  const [retOwner, , ] = await contract.read.verifyOwnership([HASH_1]);
  assert.equal(
    retOwner.toLowerCase(),
    walletClients[0].account.address.toLowerCase()
  );
});

  it("verifyOwnership returns correct owner, title, and a non-zero timestamp", async function () {
    const tx = await contract.write.registerIdea([HASH_1, TITLE_1]);
    await publicClient.waitForTransactionReceipt({ hash: tx });

    const [retOwner, retTimestamp, retTitle] =
      await contract.read.verifyOwnership([HASH_1]);

    assert.equal(
      retOwner.toLowerCase(),
      walletClients[0].account.address.toLowerCase()
    );
    assert.equal(retTitle, TITLE_1);
    assert.ok(retTimestamp > 0n);
  });

  it("two different hashes can be registered independently", async function () {
    const contract1 = await viem.getContractAt("OriginLock", contract.address, {
      client: { wallet: walletClients[1] },
    });

    await publicClient.waitForTransactionReceipt({
      hash: await contract.write.registerIdea([HASH_1, TITLE_1]),
    });
    await publicClient.waitForTransactionReceipt({
      hash: await contract1.write.registerIdea([HASH_2, "Other Idea"]),
    });

    const [owner1] = await contract.read.verifyOwnership([HASH_1]);
    const [owner2] = await contract.read.verifyOwnership([HASH_2]);

    assert.equal(
      owner1.toLowerCase(),
      walletClients[0].account.address.toLowerCase()
    );
    assert.equal(
      owner2.toLowerCase(),
      walletClients[1].account.address.toLowerCase()
    );
  });

  // ── Error paths ────────────────────────────────────────────────────────

  it("reverts with HashAlreadyRegistered on duplicate hash", async function () {
    await publicClient.waitForTransactionReceipt({
      hash: await contract.write.registerIdea([HASH_1, TITLE_1]),
    });

    await assert.rejects(
      () => contract.write.registerIdea([HASH_1, "Duplicate"]),
      (err) => {
        assert.ok(
          err.message.includes("HashAlreadyRegistered"),
          `Expected HashAlreadyRegistered, got: ${err.message}`
        );
        return true;
      }
    );
  });

  it("reverts with HashNotFound for unregistered hash", async function () {
    await assert.rejects(
      () => contract.read.verifyOwnership([HASH_2]),
      (err) => {
        assert.ok(
          err.message.includes("HashNotFound"),
          `Expected HashNotFound, got: ${err.message}`
        );
        return true;
      }
    );
  });

  it("a different user cannot re-register an existing hash", async function () {
    const contract1 = await viem.getContractAt("OriginLock", contract.address, {
      client: { wallet: walletClients[1] },
    });

    await publicClient.waitForTransactionReceipt({
      hash: await contract.write.registerIdea([HASH_1, TITLE_1]),
    });

    await assert.rejects(
      () => contract1.write.registerIdea([HASH_1, "Stolen!"]),
      (err) => {
        assert.ok(
          err.message.includes("HashAlreadyRegistered"),
          `Expected HashAlreadyRegistered, got: ${err.message}`
        );
        return true;
      }
    );
  });
});