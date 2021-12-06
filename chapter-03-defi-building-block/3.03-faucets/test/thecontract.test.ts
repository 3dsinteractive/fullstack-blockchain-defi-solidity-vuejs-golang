import expect from 'expect'
import ganache from 'ganache-cli'
import { AbiItem } from 'web3-utils'
import { MyToken } from '../types/web3-v1-contracts/MyToken'
import MyTokenContract from '../build/contracts/MyToken.json'
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

let myToken: MyToken

beforeEach(async () => {
  const actors = await testActors(web3)
  // 1. Deploy myToken contract
  myToken = new web3.eth.Contract(MyTokenContract.abi as AbiItem[]) as any as MyToken
  myToken = await myToken.deploy({data: MyTokenContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as MyToken
})

describe('My Token', () => {
  it('can be minted by everyone', async () => {
    const actors = await testActors(web3)

    const amount = toWei('100')
    await myToken.methods.mint(amount).send(actors.acc1Tx)
    await myToken.methods.mint(amount).send(actors.acc2Tx)
    
    const balAcc1 = await myToken.methods.balanceOf(actors.acc1Addr).call()
    const balAcc2 = await myToken.methods.balanceOf(actors.acc2Addr).call()

    expect(fromWei(balAcc1)).toEqual('100')
    expect(fromWei(balAcc2)).toEqual('100')
  })
})