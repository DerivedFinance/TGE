const { ethers, upgrades } = require('hardhat')

async function main() {
	const DerivedToken = await ethers.getContractFactory('DerivedToken')
	console.log('Deploying DerivedToken...')
	const tokenv1 = await upgrades.deployProxy(DerivedToken, {
		initializer: 'initialize',
	})
	await tokenv1.deployed()
	console.log('DerivedToken deployed to:', tokenv1.address)
}

main()
