// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TheContract {
  event Transfer(address indexed fromAddr, address indexed toAddr, uint amount);

  function transfer(address toAddr, uint amount) public {
    // Code to make a tranfer is here
    // Emit the event Tranfer to notify subscriber outside chain
    emit Transfer(msg.sender, toAddr, amount);
  }

  function transferForm(address fromAddr, address toAddr, uint amount) public {
     // Code to make a tranfer is here
    // Emit the event Tranfer to notify subscriber outside chain
    emit Transfer(fromAddr, toAddr, amount);
  }
}