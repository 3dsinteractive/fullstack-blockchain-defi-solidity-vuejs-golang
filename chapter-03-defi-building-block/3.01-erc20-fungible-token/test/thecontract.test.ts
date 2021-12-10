import expect from 'expect'
import ganache from 'ganache-cli'
import { AbiItem } from 'web3-utils'
import { TheContract } from '../types/web3-v1-contracts/TheContract'
import TheContractContract from '../build/contracts/TheContract.json'
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

let theContract: TheContract
let myToken: MyToken

beforeEach(async () => {
  const actors = await testActors(web3)

  // 1. Deploy myToken contract
  myToken = new web3.eth.Contract(MyTokenContract.abi as AbiItem[]) as any as MyToken
  myToken = await myToken.deploy({data: MyTokenContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as MyToken

  // 2. Get myToken address
  const myTokenAddr = myToken.options.address

  // 3. Deploy theContract contract
  theContract = new web3.eth.Contract(TheContractContract.abi as AbiItem[]) as any as TheContract
  theContract = await theContract.deploy({data: TheContractContract.bytecode, arguments:[myTokenAddr]})
    .send(actors.ownerTx) as any as TheContract

  // 4. Mint 1000 MyToken for each actors
  const amount = toWei('1000')
  await myToken.methods.mint(actors.acc1Addr, amount).send(actors.ownerTx)
  await myToken.methods.mint(actors.acc2Addr, amount).send(actors.ownerTx)
})

describe('My Token', () => {
  it('can be transfered from A to B', async () => {
    const actors = await testActors(web3)
    
    // 1. Acccount1 transfer to Account2 for 100 MyTokens
    const amount = toWei('100')
    await myToken.methods.transfer(actors.acc2Addr, amount).send(actors.acc1Tx)
    const balAcc1 = await myToken.methods.balanceOf(actors.acc1Addr).call()
    const balAcc2 = await myToken.methods.balanceOf(actors.acc2Addr).call()
    expect(fromWei(balAcc1)).toEqual('900')
    expect(fromWei(balAcc2)).toEqual('1100')
  })
})

describe('The Contract', () => {
  it('can deposit and withdraw', async () => {
    const actors = await testActors(web3)
    // 1. Approve TheContract to transfer 100 MyToken
    const amount = toWei('100')
    const theContractAddr = theContract.options.address
    await myToken.methods.approve(theContractAddr, amount).send(actors.acc1Tx)
    await theContract.methods.deposit(amount).send(actors.acc1Tx)
    // Check balance of theContract for MyToken
    let balAcc1 = await myToken.methods.balanceOf(actors.acc1Addr).call()
    let balContract = await myToken.methods.balanceOf(theContractAddr).call()
    expect(fromWei(balAcc1)).toEqual('900')
    expect(fromWei(balContract)).toEqual('100')

    // 2. Withdraw from theContract and check balance again
    await theContract.methods.withdraw(amount).send(actors.acc1Tx)
    balAcc1 = await myToken.methods.balanceOf(actors.acc1Addr).call()
    balContract = await myToken.methods.balanceOf(theContractAddr).call()
    expect(fromWei(balAcc1)).toEqual('1000')
    expect(fromWei(balContract)).toEqual('0')
  })

})