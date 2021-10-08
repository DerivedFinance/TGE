require('@nomiclabs/hardhat-ethers')
require('@openzeppelin/hardhat-upgrades')
require('@nomiclabs/hardhat-etherscan')
require("solidity-coverage");
const { mnemonic, infuraKey } = require('./secrets.json')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    // for development
    // paths: {
    // 	sources: './contracts_dev',
    // 	artifacts: './artifacts/contracts_dev',
    // 	tests: './test_dev',
    // },
    networks: {
        localhost: {
            url: 'http://127.0.0.1:8545/',
        },
        ropsten: {
            url: `https://ropsten.infura.io/v3/${infuraKey}`,
            accounts: { mnemonic: mnemonic },
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${infuraKey}`,
            accounts: { mnemonic: mnemonic },
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${infuraKey}`,
            accounts: { mnemonic: mnemonic },
        },
    },
    solidity: '0.8.4',
}
