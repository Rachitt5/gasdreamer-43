
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { truncateAddress } from "@/lib/utils";
import { toast } from "sonner";

export function WalletConnect() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    
    // Simulate connecting to wallet
    setTimeout(() => {
      setAddress("0xf3b1eD4A0c7F967B2529e9196CE4De53f85D398C");
      setConnected(true);
      setLoading(false);
      toast.success("Wallet connected successfully!");
    }, 1500);
  };

  const handleDisconnect = () => {
    setAddress("");
    setConnected(false);
    toast.info("Wallet disconnected");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className={connected ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
          variant={connected ? "outline" : "default"}
        >
          {connected ? truncateAddress(address) : "Connect"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{connected ? "Wallet Connected" : "Connect Wallet"}</DialogTitle>
          <DialogDescription>
            {connected 
              ? "Your wallet is connected to GasSaver" 
              : "Connect your wallet to access all features"
            }
          </DialogDescription>
        </DialogHeader>
        
        {connected ? (
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 784.37 1277.39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M392.07 0l-8.57 29.11v844.63l8.57 8.55 392.06-231.75z"/>
                    <path fill="currentColor" opacity="0.6" d="M392.07 0L0 650.54l392.07 231.75V472.33z"/>
                    <path fill="currentColor" d="M392.07 956.52l-4.83 5.89v300.87l4.83 14.1 392.3-552.49z"/>
                    <path fill="currentColor" opacity="0.6" d="M392.07 1277.38V956.52L0 724.89z"/>
                    <path fill="currentColor" opacity="0.2" d="M392.07 882.29l392.06-231.75-392.06-178.21z"/>
                    <path fill="currentColor" opacity="0.6" d="M0 650.54l392.07 231.75V472.33z"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Ethereum</span>
                  <span className="text-sm text-muted-foreground">{address}</span>
                </div>
              </div>
              <div className="h-2.5 w-2.5 rounded-full bg-gas-low"></div>
            </div>

            <div className="text-sm text-muted-foreground">
              Gas saving features are now available. You can now optimize your transactions and save on gas fees.
            </div>
            
            <div className="rounded-md bg-primary/5 p-3 mt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Account Balance</span>
                  <p className="text-lg font-bold">1.245 ETH</p>
                  <span className="text-xs text-muted-foreground">$3,910.50 USD</span>
                </div>
                <Button size="sm" onClick={() => toast.success("Successfully refreshed balance!")}>
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button onClick={handleConnect} className="h-24 flex flex-col" disabled={loading}>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <svg className="h-5 w-5 text-primary" width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M31.1533 0H10.3738C9.66741 0 9.09131 0.576102 9.09131 1.28246V7.69473C9.09131 8.40108 9.66741 8.97719 10.3738 8.97719C11.0801 8.97719 11.6562 8.40108 11.6562 7.69473V2.56493H29.8708V23.9025H25.0235C24.3171 23.9025 23.741 24.4786 23.741 25.185C23.741 25.8913 24.3171 26.4674 25.0235 26.4674H31.1533C31.8596 26.4674 32.4357 25.8913 32.4357 25.185V1.28246C32.4357 0.576102 31.8596 0 31.1533 0Z" fill="currentColor"/>
                  <path d="M22.4587 9.02294H1.63473C0.928369 9.02294 0.352266 9.59904 0.352266 10.3054V30.7175C0.352266 31.4239 0.928369 32 1.63473 32H22.4587C23.165 32 23.7411 31.4239 23.7411 30.7175V10.3054C23.7411 9.59904 23.165 9.02294 22.4587 9.02294ZM21.1762 29.4351H2.91722V11.5879H21.1762V29.4351Z" fill="currentColor"/>
                  <path d="M15.7635 14.1669C15.7635 14.8733 16.3396 15.4494 17.046 15.4494C17.7523 15.4494 18.3284 14.8733 18.3284 14.1669C18.3284 13.4606 17.7523 12.8845 17.046 12.8845C16.3396 12.8845 15.7635 13.4606 15.7635 14.1669Z" fill="currentColor"/>
                  <path d="M5.76494 16.6685C5.76494 17.3748 6.34106 17.9509 7.0474 17.9509C7.75374 17.9509 8.32985 17.3748 8.32985 16.6685C8.32985 15.9621 7.75374 15.386 7.0474 15.386C6.34106 15.386 5.76494 15.9621 5.76494 16.6685Z" fill="currentColor"/>
                  <path d="M5.76494 20.9665C5.76494 21.6729 6.34106 22.249 7.0474 22.249C7.75374 22.249 8.32985 21.6729 8.32985 20.9665C8.32985 20.2602 7.75374 19.6841 7.0474 19.6841C6.34106 19.6841 5.76494 20.2602 5.76494 20.9665Z" fill="currentColor"/>
                  <path d="M5.76494 25.2645C5.76494 25.9708 6.34106 26.5469 7.0474 26.5469C7.75374 26.5469 8.32985 25.9708 8.32985 25.2645C8.32985 24.5581 7.75374 23.982 7.0474 23.982C6.34106 23.982 5.76494 24.5581 5.76494 25.2645Z" fill="currentColor"/>
                  <path d="M10.063 16.6685C10.063 17.3748 10.6391 17.9509 11.3454 17.9509C12.0518 17.9509 12.6279 17.3748 12.6279 16.6685C12.6279 15.9621 12.0518 15.386 11.3454 15.386C10.6391 15.386 10.063 15.9621 10.063 16.6685Z" fill="currentColor"/>
                  <path d="M10.063 20.9665C10.063 21.6729 10.6391 22.249 11.3454 22.249C12.0518 22.249 12.6279 21.6729 12.6279 20.9665C12.6279 20.2602 12.0518 19.6841 11.3454 19.6841C10.6391 19.6841 10.063 20.2602 10.063 20.9665Z" fill="currentColor"/>
                  <path d="M10.063 25.2645C10.063 25.9708 10.6391 26.5469 11.3454 26.5469C12.0518 26.5469 12.6279 25.9708 12.6279 25.2645C12.6279 24.5581 12.0518 23.982 11.3454 23.982C10.6391 23.982 10.063 24.5581 10.063 25.2645Z" fill="currentColor"/>
                  <path d="M14.361 16.6685C14.361 17.3748 14.9371 17.9509 15.6435 17.9509C16.3498 17.9509 16.9259 17.3748 16.9259 16.6685C16.9259 15.9621 16.3498 15.386 15.6435 15.386C14.9371 15.386 14.361 15.9621 14.361 16.6685Z" fill="currentColor"/>
                  <path d="M14.361 20.9665C14.361 21.6729 14.9371 22.249 15.6435 22.249C16.3498 22.249 16.9259 21.6729 16.9259 20.9665C16.9259 20.2602 16.3498 19.6841 15.6435 19.6841C14.9371 19.6841 14.361 20.2602 14.361 20.9665Z" fill="currentColor"/>
                  <path d="M14.361 25.2645C14.361 25.9708 14.9371 26.5469 15.6435 26.5469C16.3498 26.5469 16.9259 25.9708 16.9259 25.2645C16.9259 24.5581 16.3498 23.982 15.6435 23.982C14.9371 23.982 14.361 24.5581 14.361 25.2645Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-sm font-medium">MetaMask</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col" disabled={loading}>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <svg className="h-5 w-5 text-primary" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.9913 0C7.1563 0 0 7.1634 0 16.0069C0 24.8437 7.1634 32 16.0069 32C24.8437 32 32 24.8366 32 15.9913C32 7.1563 24.8366 0 15.9913 0ZM15.8559 5.73513C19.2211 5.73513 21.9451 8.45908 21.9451 11.8243C21.9451 15.1894 19.2211 17.9134 15.8559 17.9134C12.4907 17.9134 9.76671 15.1894 9.76671 11.8243C9.76671 8.45908 12.4907 5.73513 15.8559 5.73513ZM15.8894 27.7917C12.4371 27.7917 9.32113 26.3447 7.15654 24.0263C6.22716 23.0969 5.74907 21.8428 5.74907 20.5374C5.74907 17.1254 8.50611 14.3952 11.9181 14.3952H19.8741C23.2861 14.3952 26.0297 17.1254 26.0297 20.5374C26.0297 21.8428 25.5516 23.0969 24.6222 24.0263C22.4577 26.3447 19.3418 27.7917 15.8894 27.7917Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-sm font-medium">WalletConnect</span>
            </Button>
          </div>
        )}
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {connected && (
            <Button variant="outline" onClick={handleDisconnect}>
              Disconnect
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
