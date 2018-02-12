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

  describe('Pausing token transfers', () => {
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
  });

  describe('Resuming token transfers', () => {
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
      assert.fail('Did not receive expected error');
    });
  });
});
