import type { TransactionDetails } from "@/types";

// Stub service - blockchain integration will be connected later
export const blockchainService = {
  async registerHash(_hash: string): Promise<TransactionDetails> {
    await new Promise((r) => setTimeout(r, 2000));
    return {
      hash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      timestamp: new Date().toISOString(),
      network: "Solana Devnet",
      status: "confirmed",
    };
  },

  async verifyHash(_hash: string): Promise<{ verified: boolean; details?: TransactionDetails }> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      verified: true,
      details: {
        hash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        blockNumber: 18234567,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        network: "Solana Devnet",
        status: "confirmed",
      },
    };
  },

  async getTransactionStatus(txHash: string): Promise<TransactionDetails> {
    await new Promise((r) => setTimeout(r, 500));
    return {
      hash: txHash,
      blockNumber: 18234567,
      timestamp: new Date().toISOString(),
      network: "Solana Devnet",
      status: "confirmed",
    };
  },
};