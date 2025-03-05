
import { useQuery } from "@tanstack/react-query";
import { deployOptimizedTransaction } from "@/lib/gasOptimizer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { networks } from "@/lib/gasData";
import { useState } from "react";
import { toast } from "sonner";

interface TransactionHistoryProps {
  networkId: string;
}

export function TransactionHistory({ networkId }: TransactionHistoryProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<null | {
    status: 'success' | 'pending' | 'failed';
    hash: string;
  }>(null);

  const handleDeployContract = async () => {
    try {
      setIsDeploying(true);
      setDeploymentStatus({ status: 'pending', hash: '' });
      toast.info("Deploying smart contract...");

      // Use a mock gas price for the demo
      const optimizedGasPrice = 20 + Math.random() * 10;
      
      // Deploy a sample transaction 
      const result = await deployOptimizedTransaction(
        networkId,
        "swap", // Using swap as a sample transaction type
        optimizedGasPrice
      );
      
      console.log("Smart contract deployment result:", result);
      
      if (result.status === "success") {
        setDeploymentStatus({ status: 'success', hash: result.hash });
        toast.success("Smart contract deployed successfully!");
      } else {
        setDeploymentStatus({ status: 'failed', hash: result.hash });
        toast.error("Smart contract deployment failed");
      }
    } catch (error) {
      console.error("Deployment error:", error);
      setDeploymentStatus({ status: 'failed', hash: '' });
      toast.error("Smart contract deployment failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsDeploying(false);
    }
  };

  // Get explorer URL for the network
  const getExplorerUrl = (hash: string, network: string) => {
    const networkData = networks.find(n => n.id === network);
    if (!networkData || !networkData.explorerUrl) {
      return `https://etherscan.io/tx/${hash}`;
    }
    return `${networkData.explorerUrl}/tx/${hash}`;
  };

  return (
    <Card className="gas-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Smart Contract Deployment</CardTitle>
        <CardDescription>Test deploying a smart contract with gas optimization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 gap-4">
          {deploymentStatus ? (
            <div className="w-full border rounded-lg p-4 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    deploymentStatus.status === "success" ? "bg-primary/10" : 
                    deploymentStatus.status === "pending" ? "bg-amber-500/10" : 
                    "bg-destructive/10"
                  }`}>
                    {deploymentStatus.status === "success" ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : deploymentStatus.status === "pending" ? (
                      <Clock className="h-5 w-5 text-amber-500 animate-pulse" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">Smart Contract Deployment</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">
                        {networkId}
                      </Badge>
                      {deploymentStatus.status === "pending" && (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/10">
                          Pending
                        </Badge>
                      )}
                      {deploymentStatus.status === "success" && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/10">
                          Success
                        </Badge>
                      )}
                      {deploymentStatus.status === "failed" && (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/10">
                          Failed
                        </Badge>
                      )}
                    </div>
                    {deploymentStatus.hash && (
                      <div className="mt-2">
                        <a 
                          href={getExplorerUrl(deploymentStatus.hash, networkId)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          View on Block Explorer
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No contract deployments yet
            </div>
          )}
          
          <Button 
            variant="default" 
            className="mt-4 w-full" 
            onClick={handleDeployContract}
            disabled={isDeploying}
          >
            {isDeploying ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Deploying Contract...
              </>
            ) : (
              <>
                Deploy Smart Contract
              </>
            )}
          </Button>
          
          <Button variant="outline" className="w-full" asChild>
            <Link to="/optimize">
              Gas Optimization Settings <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
