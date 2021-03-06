var PolTokenSale = artifacts.require("./PolTokenSale.sol");
var PolToken = artifacts.require("./PolToken.sol");
contract('PolTokenSale', function(accounts){
	var tokenSaleInstance;
	var tokenInstance;
	var buyer = accounts[1];
	var admin = accounts[0];
	var tokenPrice = 1000000000000000; //in wei
	var tokenAvailable = 750000;
	var numberOfTokens;
	

	it('initializes the contract with the correct values',function(){
		return PolTokenSale.deployed().then(function(instance){
			tokenSaleInstance = instance;
			return tokenSaleInstance.address
		}).then(function(address){
			assert.notEqual(address,0x0,'has contract address');
			return tokenSaleInstance.tokenContract();
		}).then(function(address){
			assert.notEqual(address,0x0,'has token contract address');
			return tokenSaleInstance.tokenPrice();
		}).then(function(price){
			assert.equal(price,tokenPrice,"token price is correct");
		});	
	});

	it("facilitates token buying", function(){
		return PolToken.deployed().then(function(instance){
			
			tokenInstance = instance;

			return PolTokenSale.deployed();
		}).then(function(instance){
			tokenSaleInstance = instance;
			//provision 75 of all token to the token sale
			return tokenInstance.transfer(tokenSaleInstance.address, tokenAvailable, { from: admin})
		}).then(function(receipt){
			numberOfTokens = 10;
			return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice})
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
			assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
			assert.equal(receipt.logs[0].args._amount, numberOfTokens,'logs the number of tokens purchased');
			return tokenSaleInstance.tokenSold();
		}).then(function(amount){
			assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
			return tokenInstance.balanceOf(buyer);
		}).then(function(balance){
			assert.equal(balance.toNumber(), numberOfTokens);
			return tokenInstance.balanceOf(tokenSaleInstance.address);
		}).then(function(balance){
			assert.equal(balance.toNumber(), tokenAvailable - numberOfTokens);
			return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 1});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
			return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice })
	    }).then(assert.fail).catch(function(error) {
	     	assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
	    });
	});



	it('ends token sale', function(){
		return PolToken.deployed().then(function(instance){
			
			tokenInstance = instance;

			return PolTokenSale.deployed();
		}).then(function(instance){
			tokenSaleInstance = instance;

			return tokenSaleInstance.endSale({ from: buyer});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'));
			//End sale an admin

			return tokenSaleInstance.endSale({ from: admin });

		}).then(function(receipt){
			return tokenInstance.balanceOf(admin);
		}).then(function(balance){
			assert.equal(balance.toNumber(), 999990, 'returns all unsold pol tokens a admin');
			//token price is reset when selfDestruct was called
			balance = web3.eth.getBalance(tokenSaleInstance.address)
      		assert.equal(balance.toNumber(), 0);
		});

	});

});