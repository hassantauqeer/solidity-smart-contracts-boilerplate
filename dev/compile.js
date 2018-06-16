const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, '../build');
fs.removeSync(buildPath);

// Get your contracts from contracts directory
const VotingInterface = path.resolve(__dirname, '../contracts', 'VotingInterface.sol');
const VotingSystem = path.resolve(__dirname, '../contracts', 'VotingSystem.sol');
const source = {
    'VotingInterface.sol': fs.readFileSync(VotingInterface, 'utf8'),
    'VotingSystem.sol': fs.readFileSync(VotingSystem, 'utf8')
}
const output = solc.compile({sources: source}, 1).contracts;

// Create build directory
fs.ensureDirSync(buildPath);

//***  If One Contract File contains more than One Contract. This loop will iterate
//***  through each Contract in ABI creating a separate ${contractName}.json file for each one.
for (let contract in output) {
    fs.outputJsonSync(
        //Put all the contracts one by one in build directory
        path.resolve(buildPath, contract.replace(/^(.*?)\:/, '') + '.json'),
        output[contract]
    );
}
