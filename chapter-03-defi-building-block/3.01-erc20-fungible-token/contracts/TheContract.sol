// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract TheContract {
  IERC20 private _token;
  mapping(address => uint) _balances;

  constructor(address tokenAddr) {
    _token = IERC20(tokenAddr);
  }

  function deposit(uint amount) public {
    _balances[msg.sender] += amount;
    _token.transferFrom(msg.sender, address(this), amount);
  }

  function withdraw(uint amount) public {
    require(_balances[msg.sender] >= amount, 'amount > balance');
    _balances[msg.sender] -= amount;
    _token.transfer(msg.sender, amount);
  }
}