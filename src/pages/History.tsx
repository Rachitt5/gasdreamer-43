
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Clock, Filter, AlertCircle, RefreshCw } from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { networks } from "@/lib/gasData";
import { useQuery } from "@tanstack/react-query";
import { getTransactionHistory } from "@/lib/gasOptimizer";

const History = () => {
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
  
  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
    toast.success(`Switched to ${network.charAt(0).toUpperCase() + network.slice(1)} network`);
  };
  
  const { data: transactions, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['transaction-history', selectedNetwork],
    queryFn: () => getTransactionHistory(selectedNetwork),
    refetchOnMount: true,
    staleTime: 5000, // Refresh data more frequently
  });

  // Auto-refresh data
  useEffect(() => {
    // Refresh immediately when network changes
    refetch();
    
    // Set up interval to refresh every 20 seconds
    const intervalId = setInterval(() => {
      refetch();
    }, 20000);
    
    return () => clearInterval(intervalId);
  }, [selectedNetwork, refetch]);

  // Determine explorer URL based on network
  const getExplorerUrl = (hash: string, network: string) => {
    const networkData = networks.find(n => n.id === network);
    if (!networkData || !networkData.explorerUrl) {
      return `https://etherscan.io/tx/${hash}`;
    }
    return `${networkData.explorerUrl}/tx/${hash}`;
  };

  // Add verification for block hash connectivity
  const verifyBlockHash = (hash: string) => {
    if (!hash || hash.length < 66) {
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onNetworkChange={handleNetworkChange} />
      
      <main className="container px-4 sm:px-6 pt-24 pb-16 mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              Transaction History
            </h1>
            <p className="text-md text-muted-foreground max-w-3xl">
              Track and monitor your past transactions and gas savings
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="w-full md:w-auto" 
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filter Transactions
            </Button>
          </div>
        </div>
        
        <Card className="gas-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <CardDescription>Your most recent blockchain transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3 mt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border rounded-lg p-3 animate-pulse h-20"></div>
                ))}
              </div>
            ) : transactions && transactions.length === 0 ? (
              <div className="h-64 flex items-center justify-center flex-col">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <p className="text-center text-muted-foreground">No transactions found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  Refresh
                </Button>
              </div>
            ) : (
              <div className="space-y-3 mt-2">
                {transactions?.map((tx, index) => (
                  <div 
                    key={tx.hash} 
                    className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        {tx.status === "success" ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : tx.status === "pending" ? (
                          <Clock className="h-4 w-4 text-primary animate-pulse" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{tx.type}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {tx.network}
                          </Badge>
                          {tx.status === "pending" && (
                            <Badge variant="outline" className="ml-2 text-xs bg-amber-500/10 text-amber-500 border-amber-500/10">
                              Pending
                            </Badge>
                          )}
                          {tx.optimized && (
                            <Badge variant="outline" className="ml-2 text-xs bg-primary/10 text-primary border-primary/10">
                              Optimized
                            </Badge>
                          )}
                          {!verifyBlockHash(tx.hash) && (
                            <Badge variant="outline" className="ml-2 text-xs bg-destructive/10 text-destructive border-destructive/10">
                              Hash Issue
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            {truncateAddress(tx.hash)}
                          </span>
                          {verifyBlockHash(tx.hash) ? (
                            <a 
                              href={getExplorerUrl(tx.hash, tx.network)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex"
                            >
                              <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground cursor-pointer" />
                            </a>
                          ) : (
                            <span className="ml-1 text-xs text-destructive">Not connected</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <Badge variant="outline" className="w-fit bg-gas-low/10 text-gas-low border-gas-low/10">
                        {tx.gasFee.toFixed(6)} {networks.find(n => n.id === tx.network)?.symbol || 'ETH'}
                      </Badge>
                      <span className="text-xs text-muted-foreground mt-1">
                        {tx.time} • {tx.gasUsed.toLocaleString()} gas used
                      </span>
                      {tx.savings > 0 && (
                        <span className="text-xs text-gas-low mt-1">
                          Saved: {tx.savings.toFixed(6)} {networks.find(n => n.id === tx.network)?.symbol || 'ETH'}
                        </span>
                      )}
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
