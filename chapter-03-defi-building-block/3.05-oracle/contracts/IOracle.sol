// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOracle {
  struct Price {
    uint blocknumber;
    uint data;
  }

  function addUpdater(address updaterAddr, bool canUpdate) external;
  function updatePrice(bytes32 key, uint price) external;
  function getPrice(bytes32 key) external returns(Price memory);
}