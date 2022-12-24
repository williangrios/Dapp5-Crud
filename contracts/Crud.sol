//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Crud{
    struct User{
        uint256 id ;
        string name;
    }

    User[] public users;
    uint256 public nextId = 1;

    function create(string memory name) public {
        users.push( User(nextId, name));
        nextId ++;
    }

    function read(uint256 id) view public returns (uint, string memory){
        uint i = find(id);
        return (users[i].id, users[i].name);
    }

    function update(uint256 id, string memory newName) public {
        uint i = find(id);
        users[i].name = newName;
    }

    function destroy(uint256 id) public {
        uint i = find(id);
        delete users[i];
    }

    function find(uint256 id) view internal returns(uint ){
        for(uint256 i = 0; i < users.length; i++){
            if(users[i].id == id){
                return i;
            }
        }
        revert('User does not exists');
    }

    function getAll() view public returns(User[] memory ){
        return users;
    }

}