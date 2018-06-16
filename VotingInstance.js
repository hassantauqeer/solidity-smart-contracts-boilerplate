import web3 from './web3';
import * as VotingSystem from '../build/VotingSystem.json'; // change path to ypur own contract file and name to your own contractName

export default new web3.eth.Contract(JSON.parse(VotingSystem.interface), "0x9a4b8E5Ae6ED2B69BB83C4D6328E17dA4d8bA540");