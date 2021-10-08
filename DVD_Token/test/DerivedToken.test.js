const chai = require('chai')
const { expect } = require('chai')
const { solidity } = require('ethereum-waffle')
chai.use(solidity)

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
let Derived
let derived
let addr1
let addr2

// Start test block
describe('DerivedToken', () => {
	beforeEach(async () => {
		Derived = await ethers.getContractFactory('DerivedToken')
		derived = await Derived.deploy()
		await derived.initialize()
		;[addr1, addr2, _] = await ethers.getSigners()
	})

	// Test cases

	it('cannot initialize more than once', async () => {
		await expect(derived.initialize()).to.be.revertedWith(
			'Initializable: contract is already initialized'
		)
	})

	it('returns correct owner info', async () => {
		expect(await derived.owner()).to.equal(addr1.address)
	})

	it('can transfer ownership (only owner)', async () => {
		await derived.transferOwnership(addr2.address)
		expect(await derived.owner()).to.equal(addr2.address)
	})

	it('fails if someone else tries to transfer ownership', async () => {
		await expect(
			derived.connect(addr2).transferOwnership(addr2.address)
		).to.be.revertedWith('Ownable: caller is not the owner')
	})

	it('can renounce ownership (only owner)', async () => {
		await derived.renounceOwnership()
		expect(await derived.owner()).to.equal(ZERO_ADDRESS)
	})

	it('fails if someone else tries to remounce ownership', async () => {
		await expect(
			derived.connect(addr2).renounceOwnership()
		).to.be.revertedWith('Ownable: caller is not the owner')
	})

	it('returns correct token info', async () => {
		expect((await derived.name()).toString()).to.equal('Derived')
		expect((await derived.symbol()).toString()).to.equal('DVD')
		expect((await derived.decimals()).toString()).to.equal('18')
		expect((await derived.totalSupply()).toString()).to.equal(
			(10 ** 9 * 10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
	})

	it('returns correct token balances', async () => {
		expect((await derived.balanceOf(addr1.address)).toString()).to.equal(
			(10 ** 9 * 10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
		expect((await derived.balanceOf(addr2.address)).toString()).to.equal(
			'0'
		)
	})

	it('can transfer tokens (transfer)', async () => {
		await derived.transfer(
			addr2.address,
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
		expect((await derived.balanceOf(addr1.address)).toString()).to.be.equal(
			((10 ** 9 - 1) * 10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
		expect((await derived.balanceOf(addr2.address)).toString()).to.be.equal(
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
	})

	it('cannot transfer tokens if recipient is zero address (transfer)', async () => {
		await expect(
			derived.transfer(
				ZERO_ADDRESS,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
		).to.be.revertedWith('ERC20: transfer to the zero address')
	})

	it('cannot transfer tokens when balance is not sufficient (transfer)', async () => {
		await expect(
			derived.connect(addr2).transfer(
				addr1.address,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
		).to.be.revertedWith('ERC20: transfer amount exceeds balance')
	})

	it('can approve tokens', async () => {
		await derived.approve(
			addr2.address,
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
		expect(
			(await derived.allowance(addr1.address, addr2.address)).toString()
		).to.be.equal(
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
	})

	it('can increase allowance of tokens', async () => {
		await derived.approve(
			addr2.address,
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
		await derived.increaseAllowance(
			addr2.address,
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)

		expect(
			(await derived.allowance(addr1.address, addr2.address)).toString()
		).to.be.equal(
			(2 * 10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
	})

	it('cannot increase allowance if receipent is zero address', async () => {
		await expect(
			derived.approve(
				ZERO_ADDRESS,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
		).to.be.revertedWith('ERC20: approve to the zero address')
	})

	it('can decrease allowance of tokens', async () => {
		await derived.approve(
			addr2.address,
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
		await derived.decreaseAllowance(
			addr2.address,
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)

		expect(
			(await derived.allowance(addr1.address, addr2.address)).toString()
		).to.be.equal('0')
	})

	it('can transfer tokens (transferFrom)', async () => {
		await derived.approve(
			addr1.address,
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)

		await derived.transferFrom(
			addr1.address,
			addr2.address,
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
		expect((await derived.balanceOf(addr1.address)).toString()).to.be.equal(
			((10 ** 9 - 1) * 10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
		expect((await derived.balanceOf(addr2.address)).toString()).to.be.equal(
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
	})

	it('can transfer tokens on behalf of sender (transferFrom)', async () => {
		await derived.approve(
			addr2.address,
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)

		await derived.connect(addr2).transferFrom(
			addr1.address,
			addr2.address,
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
		expect((await derived.balanceOf(addr1.address)).toString()).to.be.equal(
			((10 ** 9 - 1) * 10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)
		expect((await derived.balanceOf(addr2.address)).toString()).to.be.equal(
			(10 ** 18).toLocaleString('fullwide', {
				useGrouping: false,
			})
		)

		expect(
			(await derived.allowance(addr1.address, addr2.address)).toString()
		).to.be.equal('0')
	})

	it('cannot transfer tokens if recipient is zero address (transferFrom)', async () => {
		await expect(
			derived.transferFrom(
				addr1.address,
				ZERO_ADDRESS,
				(10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
		).to.be.revertedWith('ERC20: transfer to the zero address')
	})

	it('cannot transfer tokens when balance is not sufficient (transferFrom)', async () => {
		await expect(
			derived.transferFrom(
				addr1.address,
				addr2.address,
				(10 ** 10 * 10 ** 18).toLocaleString('fullwide', {
					useGrouping: false,
				})
			)
		).to.be.revertedWith('ERC20: transfer amount exceeds balance')
	})
})
