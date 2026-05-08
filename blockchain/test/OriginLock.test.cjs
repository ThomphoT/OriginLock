const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OriginLock", function () {
  let originLock;
  let owner;
  let otherUser;

  const HASH_1 = "a".repeat(64);
  const HASH_2 = "b".repeat(64);
  const TITLE_1 = "My Brilliant Idea";

  beforeEach(async function () {
    [owner, otherUser] = await ethers.getSigners();
    const OriginLock = await ethers.getContractFactory("OriginLock");
    originLock = await OriginLock.deploy();
    await originLock.waitForDeployment();
  });

  // ── Happy paths ──────────────────────────────────────────────────────────

  it("should register an idea and emit IdeaRegistered event", async function () {
    const tx = originLock.registerIdea(HASH_1, TITLE_1);
    await expect(tx)
      .to.emit(originLock, "IdeaRegistered")
      .withArgs(HASH_1, owner.address, anyValue);
  });

  it("verifyOwnership returns correct owner, title, and a non-zero timestamp", async function () {
    await originLock.registerIdea(HASH_1, TITLE_1);
    const [retOwner, retTimestamp, retTitle] =
      await originLock.verifyOwnership(HASH_1);

    expect(retOwner).to.equal(owner.address);
    expect(retTitle).to.equal(TITLE_1);
    expect(retTimestamp).to.be.gt(0n);
  });

  it("two different hashes can be registered independently", async function () {
    await originLock.registerIdea(HASH_1, TITLE_1);
    await originLock.connect(otherUser).registerIdea(HASH_2, "Other Idea");

    const [owner1] = await originLock.verifyOwnership(HASH_1);
    const [owner2] = await originLock.verifyOwnership(HASH_2);

    expect(owner1).to.equal(owner.address);
    expect(owner2).to.equal(otherUser.address);
  });

  // ── Error paths ──────────────────────────────────────────────────────────

  it("reverts with HashAlreadyRegistered on duplicate hash", async function () {
    await originLock.registerIdea(HASH_1, TITLE_1);

    await expect(originLock.registerIdea(HASH_1, "Duplicate"))
      .to.be.revertedWithCustomError(originLock, "HashAlreadyRegistered")
      .withArgs(HASH_1);
  });

  it("reverts with HashNotFound for unregistered hash", async function () {
    await expect(originLock.verifyOwnership(HASH_2))
      .to.be.revertedWithCustomError(originLock, "HashNotFound")
      .withArgs(HASH_2);
  });

  it("a different user cannot re-register an existing hash", async function () {
    await originLock.registerIdea(HASH_1, TITLE_1);

    await expect(
      originLock.connect(otherUser).registerIdea(HASH_1, "Stolen!")
    ).to.be.revertedWithCustomError(originLock, "HashAlreadyRegistered");
  });
});

function anyValue() { return true; }