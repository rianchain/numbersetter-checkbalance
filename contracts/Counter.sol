// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;

    event NumberSet(uint256 number);
    error NumberTooHigh(uint256 number);
    error NumberTooLow(uint256 number);

    function setNumber(uint256 newNumber) public {
        number = newNumber;
        emit NumberSet(newNumber);
    }

    function increment() public {
        if (number >= 10) {
            revert NumberTooHigh(number);
        }
        number++;
        emit NumberSet(number);
    }

    function decrement() public {
        if (number <= 0) {
            revert NumberTooLow(number);
        }
        number--;
        emit NumberSet(number);
    }
}
