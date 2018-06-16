# solidity-smart-contracts-boilerplate
This is a boilerplate for creating and deploying Smart Contracts in Solidity. Fully Automated just write your contract and import it in deploy and compile files.


# ERC20 Dapp

- [Installation](#installation)
- [Project Structure](#project-structure)

### Installation
- To Test your contract
```bash
yarn run test
```
- To compile your contract
```bash
yarn run compile
```
- To deploy your contract
```bash
yarn run deploy
```
- To compile & deploy your contract
```bash
yarn run cd
```

### Project Structure


```
solidity-smart-contracts-boilerplate/
      build/       -> Build files of Contract
      contracts/	  -> Solidity Contracts
      tests/       -> Contract's Unit Tests
      dev/         -> contains dev files
          compile.js	        -> Compiling file
          deploy.js	            -> Deploying file
          VotingInstance.js    -> Contracts Instance
          web3.js              -> exporting Web3 instance

    README.md
    package.json
    yarn.lock
```
