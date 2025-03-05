
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { networks } from "@/lib/gasData";
import { toast } from "sonner";
import { deployOptimizedTransaction } from "@/lib/gasOptimizer";

const History = () => {
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployments, setDeployments] = useState<Array<{
    hash: string;
    status: 'success' | 'pending' | 'failed';
    network: string;
    timestamp: Date;
  }>>([]);
  
  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
    toast.success(`Switched to ${network.charAt(0).toUpperCase() + network.slice(1)} network`);
  };
  
  const handleDeployContract = async () => {
    try {
      setIsDeploying(true);
      const newDeployment = {
        hash: '',
        status: 'pending' as const,
        network: selectedNetwork,
        timestamp: new Date()
      };
      
      setDeployments(prev => [newDeployment, ...prev]);
      toast.info("Deploying smart contract...");

      // Use a mock gas price for the demo
      const optimizedGasPrice = 20 + Math.random() * 10;
      
      // Deploy a sample transaction 
      const result = await deployOptimizedTransaction(
        selectedNetwork,
        "swap", // Using swap as a sample transaction type
        optimizedGasPrice
      );
      
      console.log("Smart contract deployment result:", result);
      
      if (result.status === "success") {
        setDeployments(prev => [
          {hash: result.hash, status: 'success', network: selectedNetwork, timestamp: new Date()},
          ...prev.slice(1)
        ]);
        toast.success("Smart contract deployed successfully!");
      } else {
        setDeployments(prev => [
          {hash: result.hash || '', status: 'failed', network: selectedNetwork, timestamp: new Date()},
          ...prev.slice(1)
        ]);
        toast.error("Smart contract deployment failed");
      }
    } catch (error) {
      console.error("Deployment error:", error);
      setDeployments(prev => [
        {hash: '', status: 'failed', network: selectedNetwork, timestamp: new Date()},
        ...prev.slice(1)
      ]);
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

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onNetworkChange={handleNetworkChange} />
      
      <main className="container px-4 sm:px-6 pt-24 pb-16 mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              Smart Contract Verification
            </h1>
            <p className="text-md text-muted-foreground max-w-3xl">
              Deploy and verify smart contracts on various networks
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              variant="default" 
              className="w-full md:w-auto" 
              onClick={handleDeployContract}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                "Deploy Contract"
              )}
            </Button>
          </div>
        </div>
        
        <Card className="gas-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contract Deployments</CardTitle>
            <CardDescription>History of your smart contract deployments</CardDescription>
          </CardHeader>
          <CardContent>
            {deployments.length === 0 ? (
              <div className="h-64 flex items-center justify-center flex-col">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <p className="text-center text-muted-foreground">No deployments found</p>
                <Button 
                  onClick={handleDeployContract}
                  disabled={isDeploying}
                  variant="outline" 
                  className="mt-4"
                >
                  Deploy Smart Contract
                </Button>
              </div>
            ) : (
              <div className="space-y-3 mt-2">
                {deployments.map((deployment, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up ${
                      deployment.status === "pending" ? "border-amber-500/50 bg-amber-50/10" : ""
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                        deployment.status === "success" ? "bg-primary/10" : 
                        deployment.status === "pending" ? "bg-amber-500/10" : 
                        "bg-destructive/10"
                      }`}>
                        {deployment.status === "success" ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : deployment.status === "pending" ? (
                          <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">Smart Contract</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {deployment.network}
                          </Badge>
                          {deployment.status === "pending" && (
                            <Badge variant="outline" className="ml-2 text-xs bg-amber-500/10 text-amber-500 border-amber-500/10">
                              Pending
                            </Badge>
                          )}
                          {deployment.status === "failed" && (
                            <Badge variant="outline" className="ml-2 text-xs bg-destructive/10 text-destructive border-destructive/10">
                              Failed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(deployment.timestamp)}
                          </span>
                        </div>
                        {deployment.hash && (
                          <div className="flex items-center mt-1">
                            <a 
                              href={getExplorerUrl(deployment.hash, deployment.network)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm flex items-center"
                            >
                              View on Explorer <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default History;
