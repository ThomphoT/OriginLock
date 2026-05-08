import { network } from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const networkName = process.argv.find((a, i) => process.argv[i - 1] === "--network") ?? "default";
  console.log("Deploying OriginLock to network:", networkName);

  const { viem } = await network.getOrCreate(networkName);
  const publicClient = await viem.getPublicClient();
  const [deployer] = await viem.getWalletClients();

  console.log("Deploying with account:", deployer.account.address);

  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log("Account balance:", balance, "wei");

  const contract = await viem.deployContract("OriginLock");
  console.log("\n✅ OriginLock deployed to:", contract.address);

  const output = {
    network: networkName,
    contractAddress: contract.address,
    deployedAt: new Date().toISOString(),
    deployer: deployer.account.address,
  };

  const outputPath = path.join(__dirname, "../artifacts/deployed-addresses.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log("\n📄 Address saved to artifacts/deployed-addresses.json");
  console.log("\n📢 SHARE WITH TEAM:");
  console.log("   Contract address:", contract.address);
  console.log("   → Run: npm run export-abi");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});