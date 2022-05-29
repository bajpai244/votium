pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/pedersen.circom";
include "merkleTree.circom";

template CommitmentHasher(){
    signal input voteKey;
    component voteKeyHasher = Pedersen(512);
    component voteKeyBits = Num2Bits(512);
    signal output commitment;

    voteKeyBits.in <== voteKey;

    for (var i = 0; i < 512; i++) {
        voteKeyHasher.in[i] <== voteKeyBits.out[i];
    }

    commitment <== voteKeyHasher.out[0];
}

// Verifies that commitment that corresponds to given secret and nullifier is included in the merkle tree of deposits
template Votium(levels) {

    signal input privateKey;
    signal input zKey;
    
    component privateKeyHasher = Pedersen(512);
    component privateKeyBits = Num2Bits(512);
    component commitmentHasher = CommitmentHasher();

    privateKeyBits.in <== privateKey;

    for (var i = 0; i < 512; i++) {
        privateKeyHasher.in[i] <== privateKeyBits.out[i];
    }

    log(privateKey);
    log(privateKeyHasher.out[0]);
    log(zKey);
}

component main = Votium(20);