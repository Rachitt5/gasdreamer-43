
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatGwei, getGasLevel, getGasLevelColor, formatUSD, calculateFeeInUSD } from "@/lib/utils";
import { mockGasPrices, transactionTypes, findOptimumTime } from "@/lib/gasData";
import { Clock, TrendingDown, Flame } from "lucide-react";

interface GasMeterProps {
  networkId: string;
}

export function GasMeter({ networkId = "ethereum" }: GasMeterProps) {
  const [gasData, setGasData] = useState(mockGasPrices[networkId]);
  const [selectedTxType, setSelectedTxType] = useState(transactionTypes[0]);

  // Update gas data when network changes
  useEffect(() => {
    setGasData(mockGasPrices[networkId]);
  }, [networkId]);
  
  const optimumTime = findOptimumTime(networkId);
  const formattedOptimumTime = new Date().setHours(optimumTime.hour, 0, 0, 0);
  
  // Determine if current gas price is high, medium, or low
  const standardGasLevel = getGasLevel(gasData.standard);
  const fastGasLevel = getGasLevel(gasData.fast);
  const instantGasLevel = getGasLevel(gasData.instant);
  
  // Get gas level text color
  const standardColor = getGasLevelColor(standardGasLevel);
  const fastColor = getGasLevelColor(fastGasLevel);
  const instantColor = getGasLevelColor(instantGasLevel);
  
  // Calculate fees in USD for the selected transaction type
  const standardFee = calculateFeeInUSD(selectedTxType.gasEstimate, gasData.standard, networkId);
  const fastFee = calculateFeeInUSD(selectedTxType.gasEstimate, gasData.fast, networkId);
  const instantFee = calculateFeeInUSD(selectedTxType.gasEstimate, gasData.instant, networkId);

  return (
    <div className="gas-card bg-white dark:bg-gray-900 shadow-lg">
      <div className="gas-card-content p-5">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Current Gas Prices</h3>
            <div className="text-sm flex items-center gap-2 text-muted-foreground">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gas-low/10 text-gas-low">
                <TrendingDown className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs font-medium">Low Activity</span>
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
              <GasCard
                title="Standard"
                description="~5 min"
                icon={<Clock className="h-5 w-5" />}
                value={formatGwei(gasData.standard)}
                level={standardGasLevel}
                colorClass={standardColor}
                feeUsd={formatUSD(standardFee)}
                gasLimit={selectedTxType.gasEstimate}
              />
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <GasCard
                title="Fast"
                description="~1 min"
                icon={<TrendingDown className="h-5 w-5" />}
                value={formatGwei(gasData.fast)}
                level={fastGasLevel}
                colorClass={fastColor}
                feeUsd={formatUSD(fastFee)}
                gasLimit={selectedTxType.gasEstimate}
              />
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <GasCard
                title="Instant"
                description="~10 sec"
                icon={<Flame className="h-5 w-5" />}
                value={formatGwei(gasData.instant)}
                level={instantGasLevel}
                colorClass={instantColor}
                feeUsd={formatUSD(instantFee)}
                gasLimit={selectedTxType.gasEstimate}
              />
            </div>
          </div>
          
          <div className="mt-2">
            <Tabs defaultValue="transfer" className="w-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Transaction Type</span>
                <TabsList className="grid grid-cols-5 h-8">
                  {transactionTypes.map((type) => (
                    <TabsTrigger
                      key={type.id}
                      value={type.id}
                      onClick={() => setSelectedTxType(type)}
                      className="text-xs px-2"
                    >
                      {type.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {transactionTypes.map((type) => (
                <TabsContent key={type.id} value={type.id} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3 flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Gas Limit</span>
                      <span className="text-lg font-medium">{type.gasEstimate.toLocaleString()} Gas Units</span>
                    </div>
                    <div className="rounded-lg border p-3 flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Optimal Time</span>
                      <div className="flex items-center">
                        <span className="text-lg font-medium">
                          {new Date(formattedOptimumTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gas-low/10 text-gas-low">
                          {formatGwei(optimumTime.price)} Gwei
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GasCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: string;
  level: "low" | "medium" | "high";
  colorClass: string;
  feeUsd: string;
  gasLimit: number;
}

function GasCard({
  title,
  description,
  icon,
  value,
  level,
  colorClass,
  feeUsd,
  gasLimit,
}: GasCardProps) {
  return (
    <div className="rounded-xl border p-4 hover:shadow-md transition-all duration-300 h-full">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className={`${colorClass} rounded-full p-2 bg-opacity-10`}>
          {icon}
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex items-baseline">
          <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
          <span className="ml-1 text-sm text-muted-foreground">Gwei</span>
        </div>
        <div className="flex flex-col mt-2">
          <span className="text-xs text-muted-foreground mb-1">Estimated Fee</span>
          <div className="flex items-center">
            <span className="text-sm font-medium">{feeUsd}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              ({gasLimit.toLocaleString()} gas)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
