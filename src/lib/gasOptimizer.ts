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
const deployedTransactions: Record<string, Transaction[]> = {
  ethereum: [],
  polygon: [],
  arbitrum: [],
  optimism: [],
  base: []
};

// Cache for mock transactions
const transactionCache: Record<string, Transaction[]> = {};

// Create a valid transaction hash with proper format
const generateTransactionHash = () => {
  return "0x" + Array.from({length: 64}, () => 
    Math.floor(Math.random() * 16).toString(16)).join('');
};

// Simulate smart contract interaction with better reliability and logging
const simulateContractCall = async (networkId: string): Promise<boolean> => {
  console.log(`Simulating contract call on network: ${networkId}`);
  
  // Simulate network latency and contract execution
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Increase success rate to 98% for better reliability
  const success = Math.random() < 0.98;
  
  console.log(`Contract call simulation result: ${success ? 'success' : 'failed'}`);
  
  // Log more details for debugging
  if (!success) {
    console.error(`Contract call failed on ${networkId} network. This is a simulated failure.`);
  }
  
  return success;
};

// Generate mock transactions with more realistic data
const generateMockTransactions = (networkId: string, count: number = 10): Transaction[] => {
  const network = networks.find(n => n.id === networkId) || networks[0];
  const txTypes = transactionTypes.map(t => t.name);
  const timeframes = ["Just now", "2 minutes ago", "15 minutes ago", "1 hour ago", "3 hours ago", "Yesterday", "2 days ago"];
  
  return Array.from({ length: count }, (_, i) => {
    const hash = generateTransactionHash();
    
    const type = txTypes[Math.floor(Math.random() * txTypes.length)];
    
    const txType = transactionTypes.find(t => t.name === type);
    const gasUsed = txType ? txType.gasEstimate : 100000;
    
    const baseGasPrice = mockGasPrices[networkId]?.standard || 30;
    const actualGasPrice = baseGasPrice * (0.8 + Math.random() * 0.4);
    
    const gasFee = Number(((gasUsed * actualGasPrice * 10**9) / 10**18).toFixed(6));
    
    const time = timeframes[Math.floor(Math.random() * timeframes.length)];
    
    const optimized = Math.random() > 0.5;
    
    const savings = optimized ? Number((gasFee * (0.1 + Math.random() * 0.3)).toFixed(6)) : 0;
    
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
  });
};

/**
 * Get transaction history for a network
 */
export async function getTransactionHistory(networkId: string, limit?: number): Promise<Transaction[]> {
  console.log(`Getting transaction history for network: ${networkId}`);
  
  // Initialize the network array if it doesn't exist
  if (!deployedTransactions[networkId]) {
    deployedTransactions[networkId] = [];
  }
  
  // Get deployed transactions for this network
  const deployed = deployedTransactions[networkId] || [];
  
  console.log(`Deployed transactions count for ${networkId}: ${deployed.length}`);
  if (deployed.length > 0) {
    console.log(`Latest deployed transaction hash: ${deployed[0].hash}`);
  }
  
  // Initialize or use cache
  if (!transactionCache[networkId]) {
    transactionCache[networkId] = generateMockTransactions(networkId, 20);
  }
  
  // Combine deployed transactions with cached ones, ensuring no duplicates
  let combinedTransactions = [...deployed];
  
  // Add non-duplicate cached transactions
  const existingHashes = new Set(deployed.map(tx => tx.hash));
  for (const tx of transactionCache[networkId]) {
    if (!existingHashes.has(tx.hash)) {
      combinedTransactions.push(tx);
    }
  }
  
  // Sort by newest first (based on timeframe text)
  combinedTransactions.sort((a, b) => {
    const timeOrder = ["Just now", "2 minutes ago", "15 minutes ago", "1 hour ago", "3 hours ago", "Yesterday", "2 days ago"];
    return timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time);
  });
  
  console.log(`Combined transactions count: ${combinedTransactions.length}`);
  
  // A small delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return limit ? combinedTransactions.slice(0, limit) : combinedTransactions;
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
  
  // Get real current gas prices from the mock data
  const currentGasPrice = mockGasPrices[networkId]?.standard || 30;
  
  // Calculate optimization with more realistic savings (15-25%)
  const savingsPercentage = 0.15 + Math.random() * 0.1;
  const optimizedGasPrice = currentGasPrice * (1 - savingsPercentage);
  
  const originalFee = calculateFeeInUSD(gasEstimate, currentGasPrice, networkId);
  const optimizedFee = calculateFeeInUSD(gasEstimate, optimizedGasPrice, networkId);
  const savings = originalFee - optimizedFee;
  
  // More realistic waiting time (1-3 hours)
  const hoursToWait = Math.floor(1 + Math.random() * 2);
  const suggestedTime = new Date();
  suggestedTime.setHours(suggestedTime.getHours() + hoursToWait);
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    originalFee,
    optimizedFee,
    savings,
    suggestedGasPrice: optimizedGasPrice,
    suggestedTime,
    bundled: Math.random() > 0.7 // Less likely to bundle
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
  
  // More realistic bundling savings (20-35%)
  const savingsPercentage = 0.2 + Math.random() * 0.15;
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
 * Deploy optimized transaction to the blockchain with improved error handling
 */
export async function deployOptimizedTransaction(
  networkId: string,
  transactionType: string,
  optimizedGasPrice: number
): Promise<{hash: string, status: string}> {
  console.log(`Deploying transaction on ${networkId} network for type: ${transactionType}`);
  
  // Create a pending transaction first so the UI can show it immediately
  const pendingHash = generateTransactionHash();
  const txType = transactionTypes.find((t) => t.id === transactionType);
  
  if (!txType) {
    console.error("Invalid transaction type:", transactionType);
    toast.error("Invalid transaction type");
    throw new Error("Invalid transaction type");
  }
  
  // Create a pending transaction
  const pendingTransaction: Transaction = {
    hash: pendingHash,
    type: txType.name,
    status: "pending",
    time: "Just now",
    gasUsed: txType.gasEstimate,
    gasFee: Number(((txType.gasEstimate * optimizedGasPrice * 10**9) / 10**18).toFixed(6)),
    network: networkId,
    optimized: true,
    savings: 0 // Will be calculated after "success"
  };
  
  // Initialize the network array if it doesn't exist
  if (!deployedTransactions[networkId]) {
    deployedTransactions[networkId] = [];
  }
  
  // Add the pending transaction to the BEGINNING of the array (newest first)
  deployedTransactions[networkId].unshift(pendingTransaction);
  
  console.log("Added pending transaction:", pendingTransaction);
  console.log("Current deployed transactions for network:", deployedTransactions[networkId]);
  
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Simulate contract interaction with proper error handling
    const contractCallSuccess = await simulateContractCall(networkId);
    
    if (!contractCallSuccess) {
      console.error("Smart contract execution failed");
      
      // Update the transaction to failed status
      const idx = deployedTransactions[networkId].findIndex(tx => tx.hash === pendingHash);
      if (idx !== -1) {
        deployedTransactions[networkId][idx].status = "failed";
        console.log("Updated transaction status to failed:", deployedTransactions[networkId][idx]);
      } else {
        console.error("Could not find pending transaction with hash:", pendingHash);
      }
      
      toast.error("Smart contract execution failed");
      throw new Error("Contract execution failed");
    }
    
    // Calculate the gas fees and savings
    const gasEstimate = txType.gasEstimate;
    const currentGasPrice = mockGasPrices[networkId]?.standard || 30;
    const gasFee = Number(((gasEstimate * optimizedGasPrice * 10**9) / 10**18).toFixed(6));
    const originalGasFee = Number(((gasEstimate * currentGasPrice * 10**9) / 10**18).toFixed(6));
    const savings = Number((originalGasFee - gasFee).toFixed(6));
    
    // Update the pending transaction to success
    const idx = deployedTransactions[networkId].findIndex(tx => tx.hash === pendingHash);
    if (idx !== -1) {
      deployedTransactions[networkId][idx].status = "success";
      deployedTransactions[networkId][idx].savings = savings;
      console.log("Updated transaction to success:", deployedTransactions[networkId][idx]);
    } else {
      console.error("Could not find pending transaction to update:", pendingHash);
      
      // If we can't find the transaction for some reason, add it as a new one
      const successfulTransaction: Transaction = {
        ...pendingTransaction,
        status: "success",
        savings: savings
      };
      
      deployedTransactions[networkId].unshift(successfulTransaction);
      console.log("Added new successful transaction:", successfulTransaction);
    }
    
    // Log the current state of deployed transactions
    console.log("Current deployed transactions count:", deployedTransactions[networkId].length);
    
    toast.success("Transaction deployed successfully!");
    
    return {
      hash: pendingHash,
      status: "success"
    };
  } catch (error) {
    console.error("Transaction deployment error:", error);
    
    // Ensure the transaction is marked as failed
    const idx = deployedTransactions[networkId].findIndex(tx => tx.hash === pendingHash);
    if (idx !== -1) {
      deployedTransactions[networkId][idx].status = "failed";
      console.log("Updated transaction status to failed:", deployedTransactions[networkId][idx]);
    } else {
      console.error("Could not find pending transaction with hash:", pendingHash);
    }
    
    toast.error("Transaction deployment failed: " + (error instanceof Error ? error.message : "Unknown error"));
    throw error;
  }
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
