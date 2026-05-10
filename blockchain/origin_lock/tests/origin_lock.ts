import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { createHash } from "crypto";
import { OriginLock } from "../target/types/origin_lock";

describe("origin_lock", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.OriginLock as Program<OriginLock>;
  const owner = anchor.getProvider().publicKey!;
  const contentHash = "a".repeat(64);
  const title = "Decentralized proof of idea ownership";

  function ideaPda(hash: string) {
    const seed = createHash("sha256").update(hash).digest();
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("idea"), owner.toBuffer(), seed],
      program.programId
    )[0];
  }

  it("registers an idea and stores ownership metadata", async () => {
    const ideaRecord = ideaPda(contentHash);

    await program.methods
      .registerIdea(contentHash, title)
      .accounts({
        ideaRecord,
        owner,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const record = await program.account.ideaRecord.fetch(ideaRecord);
    assert.equal(record.owner.toBase58(), owner.toBase58());
    assert.equal(record.contentHash, contentHash);
    assert.equal(record.title, title);
    assert.isTrue(record.timestamp.toNumber() > 0);
  });

  it("rejects invalid hashes", async () => {
    const invalidHash = "not-a-valid-hash";
    const ideaRecord = ideaPda(invalidHash);

    try {
      await program.methods
        .registerIdea(invalidHash, title)
        .accounts({
          ideaRecord,
          owner,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      assert.fail("Expected invalid hash to be rejected");
    } catch (error: any) {
      assert.equal(error.error.errorCode.code, "InvalidHash");
    }
  });

  it("rejects duplicate idea registrations for the same owner and hash", async () => {
    const duplicateHash = "b".repeat(64);
    const ideaRecord = ideaPda(duplicateHash);

    await program.methods
      .registerIdea(duplicateHash, title)
      .accounts({
        ideaRecord,
        owner,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    try {
      await program.methods
        .registerIdea(duplicateHash, title)
        .accounts({
          ideaRecord,
          owner,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      assert.fail("Expected duplicate registration to fail");
    } catch (error: any) {
      assert.include(error.message, "already in use");
    }
  });
});
