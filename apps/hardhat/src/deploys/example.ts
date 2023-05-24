import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ExampleContract = await ethers.getContractFactory("Example");
  const example = await ExampleContract.deploy();
  console.log("Deploying...");

  const tx = await example.deployed();
  console.log("✅︎ Deployment `example` finished ", tx.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
