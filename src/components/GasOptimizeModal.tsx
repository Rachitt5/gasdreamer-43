
import { useState, useEffect } from "react";
import { Check, Clock, TrendingDown, Flame, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { formatGwei, formatUSD } from "@/lib/utils";
import { optimizeGasFee, bundleTransactions, deployOptimizedTransaction } from "@/lib/gasOptimizer";
import { transactionTypes } from "@/lib/gasData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface GasOptimizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  networkId: string;
  transactionType?: string;
}

export function GasOptimizeModal({ 
  open, 
  onOpenChange,
  networkId = "ethereum",
  transactionType
}: GasOptimizeModalProps) {
  const [step, setStep] = useState<"select" | "optimize" | "review" | "deploy">("select");
  const [selectedTxTypes, setSelectedTxTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [deployedHash, setDeployedHash] = useState<string | null>(null);

  // When opening modal with a transaction type, pre-select it
  useEffect(() => {
    if (transactionType && open) {
      setSelectedTxTypes([transactionType]);
    }
  }, [transactionType, open]);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      let result;
      
      if (selectedTxTypes.length > 1) {
        // Bundle multiple transactions
        result = await bundleTransactions(networkId, selectedTxTypes);
        toast.success("Transactions bundled to save gas!");
      } else {
        // Optimize single transaction
        const txType = selectedTxTypes[0] || transactionType || "transfer";
        result = await optimizeGasFee(networkId, txType);
        toast.success("Gas optimization complete!");
      }
      
      setOptimizationResult(result);
      setStep("review");
    } catch (error) {
      toast.error("Optimization failed. Please try again.");
      console.error("Optimization error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    if (!optimizationResult) return;
    
    setDeploymentStatus("pending");
    try {
      const txType = selectedTxTypes[0] || transactionType || "transfer";
      const result = await deployOptimizedTransaction(
        networkId,
        txType,
        optimizationResult.suggestedGasPrice
      );
      
      setDeployedHash(result.hash);
      setDeploymentStatus("success");
      
      // Close modal after successful deployment with a delay
      setTimeout(() => {
        onOpenChange(false);
        resetState();
      }, 3000);
      
    } catch (error) {
      setDeploymentStatus("error");
      toast.error("Deployment failed. Please try again.");
      console.error("Deployment error:", error);
    }
  };

  const resetState = () => {
    setStep("select");
    setSelectedTxTypes([]);
    setOptimizationResult(null);
    setDeploymentStatus("idle");
    setDeployedHash(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetState();
  };

  // Update title based on step and deployment status
  const getTitle = () => {
    if (step === "select") return "Select Transactions to Optimize";
    if (step === "optimize") return "Optimizing Gas Fees";
    if (step === "review") return "Optimization Results";
    if (step === "deploy") {
      if (deploymentStatus === "pending") return "Deploying Transaction";
      if (deploymentStatus === "success") return "Transaction Deployed";
      if (deploymentStatus === "error") return "Deployment Failed";
      return "Deploy Transaction";
    }
    return "Optimize Gas";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {step === "select" && "Choose which transactions you want to optimize. Bundling multiple transactions can save more gas."}
            {step === "optimize" && "Our AI is finding the best parameters to minimize your gas fees..."}
            {step === "review" && "Review your optimized transaction details before deploying"}
            {step === "deploy" && deploymentStatus === "pending" && "Submitting your transaction to the blockchain..."}
            {step === "deploy" && deploymentStatus === "success" && "Your transaction has been successfully deployed to the blockchain"}
            {step === "deploy" && deploymentStatus === "error" && "There was an error deploying your transaction. Please try again."}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Select Transaction Types */}
        {step === "select" && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              {transactionTypes.map((type) => (
                <div
                  key={type.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-primary/5 transition-colors ${
                    selectedTxTypes.includes(type.id) ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => {
                    if (selectedTxTypes.includes(type.id)) {
                      setSelectedTxTypes(selectedTxTypes.filter(id => id !== type.id));
                    } else {
                      setSelectedTxTypes([...selectedTxTypes, type.id]);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      {type.id === "transfer" && <TrendingDown className="h-4 w-4 text-primary" />}
                      {type.id === "swap" && <Flame className="h-4 w-4 text-primary" />}
                      {(type.id !== "transfer" && type.id !== "swap") && <Clock className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-muted-foreground">~{type.gasEstimate.toLocaleString()} gas</div>
                    </div>
                  </div>
                  {selectedTxTypes.includes(type.id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Optimize */}
        {step === "optimize" && (
          <div className="py-10 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              Our AI is analyzing current gas prices and finding the optimal parameters for your transaction...
            </p>
          </div>
        )}

        {/* Step 3: Review Results */}
        {step === "review" && optimizationResult && (
          <div className="space-y-4 py-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Original Fee</span>
                <span className="font-medium line-through">{formatUSD(optimizationResult.originalFee)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Optimized Fee</span>
                <span className="font-medium text-primary">{formatUSD(optimizationResult.optimizedFee)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-medium">You Save</span>
                <span className="font-bold text-gas-low">{formatUSD(optimizationResult.savings)} ({Math.round((optimizationResult.savings / optimizationResult.originalFee) * 100)}%)</span>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="text-sm font-medium mb-2">Optimization Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gas Price</span>
                  <span className="font-medium">{formatGwei(optimizationResult.suggestedGasPrice)} Gwei</span>
                </div>
                {optimizationResult.bundled && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Transaction Bundling</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gas-low/10 text-gas-low">Enabled</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Best Time to Execute</span>
                  <span className="font-medium">
                    {optimizationResult.suggestedTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Deploy */}
        {step === "deploy" && (
          <div className="py-6 flex flex-col items-center justify-center">
            {deploymentStatus === "pending" && (
              <>
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-center text-muted-foreground">
                  Deploying your optimized transaction to the blockchain...
                </p>
              </>
            )}
            
            {deploymentStatus === "success" && (
              <>
                <div className="rounded-full bg-gas-low/10 p-4 mb-4">
                  <Check className="h-8 w-8 text-gas-low" />
                </div>
                <p className="text-center font-medium mb-1">Transaction Successfully Deployed!</p>
                <p className="text-center text-muted-foreground text-sm mb-3">
                  Your transaction has been submitted and will be processed shortly.
                </p>
                {deployedHash && (
                  <div className="text-center text-xs text-muted-foreground">
                    Transaction Hash: {deployedHash.substring(0, 12)}...{deployedHash.substring(deployedHash.length - 8)}
                  </div>
                )}
              </>
            )}
            
            {deploymentStatus === "error" && (
              <>
                <div className="rounded-full bg-destructive/10 p-4 mb-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-center font-medium mb-1">Transaction Failed</p>
                <p className="text-center text-muted-foreground text-sm">
                  There was an error deploying your transaction. Please try again.
                </p>
              </>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-between items-center">
          {step === "select" && (
            <>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button 
                onClick={() => {
                  if (selectedTxTypes.length === 0) {
                    toast.error("Please select at least one transaction type");
                    return;
                  }
                  setStep("optimize");
                  handleOptimize();
                }}
                disabled={loading || selectedTxTypes.length === 0}
              >
                Optimize Gas
              </Button>
            </>
          )}
          
          {step === "optimize" && (
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
          )}
          
          {step === "review" && (
            <>
              <Button variant="outline" onClick={() => setStep("select")}>
                Back
              </Button>
              <Button 
                onClick={() => {
                  setStep("deploy");
                  handleDeploy();
                }} 
                className="ml-2" 
                disabled={deploymentStatus === "pending"}
              >
                Deploy Now
              </Button>
            </>
          )}
          
          {step === "deploy" && (
            <Button 
              onClick={handleClose} 
              disabled={deploymentStatus === "pending"}
              variant={deploymentStatus === "success" ? "default" : "outline"}
            >
              {deploymentStatus === "success" ? "Close" : "Cancel"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
