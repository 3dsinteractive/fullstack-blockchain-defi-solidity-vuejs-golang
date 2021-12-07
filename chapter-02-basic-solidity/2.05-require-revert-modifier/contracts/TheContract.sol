// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TheContract {

  address private _ownerAddr;
  uint private _totalSupply;

  modifier ownerOnly() {
    require(msg.sender == _ownerAddr, 'owner only');
    _;
  }

  modifier mustNotZero(uint amount) {
    require(amount > 0, 'amount must > 0');
    _;
  }

  modifier mustNotOverflow(uint amount) {
    require(_totalSupply + amount > _totalSupply, 'total supply overflow');
    _;
  }

  // 1. Constructor will save owner address in the storage
  constructor() {
    _ownerAddr = msg.sender;
  }

  // 2. This mint function require 3 expression to valid
  //    - the caller must be owner only
  //    - non-zero amount
  //    - check for overflow after adding
  function mint(uint amount) public {
    require(msg.sender == _ownerAddr, 'owner only');
    require(amount > 0, 'amount must > 0');
    require(_totalSupply + amount > _totalSupply, 'total supply overflow');
    _totalSupply += amount;
  }

  // 3. This mint2 function is same as mint but use modifier to do the job
  //    Benefits:
  //    - Code is cleaner
  //    - Modifier can be reused across functions 
  //    - Modifier can be reused across contracts if we place modifier in base contract
  function mint2(uint amount) public 
    ownerOnly 
    mustNotZero(amount) 
    mustNotOverflow(amount) {
      
    _totalSupply += amount;
  }

  function getTotalSupply() public view returns(uint) {
    return _totalSupply;
  }
}