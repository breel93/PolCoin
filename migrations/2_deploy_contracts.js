var PolToken = artifacts.require("./PolToken.sol");


module.exports = function(deployer) {
  deployer.deploy(PolToken,1000000);
};
