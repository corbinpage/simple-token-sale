# Simple Token Launch
[ ![Codeship Status for skmgoldin/simple-token-launch](https://app.codeship.com/projects/5392ad30-6041-0135-6b30-4614bcb67ade/status?branch=master)](https://app.codeship.com/projects/239399)

This codebase can be used to deploy fixed-price, finite-supply token sales. It uses json conf files to specify sale parameters, supports token distributions for pre-sale buyers, and the distribution of timelocked tokens for founders. It also includes a comprehensive test suite.

# Initialize
This was developed using Node 8.2.1, Truffle 3.4.5 and TestRPC 4.0.1.

```
npm install -g truffle
npm install
truffle compile
```

# The tests
To run the tests, simply `npm run test`.

The parameters tested are the same as those which will be deployed. This means the tests can take a very long time if your start block is up in the millions, and some tests will be skipped if signing keys cannot be unlocked for the required accounts, particularly the final test block for the founder timelocking mechanisms. The `owner` address in `sale.json` must be the first address generated by the mnemonic in `secrets.json`.

# Composition of the repo
The repo is composed as a Truffle project. The test suite can be found in `test/sale.json`. The sale contract is in `contracts/Sale.sol`. The deployment scripts are in the `migrations` folder.

The Sale contract deploys the token contract, disburses funds to pre-sale purchasers and then deploys timelock contracts to store the founders tokens. `Disbursement.sol` and `Filter.sol` comprise the timelock contracts. Two `Disbursement.sol` contracts are deployed which unlock funds at a particular date. The `Filter.sol` contracts sit in front of them and allow particular addresses to withdraw particular amounts of funds.

# Using the repo to deploy a real token
Config files where the parameters of your own sale can be filled in are in the `conf` directory.

Note that the `owner` in `sale.json` MUST BE the first address generated by the mnemonic in `secrets.json`. Note that you MUST change the default mnemonic in `secrets.json` or you WILL BE PWNED. Once you've done that you MUST NEVER commit your `secrets.json`. KEEP IT SECRET. It is in the .gitignore. Do not commit it once you've changed it. If your production mnemonic is compromised you are fully pwned.

DO NOT USE THE DEFAULT MNEMONIC.
DO NOT SHARE OR COMMIT THE MNEMONIC YOU CHANGE IT TO.

Make sure all the tests pass before deploying. You probably won't have all of your founders' private keys and so expect to see warnings on those tests. It will take a long time for the tests in the "Sale period 0" block to begin since the testRPC has to be force-mined for millions of blocks.

Having done all that you can `truffle migrate --network mainnet`. Save the contents of your build directory, you'll want to have all that data.

# Task
Using this repo, create a smart contract structure for pausing the token contract. It should have methods for pausing, un-pausing the contract and reporting the current state to anyone that queries it. Make sure tokens cannot be transferred while the contract is paused. Write appropriate tests for this new functionality.
