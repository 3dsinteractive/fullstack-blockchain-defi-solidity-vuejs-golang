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
  it('can calculate percentage', async () => {
    const actors = await testActors(web3)

    let res = await theContract.methods.percentOf(toBasis(2.5), toWei('100')).call(actors.acc1Tx)
    expect(fromWei(res)).toEqual('2.5')
  })

})