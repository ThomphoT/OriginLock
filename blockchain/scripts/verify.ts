import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import fs from "fs";
import path from "path";

async function main() {
  const contentHash = process.argv[2];
  if (!contentHash || contentHash.length !== 64) {
    console.error("Usage: npm run verify -- <64-char-hex-content-hash>");
    process.exit(1);
  }

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const idlPath = path.join(__dirname, "..", "target", "idl", "originlock.json");
  const addressesPath = path.join(__dirname, "..", "artifacts", "deployed-addresses.json");

  if (!fs.existsSync(idlPath)) {
    console.error("IDL not found. Run 'anchor build' first.");
    process.exit(1);
  }

  let programId: PublicKey;
  if (fs.existsSync(addressesPath)) {
    const { programId: pid } = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
    programId = new PublicKey(pid);
  } else {
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
    programId = new PublicKey(idl.address);
  }

  const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
  const program = new anchor.Program(idl, programId, provider);

  const [ideaPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("idea"), Buffer.from(contentHash)],
    programId
  );

  try {
    const idea = await program.account.ideaRecord.fetch(ideaPda);
    console.log("\n=== Ownership Verification Result ===\n");
    console.log(`Status:   ✅ Verified`);
    console.log(`Owner:    ${idea.owner.toBase58()}`);
    console.log(`Title:    ${idea.title}`);
    console.log(`Hash:     ${idea.contentHash}`);
    console.log(`Timestamp: ${new Date(idea.timestamp.toNumber() * 1000).toISOString()}`);
    console.log(`Explorer: https://explorer.solana.com/address/${ideaPda.toBase58()}?cluster=devnet\n`);
  } catch {
    console.log("\n=== Ownership Verification Result ===\n");
    console.log(`Status: ❌ Not Found`);
    console.log(`Hash:   ${contentHash}`);
    console.log("This hash has not been registered on the blockchain.\n");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
