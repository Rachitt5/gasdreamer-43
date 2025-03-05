
import { mockTransactionHistory } from "@/lib/gasData";
import { truncateAddress } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ExternalLink } from "lucide-react";

export function TransactionHistory() {
  return (
    <Card className="gas-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <CardDescription>Your recent transaction history</CardDescription>
      </CardHeader>
      <CardContent>
        {mockTransactionHistory.length === 0 ? (
          <div className="h-64 flex items-center justify-center flex-col">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <p className="text-center text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {mockTransactionHistory.map((tx, index) => (
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
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-muted-foreground">
                        {truncateAddress(tx.hash)}
                      </span>
                      <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground cursor-pointer" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end">
                  <Badge variant="outline" className="w-fit bg-gas-low/10 text-gas-low border-gas-low/10">
                    {tx.gasFee} ETH
                  </Badge>
                  <span className="text-xs text-muted-foreground mt-1">
                    {tx.time} • {tx.gasUsed.toLocaleString()} gas used
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
