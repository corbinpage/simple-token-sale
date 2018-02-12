/* eslint-env mocha */
/* global artifacts assert contract */

const StandardToken = artifacts.require('./StandardToken.sol');

contract('StandardToken', (accounts) => {
  const creator = accounts[0];
  const notCreator = accounts[1];

  let initiallyLiveContract;
  let initiallyPausedContract;

  beforeEach(async () => {
    initiallyLiveContract = await StandardToken.new({ from: creator });
    initiallyPausedContract = await StandardToken.new({ from: creator });
    await initiallyPausedContract.pause({ from: creator });
  });

  describe('Pause flag', () => {
    it('is initially false', async () => {
      const paused = await initiallyLiveContract.paused();
      assert(paused === false);
    });
  });

  describe('Pausing a token', () => {
    it('is possible for creator', async () => {
      await initiallyLiveContract.pause({ from: creator });
      const paused = await initiallyLiveContract.paused();
      assert(paused === true);
    });

    it('is not possible for non-creator', async () => {
      try {
        await initiallyLiveContract.pause({ from: notCreator });
      } catch (err) {
        const paused = await initiallyLiveContract.paused();
        assert(paused === false);
        return;
      }
      assert.fail('Did not receive expected error');
    });

    describe('when the token is already paused', () => {
      it('does nothing', async () => {
        await initiallyPausedContract.pause({ from: creator });
        const paused = await initiallyPausedContract.paused();
        assert(paused === true);
      });
    });
  });

  describe('Resuming a token', () => {
    it('is possible for creator', async () => {
      await initiallyPausedContract.resume({ from: creator });
      const paused = await initiallyPausedContract.paused();
      assert(paused === false);
    });

    it('is not possible for non-creator', async () => {
      try {
        await initiallyPausedContract.resume({ from: notCreator });
      } catch (err) {
        const paused = await initiallyPausedContract.paused();
        assert(paused === true);
        return;
      }
      throw new Error('Expected resume() to throw an error');
    });

    describe('when the token is already live', () => {
      it('does nothing', async () => {
        await initiallyLiveContract.resume({ from: creator });
        const paused = await initiallyLiveContract.paused();
        assert(paused === false);
      });
    });
  });

  describe('transfer()', () => {
    it('is possible when the token is not paused', async () => {
      try {
        await initiallyLiveContract.transfer(notCreator, 0, { from: creator });
      } catch (err) {
        throw err;
      }
    });

    it('is not possible when the token is paused', async () => {
      try {
        await initiallyPausedContract.transfer(notCreator, 0, { from: creator });
      } catch (err) {
        return;
      }
      throw new Error('Expected transfer() to throw an error');
    });
  });

  describe('transferFrom()', () => {
    it('is possible when the token is not paused', async () => {
      try {
        await initiallyLiveContract.transferFrom(creator, notCreator, 0, { from: creator });
      } catch (err) {
        throw err;
      }
    });

    it('is not possible when the token is paused', async () => {
      try {
        await initiallyPausedContract.transferFrom(creator, notCreator, 0, { from: creator });
      } catch (err) {
        return;
      }
      throw new Error('Expected transferFrom() to throw an error');
    });
  });
});
