var PolToken = artifacts.require("./PolToken.sol");


contract('PolToken',function(accounts){
	var tokenInstance;

	it('initializes the contract with the correct values', function(){
		return PolToken.deployed().then(function(intance){
			tokenInstance = intance;
			return tokenInstance.name();
		}).then(function(name){
		   assert.equal(name,'Pol Token', 'has the correct name');
		   return tokenInstance.symbol();
		}).then(function(symbol){
		   assert.equal(symbol,'POL','has the correct symbol');
		   return tokenInstance.standard();
		}).then(function(standard){
		   assert.equal(standard, 'Pol Token v1.0','has the correct standard');
		});
	});



	it('allocate initial supply upon deployment',function(){
		return PolToken.deployed().then(function(intance){
	 	tokenInstance = intance;
	 	return tokenInstance.totalSupply();
	 	}).then(function(totalSupply){
	 	assert.equal(totalSupply.toNumber(),1000000,'set totalSupply to 1000000');
	 	return tokenInstance.balanceOf(accounts[0]);
		 }).then(function(adminBalance){
	 	assert.equal(adminBalance.toNumber(),1000000,'it allocates the initial supply to the admin');
		});
 	 });


    it('transfers token ownership', function(){
		return PolToken.deployed().then(function(intance){
			tokenInstance = intance;
	  		return tokenInstance.transfer.call(accounts[1], 99999999999999999999999);
    	}).then(assert.fail).catch(function(error) {
      		assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
      		return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
    	}).then(function(success) {
      		assert.equal(success, true, 'it returns true');
      		return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
		}).then(function(receipt){
	   		assert.equal(receipt.logs.length, 1, 'triggers one event');
	   		assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
	   		assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
	   		assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
	   		assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
	   		return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance){
			assert.equal(balance.toNumber(),250000,'adds amount to receiving account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance){
			assert.equal(balance.toNumber(),750000,'deducts the amount from the sending account');
		});
    });
});


