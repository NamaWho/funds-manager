// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing the same interface from NPM (as a package)
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// This allows to call functions also on variables, like msg.value.getConversionRate()
library PriceConverter {

    function getPrice() internal view returns (uint256) {
        // Need to interact with Chainlink Data Feed
        // ABI
        // Address (Goerly network) - https://docs.chain.link/docs/data-feeds/price-feeds/addresses/#Goerli%20Testnet [0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e]

        AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);

        (, int256 price,,,) = priceFeed.latestRoundData();

        // Remembering that an ETH has 18 decimals 
        // 1.0000000000000000000 [18 zeros]
        // Instead ETH in terms of USD
        // 3000.00000000 [8 decimals]
        return uint256(price * 1e10);
    }

    function getConversionRate(uint256 ethAmount) internal view returns (uint256) {
        uint256 ethPrice = getPrice();

        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;

        return ethAmountInUsd;
    }
}