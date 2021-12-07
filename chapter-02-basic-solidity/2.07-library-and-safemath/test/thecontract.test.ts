import expect from 'expect'
import ganache from 'ganache-cli'
import { AbiItem } from 'web3-utils'
import { TheContract } from '../types/web3-v1-contracts/TheContract'
import TheContractContract from '../build/contracts/TheContract.json'
import { AnotherContract } from '../types/web3-v1-contracts/AnotherContract'
import AnotherContractContract from '../build/contracts/AnotherContract.json'
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
let anotherContract: AnotherContract

beforeEach(async () => {
  const actors = await testActors(web3)
  // 1. Deploy theContract contract
  theContract = new web3.eth.Contract(TheContractContract.abi as AbiItem[]) as any as TheContract
  theContract = await theContract.deploy({data: TheContractContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as TheContract
  // 2. Deploy anotherContract contract
  anotherContract = new web3.eth.Contract(AnotherContractContract.abi as AbiItem[]) as any as AnotherContract
  anotherContract = await anotherContract.deploy({data: AnotherContractContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as AnotherContract
})

describe('The Contract', () => {
  it('can add, div and log', async () => {
    const actors = await testActors(web3)
    
    let a = toWei('100')
    let b = toWei('100')
    let z = toWei('0')
    let c = await theContract.methods.add(a, b).call(actors.acc1Tx)
    expect(fromWei(c)).toEqual('200')

    try {
      await theContract.methods.sub(a, toWei('101')).call(actors.acc1Tx)
    } catch (e) {
      expect(e.toString()).toEqual('c: VM Exception while processing transaction: revert underflow')
    }

    c = await theContract.methods.div(a, b).call(actors.acc1Tx)
    expect(c).toEqual('1')

    try {
      await theContract.methods.div(a, z).call(actors.acc1Tx)
    } catch (e) {
      expect(e.toString()).toEqual('c: VM Exception while processing transaction: revert div by zero')
    }
  })

})