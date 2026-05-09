const anchor = require("@coral-xyz/anchor");
const { SystemProgram } = anchor.web3;
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying OriginLock...\n");

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const idlPath = path.join(__dirname, "..", "target", "idl", "originlock.json");
  if (!fs.existsSync(idlPath)) {
    console.error("IDL not found. Run 'anchor build' first.");
    process.exit(1);
  }

  const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
  const programId = new anchor.web3.PublicKey(idl.address);

  const program = new anchor.Program(idl, programId, provider);

  console.log(`Deployer: ${provider.wallet.publicKey.toBase58()}`);
  console.log(`Program ID: ${programId.toBase58()}`);

  const balance = await provider.connection.getBalance(provider.wallet.publicKey);
  console.log(`Balance: ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);

  if (balance < 2 * anchor.web3.LAMPORTS_PER_SOL) {
    console.warn("Warning: Low balance. Consider airdropping SOL.");
  }

  console.log("\nDeployment complete!");

  const outputPath = path.join(__dirname, "..", "artifacts", "deployed-addresses.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        programId: programId.toBase58(),
        deployedAt: new Date().toISOString(),
        cluster: provider.connection.rpcEndpoint,
      },
      null,
      2
    )
  );
  console.log(`Address written to ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
