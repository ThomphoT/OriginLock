// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OriginLock {
    struct IdeaRecord {
        address owner;
        uint256 timestamp;
        string title;
        bool exists;
    }

    // contentHash (SHA-256 hex string) => IdeaRecord
    mapping(string => IdeaRecord) public ideas;

    event IdeaRegistered(
        string indexed hash,
        address indexed owner,
        uint256 timestamp
    );

    error HashAlreadyRegistered(string hash);
    error HashNotFound(string hash);

    /**
     * @notice Register a new idea by its content hash.
     * @param contentHash SHA-256 hex string of the idea file/content.
     * @param title Human-readable title of the idea.
     */
    function registerIdea(
        string calldata contentHash,
        string calldata title
    ) external {
        if (ideas[contentHash].exists) {
            revert HashAlreadyRegistered(contentHash);
        }

        ideas[contentHash] = IdeaRecord({
            owner: msg.sender,
            timestamp: block.timestamp,
            title: title,
            exists: true
        });

        emit IdeaRegistered(contentHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Verify who owns a registered idea hash.
     * @param contentHash SHA-256 hex string to look up.
     * @return owner   Wallet address of the registrant.
     * @return timestamp Unix timestamp of registration.
     * @return title   Title provided at registration.
     */
    function verifyOwnership(
        string calldata contentHash
    )
        external
        view
        returns (
            address owner,
            uint256 timestamp,
            string memory title
        )
    {
        if (!ideas[contentHash].exists) {
            revert HashNotFound(contentHash);
        }

        IdeaRecord storage r = ideas[contentHash];
        return (r.owner, r.timestamp, r.title);
    }
}