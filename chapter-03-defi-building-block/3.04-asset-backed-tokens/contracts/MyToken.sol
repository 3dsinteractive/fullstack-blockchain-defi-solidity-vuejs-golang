// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MyToken is Ownable, ERC20 {
  IERC20 private _asset;

  constructor(address backAssetAddr) ERC20('MyToken', 'MyToken') {
    _asset = IERC20(backAssetAddr);
  }

  function deposit(uint amount) public {
    require(_asset.balanceOf(msg.sender) >= amount, 'balance too low');
    _asset.transferFrom(msg.sender, address(this), amount);
    _mint(msg.sender, amount);
  }

  function withdraw(uint amount) public {
    require(balanceOf(msg.sender) >= amount, 'balance too low');
    _asset.transfer(msg.sender, amount);
    _burn(msg.sender, amount);
  }
}