
import { toast } from "sonner";
import { transactionTypes, mockGasPrices, networks } from "./gasData";
import { formatGwei, formatUSD, calculateFeeInUSD } from "./utils";

interface OptimizationResult {
  originalFee: number;
  optimizedFee: number;
  savings: number;
  suggestedGasPrice: number;
  suggestedTime: Date;
  bundled: boolean;
}

export interface Transaction {
  hash: string;
  type: string;
  status: string;
  time: string;
  gasUsed: number;
  gasFee: number;
  network: string;
  optimized?: boolean;
  savings?: number;
}

// Store deployed transactions to ensure they show up in history
const deployedTransactions: Record<string, Transaction[]> = {};

// Create a more realistic transaction hash
const generateTransactionHash = () => {
  return "0x" + Array.from({length: 64}, () => 
    Math.floor(Math.random() * 16).toString(16)).join('');
};

const generateMockTransactions = (networkId: string, count: number = 10): Transaction[] => {
  const network = networks.find(n => n.id === networkId) || networks[0];
  const txTypes = transactionTypes.map(t => t.name);
  const timeframes = ["Just now", "2 minutes ago", "15 minutes ago", "1 hour ago", "3 hours ago", "Yesterday", "2 days ago"];
  
  // Include deployed transactions first
  const deployed = deployedTransactions[networkId] || [];
  
  // Generate additional random transactions if needed
  const additional = count - deployed.length;
  const randomTransactions = additional > 0 ? Array.from({ length: additional }, (_, i) => {
    const hash = generateTransactionHash();
    
    const type = txTypes[Math.floor(Math.random() * txTypes.length)];
    
    const txType = transactionTypes.find(t => t.name === type);
    const gasUsed = txType ? txType.gasEstimate : 100000;
    
    const baseGasPrice = mockGasPrices[networkId]?.standard || 30;
    const actualGasPrice = baseGasPrice * (0.8 + Math.random() * 0.4);
    
    const gasFee = Number(((gasUsed * actualGasPrice * 10**9) / 10**18).toFixed(4));
    
    const time = timeframes[Math.floor(Math.random() * timeframes.length)];
    
    const optimized = Math.random() > 0.5;
    
    const savings = optimized ? Number((gasFee * (0.1 + Math.random() * 0.3)).toFixed(4)) : 0;
    
    return {
      hash,
      type,
      status: "success",
      time,
      gasUsed,
      gasFee,
      network: networkId,
      optimized,
      savings
    };
  }) : [];
  
  return [...deployed, ...randomTransactions];
};

const transactionCache: Record<string, Transaction[]> = {};

/**
 * Get transaction history for a network
 */
export async function getTransactionHistory(networkId: string, limit?: number): Promise<Transaction[]> {
  // If we have deployed transactions, include them first
  if (deployedTransactions[networkId] && deployedTransactions[networkId].length > 0) {
    if (!transactionCache[networkId]) {
      transactionCache[networkId] = [];
    }
    
    // Add deployed transactions to the front of the cache
    const existingHashes = new Set(transactionCache[networkId].map(tx => tx.hash));
    for (const tx of deployedTransactions[networkId]) {
      if (!existingHashes.has(tx.hash)) {
        transactionCache[networkId].unshift(tx);
        existingHashes.add(tx.hash);
      }
    }
  }
  
  // Generate or use cached transactions
  if (!transactionCache[networkId] || transactionCache[networkId].length < 5) {
    transactionCache[networkId] = generateMockTransactions(networkId, 20);
  }
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return limit ? transactionCache[networkId].slice(0, limit) : transactionCache[networkId];
}

/**
 * Optimizes gas fee by analyzing current prices and finding the best time to transact
 */
export async function optimizeGasFee(
  networkId: string,
  transactionType: string,
  gasLimit?: number
): Promise<OptimizationResult> {
  const txType = transactionTypes.find((t) => t.id === transactionType) || transactionTypes[0];
  const gasEstimate = gasLimit || txType.gasEstimate;
  
  const currentGasPrice = mockGasPrices[networkId]?.standard || 30;
  
  const savingsPercentage = 0.2 + Math.random() * 0.2;
  const optimizedGasPrice = currentGasPrice * (1 - savingsPercentage);
  
  const originalFee = calculateFeeInUSD(gasEstimate, currentGasPrice, networkId);
  const optimizedFee = calculateFeeInUSD(gasEstimate, optimizedGasPrice, networkId);
  const savings = originalFee - optimizedFee;
  
  const hoursToWait = Math.floor(1 + Math.random() * 7);
  const suggestedTime = new Date();
  suggestedTime.setHours(suggestedTime.getHours() + hoursToWait);
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    originalFee,
    optimizedFee,
    savings,
    suggestedGasPrice: optimizedGasPrice,
    suggestedTime,
    bundled: Math.random() > 0.5
  };
}

/**
 * Bundle multiple transactions together to save gas
 */
export async function bundleTransactions(
  networkId: string,
  transactions: string[] = []
): Promise<OptimizationResult> {
  const totalGas = transactions.length > 0
    ? transactions.reduce((sum, txType) => {
        const tx = transactionTypes.find(t => t.id === txType);
        return sum + (tx?.gasEstimate || 100000);
      }, 0)
    : 250000;
  
  const currentGasPrice = mockGasPrices[networkId]?.standard || 30;
  
  const savingsPercentage = 0.3 + Math.random() * 0.3;
  const optimizedGasPrice = currentGasPrice;
  
  const optimizedGas = totalGas * (1 - savingsPercentage);
  
  const originalFee = calculateFeeInUSD(totalGas, currentGasPrice, networkId);
  const optimizedFee = calculateFeeInUSD(optimizedGas, optimizedGasPrice, networkId);
  const savings = originalFee - optimizedFee;
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    originalFee,
    optimizedFee,
    savings,
    suggestedGasPrice: optimizedGasPrice,
    suggestedTime: new Date(),
    bundled: true
  };
}

/**
 * Deploy optimized transaction to the blockchain
 */
export async function deployOptimizedTransaction(
  networkId: string,
  transactionType: string,
  optimizedGasPrice: number
): Promise<{hash: string, status: string}> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const hash = generateTransactionHash();
  
  const txType = transactionTypes.find((t) => t.id === transactionType);
  if (txType) {
    const gasEstimate = txType.gasEstimate;
    const currentGasPrice = mockGasPrices[networkId]?.standard || 30;
    const gasFee = Number(((gasEstimate * optimizedGasPrice * 10**9) / 10**18).toFixed(4));
    const originalGasFee = Number(((gasEstimate * currentGasPrice * 10**9) / 10**18).toFixed(4));
    const savings = Number((originalGasFee - gasFee).toFixed(4));
    
    const newTransaction = {
      hash,
      type: txType.name,
      status: "success",
      time: "Just now",
      gasUsed: gasEstimate,
      gasFee,
      network: networkId,
      optimized: true,
      savings
    };
    
    // Store the deployed transaction
    if (!deployedTransactions[networkId]) {
      deployedTransactions[networkId] = [];
    }
    deployedTransactions[networkId].unshift(newTransaction);
    
    // Also update the cache if it exists
    if (transactionCache[networkId]) {
      transactionCache[networkId].unshift(newTransaction);
    }
  }
  
  toast.success("Transaction deployed successfully!");
  
  return {
    hash,
    status: "success"
  };
}

/**
 * Set a gas price alert for when prices drop below threshold
 */
export async function setGasAlert(
  networkId: string,
  threshold: number,
  notify: boolean = true
): Promise<{success: boolean, alertId: string}> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (notify) {
    toast.success(`Alert set for ${formatGwei(threshold)} Gwei`);
  }
  
  return {
    success: true,
    alertId: "alert_" + Math.random().toString(36).substring(2, 10)
  };
}
