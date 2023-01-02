const MedicalRecord = artifacts.require("MedicalRecord");

module.exports = function (deployer) {
  deployer.deploy(MedicalRecord);
};
