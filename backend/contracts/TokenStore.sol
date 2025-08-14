// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./GameToken.sol";

contract TokenStore is Ownable, ReentrancyGuard {
    IERC20 public immutable usdtToken;
    GameToken public immutable gameToken;
    uint256 public gtPerUsdtRate; // 1 USDT = 1 GT (e.g., 1e18)

    event Purchase(address indexed buyer, uint256 usdtAmount, uint256 gtAmount);
    event USDTWithdrawn(address indexed to, uint256 amount);

    constructor(address _usdtToken, address _gameToken, uint256 _gtPerUsdtRate) Ownable(msg.sender) {
        require(_usdtToken != address(0), "Invalid USDT address");
        require(_gameToken != address(0), "Invalid GameToken address");
        
        usdtToken = IERC20(_usdtToken);
        gameToken = GameToken(_gameToken);
        gtPerUsdtRate = _gtPerUsdtRate;
    }

    function buy(uint256 usdtAmount) external nonReentrant {
        require(usdtAmount > 0, "Amount must be greater than zero");
        
        uint256 gtAmount = (usdtAmount * gtPerUsdtRate) / 1e6;
        
        usdtToken.transferFrom(msg.sender, address(this), usdtAmount);
        
        gameToken.mint(msg.sender, gtAmount);
        
        emit Purchase(msg.sender, usdtAmount, gtAmount);
    }

    function withdrawUSDT(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than zero");
        require(usdtToken.balanceOf(address(this)) >= amount, "Insufficient USDT balance");
        
        require(usdtToken.transfer(to, amount), "USDT transfer failed");
        emit USDTWithdrawn(to, amount);
    }

    function getUSDTBalance() external view returns (uint256) {
        return usdtToken.balanceOf(address(this));
    }
}