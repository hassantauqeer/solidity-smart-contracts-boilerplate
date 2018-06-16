const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledContract = require('../build/VotingSystem.json');

let accounts;
let votingContract;
let tokenAddress;
let owner;
let totalSupply;
process.setMaxListeners(0);

describe('Voting System', () => {
    beforeAll(async () => {
        accounts = await web3.eth.getAccounts();
      //  console.log(accounts, 'accounts');
        votingContract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
            .deploy({data: compiledContract.bytecode})
            .send({from: accounts[0], gas: '4712388'});
        owner = await votingContract.methods.owner().call();
      //  console.log(owner)
        // console.log(totalSupply)
        // console.log(accounts)
    });

    it('deploys Voting System Contract', () => {
        assert.ok(votingContract.options.address);
    })

    it('deployer (Owner) is the owner of Contract', async () => {
        assert.equal(accounts[0], owner); // Deployer == Onwer
    })

    it("Register's a member succesfully!", async () => {
        let membersBefore = await votingContract.methods.totalMembers().call();
        await votingContract.methods.registerMember().send({from: owner, gas: '1000000'});
        let membersAfter = await votingContract.methods.totalMembers().call();
      //  console.log(membersAfter, membersBefore)
        assert.equal(parseInt(membersBefore) + 1, parseInt(membersAfter)); // Members will be increased by 1 after registering a new member.
    })

    it("Creates a new Task 'Recruit Employees' succesfully!", async () => {
        let tasksBefore = await votingContract.methods.getTotalTasks().call();
        await votingContract.methods.createTask("Recruit Employees", 1596542464222).send({from: owner, gas: '1000000'});
        let tasksAfter = await votingContract.methods.getTotalTasks().call();

        let task = await votingContract.methods.getTaskInfo(tasksBefore).call();
        // console.log(task['0']);
        // console.log(tasksBefore, tasksAfter)

        assert.equal(task['1'], 'Recruit Employees'); // Task name is Recruit Employees
        assert.equal(parseInt(tasksBefore) + 1, parseInt(tasksAfter)); // Tasks increased by 1 after creating a new Task.
    })

    it("Cast Vote", async () => {
        let task = await votingContract.methods.getTaskInfo(0).call();
        assert.equal(task['1'], 'Recruit Employees'); // Task name is Recruit Employees... confirming

        let votesBefore = task['3'];
        await votingContract.methods.castVote(0, true).send({from: owner, gas: '1000000'}); //Casting Vote

        task = await votingContract.methods.getTaskInfo(0).call(); // Refreshing task after casting vote.
        let votesAfter = task['3'];

        // console.log(task['0']);
        // console.log(tasksBefore, tasksAfter)

        assert.equal(task['1'], 'Recruit Employees'); // Task name is Recruit Employees
        assert.equal(parseInt(votesBefore) + 1, parseInt(votesAfter)); // Tasks increased by 1 after creating a new Task.
    })

    it("Can't Vote more than 1 time", async () => {
        let task = await votingContract.methods.getTaskInfo(0).call(); // Refreshing task after casting vote.
        let votesBefore = task['3'];

        try { //TX will be reverted (failed) because contract doesn't allows multiple voting.
            await votingContract.methods.castVote(0, false).send({from: owner, gas: '1000000'}); //Casting Vote
        }
        catch(err){}

        task = await votingContract.methods.getTaskInfo(0).call(); // Refreshing task after casting vote.
        let votesAfter = task['3'];

        // console.log(task['0']);
      //  console.log(votesBefore, votesAfter, task)

        assert.equal(task['1'], 'Recruit Employees'); // Task name is Recruit Employees
        assert.equal(parseInt(votesBefore), parseInt(votesAfter)); // Tasks increased by 1 after creating a new Task.
    });

    it("Total members are 1 so if 1 Up voted it means the task should get approved", async () => {
        let task = await votingContract.methods.getTaskInfo(0).call(); // Refreshing task after casting vote.
        let approved = task['4']; // Getting Approved flag from task Info
        let complete = task['5']; // Getting Complete flag from task Info

        assert.equal(approved, true);
        assert.equal(complete, true);  //Both should be tru because I voted true
    });

})
