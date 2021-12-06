// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './LPToken.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/utils/math/Math.sol";

contract ThePool is LPToken {
  IERC20 private _tokenA;
  IERC20 private _tokenB;

  event AddLiquidity(address indexed provider, uint amount);
  event RemoveLiquidity(address indexed provider, uint amount);

  constructor(address tokenA, address tokenB) LPToken() {
    _tokenA = IERC20(tokenA);
    _tokenB = IERC20(tokenB);
  }

  function addLiquidity(uint amountA, uint amountB) public {

    address contractAddr = address(this);
    uint reserveA = _tokenA.balanceOf(contractAddr);
    uint reserveB = _tokenB.balanceOf(contractAddr);
    
    _tokenA.transferFrom(msg.sender, contractAddr, amountA);
    _tokenB.transferFrom(msg.sender, contractAddr, amountB);

    uint newReserveA = _tokenA.balanceOf(contractAddr);
    uint newReserveB = _tokenB.balanceOf(contractAddr);

    // reserveA * reserveB = k
    // newReserveA * newReserveB >= k
    require(newReserveA * newReserveB >= reserveA * reserveB, 'invalid K');

    uint totalSupply = totalSupply();
    uint lpTokenAmount = 0;
    if (totalSupply == 0) {
      lpTokenAmount = amountA;
    } else {
      lpTokenAmount = Math.min(amountA * totalSupply / reserveA, 
                                amountB * totalSupply / reserveB);
    }
    
    require(lpTokenAmount > 0, 'lptoken amount == 0');

    emit AddLiquidity(msg.sender, lpTokenAmount);
    _mint(msg.sender, lpTokenAmount);
  }

  function removeLiquidity(uint amount) public {
    require(balanceOf(msg.sender) >= amount, 'insufficient balance');

    address contractAddr = address(this);

    uint reserveA = _tokenA.balanceOf(contractAddr);
    uint reserveB = _tokenB.balanceOf(contractAddr);

    uint totalSupply = totalSupply();
    uint amountA = amount * reserveA / totalSupply;
    uint amountB = amount * reserveB / totalSupply;

    emit RemoveLiquidity(msg.sender, amount);

    _burn(msg.sender, amount);
    _tokenA.transfer(msg.sender, amountA);
    _tokenB.transfer(msg.sender, amountB);
  }

  function swapAForB(uint amountAIn, uint amountBOut) public {

    require(amountAIn > 0, 'insufficient amountA');
    require(amountBOut > 0, 'insufficient amountB');

    address contractAddr = address(this);

    uint reserveA = _tokenA.balanceOf(contractAddr);
    uint reserveB = _tokenB.balanceOf(contractAddr);
    
    _tokenA.transferFrom(msg.sender, address(this), amountAIn);
    _tokenB.transfer(msg.sender, amountBOut);

    uint newReserveA = _tokenA.balanceOf(contractAddr);
    uint newReserveB = _tokenB.balanceOf(contractAddr);

    // reserveA * reserveB = k
    // newReserveA * newReserveB >= k
    require(newReserveA * newReserveB >= reserveA * reserveB, 'invalid K');
  }

  function getAmountBByA(uint amountA) public view returns (uint) {
    require(amountA > 0, 'insufficient amount');

    address contractAddr = address(this);
    uint reserveA = _tokenA.balanceOf(contractAddr);
    uint reserveB = _tokenB.balanceOf(contractAddr);
    require(reserveA > 0 && reserveB > 0, 'insufficient liquidity');

    return amountA * reserveB / reserveA;
  }

  function swapBForA(uint amountBIn, uint amountAOut) public {

    require(amountBIn > 0, 'insufficient amountB');
    require(amountAOut > 0, 'insufficient amountA');

    address contractAddr = address(this);

    uint reserveA = _tokenA.balanceOf(contractAddr);
    uint reserveB = _tokenB.balanceOf(contractAddr);
    
    _tokenA.transfer(msg.sender, amountAOut);
    _tokenB.transferFrom(msg.sender, address(this), amountBIn);

    uint newReserveA = _tokenA.balanceOf(contractAddr);
    uint newReserveB = _tokenB.balanceOf(contractAddr);

    // reserveA * reserveB = k
    // newReserveA * newReserveB >= k
    require(newReserveA * newReserveB >= reserveA * reserveB, 'invalid K');
  }

  function getAmountAByB(uint amountB) public view returns (uint) {
    require(amountB > 0, 'insufficient amount');

    address contractAddr = address(this);
    uint reserveA = _tokenA.balanceOf(contractAddr);
    uint reserveB = _tokenB.balanceOf(contractAddr);
    require(reserveA > 0 && reserveB > 0, 'insufficient liquidity');

    return amountB * reserveA / reserveB;
  }
}