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

// 1. Create web3 connect to Smart contract using Ganache provider
const ganacheOpts = {
  // verbose: true,
  // logger: console,
}
const web3 = getWeb3(ganache.provider(ganacheOpts))

let helloworld: Helloworld

// 2. Before each test case, deploy contract
beforeEach(async () => {

  const actors = await testActors(web3)

  // 2.1 The contract is deployed using ABI and bytecode provide by 
  // the build/contracts/Helloworld.json compiled by "truffle compile"
  // the helloworld: Helloworld type is generate by typechain
  // https://github.com/dethcrypto/TypeChain

  helloworld = new web3.eth.Contract(HelloworldContract.abi as AbiItem[]) as any as Helloworld
  helloworld = await helloworld.deploy({data: HelloworldContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as Helloworld
})

describe('Helloworld', () => {

  // 3. Test Helloworld contract
  it('can set and get message', async () => {
    
    // Explain actors (There are 4 actors in our test scenario)
    // - owner
    // - account1 <- we will use account1 in this test case
    // - account2
    // - platform
    const actors = await testActors(web3)

    // 4. Set message 'hello world' and get it back
    //    Typechain make this function call easier by providing types information over web3 contract
    //    in this case setMessage is intellisensable
    await helloworld.methods.setMessage('hello world').send(actors.acc1Tx)
    // FAIL case
    // await helloworld.methods.setMessage('hello worlds').send(actors.acc1Tx)
    const message = await helloworld.methods.helloworld().call()
    expect(message).toEqual('hello world')
  })
})