// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract MockDEX {
    IERC20 public token;
    uint256 public reserveToken;
    uint256 public reserveEth;

    function initialize(address _token) external {
        token = IERC20(_token);
    }

    function addLiquidity(uint256 tokenAmount) external payable {
        require(msg.value > 0, "Send ETH to add liquidity");
        require(tokenAmount > 0, "Token amount required");
        // pull tokens
        bool ok = token.transferFrom(msg.sender, address(this), tokenAmount);
        require(ok, "token transfer failed");
        reserveToken += tokenAmount;
        reserveEth += msg.value;
    }

    // very simplified constant product approximation (no fee, no slippage protection)
    function buy() external payable {
        require(msg.value > 0, "Send ETH to buy tokens");
        require(reserveEth > 0 && reserveToken > 0, "No liquidity");
        uint256 tokenOut = (msg.value * reserveToken) / reserveEth;
        require(tokenOut <= reserveToken, "Not enough tokens in reserve");
        reserveEth += msg.value;
        reserveToken -= tokenOut;
        token.transfer(msg.sender, tokenOut);
    }

    function sell(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Specify tokens to sell");
        require(reserveEth > 0 && reserveToken > 0, "No liquidity");
        // pull tokens
        bool ok = token.transferFrom(msg.sender, address(this), tokenAmount);
        require(ok, "token transfer failed");
        uint256 ethOut = (tokenAmount * reserveEth) / reserveToken;
        require(ethOut <= reserveEth, "Not enough ETH in reserve");
        reserveToken += tokenAmount;
        reserveEth -= ethOut;
        payable(msg.sender).transfer(ethOut);
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveToken, reserveEth);
    }

    receive() external payable {}
}
