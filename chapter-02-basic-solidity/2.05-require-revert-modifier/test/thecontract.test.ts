import expect from 'expect'
import ganache from 'ganache-cli'
import { AbiItem } from 'web3-utils'
import { TheContract } from '../types/web3-v1-contracts/TheContract'
import TheContractContract from '../build/contracts/TheContract.json'
import {beforeEach, describe, it, jest} from '@jest/globals'
import {
  getWeb3, 
  toWei, 
  toBasis, 
  toBN, 
  fromWei,
  zeroBN,
  toBytes32,
  fromBytes32,
} from '../utils/util'
import { 
  testActors
} from '../utils/test_util'

const ganacheOpts = {
  // verbose: true,
  // logger: console,
}
const web3 = getWeb3(ganache.provider(ganacheOpts))

let theContract: TheContract

beforeEach(async () => {
  const actors = await testActors(web3)
  // 1. Deploy theContract contract
  theContract = new web3.eth.Contract(TheContractContract.abi as AbiItem[]) as any as TheContract
  theContract = await theContract.deploy({data: TheContractContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as TheContract
})

describe('The Contract', () => {
  it('can use modifier', async () => {
    const actors = await testActors(web3)

    let amount = toWei('100')

    // 1. Mint will throw error and revert if caller is not owner
    try {
      await theContract.methods.mint(amount).send(actors.acc1Tx)
    } catch (err) {
      expect(err.toString()).toEqual('c: VM Exception while processing transaction: revert owner only')
    }

    // 2. Mint2 (user modifier) will throw error and revert if caller is not owner
    try {
      await theContract.methods.mint2(amount).send(actors.acc1Tx)
    } catch (err) {
      expect(err.toString()).toEqual('c: VM Exception while processing transaction: revert owner only')
    }


    // 3. Mint will throw error and revert if amount is zero
    amount = toWei('0')
    try {
      await theContract.methods.mint(amount).send(actors.ownerTx)
    } catch (err) {
      expect(err.toString()).toEqual('c: VM Exception while processing transaction: revert amount must > 0')
    }

    // 4. Mint2 (user modifier) will throw error and revert if amount is zero
    try {
      await theContract.methods.mint2(amount).send(actors.ownerTx)
    } catch (err) {
      expect(err.toString()).toEqual('c: VM Exception while processing transaction: revert amount must > 0')
    }


    // 5. Mint will increase totalSupply by amount
    amount = toWei('100')
    await theContract.methods.mint(amount).send(actors.ownerTx)
    // 6. Mint2 will increase totalSupply by amount
    await theContract.methods.mint2(amount).send(actors.ownerTx)
    
    const totalSupply = await theContract.methods.getTotalSupply().call(actors.acc1Tx)
    expect(fromWei(totalSupply)).toEqual('200')
  })
})