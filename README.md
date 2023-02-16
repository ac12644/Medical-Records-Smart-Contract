## MedicalRecord Smart Contract
The MedicalRecord smart contract is designed to securely store and manage medical records on the Ethereum blockchain. This contract ensures that only authorized users can access medical records, and that access to those records is restricted based on the user's role and the expiration date of the record.

## Contract Variables
The MedicalRecord contract has the following variables:

- owner: The address of the owner of the contract.
- records: A mapping of medical records that are being stored.
- authorizedUsers: A mapping of authorized users who are allowed to access the records.
- accessRestrictions: A mapping of the restrictions on access to each record.
- userRoles: A mapping of the role of each user.

## Contract Functions
The MedicalRecord contract has the following functions:

- authorizeUser(address user): Only the owner can authorize a user to access records.
- removeAuthorization(address user): Only the owner can remove a user's authorization to access records.
- setUserRole(address user, Roles role): Only the owner can set the role of a user.
- getRecord(bytes32 key): Only authorized users can access a record if the current time is before the record's expiration date and the user's role is equal to or higher than the minimum role required to access the record.
- setRecord(bytes32 key, bytes memory data, uint256 expirationDate, uint8 minRole, address[] memory authorizedUsers): Only the owner can add or update a record.
- deleteRecord(bytes32 key): Only the owner can delete a record.
- getOwner(): Retrieve the value of the owner.

## Modifiers
The MedicalRecord contract has the following modifiers:

- onlyOwner: Only the owner can call these functions.
- onlyAuthorized: Only authorized users can call these functions.

## Conclusion

The MedicalRecord smart contract is an important tool for securely storing and managing medical records on the Ethereum blockchain. By ensuring that only authorized users can access records, and by restricting access based on the user's role and the expiration date of the record, this contract provides a powerful way to protect sensitive medical data.
