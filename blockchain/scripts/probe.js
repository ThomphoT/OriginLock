import hre from "hardhat";
console.log("hre.config.defaultNetwork:", hre.config.defaultNetwork);
console.log("hre.config.networks:", Object.keys(hre.config.networks ?? {}));
