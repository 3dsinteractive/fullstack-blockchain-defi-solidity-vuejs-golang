import expect from 'expect'
import ganache from 'ganache-cli'
import { AbiItem } from 'web3-utils'
import { TokenA } from '~/types/web3-v1-contracts/TokenA'
import TokenAContract from '../build/contracts/TokenA.json'
import { TokenB } from '~/types/web3-v1-contracts/TokenB'
import TokenBContract from '../build/contracts/TokenB.json'
import { ThePool } from '../types/web3-v1-contracts/ThePool'
import ThePoolContract from '../build/contracts/ThePool.json'
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

let tokenA: TokenA
let tokenB: TokenB
let thePool: ThePool

beforeEach(async () => {
  const actors = await testActors(web3)

  // 1. Deploy TokenA contract
  tokenA = new web3.eth.Contract(TokenAContract.abi as AbiItem[]) as any as TokenA
  tokenA = await tokenA.deploy({data: TokenAContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as TokenA

  // 2. Deploy TokenB contract
  tokenB = new web3.eth.Contract(TokenBContract.abi as AbiItem[]) as any as TokenB
  tokenB = await tokenB.deploy({data: TokenBContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as TokenB

  // 3. Get TokenA and TokenB addresses
  const tokenAAddr = tokenA.options.address
  const tokenBAddr = tokenB.options.address

  // 4. Deploy theContract contract
  thePool = new web3.eth.Contract(ThePoolContract.abi as AbiItem[]) as any as ThePool
  thePool = await thePool.deploy({data: ThePoolContract.bytecode, arguments:[tokenAAddr, tokenBAddr]})
    .send(actors.ownerTx) as any as ThePool
})

describe('The Pool', () => {
  it('can add lp / remove lp and swap', async () => {
    const actors = await testActors(web3)

    const tokenAAmount = toWei('1000000')
    const tokenBAmount = toWei('2000000')
    // tokenA : tokenB = 1 : 2

    const thePoolAddr = thePool.options.address
    // 1. Mint tokenA and tokenB and add to LP
    await tokenA.methods.mint(tokenAAmount).send(actors.ownerTx)
    await tokenB.methods.mint(tokenBAmount).send(actors.ownerTx)
    await tokenA.methods.approve(thePoolAddr, tokenAAmount).send(actors.ownerTx)
    await tokenB.methods.approve(thePoolAddr, tokenBAmount).send(actors.ownerTx)
    await thePool.methods.addLiquidity(tokenAAmount, tokenBAmount).send(actors.ownerTx)

    // 2. Swap 10 tokenA => ~19.96 tokenB
    const amountAIn = toWei('10')
    const quotePrice = await thePool.methods.getAmountBByA(amountAIn).call()
    const amountBOut = parseInt(fromWei(quotePrice)) * 0.998 // set slippage
    await tokenA.methods.mint(amountAIn).send(actors.acc1Tx)
    await tokenA.methods.approve(thePoolAddr, amountAIn).send(actors.acc1Tx)
    await thePool.methods.swapAForB(amountAIn, toWei(`${amountBOut}`)).send(actors.acc1Tx)
    const finalAmountB = await tokenB.methods.balanceOf(actors.acc1Addr).call()
    expect(fromWei(finalAmountB)).toEqual(`${amountBOut}`)

    // 3. Remove LP
    let lpTokenAmount = await thePool.methods.balanceOf(actors.ownerAddr).call()
    await thePool.methods.removeLiquidity(lpTokenAmount).send(actors.ownerTx)
    lpTokenAmount = await thePool.methods.balanceOf(actors.ownerAddr).call()
    const balTokenA = await tokenA.methods.balanceOf(actors.ownerAddr).call()
    const balTokenB = await tokenB.methods.balanceOf(actors.ownerAddr).call()

    expect(fromWei(balTokenA)).toEqual('1000010')
    expect(fromWei(balTokenB)).toEqual('1999980.04')
  })
})