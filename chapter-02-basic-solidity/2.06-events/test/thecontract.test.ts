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
  it('can emit the Transfer event when transfer money', async () => {
    const actors = await testActors(web3)

    const amount = toWei("100")
    // 1. Send transfer transactions
    await theContract.methods.transfer(actors.acc2Addr, amount).send(actors.acc1Tx)
    await theContract.methods.transfer(actors.acc1Addr, amount).send(actors.acc2Tx)

    // 2. Filter the events
    const events = await theContract.getPastEvents('Transfer', {
      filter: {},
      fromBlock: 0,
    })
    expect(events.length).toEqual(2)
    expect(events[0].returnValues['fromAddr']).toEqual(actors.acc1Addr)
    expect(events[0].returnValues['toAddr']).toEqual(actors.acc2Addr)
    expect(fromWei(events[0].returnValues['amount'])).toEqual('100')

    expect(events[1].returnValues['fromAddr']).toEqual(actors.acc2Addr)
    expect(events[1].returnValues['toAddr']).toEqual(actors.acc1Addr)
    expect(fromWei(events[1].returnValues['amount'])).toEqual('100')
  })

})