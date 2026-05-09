const anchor = require("@coral-xyz/anchor");

module.exports = async function (provider) {
  anchor.setProvider(provider);
  const program = anchor.workspace.Originlock;
  console.log("Migration: OriginLock program deployed at", program.programId.toBase58());
};
