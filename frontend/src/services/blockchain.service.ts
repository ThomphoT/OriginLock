import { AnchorProvider, Program, type Idl } from "@coral-xyz/anchor";
import { type Connection, PublicKey, SystemProgram, type Transaction, type VersionedTransaction } from "@solana/web3.js";
import type { TransactionDetails } from "@/types";
import idl from "./origin_lock.idl.json";

const PROGRAM_ID = new PublicKey(
  import.meta.env.VITE_ORIGIN_LOCK_PROGRAM_ID ?? "D1iXnVYxEBs38Q4VJvzLCK7rZBYEGvmwEniTbMx8Afae",
);

type AnchorWalletLike = {
  publicKey: PublicKey;
  signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
};

async function contentHashSeed(contentHash: string): Promise<Uint8Array> {
  const bytes = new TextEncoder().encode(contentHash);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
}

async function ideaPda(owner: PublicKey, contentHash: string): Promise<PublicKey> {
  const seed = await contentHashSeed(contentHash);
  return PublicKey.findProgramAddressSync(
    [new TextEncoder().encode("idea"), owner.toBuffer(), seed],
    PROGRAM_ID,
  )[0];
}

function programFor(connection: Connection, wallet: AnchorWalletLike) {
  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  return new Program(idl as Idl, provider);
}

export const blockchainService = {
  async registerHash(
    connection: Connection,
    wallet: AnchorWalletLike | null | undefined,
    contentHash: string,
    title: string,
  ): Promise<TransactionDetails> {
    if (!wallet?.publicKey) {
      throw new Error("Connect a Solana wallet before registering an idea");
    }

    const program = programFor(connection, wallet);
    const ideaRecord = await ideaPda(wallet.publicKey, contentHash);
    const signature = await program.methods
      .registerIdea(contentHash, title)
      .accounts({
        ideaRecord,
        owner: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return {
      hash: signature,
      blockNumber: 0,
      timestamp: new Date().toISOString(),
      network: "Solana Devnet",
      status: "confirmed",
    };
  },

  async verifyHash(
    connection: Connection,
    owner: PublicKey,
    contentHash: string,
  ): Promise<{ verified: boolean; details?: TransactionDetails }> {
    const ideaRecord = await ideaPda(owner, contentHash);
    const account = await connection.getAccountInfo(ideaRecord);

    return {
      verified: account !== null,
      details: account
        ? {
            hash: ideaRecord.toBase58(),
            blockNumber: 0,
            timestamp: new Date().toISOString(),
            network: "Solana Devnet",
            status: "confirmed",
          }
        : undefined,
    };
  },

  async getTransactionStatus(connection: Connection, signature: string): Promise<TransactionDetails> {
    const status = await connection.getSignatureStatus(signature, { searchTransactionHistory: true });
    const confirmation = status.value?.confirmationStatus;

    return {
      hash: signature,
      blockNumber: status.value?.slot ?? 0,
      timestamp: new Date().toISOString(),
      network: "Solana Devnet",
      status: status.value?.err ? "failed" : confirmation === "finalized" || confirmation === "confirmed" ? "confirmed" : "pending",
    };
  },
};
