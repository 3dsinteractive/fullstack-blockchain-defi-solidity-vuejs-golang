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

  constructor() {
    _ownerAddr = msg.sender;
  }

  function mint(uint amount) public {
    require(msg.sender == _ownerAddr, 'owner only');
    require(amount > 0, 'amount must > 0');
    require(_totalSupply + amount > _totalSupply, 'total supply overflow');
    _totalSupply += amount;
  }

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