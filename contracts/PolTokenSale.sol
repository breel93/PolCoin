pragma solidity ^0.4.2;


import "./PolToken.sol";


/**
 * The PolTokenSale contract does this and that...
 */
contract PolTokenSale {
	address admin;
	PolToken public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokenSold;

	event Sell(address _buyer, uint256 _amount);

	function PolTokenSale(PolToken _tokenContract, uint256 _tokenPrice) public {
		admin = msg.sender;
		
		tokenContract = _tokenContract;

		tokenPrice = _tokenPrice;
	}	

	function multiply(uint x, uint y) internal pure returns(uint z){

		require (y == 0 || (z = x * y) / y == x);
		
	}


	function buyTokens(uint256 _numberOfTokens) public payable{
		

		require (msg.value == multiply(_numberOfTokens, tokenPrice));
		
		require (tokenContract.balanceOf(this) >= _numberOfTokens);

		require(tokenContract.transfer(msg.sender, _numberOfTokens));

		tokenSold += _numberOfTokens;

		Sell(msg.sender, _numberOfTokens); 
	}

	function endSale() public {

		require (msg.sender == admin);

		require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
			
		// selfdestruct(admin);

        // Just transfer the balance to the admin
        admin.transfer(address(this).balance);
	}
}

