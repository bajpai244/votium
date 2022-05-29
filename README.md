# Votium → ZK Snark Based Voting

## Problem Statement

Voting on public chains like Ethereum comes with the problem of anonymity. Wallet Addresses are prone to chain analysis at the same time some voting motions are only possible if the public address of the person is linked with a real world Identity, one example being public election of local leaders.

For voting to happen on any kind of motion, there are 2 requirements:
1.  The smart contract needs to know all eligible public addresses that can vote on this motion

1. The votes should be anonymous, i.e reading the public ledger of ethereum no one should be able to figure out who voted for whom.

**The Point 2. is a very big problem! How do u provide anonymity while voting on a public 
blockchain, this is what Votium aims to solve via ZK SNARKS.**

Votium provides a framework { zKCircuits + Smart Contracts } for people to make their voting motions on top of it.

- Anyone who has created a motion can provide an input of the list of public voting keys that are allowed to vote { voting keys are like voting IDs which can recognise a public address. }
- Anyone who is allowed to vote for that motion can produce a proof that they are indeed allowed to vote and then also provide what their vote is. **The proof will not have the voting key of the voter, hence the smart contract will be able to verify whether a given vote is valid or not without ever knowing the public identity of the person who is voting!**

The below diagrams explains the difference between traditional voting on Ethereum { or any other public blockchain } vs anonymous voting via Votium.

Traditional Voting:

You send your vote to the smart contract, everyone knows what you have voted, you are suspectible to chain analysis and at the same time this limits the kind of voting you can have on the chain! You can’t do an election or any kind of voting that requires the voting key to be linked with some sort of centralised identity.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/74a97def-631e-4455-84a1-5d28fefdc508/Untitled.png)

Voting via Votium:

Instead of sending your vote to the smart contract, you generate a ZK Proof on ur system, this proof can prove to the smart contract that you are eligible to vote, it tells it what your vote is but at the same time doesn’t reveal your voter id. You relay your vote through a relayer which basically passes your vote to the smart contract, this makes your vote completely anonymous on a public chain as the smart contract can verify whether a vote is legit or not but it can’t figure out who has voted via it!

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9543b981-e5ff-4733-9094-7525c4f3013d/Untitled.png)

What about double spending?

With the proof you send the Hash of your voting key {changing the Hash would corrupt the proof and hence it won’t get verified!}, it is saved in the smart contract and after the first vote if you try to use the proof again, it won’t accept it since it already has the hash associated with that given proof! Making double spending impossible here! 

## Demo

---

Here is a small demo built on top of Votium, the UI is minimal to show basic functionalities, since Votium is a framework, you can build as complex voting DApps you want on top of it!

### Adding a Voter

---

When someone creates a motion on Votium, they can add a list of voters that can vote on the given motion.

Below is a demo of the same with a minimalistic UI. The Voter is being added and once added they can vote anonymously via zk SNARKS.

![adding a voter.gif](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/017310ed-27c3-4383-8409-003e5252791c/adding_a_voter.gif)

### Generating a Proof

---

Once a voter is added, a voter can generate off chain vote on their system, for the demo a cli is used but in production it will go either with a plugin or a native app like 1password.

![generating_proof_original.gif](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c84185b4-3652-4d4f-94ba-4884264a6032/generating_proof_original.gif)

### Submitting a Vote

---

Submit a vote requires providing a proof along with your vote, the proof doesn’t contain any reference to your on-chain credentials but the smart contract can still verify whether it is coming from a legitimate voter or not.

The Hash of the voting-key is recorded on the smart contract making double-spendin, i.e voting twice impossible and still protecting the credential of the voter { because hashing is a one way function }.

  

![voting.gif](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/db5df934-579b-4bd0-861a-5046c78da84a/voting.gif)
