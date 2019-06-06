pragma solidity ^0.5.3;

// truffle console is js run-time environment. 

contract DappToken{
	// Constructor 
	// set the no.of tokens
	// read the total no. of tokens
	string public name = 'DApp Token'; //Name
	string public symbol = 'DAPP'; // SYmbol
	string public standard = 'DApp Token v1.0';
	uint256 public totalSupply;
			// for state variable if its public ...we get getter funnction
		// mappin -in solidityis like hash table ..initialization is to zero
		
	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);	
	//approve
	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
	);

	mapping(address => uint256)public balanceOf;
	//allowance
	mapping(address => mapping(address => uint256)) public allowance;
				// nested mapping..2D mapping...owner is key
				//...........another address is spender and then value
				// so this mapping record all of the owners approvals//
				// A -B-565 A-C-656 so on...

	constructor(uint256 _initalSupply) public{
		balanceOf[msg.sender]=_initalSupply;
		totalSupply = _initalSupply;  //state variable accessiblle to entire contract
			// state variable is written todisk.
			// allocate initial supply
	}

	// Transfer of tokens... returns bool 	
	
	function transfer(address _to,uint256 _value) public returns (bool success) {
		require(balanceOf[msg.sender] >= _value);
		// Transfer Balance (triggers transfer event)
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;

		// Transfer Event
			// to emit transfer event we need to declare one
		emit Transfer(msg.sender,_to,_value);
		// Return Bool
		return true;
	} 	

	// Delegated Transfer

		//aprove allows someone to approve another account to spend on his behalf
		// after approving another address executes the transferFrom
		// allowance .. alloted amount that we have approved to transfer
		// event -Approval...everyitme approve is successful trigger and log approve event

	// Approve
	function approve(address _spender,uint256 _value) public returns (bool success){
		//allowance
		allowance[msg.sender][_spender]=_value;

		emit Approval(msg.sender,_spender,100);
		//Approve Event

		return true;
	}
	
	// TransferFrom
	function transferFrom(address _from,address _to,uint256 _value)public returns(bool success){
		//require _from has enough tokens
		require(_value<=balanceOf[_from]);
		//require allowance is big enough
		require(_value<=allowance[_from][msg.sender]);
		
		//Change the balance
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;

		//Update allowance
		allowance[_from][msg.sender] -= _value;
					// msg.sender is spending account
		//Transfer event
		emit Transfer(_from,_to,_value);

		//return a boolean
		return true;
	}

}