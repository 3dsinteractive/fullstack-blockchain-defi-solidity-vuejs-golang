// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './IOracle.sol';

contract TheContract {
  
  IOracle private _oracle;

  event Swap(address indexed sender, uint amountIn, uint amountOut);

  constructor(address oracleAddr) {
    _oracle = IOracle(oracleAddr);
  }

  function swap(bytes32 poolId, uint amountIn) public {
    IOracle.Price memory price = _oracle.getPrice(poolId);
    require(block.number - price.blocknumber < 10, 'price is outdated');
    require(price.data > 0, 'no price set');
    uint amountOut = amountIn * price.data;
    
    emit Swap(msg.sender, amountIn, amountOut);
  }
}