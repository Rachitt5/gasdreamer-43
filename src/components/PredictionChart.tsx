
import { useEffect, useState } from "react";
import { mockPredictions, findOptimumTime, findMaximumTime } from "@/lib/gasData";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import { formatGwei } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, RefreshCw } from "lucide-react";

interface PredictionChartProps {
  networkId: string;
}

export function PredictionChart({ networkId = "ethereum" }: PredictionChartProps) {
  const [data, setData] = useState(mockPredictions[networkId]);
  const [loading, setLoading] = useState(false);
  
  // Update data when network changes
  useEffect(() => {
    setData(mockPredictions[networkId]);
  }, [networkId]);

  const optimumTime = findOptimumTime(networkId);
  const maxTime = findMaximumTime(networkId);
  
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(mockPredictions[networkId]);
      setLoading(false);
    }, 1500);
  };
  
  // Format hour for X-axis
  const formatHour = (hour: number) => {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-900 p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium">{formatHour(payload[0].payload.hour)}</p>
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-semibold">{formatGwei(payload[0].value)}</span> Gwei
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="gas-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Gas Price Prediction</CardTitle>
            <CardDescription>Next 24 hours forecast</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" opacity={0.3} />
              <XAxis 
                dataKey="hour"
                tickFormatter={formatHour}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                width={30}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={optimumTime.price} 
                stroke="#10b981" 
                strokeDasharray="3 3"
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3b82f6" 
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "white" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col bg-primary/5 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <Clock className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium">Best Time to Transact</span>
            </div>
            <div className="flex items-baseline mt-1">
              <span className="text-lg font-bold">{formatHour(optimumTime.hour)}</span>
              <Badge variant="outline" className="ml-2 bg-gas-low/10 text-gas-low border-gas-low/10">
                {formatGwei(optimumTime.price)} Gwei
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col bg-destructive/5 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <Calendar className="h-4 w-4 text-destructive mr-2" />
              <span className="text-sm font-medium">Peak Gas Price</span>
            </div>
            <div className="flex items-baseline mt-1">
              <span className="text-lg font-bold">{formatHour(maxTime.hour)}</span>
              <Badge variant="outline" className="ml-2 bg-gas-high/10 text-gas-high border-gas-high/10">
                {formatGwei(maxTime.price)} Gwei
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
