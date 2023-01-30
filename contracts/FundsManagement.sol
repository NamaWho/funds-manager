// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./PriceConverter.sol";

error NotOwner();

contract FundManagement {
    using PriceConverter for uint256;

    address private immutable owner;
    mapping (address => uint256) private balances;

    // Minimum deposit amount 5$
    uint256 public constant MINIMUM_USD = 5 * 1e18;

    modifier onlyOwner {
        if(msg.sender != owner){revert NotOwner();}
        _;  
    }

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        require(msg.value.getConversionRate() >= MINIMUM_USD, "Did not receive enough ETH");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        payable(msg.sender).transfer(amount);
        balances[msg.sender] -= amount;
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender].getConversionRate();
        //return getConversionRate(balances[msg.sender]);
    }

    function getBalanceOfFunder(address funder) public view onlyOwner returns(uint256){
        return balances[funder].getConversionRate();
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    receive() external payable {
        deposit();
    }

    fallback() external payable {
        deposit();
    }
}
