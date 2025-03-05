
import { useState, useEffect } from "react";
import { Check, Clock, TrendingDown, Flame, Loader2 } from "lucide-react";
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
      console.error(error);
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
      
      setDeploymentStatus("success");
      
      // Close modal after successful deployment
      setTimeout(() => {
        onOpenChange(false);
        resetState();
      }, 3000);
      
    } catch (error) {
      setDeploymentStatus("error");
      toast.error("Deployment failed. Please try again.");
      console.error(error);
    }
  };

  const resetState = () => {
    setStep("select");
    setSelectedTxTypes([]);
    setOptimizationResult(null);
    setDeploymentStatus("idle");
  };

  const handleClose = () => {
    onOpenChange(false);
    resetState();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "select" && "Select Transactions to Optimize"}
            {step === "optimize" && "Optimizing Gas Fees"}
            {step === "review" && "Optimization Results"}
            {step === "deploy" && "Deploying Transaction"}
          </DialogTitle>
          <DialogDescription>
            {step === "select" && "Choose which transactions you want to optimize. Bundling multiple transactions can save more gas."}
            {step === "optimize" && "Our AI is finding the best parameters to minimize your gas fees..."}
            {step === "review" && "Review your optimized transaction details before deploying"}
            {step === "deploy" && "Submitting your transaction to the blockchain..."}
          </DialogDescription>
        </DialogHeader>

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

        {step === "optimize" && (
          <div className="py-10 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              Our AI is analyzing current gas prices and finding the optimal parameters for your transaction...
            </p>
          </div>
        )}

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
                <p className="text-center text-muted-foreground text-sm">
                  Your transaction has been submitted and will be processed shortly.
                </p>
              </>
            )}
            
            {deploymentStatus === "error" && (
              <>
                <div className="rounded-full bg-destructive/10 p-4 mb-4">
                  <Flame className="h-8 w-8 text-destructive" />
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
              <Button onClick={() => setStep("deploy")} className="ml-2" disabled={deploymentStatus === "pending"}>
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
