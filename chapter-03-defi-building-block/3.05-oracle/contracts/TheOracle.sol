// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './IOracle.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract TheOracle is Ownable, IOracle {

  mapping(address => bool) private _updaters;
  mapping(bytes32 => Price) private _prices;

  function addUpdater(address updaterAddr, bool canUpdate) public onlyOwner {
    _updaters[updaterAddr] = canUpdate;
  }

  function updatePrice(bytes32 key, uint price) public {
    require(_updaters[msg.sender] == true, 'updater only');
    _prices[key] = Price({
      blocknumber: block.number,
      data: price
    });
  }

  function getPrice(bytes32 key) public view returns(Price memory) {
    return _prices[key];
  }
}