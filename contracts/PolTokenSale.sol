pragma solidity ^0.4.2;


import "./PolToken.sol";


/**
 * The PolTokenSale contract does this and that...
 */
contract PolTokenSale {
	address admin;
	PolToken public tokenContract;
	uint256 public tokenPrice;


	function PolTokenSale(PolToken _tokenContract, uint256 _tokenPrice) public {
		admin = msg.sender;
		tokenContract = _tokenContract;

		tokenPrice = _tokenPrice;
	}	
}

