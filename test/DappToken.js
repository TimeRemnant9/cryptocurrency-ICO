// smart contract data is immutable
// if bug is found you need to deploya new contract

var DappToken = artifacts.require("DappToken.sol");

contract('DappToken',function(accounts){
	it('initialized contract will correct values', function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance=instance;
			return tokenInstance.name();
		}).then(function(name){
			assert.equal(name,'DApp Token', ' name is correct ')
			return tokenInstance.symbol();
		}).then(function(symbol){
			assert.equal(symbol,'DAPP', 'symbol is correct')
			return tokenInstance.standard();
		}).then(function(standard){
			assert.equal(standard,'DApp Token v1.0', 'standard is correct')
		})
	})
	it('allocates the total supply on deployment', function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply){
			assert.equal(totalSupply.toNumber(),1000000, 'sets the total supply to 1000000')
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance){
			assert.equal(adminBalance.toNumber(),1000000,'it allocates the initial supply to the admin')		})
	});
	it('transfers token ownership',function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance=instance;
			// Test 'require ' statement first by transferring something larger than senders balance
			return tokenInstance.transfer.call(accounts[1],999999999999); // calls allows to call function doesnt creates transaction...you wont get receipt for call 
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0,'error message must contain revert')
			return tokenInstance.transfer(accounts[1],250000, {from: accounts[0]})
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,'trigger one event')
					// events info is in logs 
			assert.equal(receipt.logs[0].event,'Transfer','should be the transfer event')
			
			assert.equal(receipt.logs[0].args._from,accounts[0],'logs the account tokens are taken from')
			
			assert.equal(receipt.logs[0].args._to,accounts[1],'logs the account tokens are transferred to')
			
			assert.equal(receipt.logs[0].args._value,250000,'logs the transfer amount')
			
			return tokenInstance.balanceOf(accounts[1]);
			}).then(function(balance){
			assert.equal(balance.toNumber(),250000,'adds to receiving account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance){
			assert.equal(balance.toNumber(),750000),'deducts amount from sending account'
		});
	});  
	it('approves token for delegated transfer',function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance=instance;
			return tokenInstance.approve.call(accounts[1],100);
		}).then(function(success){
			assert.equal(success,true,'it returns true');
			return tokenInstance.approve(accounts[1],100);
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,'trigger one event')
					// events info is in logs 
			assert.equal(receipt.logs[0].event,'Approval','should be the approval event')
			
			assert.equal(receipt.logs[0].args._owner,accounts[0],'logs the account tokens are authorized by')
			
			assert.equal(receipt.logs[0].args._spender,accounts[1],'logs the account tokens are authorized to')
			
			assert.equal(receipt.logs[0].args._value,100,'logs the transfer amount')
			return tokenInstance.allowance(accounts[0],accounts[1]);
		}).then(function(allowance){
			assert.equal(allowance,100,'stores the allowance for delegated transfer');
		})
	})

	it('handles delegated token transfer',function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance=instance;
			fromAccount= accounts[2];
			toAccount=accounts[3];
			spendingAccount = accounts[4];
			// transfer some tokens to fromAccount
			return tokenInstance.transfer(fromAccount,100,{from: accounts[0]})
		}).then(function(receipt){
			// APrrove spendingAccount to spend 10 tokens
			return tokenInstance.approve(spendingAccount,10,{from: fromAccount})
		}).then(function(receipt){
			//try transferring something large than senders balance
			return tokenInstance.transferFrom(fromAccount,toAccount,9999);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert')>=0,'cannot transfer value larger than balance')
			// try transferring lrger than approved amount
			return tokenInstance.transferFrom(fromAccount,toAccount,20,{from: spendingAccount})
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >=0, 'cannot transfer larger than approved amount')
			return tokenInstance.transferFrom.call(fromAccount,toAccount,10,{from: spendingAccount});
		}).then(function(success){
			assert.equal(success,true);
			return tokenInstance.transferFrom(fromAccount,toAccount,10,{from: spendingAccount})
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,'trigger one event')
					// events info is in logs 
			assert.equal(receipt.logs[0].event,'Transfer','should be the approval event')
			
			assert.equal(receipt.logs[0].args._from,fromAccount,'logs the account tokens are transferred from')
			
			assert.equal(receipt.logs[0].args._to,toAccount,'logs the account tokens are transferred to')
			
			assert.equal(receipt.logs[0].args._value,10,'logs the transfer amount')
			return tokenInstance.balanceOf(fromAccount);
		}).then(function(balance){
			assert.equal(balance.toNumber(),90,'deducts the amount from fromAccount')
			return tokenInstance.balanceOf(toAccount);
		}).then(function(balance){
			assert.equal(balance.toNumber(),10,'adds the amount to receiving  account')
			return tokenInstance.allowance(fromAccount,spendingAccount);
		}).then(function(allowance){
			assert.equal(allowance.toNumber(),0,'deducts amount from allowance');
		});
	});
























});




