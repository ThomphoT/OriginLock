const fs = require("fs");
const path = require("path");

function main() {
  const source = path.join(__dirname, "..", "target", "idl", "originlock.json");
  const destDir = path.join(__dirname, "..", "..", "frontend", "src", "services");
  const dest = path.join(destDir, "abi.json");

  if (!fs.existsSync(source)) {
    console.error("IDL not found at", source);
    console.error("Run 'anchor build' first to generate the IDL.");
    process.exit(1);
  }

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(source, dest);

  console.log(`IDL exported to ${dest}`);
}

main();
