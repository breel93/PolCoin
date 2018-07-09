pragma solidity ^0.4.2;

/**
 * The PolToken contract does this and that...
 */
contract PolToken {

	//name
	string public name = "Pol Token";
	string public symbol = 'POL';
    string public standard = 'Pol Token v1.0';
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value

    );
    

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    

	function PolToken (uint256 _initialSupply) public {
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
		//intialSupply
	}	

	//Transfer

  	function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        Transfer(msg.sender, _to, _value);

        return true;
    }

    //approve

    function approve(address _spender, uint256 _value) public returns (bool success){
       //allowance
       allowance[msg.sender][_spender] = _value;

        Approval(msg.sender,_spender, _value);
        return true;
    }


    function transferFrom(address _from,address _to, uint256 _value) public returns(bool success){


        require (_value <= balanceOf[_from]);
        require (_value <= allowance[_from][msg.sender]);
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        Transfer(_from, _to, _value);

        return true;   
    }

}

