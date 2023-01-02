pragma solidity ^0.7.0;

// It is important to thoroughly review and test any smart contract before using it.

contract MedicalRecord {
    // The address of the owner of the contract.
    address private owner;

    // The medical records that are being stored.
    mapping(bytes32 => Record) private records;

    // The authorized users who are allowed to access the records.
    mapping(address => bool) private authorizedUsers;

    // The restrictions on access to each record.
    mapping(bytes32 => Restrictions) private accessRestrictions;

    // The data for a single medical record.
    struct Record {
        bytes data;
        uint256 timestamp;
    }

    // The restrictions on access to a single record.
    struct Restrictions {
        // The users who are allowed to access the record.
        mapping(address => bool) authorizedUsers;
        // The minimum role required to access the record.
        uint8 minRole;
        // The expiration date for the record.
        uint256 expirationDate;
    }

    // The roles that a user can have.
    enum Roles {
        Patient,
        Doctor,
        Administrator
    }

    // The role of each user.
    mapping(address => Roles) private userRoles;

    // The constructor sets the owner of the contract.
    constructor() public {
        owner = msg.sender;
    }

    // Only the owner can authorize a user to access records.
    function authorizeUser(address user) public onlyOwner {
        authorizedUsers[user] = true;
    }

    // Only the owner can remove a user's authorization to access records.
    function removeAuthorization(address user) public onlyOwner {
        authorizedUsers[user] = false;
    }

    // Only the owner can set the role of a user.
    function setUserRole(address user, Roles role) public onlyOwner {
        userRoles[user] = role;
    }

    // Only authorized users can access a record if the current time is before the record's expiration date
    // and the user's role is equal to or higher than the minimum role required to access the record.
    function getRecord(bytes32 key) public view onlyAuthorized returns (bytes memory) {
        Record storage record = records[key];
        Restrictions storage restrictions = accessRestrictions[key];
        require(block.timestamp < restrictions.expirationDate, "This record has expired.");
        require(uint8(userRoles[msg.sender]) >= restrictions.minRole, "Your role is not high enough to access this record.");
        require(restrictions.authorizedUsers[msg.sender], "You are not authorized to access this record.");
        return record.data;
    }

    // Only the owner can add or update a record.
    function setRecord(bytes32 key, bytes memory data, uint256 expirationDate, uint8 minRole, address[] memory authorizedUsers) public onlyOwner {
        Record storage record = records[key];
        record.data = data;
        record.timestamp = block.timestamp;
        Restrictions storage restrictions = accessRestrictions[key];
        restrictions.expirationDate = expirationDate;
        restrictions.minRole = minRole;
        for (uint i = 0; i < authorizedUsers.length; i++) {
            restrictions.authorizedUsers[authorizedUsers[i]] = true;
        }
    }

    // Only the owner can delete a record.
    function deleteRecord(bytes32 key) public onlyOwner {
        delete records[key];
        delete accessRestrictions[key];
    }

    // retrieve the value of the owner  
    function getOwner() public view returns (address) {
        return owner;
    }


    // Only the owner can call these functions.
    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // Only authorized users can call these functions.
    modifier onlyAuthorized {
        require(authorizedUsers[msg.sender], "You are not authorized to perform this action.");
        _;
    }
}