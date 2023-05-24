import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers"; // plugin for provide ethers to hardhat
import "hardhat-deploy";
import "tsconfig-paths/register"; // support typescript paths mappings

const chains = [
  {
    id: "JFIN",
    chainId: 3501,
    chainName: "JFIN Chain",
    rpcEndpoint: "https://rpc.jfinchain.com",
    explorerEndpoint: "https://exp.jfinchain.com",
    apiKey: "",
    apiEndpoint: "https://exp.jfinchain.com/api",
    accounts: process.env.JFIN_PRIVATE_KEY
      ? [`0x${process.env.JFIN_PRIVATE_KEY}`]
      : [],
  },
  {
    id: "JFINT",
    chainId: 3502,
    chainName: "JFIN Chain Testnet",
    rpcEndpoint: "https://rpc.testnet.jfinchain.com",
    explorerEndpoint: "https://exp.testnet.jfinchain.com",
    apiKey: "",
    apiEndpoint: "https://exp.testnet.jfinchain.com/api",
    accounts: process.env.JFINT_PRIVATE_KEY
      ? [`0x${process.env.JFINT_PRIVATE_KEY}`]
      : [],
  },
];

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  etherscan: {
    apiKey: chains.reduce((result: any, item: any) => {
      return { ...result, [item.id]: item?.apiKey || "_" };
    }, {}),
    customChains: chains.map((chain) => ({
      network: chain.id,
      chainId: chain.chainId,
      urls: {
        apiURL: chain.apiEndpoint,
        browserURL: chain.explorerEndpoint,
      },
    })),
  },
  networks: chains.reduce((result: any, item: any) => {
    return {
      ...result,
      [item.id]: {
        url: item.rpcEndpoint,
        accounts: item.accounts,
        deploy: ["./src/deploys"],
      },
    };
  }, {}),
  namedAccounts: {
    deployer: {
      ...chains.reduce((result, item) => {
        return {
          ...result,
          [item.id]: item.accounts[0],
        };
      }, {}),
    },
  },
  typechain: {
    outDir: "src/typechain",
    target: "ethers-v5",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: [], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
    dontOverrideCompile: false, // defaults to false
  },
  paths: {
    sources: "./src/contracts",
    artifacts: "./src/artifacts",
  },
};

console.log(config);

export default config;
