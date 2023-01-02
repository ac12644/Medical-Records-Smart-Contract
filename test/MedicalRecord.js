const MedicalRecord = artifacts.require("MedicalRecord");

contract("MedicalRecord", (accounts) => {
  let contract;
  let owner;

  before(async () => {
    contract = await MedicalRecord.new();
    owner = await contract.owner();
  });

  it("should set the owner of the contract to the deployer", async () => {
    const contractOwner = await contract.owner();
    assert.strictEqual(
      contractOwner,
      owner,
      "The contract owner is not the deployer."
    );
  });

  it("should allow the owner to authorize a user to access records", async () => {
    await contract.authorizeUser(accounts[1], { from: owner });
    const isAuthorized = await contract.isAuthorized(accounts[1]);
    assert.isTrue(
      isAuthorized,
      "The user was not authorized to access records."
    );
  });

  it("should allow the owner to remove a user's authorization to access records", async () => {
    await contract.removeAuthorization(accounts[1], { from: owner });
    const isAuthorized = await contract.isAuthorized(accounts[1]);
    assert.isFalse(isAuthorized, "The user's authorization was not removed.");
  });

  it("should allow the owner to set the role of a user", async () => {
    const roleToSet = 1;
    await contract.setUserRole(accounts[1], roleToSet, { from: owner });
    const role = await contract.getUserRole(accounts[1]);
    assert.strictEqual(
      role.toString(),
      roleToSet.toString(),
      "The user's role was not set correctly."
    );
  });

  it("should allow authorized users to access a record if the current time is before the record's expiration date and the user's role is equal to or higher than the minimum role required to access the record", async () => {
    const key = web3.utils.keccak256("test");
    const data = web3.utils.asciiToHex("test data");
    const expirationDate = Math.floor(Date.now() / 1000) + 3600; // One hour from now
    const minRole = 1;
    await contract.setRecord(
      key,
      data,
      expirationDate,
      minRole,
      [accounts[1]],
      { from: owner }
    );
    const retrievedData = await contract.getRecord(key, { from: accounts[1] });
    assert.strictEqual(
      web3.utils.hexToAscii(retrievedData),
      "test data",
      "The retrieved data is incorrect."
    );
  });

  it("should not allow unauthorized users to access a record", async () => {
    const key = web3.utils.keccak256("test");
    try {
      await contract.getRecord(key, { from: accounts[2] });
      assert.fail("The function did not throw an error.");
    } catch (err) {
      assert.include(
        err.message,
        "You are not authorized to access this record.",
        "The error message is incorrect."
      );
    }
  });

  it("should not allow a user with a role that is lower than the minimum required to access a record", async () => {
    const key = web3.utils.keccak256("test");
    try {
      await contract.setUserRole(accounts[1], 0, { from: owner });
      await contract.getRecord(key, { from: accounts[1] });
      assert.fail("The function did not throw an error.");
    } catch (err) {
      assert.include(
        err.message,
        "Your role is not high enough to access this record.",
        "The error message is incorrect."
      );
    }
  });

  it("should not allow users to access a record if the current time is after the record's expiration date", async () => {
    const key = web3.utils.keccak256("test");
    try {
      await contract.setRecord(
        key,
        data,
        Math.floor(Date.now() / 1000) - 3600,
        minRole,
        [accounts[1]],
        { from: owner }
      );
      await contract.getRecord(key, { from: accounts[1] });
      assert.fail("The function did not throw an error.");
    } catch (err) {
      assert.include(
        err.message,
        "This record has expired.",
        "The error message is incorrect."
      );
    }
  });

  it("should allow the owner to add or update a record", async () => {
    const key = web3.utils.keccak256("test");
    const data = web3.utils.asciiToHex("updated test data");
    const expirationDate = Math.floor(Date.now() / 1000) + 3600; // One hour from now
    const minRole = 1;
    await contract.setRecord(
      key,
      data,
      expirationDate,
      minRole,
      [accounts[1]],
      { from: owner }
    );
    const retrievedData = await contract.getRecord(key, { from: accounts[1] });
    assert.strictEqual(
      web3.utils.hexToAscii(retrievedData),
      "updated test data",
      "The retrieved data is incorrect."
    );
  });

  it("should allow the owner to delete a record", async () => {
    const key = web3.utils.keccak256("test");
    await contract.deleteRecord(key, { from: owner });
    try {
      await contract.getRecord(key, { from: accounts[1] });
      assert.fail("The function did not throw an error.");
    } catch (err) {
      assert.include(
        err.message,
        "This record does not exist.",
        "The error message is incorrect."
      );
    }
  });

  it("should not allow unauthorized users to perform actions", async () => {
    const key = web3.utils.keccak256("test");
    const data = web3.utils.asciiToHex("test data");
    const expirationDate = Math.floor(Date.now() / 1000) + 3600; // One hour from now
    const minRole = 1;
    try {
      await contract.setRecord(
        key,
        data,
        expirationDate,
        minRole,
        [accounts[1]],
        { from: accounts[2] }
      );
      assert.fail("The function did not throw an error.");
    } catch (err) {
      assert.include(
        err.message,
        "Only the owner can perform this action.",
        "The error message is incorrect."
      );
    }
  });
});
