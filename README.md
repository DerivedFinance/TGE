# tge-smart-contracts

Smart Contracts for TGE

## 1. DVDX Token

### Installation

Install all the dependencies with npm, run the following command

```bash
  cd DVD_Token
  npm install
```

### Testing

To test the contract, run the following command

```bash
  npm run test
```

To run coverage for the contract, run the following command

```bash
  npm run coverage
```

To clean all the temp files from the test, run the following command

```bash
  npm run clean
```

### Deployment

Create a secrets.json file in the root directory and add the following variables

```json
{
	"mnemonic": "your-mnemonic",
	"infuraKey": "your-infura-key"
}
```

To deploy to a network, run the following command by replacing the `NETWORK` with one of the following valid values:

-   localhost
-   ropsten
-   rinkeby
-   goerli

```bash
  npx hardhat run --network NETWORK scripts/deploy_upgradable_token.js
```

> Save the deployed contract address as it would be required to upgrade the contract

### Upgrading

Create your upgraded contract and save it inside `contracts` folder and run the following command to compile the new contract

```bash
  npx hardhat compile
```

Now run the following command

```bash
  cd scripts
```

Open `deploy_proxy_token.js` file and do the following

1. In line 4, change `'TokenV2'` at the end of the line to name of your upgraded contract name. For example if your upgraded contract name is DerivedTokenV2, it will be

```js
const TokenV2 = await ethers.getContractFactory('DerivedTokenV2')
```

2. Replace the address in line 8 with your previously deployed contract address

3. Run the following command

```bash
  cd ..
```

Now run the following command and replace the NETWORK with the network your token is currently deployed

```bash
  npx hardhat run --network NETWORK scripts/deploy_proxy_token.js
```

Your contract will be upgraded and the address will remain the same

&nbsp;
&nbsp;

