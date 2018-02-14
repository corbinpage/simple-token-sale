/* eslint-env mocha */
/* global artifacts assert contract */

const StandardToken = artifacts.require('./StandardToken.sol');
const Pausable = artifacts.require('./Pausable.sol');

contract('Pausable', (accounts) => {
  const owner = accounts[0];
  const notOwner = accounts[1];
  let contract;

  beforeEach(async () => {
    contract = await Pausable.new({ from: owner });
  });

  describe('Pause flag', () => {
    it('is initially false', async () => {
      const paused = await contract.paused();
      assert.isFalse(paused);
    });
  });

  describe('Pausing', () => {
    it('is possible for owner', async () => {
      await contract.pause({ from: owner });
      const paused = await contract.paused();
      assert.isTrue(paused);
    });

    it('is not possible for non-owner', async () => {
      try {
        await contract.pause({ from: notOwner });
      } catch (err) {
        const paused = await contract.paused();
        assert.isFalse(paused);
        return;
      }
      throw new Error('Did not receive expected error');
    });

    it('is not possible when already paused', async () => {
      await contract.pause({ from: owner });
      try {
        await contract.pause({ from: owner });
      } catch (err) {
        const paused = await contract.paused();
        assert.isTrue(paused);
        return;
      }
      throw new Error('Did not receive expected error');
    });
  });

  describe('Resuming', () => {
    it('is possible for owner', async () => {
      await contract.pause({ from: owner });
      await contract.resume({ from: owner });
      const paused = await contract.paused();
      assert.isFalse(paused);
    });

    it('is not possible for non-owner', async () => {
      await contract.pause({ from: owner });
      try {
        await contract.resume({ from: notOwner });
      } catch (err) {
        const paused = await contract.paused();
        assert.isTrue(paused);
        return;
      }
      throw new Error('Did not receive expected error');
    });

    it('is not possible when already resumed', async () => {
      try {
        await contract.resume({ from: owner });
      } catch (err) {
        const paused = await contract.paused();
        assert.isFalse(paused);
        return;
      }
      throw new Error('Did not receive expected error');
    });
  });
});

contract('StandardToken', (accounts) => {
  const owner = accounts[0];
  const notOwner = accounts[1];
  let contract;

  beforeEach(async () => {
    contract = await StandardToken.new({ from: owner });
  });

  describe('transfer()', () => {
    it('is possible when the token is not paused', async () => {
      await contract.transfer(notOwner, 0, { from: owner });
    });

    it('is not possible when the token is paused', async () => {
      await contract.pause({ from: owner });
      try {
        await contract.transfer(owner, 0, { from: notOwner });
      } catch (err) {
        return;
      }
      throw new Error('Expected transfer() to throw an error');
    });
  });

  describe('transferFrom()', () => {
    it('is possible when the token is not paused', async () => {
      await contract.transferFrom(owner, notOwner, 0, { from: owner });
    });

    it('is not possible when the token is paused', async () => {
      await contract.pause({ from: owner });
      try {
        await contract.transferFrom(notOwner, owner, 0, { from: owner });
      } catch (err) {
        return;
      }
      throw new Error('Expected transferFrom() to throw an error');
    });
  });
});
