const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying OriginLock to network:", hre.network.name);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MATIC");

  const OriginLock = await ethers.getContractFactory("OriginLock");
  const contract = await OriginLock.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\n✅ OriginLock deployed to:", address);

  // Save address to a shared file so other services can read it
  const output = {
    network: hre.network.name,
    contractAddress: address,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  const outputPath = path.join(__dirname, "../artifacts/deployed-addresses.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log("\n📄 Address saved to artifacts/deployed-addresses.json");
  console.log("\n📢 SHARE WITH TEAM:");
  console.log("   Contract address:", address);
  console.log("   → Give this to Frontend + Backend devs");
  console.log("   → Copy ABI with: npm run export-abi");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});