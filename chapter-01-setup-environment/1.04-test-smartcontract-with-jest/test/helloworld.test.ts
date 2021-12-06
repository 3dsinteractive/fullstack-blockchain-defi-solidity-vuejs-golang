import expect from 'expect'
import ganache from 'ganache-cli'
import { AbiItem } from 'web3-utils'
import { Helloworld } from '../types/web3-v1-contracts/Helloworld'
import HelloworldContract from '../build/contracts/Helloworld.json'
import {beforeEach, describe, it, jest} from '@jest/globals'
import {
  getWeb3, 
  toWei, 
  toBasis, 
  toBN, 
  fromWei,
  zeroBN,
} from '../utils/util'
import { 
  testActors
} from '../utils/test_util'

const ganacheOpts = {
  // verbose: true,
  // logger: console,
}
const web3 = getWeb3(ganache.provider(ganacheOpts))

let helloworld: Helloworld

beforeEach(async () => {
  const actors = await testActors(web3)
  helloworld = new web3.eth.Contract(HelloworldContract.abi as AbiItem[]) as any as Helloworld
  helloworld = await helloworld.deploy({data: HelloworldContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as Helloworld
})

describe('Helloworld', () => {
  it('can set and get message', async () => {
    const actors = await testActors(web3)

    await helloworld.methods.setMessage('hello world').send(actors.ownerTx)
    const message = await helloworld.methods.helloworld().call()
    expect(message).toEqual('hello world')
  })
})