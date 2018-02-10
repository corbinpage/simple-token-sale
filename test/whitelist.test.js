const Whitelist = artifacts.require('./Whitelist.sol');
web3.eth.getTransactionReceiptMined = require("./libs/getTransactionReceiptMined.js");
const expectedExceptionPromise = require('./libs/expected_exception_testRPC_and_geth');

contract('Whitelist', function(accounts) {
  const owner = accounts[0]
  const newOwner = accounts[1]
  const okayAddress = accounts[2]
  const badAddress = accounts[3]

  let contract

  beforeEach( async () => {
    contract = await Whitelist.new({from:owner})
  })

  describe('Ownership inheritance', () => {
    it('should be owned by "owner"', async () => {
      const _owner = await contract.owner({from:owner})
      assert.strictEqual(_owner, owner, "owner is not owned by 'owner'")
    })

    it('should allow owner to change ownership', async () => {
      await contract.transferOwnership(newOwner, {from:owner})
      const _owner = await contract.owner({from:owner})
      assert.strictEqual(_owner, newOwner, "ownership did not transfer")
    })
  })

  describe('.isWhitelisted', () => {
    it('should return false for addresses not added', async () => {
      const _listed = await contract.isWhitelisted(owner, {from:owner})
      assert.isFalse(_listed, 'no address should be listed initially')
    })
  }) 

  describe('.addAddress', () => {
    it('should add the address to the list', async () => {
      await contract.addAddress(okayAddress, {from:owner})
      const _listed = await contract.isWhitelisted(okayAddress, {from:owner})
      assert.isTrue(_listed, 'okayAddress was not added to the list')
    })

    it('should only allow the owner to add addresses', () => {
      return expectedExceptionPromise( () => {
        return contract.addAddress(okayAddress, {from:badAddress})
      }, 3000000);
    })

    it('should not allow adding an address twice', async () => {
      await contract.addAddress(okayAddress, {from:owner})
      return expectedExceptionPromise( () => {
        return contract.addAddress(okayAddress, {from:owner})
      }, 3000000);
    })

    it('should not allow adding a Zero address', async () => {
      return expectedExceptionPromise( () => {
        return contract.addAddress(0, {from:owner})
      }, 3000000);
    })
  })

  describe('.removeAddress', () => {
    beforeEach( async () => {
      await contract.addAddress(okayAddress, {from:owner})
    })

    it('should remove the address from the list', async () => {
      let _listed = await contract.isWhitelisted(okayAddress, {from:owner})
      assert.isTrue(_listed, 'okayAddress was not added to the list')

      await contract.removeAddress(okayAddress, {from:owner})
      _listed = await contract.isWhitelisted(okayAddress, {from:owner})
      assert.isFalse(_listed, 'okayAddress was not removed from the list')
    })

    it('should only allow the owner to add addresses', () => {
      return expectedExceptionPromise( () => {
        return contract.removeAddress(okayAddress, {from:badAddress})
      }, 3000000);
    })

    it('should not allow removing an non-added address', async () => {
      const _listed = await contract.isWhitelisted(badAddress, {from:owner})
      assert.isFalse(_listed, 'badAddress was already on the list')

      return expectedExceptionPromise( () => {
        return contract.removeAddress(badAddress, {from:owner})
      }, 3000000);
    })
  })
})