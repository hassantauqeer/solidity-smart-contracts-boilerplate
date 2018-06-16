const fs = require('fs-extra');
const path = require('path');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const VotingSystem = require('../build/VotingSystem.json');
require('dotenv').config()

const votingInstance = path.resolve(__dirname, 'VotingInstance.js');
fs.removeSync(votingInstance);


const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.INFURA
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);
  // console.log(VotingSystem.bytecode)
  // console.log(VotingSystem.interface)
  const result = await new web3.eth.Contract(
    JSON.parse(VotingSystem.interface)
  )
    // You can also add parameters while deploying Contract these parameters
    // are passed to the constructor of your contract.
    // If arguments were passed to deploy function, it will look like commented below:-
    //  .deploy({ data: bytecode, arguments: ['Hi there!'] })

    .deploy({ data: VotingSystem.bytecode }) // Deploying Contract
    .send({ gas: '4712388', from: accounts[0] });
    console.log('Contract deployed to: ', result.options.address);
    fs.writeFile("./VotingInstance.js", votingInstanceContent(result.options.address));
};
deploy();


function votingInstanceContent (address) {
  return (
`import web3 from './web3';
import * as VotingSystem from '../build/VotingSystem.json'; // change path to ypur own contract file and name to your own contractName

export default new web3.eth.Contract(JSON.parse(VotingSystem.interface), "${address}");`
  )
}