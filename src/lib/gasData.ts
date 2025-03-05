export interface GasPrice {
  network: string;
  symbol: string;
  standard: number;
  fast: number;
  instant: number;
  baseFee: number;
  usdPrice: number;
}

export interface NetworkData {
  id: string;
  name: string;
  icon: string;
  color: string;
  symbol: string;
  gasUnit: string;
  explorerUrl: string;
}

export interface Prediction {
  hour: number;
  price: number;
}

export interface HistoricalGasData {
  timestamp: string;
  gasPrice: number;
}

export const networks: NetworkData[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    gasUnit: "Gwei",
    color: "#627EEA",
    explorerUrl: "https://etherscan.io"
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    gasUnit: "Gwei",
    color: "#8247E5",
    explorerUrl: "https://polygonscan.com"
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    symbol: "ETH",
    gasUnit: "Gwei",
    color: "#28A0F0",
    explorerUrl: "https://arbiscan.io"
  },
  {
    id: "optimism",
    name: "Optimism",
    symbol: "ETH",
    gasUnit: "Gwei",
    color: "#FF0420",
    explorerUrl: "https://optimistic.etherscan.io"
  },
  {
    id: "base",
    name: "Base",
    symbol: "ETH",
    gasUnit: "Gwei",
    color: "#0052FF",
    explorerUrl: "https://basescan.org"
  }
];

// Mock gas data by network
export const mockGasPrices: Record<string, GasPrice> = {
  ethereum: {
    network: "ethereum",
    symbol: "ETH",
    standard: 32,
    fast: 48,
    instant: 56,
    baseFee: 31.2,
    usdPrice: 3140
  },
  polygon: {
    network: "polygon",
    symbol: "MATIC",
    standard: 78,
    fast: 124,
    instant: 175,
    baseFee: 72.6,
    usdPrice: 0.54
  },
  bsc: {
    network: "bsc",
    symbol: "BNB",
    standard: 5,
    fast: 6,
    instant: 7,
    baseFee: 5.1,
    usdPrice: 532
  },
  arbitrum: {
    network: "arbitrum",
    symbol: "ETH",
    standard: 0.1,
    fast: 0.15,
    instant: 0.2,
    baseFee: 0.1,
    usdPrice: 3140
  },
  optimism: {
    network: "optimism",
    symbol: "ETH",
    standard: 0.2,
    fast: 0.3,
    instant: 0.4,
    baseFee: 0.19,
    usdPrice: 3140
  }
};

// Mock transaction types
export const transactionTypes = [
  { id: "transfer", name: "Token Transfer", gasEstimate: 21000 },
  { id: "swap", name: "Token Swap", gasEstimate: 120000 },
  { id: "mint", name: "NFT Mint", gasEstimate: 165000 },
  { id: "approve", name: "Token Approval", gasEstimate: 45000 },
  { id: "stake", name: "Staking", gasEstimate: 100000 }
];

// Mock AI predictions for gas prices - predicts the next 24 hours
export const mockPredictions: Record<string, Prediction[]> = {
  ethereum: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    price: 30 + Math.sin(i * 0.5) * 20 + Math.random() * 5
  })),
  polygon: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    price: 75 + Math.sin(i * 0.5) * 40 + Math.random() * 10
  })),
  bsc: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    price: 5 + Math.sin(i * 0.5) * 2 + Math.random() * 1
  })),
  arbitrum: Array.from({ length: 24 }, (_, i) => ({
    hour: i, 
    price: 0.1 + Math.sin(i * 0.5) * 0.05 + Math.random() * 0.02
  })),
  optimism: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    price: 0.2 + Math.sin(i * 0.5) * 0.1 + Math.random() * 0.05
  }))
};

// Mock historical gas data for the past week
export const mockHistoricalData: Record<string, HistoricalGasData[]> = {
  ethereum: Array.from({ length: 7 * 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (7 * 24 - i) * 60 * 60 * 1000).toISOString(),
    gasPrice: 30 + Math.sin(i * 0.1) * 15 + Math.random() * 5
  })),
  polygon: Array.from({ length: 7 * 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (7 * 24 - i) * 60 * 60 * 1000).toISOString(),
    gasPrice: 70 + Math.sin(i * 0.1) * 30 + Math.random() * 15
  })),
  bsc: Array.from({ length: 7 * 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (7 * 24 - i) * 60 * 60 * 1000).toISOString(),
    gasPrice: 5 + Math.sin(i * 0.1) * 1.5 + Math.random() * 0.8
  })),
  arbitrum: Array.from({ length: 7 * 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (7 * 24 - i) * 60 * 60 * 1000).toISOString(),
    gasPrice: 0.1 + Math.sin(i * 0.1) * 0.04 + Math.random() * 0.02
  })),
  optimism: Array.from({ length: 7 * 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (7 * 24 - i) * 60 * 60 * 1000).toISOString(),
    gasPrice: 0.2 + Math.sin(i * 0.1) * 0.08 + Math.random() * 0.04
  }))
};

// Find optimum time in the next 24 hours
export function findOptimumTime(networkId: string): { hour: number; price: number } {
  const predictions = mockPredictions[networkId] || mockPredictions.ethereum;
  return predictions.reduce((min, p) => 
    p.price < min.price ? p : min, predictions[0]);
}

// Find maximum time in the next 24 hours
export function findMaximumTime(networkId: string): { hour: number; price: number } {
  const predictions = mockPredictions[networkId] || mockPredictions.ethereum;
  return predictions.reduce((max, p) => 
    p.price > max.price ? p : max, predictions[0]);
}

// Mock transaction history
export const mockTransactionHistory = [
  {
    hash: "0x7a6e9e123f3d5b4a8c3e9f1e2d1c0b9a8f7e6d5c",
    type: "Token Transfer",
    status: "success",
    time: "2 hours ago",
    gasUsed: 21000,
    gasFee: 0.0012,
    network: "ethereum"
  },
  {
    hash: "0x8b7f0f234g4e6b5c2d3e0f1f2e3d4c5b6a7f8e9d",
    type: "Token Swap",
    status: "success",
    time: "5 hours ago",
    gasUsed: 118432,
    gasFee: 0.0068,
    network: "ethereum"
  },
  {
    hash: "0x9c8g1g345h5f7c3e4f2g3e4d5c6b7a8f9e0d1c",
    type: "NFT Mint",
    status: "success",
    time: "Yesterday",
    gasUsed: 165280,
    gasFee: 0.0095,
    network: "ethereum"
  },
  {
    hash: "0x0d9h2h456i6g8d4f5g3f4e5d6c7b8a9f0e1d2c",
    type: "Token Approval",
    status: "success",
    time: "3 days ago",
    gasUsed: 45132,
    gasFee: 0.0026,
    network: "ethereum"
  }
];

// Calculate estimate fee in USD
export function calculateFeeInUSD(gasLimit: number, gasPrice: number, network: string): number {
  const { symbol, usdPrice } = mockGasPrices[network] || mockGasPrices.ethereum;
  
  // Convert to proper units based on network
  let ethCost;
  
  if (network === "ethereum" || network === "arbitrum" || network === "optimism") {
    // ETH uses Gwei, 1 Gwei = 10^9 Wei, 1 ETH = 10^18 Wei
    ethCost = (gasLimit * gasPrice * 10**9) / 10**18;
  } else if (network === "polygon") {
    // Similar to ETH but with MATIC
    ethCost = (gasLimit * gasPrice * 10**9) / 10**18;
  } else if (network === "bsc") {
    // BNB uses Gwei like ETH
    ethCost = (gasLimit * gasPrice * 10**9) / 10**18;
  } else {
    ethCost = 0;
  }
  
  return ethCost * usdPrice;
}
