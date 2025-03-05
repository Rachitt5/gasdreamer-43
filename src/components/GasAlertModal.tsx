
import { useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { formatGwei } from "@/lib/utils";
import { setGasAlert } from "@/lib/gasOptimizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockGasPrices } from "@/lib/gasData";

interface GasAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  networkId: string;
}

export function GasAlertModal({ 
  open, 
  onOpenChange,
  networkId = "ethereum"
}: GasAlertModalProps) {
  const currentGasPrice = mockGasPrices[networkId]?.standard || 30;
  const [targetGasPrice, setTargetGasPrice] = useState<number>(Math.floor(currentGasPrice * 0.8));
  const [emailNotification, setEmailNotification] = useState<boolean>(true);
  const [pushNotification, setPushNotification] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleSetAlert = async () => {
    setLoading(true);
    try {
      await setGasAlert(networkId, targetGasPrice, true);
      // Close modal after successful alert setup
      setTimeout(() => {
        onOpenChange(false);
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (values: number[]) => {
    if (values.length > 0) {
      setTargetGasPrice(values[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Gas Price Alert</DialogTitle>
          <DialogDescription>
            We'll notify you when gas prices fall below your target.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Gas Price</label>
            <div className="flex items-center gap-2">
              <Slider
                defaultValue={[targetGasPrice]}
                max={currentGasPrice * 1.5}
                min={currentGasPrice * 0.5}
                step={1}
                onValueChange={handleSliderChange}
                className="flex-1"
              />
              <div className="w-24">
                <Input
                  type="number"
                  value={targetGasPrice}
                  onChange={(e) => setTargetGasPrice(Number(e.target.value))}
                  min={1}
                  className="h-9"
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>Low: {formatGwei(currentGasPrice * 0.5)} Gwei</span>
              <span>Current: {formatGwei(currentGasPrice)} Gwei</span>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <label className="text-sm font-medium">Notification Methods</label>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Email Notifications</span>
              </div>
              <Switch 
                checked={emailNotification} 
                onCheckedChange={setEmailNotification} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Push Notifications</span>
              </div>
              <Switch 
                checked={pushNotification} 
                onCheckedChange={setPushNotification} 
              />
            </div>
          </div>
          
          <div className="rounded-md bg-primary/5 p-3 mt-2">
            <div className="flex items-start gap-2">
              <Bell className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Alert Details</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You'll be notified when gas prices on {networkId.charAt(0).toUpperCase() + networkId.slice(1)} fall below {formatGwei(targetGasPrice)} Gwei. This alert will remain active for 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSetAlert} disabled={loading || (!emailNotification && !pushNotification)}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting...
              </>
            ) : (
              "Set Alert"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
