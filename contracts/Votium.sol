//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.0 <0.9.0;
import "./MerkleTreeWithHistory.sol";

import "hardhat/console.sol";

interface IVerifier {
    function verifyProof(bytes memory _proof, uint256[] memory _input)
        external
        returns (bool);
}

contract Votium is MerkleTreeWithHistory {
    IVerifier public immutable verifier;

    event Deposit(bytes32 indexed vKey, uint32 leafIndex, uint256 timestamp);

    uint256 public yes = 0;
    uint256 public no = 0;

    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admins");
        _;
    }

    modifier commitmentNotDuplicate(string memory commitment) {
        require(
            nullifierMap[commitment] == false,
            "the voter has already voted for the motion"
        );
        _;
    }

    mapping(string => bool) public nullifierMap;

    constructor(
        IVerifier _verifier,
        IHasher _hasher,
        uint32 _merkleTreeHeight
    ) MerkleTreeWithHistory(_merkleTreeHeight, _hasher) {
        verifier = _verifier;
        admin = msg.sender;
    }

    function addVotingKey(bytes32 _votingKey) public onlyAdmin {
        uint32 insertedIndex = _insert(_votingKey);
        emit Deposit(_votingKey, insertedIndex, block.timestamp);
    }

    function vote(
        bytes calldata _proof,
        uint256[] memory pubSignals,
        string memory _nullifier,
        uint256 _vote
    ) public commitmentNotDuplicate(_nullifier) {
        require(verifier.verifyProof(_proof, pubSignals), "Invalid proof");
        nullifierMap[_nullifier] = true;

        if (_vote == 1) {
            yes += 1;
        } else {
            no += 1;
        }
    }
}
