import expect from 'expect'
import ganache from 'ganache-cli'
import { AbiItem } from 'web3-utils'
import { TheContract } from '../types/web3-v1-contracts/TheContract'
import TheContractContract from '../build/contracts/TheContract.json'
import { TheLand } from '../types/web3-v1-contracts/TheLand'
import TheLandContract from '../build/contracts/TheLand.json'
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
let theLand: TheLand

beforeEach(async () => {
  const actors = await testActors(web3)

  // 1. Deploy theLand contract
  theLand = new web3.eth.Contract(TheLandContract.abi as AbiItem[]) as any as TheLand
  theLand = await theLand.deploy({data: TheLandContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as TheLand

  // 2. Get address of the land contract
  const theLandAddr = theLand.options.address

  // 3. Deploy theContract contract
  theContract = new web3.eth.Contract(TheContractContract.abi as AbiItem[]) as any as TheContract
  theContract = await theContract.deploy({data: TheContractContract.bytecode, arguments:[theLandAddr]})
    .send(actors.ownerTx) as any as TheContract
})

describe('The Contract', () => {
  it('can transfer from a to b', async () => {
    const actors = await testActors(web3)
    
    // 1. Mint land URI = https://metaland.me/land_id/1
    let landId = 1
    let landURI = `https://metaland.local/land_id/${landId}`
    await theLand.methods.mint(actors.acc1Addr, landId, landURI).send(actors.ownerTx)
    
    // Check owner of landId 1
    let ownerAddr = await theLand.methods.ownerOf(landId).call()
    expect(ownerAddr).toEqual(actors.acc1Addr)

    // Check landURI of landId 1
    let resLandURI = await theLand.methods.tokenURI(landId).call()
    expect(resLandURI).toEqual(landURI)

    // 2. Tranfer from account 1 to account 2
    await theLand.methods.transferFrom(actors.acc1Addr, actors.acc2Addr, landId).send(actors.acc1Tx)
    ownerAddr = await theLand.methods.ownerOf(landId).call()
    expect(ownerAddr).toEqual(actors.acc2Addr)
  })

  it('can deposit and withdraw land from the contract', async () => {
    const actors = await testActors(web3)

    // 1. Mint land URI = https://metaland.me/land_id/2
    let landId = 2
    let landURI = `https://metaland.local/land_id/${landId}`
    await theLand.methods.mint(actors.acc1Addr, landId, landURI).send(actors.ownerTx)
    
    // Check owner of landId 2
    let ownerAddr = await theLand.methods.ownerOf(landId).call()
    expect(ownerAddr).toEqual(actors.acc1Addr)

    // Check landURI of landId 2
    let resLandURI = await theLand.methods.tokenURI(landId).call()
    expect(resLandURI).toEqual(landURI)

    // 2. Deposit land to theContract
    const theContractAddr = theContract.options.address
    await theLand.methods.approve(theContractAddr, landId).send(actors.acc1Tx)
    await theContract.methods.deposit(landId).send(actors.acc1Tx)

    ownerAddr = await theLand.methods.ownerOf(landId).call()
    expect(ownerAddr).toEqual(theContractAddr)

    await theContract.methods.withdraw(landId).send(actors.acc1Tx)
    ownerAddr = await theLand.methods.ownerOf(landId).call()
    expect(ownerAddr).toEqual(actors.acc1Addr)
  })
})