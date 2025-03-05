
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Clock, Filter } from "lucide-react";
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
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transaction-history', selectedNetwork],
    queryFn: () => getTransactionHistory(selectedNetwork),
  });

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
          <Button variant="outline" className="mt-4 md:mt-0 w-full md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filter Transactions
          </Button>
        </div>
        
        <Card className="gas-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <CardDescription>Your most recent blockchain transactions</CardDescription>
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
                        <CheckCircle className="h-4 w-4 text-primary" />
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
                            href={`https://etherscan.io/tx/${tx.hash}`} 
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
                        {tx.gasFee} {networks.find(n => n.id === tx.network)?.symbol || 'ETH'}
                      </Badge>
                      <span className="text-xs text-muted-foreground mt-1">
                        {tx.time} • {tx.gasUsed.toLocaleString()} gas used
                      </span>
                      {tx.savings > 0 && (
                        <span className="text-xs text-gas-low mt-1">
                          Saved: {tx.savings} {networks.find(n => n.id === tx.network)?.symbol || 'ETH'}
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
