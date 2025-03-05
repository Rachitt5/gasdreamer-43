
import { useState } from "react";
import { Header } from "@/components/Header";
import { GasOptimizeModal } from "@/components/GasOptimizeModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Calculator } from "lucide-react";
import { transactionTypes } from "@/lib/gasData";
import { toast } from "sonner";

const Optimize = () => {
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
  const [optimizeModalOpen, setOptimizeModalOpen] = useState(false);
  const [selectedTxType, setSelectedTxType] = useState(transactionTypes[0].id);

  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
    toast.success(`Switched to ${network.charAt(0).toUpperCase() + network.slice(1)} network`);
  };

  const handleOptimize = (txType: string) => {
    setSelectedTxType(txType);
    setOptimizeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onNetworkChange={handleNetworkChange} />
      
      <main className="container px-4 sm:px-6 pt-24 pb-16 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Optimize Gas Fees
          </h1>
          <p className="text-md text-muted-foreground max-w-3xl">
            Choose a transaction type to optimize or bundle multiple transactions together to save gas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactionTypes.map((type, index) => (
            <Card key={type.id} className="gas-card animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{type.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-3">
                  <Calculator className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">Estimated Gas: {type.gasEstimate.toLocaleString()}</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleOptimize(type.id)}
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Optimize Now
                </Button>
              </CardContent>
            </Card>
          ))}

          <Card className="gas-card animate-fade-in-up" style={{ animationDelay: `${transactionTypes.length * 100}ms` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Bundle Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-3">
                <Calculator className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Save up to 40% on gas fees</span>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setOptimizeModalOpen(true)}
              >
                <Rocket className="h-4 w-4 mr-2" />
                Bundle Transactions
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <GasOptimizeModal 
        open={optimizeModalOpen} 
        onOpenChange={setOptimizeModalOpen} 
        networkId={selectedNetwork}
        transactionType={selectedTxType}
      />
    </div>
  );
};

export default Optimize;
