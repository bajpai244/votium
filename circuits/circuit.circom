pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/pedersen.circom";
include "merkleTree.circom";


template NumBits(n) {
    signal input in;
    log(in);

    signal output out[n];
    var lc1=0;

    var e2=1;
    for (var i = 0; i<n; i++) {
        out[i] <-- (in >> i) & 1;
        out[i] * (out[i] -1 ) === 0;
        lc1 += out[i] * e2;
        e2 = e2+e2;
    }

    log(lc1);

    lc1 === in;
}

// Verifies that commitment that corresponds to given secret and nullifier is included in the merkle tree of deposits
template Votium(levels) {

    signal input privateKey;
    signal input vKey;
    signal input nullifier;
    signal input vote;

    signal input root;

    log(privateKey);
    log(vKey);

    signal input pathElements[levels];
    signal input pathIndices[levels];

    component privateKeyHasher = Pedersen(512);
    component privateKeyBits = Num2Bits(512);

    component vKeyHasher = Pedersen(512);
    component vKeyHasherBits = Num2Bits(512);

    privateKeyBits.in <== privateKey;
    vKeyHasherBits.in <== vKey;

    component tree = MerkleTreeChecker(levels);

    tree.leaf <== vKey;
    tree.root <== root;

    for (var i = 0; i < levels; i++) {
        tree.pathElements[i] <== pathElements[i];
        tree.pathIndices[i] <== pathIndices[i];
    }

    for (var i = 0; i < 512; i++) {
        privateKeyHasher.in[i] <== privateKeyBits.out[i];
        vKeyHasher.in[i] <== vKeyHasherBits.out[i];
    }

    vKey === privateKeyHasher.out[0];
    nullifier === vKeyHasher.out[0];
}

component main{public[vote, nullifier]} = Votium(20);