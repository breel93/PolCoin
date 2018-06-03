var PolToken = artifacts.require("./PolToken.sol");


contract('PolToken',function(account){
	it('sets the total supply upon deployment',function(){
	 return PolToken.deployed().then(function(intance){
	 	tokenInstance = intance;
	 	return tokenInstance.totalSupply();
	 }).then(function(totalSupply){
	 	assert.equal(totalSupply.toNumber(),1000000,'set totalSupply to 1000000');
	 });
	});
})
