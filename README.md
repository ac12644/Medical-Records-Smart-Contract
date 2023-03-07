# Medical Record Smart Contract

This is a Solidity smart contract for managing medical records on the blockchain. The contract allows for storing and accessing medical records while maintaining data privacy and security. The contract also includes access restrictions to ensure that only authorized users can access the records.

## Getting Started

To use this smart contract, you will need to have access to a blockchain platform that supports Solidity smart contracts. You can deploy the contract to a public blockchain like Ethereum or to a private blockchain for internal use.

## Prerequisites

- A blockchain platform that supports Solidity smart contracts (e.g. Ethereum, Hyperledger Fabric)
- A wallet for interacting with the blockchain (e.g. MetaMask)

## Installation

1. Clone this repository to your local machine:
```
git clone https://github.com/your_username/medical-record-contract.git
```
2. Install the required dependencies:

```
npm install
```

3. Compile the smart contract:

```
truffle compile
```

4. Deploy the contract to your blockchain:

```
truffle migrate
```

## Usage

Once you have deployed the contract to your blockchain, you can interact with it using a tool like Remix or through your own custom application.

## Functions

- `authorizeUser(address user)`: Only the owner can authorize a user to access records.
- `removeAuthorization(address user)`: Only the owner can remove a user's authorization to access records.
- `setUserRole(address user, Roles role)`: Only the owner can set the role of a user.
- `getRecord(bytes32 key)`: Only authorized users can access a record if the current time is before the record's expiration date and the user's role is equal to or higher than the minimum role required to access the record.
- `setRecord(bytes32 key, bytes memory data, uint256 expirationDate, uint8 minRole, address[] memory authorizedUsers)`: Only the owner can add or update a record.
- `deleteRecord(bytes32 key)`: Only the owner can delete a record.
- `getOwner()`: Retrieve the value of the owner.

## Example Workflow

1. The owner deploys the smart contract to the blockchain.
2. The owner authorizes users to access the medical records.
3. A doctor accesses a patient's medical record by calling the `getRecord()` function with the appropriate key.
4. The contract checks the user's role and access restrictions before returning the record data.


## Tutorial

For a step-by-step tutorial on how to use this smart contract, check out this [Medium](https://medium.com/better-programming/storing-medical-records-on-blockchain-18e9a076b28b) article.

## Contributing

Contributions to this project are welcome! If you find a bug or would like to suggest a new feature, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
