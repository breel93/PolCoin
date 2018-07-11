var PolToken = artifacts.require("./PolToken.sol");

var PolTokenSale = artifacts.require("./PolTokenSale.sol");


module.exports = function(deployer) {
  deployer.deploy(PolToken,1000000).then(function(){
  	
  	var tokenPrice = 1000000000000000; 

  	return deployer.deploy(PolTokenSale, PolToken.address, tokenPrice);
  });
  
};
