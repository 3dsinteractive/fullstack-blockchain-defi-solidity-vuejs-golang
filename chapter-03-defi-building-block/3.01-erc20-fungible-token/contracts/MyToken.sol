// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MyToken is Ownable, ERC20 {
  constructor() ERC20('MyToken', 'MyToken') {
  }

  function mint(address receiver, uint amount) public onlyOwner {
    _mint(receiver, amount);
  }
}