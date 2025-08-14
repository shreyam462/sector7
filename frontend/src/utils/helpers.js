import { ethers } from 'ethers';

/**
 * Format an Ethereum address for display
 * @param {string} address - The address to format
 * @param {number} chars - Number of characters to show from start/end
 * @returns {string} Formatted address
 */
export const formatAddress = (address, chars = 4) => {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

/**
 * Format a number for display
 * @param {string|number} value - The value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimals = 2) => {
  if (!value) return '0';
  return parseFloat(value).toFixed(decimals);
};

/**
 * Check if an address is valid
 * @param {string} address - The address to validate
 * @returns {boolean} True if valid
 */
export const isValidAddress = (address) => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

/**
 * Convert Wei to Ether
 * @param {string} weiValue - Value in Wei
 * @returns {string} Value in Ether
 */
export const weiToEther = (weiValue) => {
  try {
    return ethers.formatEther(weiValue);
  } catch {
    return '0';
  }
};

/**
 * Convert Ether to Wei
 * @param {string} etherValue - Value in Ether
 * @returns {string} Value in Wei
 */
export const etherToWei = (etherValue) => {
  try {
    return ethers.parseEther(etherValue.toString());
  } catch {
    return '0';
  }
};

/**
 * Format token amount with proper decimals
 * @param {string} amount - Token amount
 * @param {number} decimals - Token decimals
 * @returns {string} Formatted amount
 */
export const formatTokenAmount = (amount, decimals = 18) => {
  try {
    return ethers.formatUnits(amount, decimals);
  } catch {
    return '0';
  }
};

/**
 * Parse token amount with proper decimals
 * @param {string} amount - Token amount
 * @param {number} decimals - Token decimals
 * @returns {string} Parsed amount
 */
export const parseTokenAmount = (amount, decimals = 18) => {
  try {
    return ethers.parseUnits(amount.toString(), decimals);
  } catch {
    return '0';
  }
};

/**
 * Wait for a specified amount of time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the specified time
 */
export const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

/**
 * Get transaction URL for block explorer
 * @param {string} txHash - Transaction hash
 * @param {number} chainId - Chain ID
 * @returns {string} Block explorer URL
 */
export const getTxUrl = (txHash, chainId = 1) => {
  const explorers = {
    1: 'https://etherscan.io/tx/',
    5: 'https://goerli.etherscan.io/tx/',
    137: 'https://polygonscan.com/tx/',
    31337: '#' // Localhost - no explorer
  };
  
  return `${explorers[chainId] || explorers[1]}${txHash}`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Generate a random match ID
 * @param {string} player1 - Player 1 address
 * @param {string} player2 - Player 2 address
 * @returns {string} Match ID
 */
export const generateMatchId = (player1, player2) => {
  const timestamp = Date.now();
  const data = `${player1}-${player2}-${timestamp}`;
  return ethers.keccak256(ethers.toUtf8Bytes(data));
};