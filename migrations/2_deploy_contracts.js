const DappToken = artifacts.require("DappToken.sol");

	// creating a artifact allows us to create s smart contract
	// abstraction to run in javscript runtime environment.....
	// allows to interact smartcontract in any js environment...
module.exports = function(deployer) {
  deployer.deploy(DappToken,1000000);
};
