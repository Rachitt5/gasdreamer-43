
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { GasMeter } from "@/components/GasMeter";
import { PredictionChart } from "@/components/PredictionChart";
import { TransactionHistory } from "@/components/TransactionHistory";
import { GasOptimizeModal } from "@/components/GasOptimizeModal";
import { GasAlertModal } from "@/components/GasAlertModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Rocket, BadgePercent } from "lucide-react";
import { transactionTypes } from "@/lib/gasData";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
  const [optimizeModalOpen, setOptimizeModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
    toast.success(`Switched to ${network.charAt(0).toUpperCase() + network.slice(1)} network`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onNetworkChange={handleNetworkChange} />
      
      <main className="container px-4 sm:px-6 pt-24 pb-16 mx-auto">
        <div className="mb-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <div className="inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring bg-primary/10 text-primary hover:bg-primary/20">
              AI-Powered Gas Optimizer
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Save on Gas Fees with
            <span className="text-primary ml-2">GasSaver</span>
          </h1>
          <p className="text-md sm:text-lg text-muted-foreground max-w-3xl mx-auto md:mx-0">
            Optimize your blockchain transactions with AI-powered gas fee predictions and transaction bundling.
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[300px]">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-[300px] animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 w-1/3 bg-muted rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-8 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Gas Meter Section */}
            <div className="mb-6">
              <GasMeter networkId={selectedNetwork} />
            </div>
            
            {/* Charts and Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PredictionChart networkId={selectedNetwork} />
              </div>
              
              <div className="space-y-6">
                <Card className="gas-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">AI Optimizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Rocket className="h-4 w-4 text-primary mr-2" />
                          <span className="font-medium">Bundle Transactions</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Save up to 42% on gas by bundling multiple transactions together.
                        </p>
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => setOptimizeModalOpen(true)}
                        >
                          Optimize Now
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Gauge className="h-4 w-4 text-primary mr-2" />
                          <span className="font-medium">Gas Alert</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Get notified when gas fees drop below your target price.
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="sm"
                          onClick={() => setAlertModalOpen(true)}
                        >
                          Set Alert
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <BadgePercent className="h-4 w-4 text-primary mr-2" />
                          <span className="font-medium">Savings Summary</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="rounded-md bg-primary/5 p-2 text-center">
                            <span className="text-xs text-muted-foreground">Total Saved</span>
                            <p className="font-bold text-primary">$42.18</p>
                          </div>
                          <div className="rounded-md bg-primary/5 p-2 text-center">
                            <span className="text-xs text-muted-foreground">Transactions</span>
                            <p className="font-bold">4</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="gas-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Quick Calculate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transactionTypes.slice(0, 3).map((type, index) => (
                        <div key={type.id} className="flex items-center justify-between border-b last:border-b-0 py-2">
                          <span className="text-sm">{type.name}</span>
                          <span className="text-sm font-medium">
                            {type.gasEstimate.toLocaleString()} gas
                          </span>
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-2" 
                        size="sm"
                        asChild
                      >
                        <Link to="/optimize">
                          View All Transactions
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Transaction History */}
            <div>
              <TransactionHistory networkId={selectedNetwork} limit={3} />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <GasOptimizeModal 
        open={optimizeModalOpen} 
        onOpenChange={setOptimizeModalOpen} 
        networkId={selectedNetwork}
      />

      <GasAlertModal
        open={alertModalOpen}
        onOpenChange={setAlertModalOpen}
        networkId={selectedNetwork}
      />
    </div>
  );
};

export default Index;
