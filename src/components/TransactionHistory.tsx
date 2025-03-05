
import { useQuery } from "@tanstack/react-query";
import { getTransactionHistory } from "@/lib/gasOptimizer";
import { truncateAddress } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ExternalLink, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { networks } from "@/lib/gasData";
import { useEffect } from "react";

interface TransactionHistoryProps {
  networkId: string;
  limit?: number;
  showViewAll?: boolean;
}

export function TransactionHistory({ networkId, limit = 3, showViewAll = true }: TransactionHistoryProps) {
  const { data: transactions, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['transaction-history', networkId, limit],
    queryFn: () => getTransactionHistory(networkId, limit),
    refetchOnWindowFocus: true,
    staleTime: 10000, // Refetch after 10 seconds
  });

  // Auto-refresh transactions when component mounts or network changes
  useEffect(() => {
    refetch();
    
    // Set up interval to refresh transactions every 30 seconds
    const intervalId = setInterval(() => {
      refetch();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [networkId, refetch]);

  // Determine explorer URL based on network
  const getExplorerUrl = (hash: string, network: string) => {
    const networkData = networks.find(n => n.id === network);
    if (!networkData || !networkData.explorerUrl) {
      return `https://etherscan.io/tx/${hash}`;
    }
    return `${networkData.explorerUrl}/tx/${hash}`;
  };

  return (
    <Card className="gas-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <CardDescription>Your recent transaction history</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refetch()} 
            disabled={isFetching}
            className={isFetching ? "animate-spin" : ""}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {showViewAll && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/history">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3 mt-2">
            {[1, 2, 3].map((i) => (
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
                      {tx.optimized && (
                        <Badge variant="outline" className="ml-2 text-xs bg-primary/10 text-primary border-primary/10">
                          Optimized
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-muted-foreground">
                        {truncateAddress(tx.hash)}
                      </span>
                      <a 
                        href={getExplorerUrl(tx.hash, tx.network)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex"
                      >
                        <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground cursor-pointer" />
                      </a>
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
  );
}
