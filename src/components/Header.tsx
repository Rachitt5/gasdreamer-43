
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";
import { NetworkSelector } from "@/components/NetworkSelector";
import { Wallet, Menu } from "lucide-react";

interface HeaderProps {
  onNetworkChange?: (network: string) => void;
}

export function Header({ onNetworkChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="animate-fade-in-up flex items-center mr-4">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mr-2">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">GasSaver</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="text-sm font-medium">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="text-sm font-medium">
              Optimize
            </Button>
            <Button variant="ghost" size="sm" className="text-sm font-medium">
              History
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <NetworkSelector onNetworkChange={onNetworkChange} />
          </div>
          <WalletConnect />
          
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 glass border-b border-border/30 animate-fade-in">
          <div className="flex flex-col space-y-1">
            <Button variant="ghost" size="sm" className="justify-start text-sm font-medium">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-sm font-medium">
              Optimize
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-sm font-medium">
              History
            </Button>
            <div className="pt-2">
              <NetworkSelector isMobile onNetworkChange={onNetworkChange} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
