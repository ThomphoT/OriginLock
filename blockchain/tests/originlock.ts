import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";

use(chaiAsPromised);

describe("originlock", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Originlock as Program;

  const authority = provider.wallet.publicKey;
  const contentHash = "a".repeat(64);
  const title = "My Original Idea";

  function ideaPda(hash: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("idea"), Buffer.from(hash)],
      program.programId
    );
  }

  it("registerIdea succeeds and emits event", async () => {
    const [pda] = ideaPda(contentHash);
    const tx = await program.methods
      .registerIdea(contentHash, title)
      .accounts({ authority })
      .rpc();

    const idea = await program.account.ideaRecord.fetch(pda);
    expect(idea.owner.toBase58()).to.equal(authority.toBase58());
    expect(idea.contentHash).to.equal(contentHash);
    expect(idea.title).to.equal(title);
    expect(idea.exists).to.be.true;
    expect(idea.timestamp.toNumber()).to.be.greaterThan(0);
  });

  it("verifyOwnership returns correct data", async () => {
    const [pda] = ideaPda(contentHash);
    const proof = await program.methods
      .verifyOwnership()
      .accounts({ idea: pda })
      .view();

    expect(proof.owner.toBase58()).to.equal(authority.toBase58());
    expect(proof.title).to.equal(title);
    expect(proof.timestamp.toNumber()).to.be.greaterThan(0);
  });

  it("duplicate hash reverts with HashAlreadyRegistered", async () => {
    const otherSigner = Keypair.generate();
    // Airdrop SOL for rent
    const sig = await provider.connection.requestAirdrop(
      otherSigner.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);

    const [pda] = ideaPda(contentHash);
    await expect(
      program.methods
        .registerIdea(contentHash, "Duplicate")
        .accounts({
          authority: otherSigner.publicKey,
          idea: pda,
          systemProgram: SystemProgram.programId,
        })
        .signers([otherSigner])
        .rpc()
    ).to.be.rejected;
  });

  it("unknown hash reverts with HashNotFound", async () => {
    const unknownHash = "b".repeat(64);
    const [pda] = ideaPda(unknownHash);

    await expect(
      program.methods
        .verifyOwnership()
        .accounts({ idea: pda })
        .view()
    ).to.be.rejectedWith("Hash not found");
  });

  it("registerIdea with different content hash creates separate PDA", async () => {
    const secondHash = "c".repeat(64);
    const [pda1] = ideaPda(contentHash);
    const [pda2] = ideaPda(secondHash);

    await program.methods
      .registerIdea(secondHash, "Second Idea")
      .accounts({ authority })
      .rpc();

    const idea1 = await program.account.ideaRecord.fetch(pda1);
    const idea2 = await program.account.ideaRecord.fetch(pda2);
    expect(idea1.contentHash).to.equal(contentHash);
    expect(idea2.contentHash).to.equal(secondHash);
    expect(pda1.equals(pda2)).to.be.false;
  });
});
