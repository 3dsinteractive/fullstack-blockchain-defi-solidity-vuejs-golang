// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TheContract {
  // 1. Primitive types
  // Unsigned integer
  // uint8   ranges from 0 to 2 ** 8 - 1
  // uint16  ranges from 0 to 2 ** 16 - 1
  // ..
  // uint256 ranges from 0 to 2 ** 256 - 1
  uint private _myUint; // uint is the alias for uint256
  uint8 private _myUint8;
  uint16 private _myUint16;
  uint32 private _myUint32;
  uint64 private _myUint64;
  uint128 private _myUint128;
  uint256 private _myUint256; // 256 bit is the 32 bytes that EVM will read/write at one opcode

  // Signed integer
  int private _myInt;
  int8 private _myInt8;
  int16 private _myInt16;
  int32 private _myInt32;
  int64 private _myInt64;
  int128 private _myInt128;
  int256 private _myInt256;

  // Boolean
  bool private _myBool; // 1 byte

  // Address
  address private _myAddress; // 20 bytes, ex. 0x976bEDa7b8a604986f60144a003f9A1DB62A36E1

  // String
  string private _myString;

  // Bytes array
  bytes private _myBytes; // Dynamic array of bytes
  // bytes1[] private _myBytes1; // DONT USE THIS, use bytes instead, because it will padding with 31 bytes
  bytes1 private _myBytes1;
  bytes8 private _myBytes8;
  bytes16 private _myBytes16;
  bytes20 private _myBytes20;
  bytes32 private _myBytes32;

  // 2. Constant can't be modified
  uint private constant MY_PERCENT = 100;
  address private constant MY_WALLET_ADDR = 0x976bEDa7b8a604986f60144a003f9A1DB62A36E1;

  // 3. Immutable can't be modified outside constructor
  uint private immutable _myPercent;

  // 4. Constructor
  address private _contractOwner;
  constructor(uint myPercent) {
    _contractOwner = msg.sender;
    _myPercent = myPercent;
  }
  
  // 5. public functions, can be called from outside
  address private _theAddr;

  function getTheAddr() public view returns(address) {
    return _theAddr;
  }

  function setTheAddr(address theAddr) public {
    _theAddr = theAddr;
  } 

  // external function, can be called from outside (ONLY)
  // when function is external the calldata storage is support for optimization
  function externalSetTheAddr(address theAddr, string calldata myString) external {
    _theAddr = theAddr;
    _myString = myString;
  }

  // 6. private functions, cannot be called from outside this smartcontract
  function _getTheAddr() private view returns(address) {
    return _theAddr;
  }

  function _setTheAddr(address theAddr) private {
    _theAddr = theAddr;
  }

  // 7. internal functions, can be called only from inherited contract
  function readTheAddr() internal view returns(address) {
    return _theAddr;
  }

  // 8. pure functions, is function that don't modify state variable
  function doubleOf(uint value) public pure returns(uint) {
    return value * 2;
  }

  // 9. Function can return multiple values
  function getTheAddrAndMe() public view returns(address, address) {
    return (_theAddr, _myAddress);
  }

  function useGetTheAddrAndMe() public view returns(address, address) {
    (address theAddr, address myAddr) = getTheAddrAndMe();
    return (theAddr, myAddr);
  }

  // 10. Mapping is key/value type like hashmap or dictionary
  mapping(address => bool) private _adminAddrs;

  function setAdmin(address addr, bool value) public {
    _adminAddrs[addr] = value;
  }

  function isAdmin(address addr) public view returns(bool) {
    return _adminAddrs[addr];
  }

  function removeAdmin(address addr) public {
    delete _adminAddrs[addr]; // The delete statement will reset the value to default
  }

  // 11. Array is list of iterable value
  address[] private _allAdmins;

  function addAdmin(address addr) public {
    _allAdmins.push(addr);
  }

  function getAdminAt(uint i) public view returns(address) {
    return _allAdmins[i];
  }

  function deleteAdminAt(uint i) public {
    delete _allAdmins[i]; // The delete statement will reset the value to default
  }

  function howManyAdmins() public view returns(uint) {
    uint count = 0;
    // Be careful of the length of _allAdmins
    // If there are possible of very large items of _allAdmins
    // This function will consume a lot of gas
    for (uint i=0; i<_allAdmins.length; i++) {
      if (_allAdmins[i] != address(0)) {
        count += 1;
      }
    }
    return count;
  }

  // 12. Enum is the int value start from 0 to N
  // In this cases Default = 0, NoVote = 1, No = 2 and Yes = 3
  enum VoteStatus {
    Default,
    NoVote,
    No,
    Yes
  }

  mapping(address => VoteStatus) private _voteStatuses;

  function vote(VoteStatus status) public {
    // msg.sender is the global variable that get the address of sender 
    // which is a wallet address or contract address who call this function
    _voteStatuses[msg.sender] = status; 
  }

  function getVote(address voterAddr) public view returns(VoteStatus) {
    return _voteStatuses[voterAddr];
  }

  // 13. Simple Struct
  enum MemberLevel {
    Normal,
    VIP,
    SuperVIP
  }

  struct Member {
    address walletAddr;
    uint point;
    MemberLevel level;
  }

  mapping(address => Member) private _members;

  function register() public virtual {
    _members[msg.sender] = Member({
      walletAddr: msg.sender,
      point: 100,
      level: MemberLevel.Normal
    });

    // We can create struct using this style but not recommended
    // _members[msg.sender] = Member(
    //   msg.sender,  
    //   MemberLevel.Normal
    // );
  }

  // 14. If / Else
  function promoteMember(address memberAddr) public {
    require(msg.sender == _contractOwner, 'owner only');
    Member storage member = _members[memberAddr];

    if (member.point > 2000) {
      member.level = MemberLevel.VIP;
    } else if (member.point > 6000) {
      member.level = MemberLevel.SuperVIP;
    }
  }

  // 15. Complex Struct (struct with mapping)
  struct VoteRequest {
    address requester;
    uint voteStartBlock;
    uint voteEndBlock;
    mapping(address => VoteStatus) voters;
    uint numberOfVoters;
  }

  mapping(uint => VoteRequest) private _voteRequests;

  function createVote(uint voteId, uint numberOfVoteBlocks) public {
    // Check if the vote id is duplicated
    require(_voteRequests[voteId].requester == address(0), 'vote id is duplicated');
    // The storage mean, the voteRequest is the reference to the 
    // same voteRequest reside in _voteRequests[voteId]
    VoteRequest storage voteRequest = _voteRequests[voteId];
    voteRequest.requester = msg.sender;
    voteRequest.voteStartBlock = block.number;
    voteRequest.voteEndBlock = block.number + numberOfVoteBlocks;
  }

  function vote(uint voteId, VoteStatus status) public {
    require(status != VoteStatus.Default, 'vote status can be 1 (NoVote), 2 (No), 3 (Yes)');

    VoteRequest storage voteRequest = _voteRequests[voteId];
    require(voteRequest.requester != address(0), 'vote id is not exists');
    require(voteRequest.voters[msg.sender] == VoteStatus.Default, 'already vote');
    require(block.number <= voteRequest.voteEndBlock, 'vote is ended');

    voteRequest.voters[msg.sender] = status;
    voteRequest.numberOfVoters += 1;
  }
}

// 16. Contract Inheritance
contract ChildContract is TheContract{
  constructor(uint myPercent) TheContract(myPercent) {
    // Internal function can be called from child contract
    readTheAddr();
    // Private function cannot be called from child contract
    // _getTheAddr();
  }
}

// 17. Multiple Inheritance
contract BaseContract {
  struct Land {
    uint landId;
    uint price;
  }
  
  struct Player {
    address playerWallet;
    uint level;
  }

  Land[] internal _lands;
  mapping(address => Player) internal _players;

  function register() public virtual {
    _players[msg.sender] = Player({
      playerWallet: msg.sender,
      level: 1
    });
  }
}

contract GameContract is BaseContract, TheContract {
  
  constructor(uint myPercent) BaseContract() TheContract(myPercent) {
    // We can use Land struct from BaseContract
    _lands.push(Land({
      landId: 0,
      price: 5 * 10 ** 18
    }));
  }

  // If there are same function name in both inherited contracts
  // we need to specify override(list of all contracts that has the same function)
  // the function in based contract also need to specify virtual keyword
  function register() public override(BaseContract, TheContract) {
    // super.register is the TheContract.register() (The right most contract in the inheritance list)
    super.register();
    // If we want to call function from specific contract
    BaseContract.register();
  }

}