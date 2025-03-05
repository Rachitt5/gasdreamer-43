
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { networks } from "@/lib/gasData";
import { cn } from "@/lib/utils";

interface NetworkSelectorProps {
  isMobile?: boolean;
}

export function NetworkSelector({ isMobile = false }: NetworkSelectorProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);

  const getNetworkIcon = (icon: string) => {
    switch (icon) {
      case "eth":
        return (
          <svg className="h-4 w-4" viewBox="0 0 784.37 1277.39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#343434" d="M392.07 0l-8.57 29.11v844.63l8.57 8.55 392.06-231.75z"/>
            <path fill="#8C8C8C" d="M392.07 0L0 650.54l392.07 231.75V472.33z"/>
            <path fill="#3C3C3B" d="M392.07 956.52l-4.83 5.89v300.87l4.83 14.1 392.3-552.49z"/>
            <path fill="#8C8C8C" d="M392.07 1277.38V956.52L0 724.89z"/>
            <path fill="#141414" d="M392.07 882.29l392.06-231.75-392.06-178.21z"/>
            <path fill="#393939" d="M0 650.54l392.07 231.75V472.33z"/>
          </svg>
        );
      case "polygon":
        return (
          <svg className="h-4 w-4" viewBox="0 0 38 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.0005 0L0 12.9231V12.9254L0 33L19.0005 20.0769V0Z" fill="#8247E5"/>
            <path d="M19 0L38.0009 12.9231V12.9254V33L19 20.0769V0Z" fill="#8247E5"/>
            <path d="M19.0005 0L0 12.9231L19.0005 25.8462L38.0009 12.9231L19.0005 0Z" fill="#2BBDF7"/>
          </svg>
        );
      case "bnb":
        return (
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L9.8 1.8L4 7.6L2.2 5.8L8 0Z" fill="#F3BA2F"/>
            <path d="M11.8 3.8L13.6 5.6L8 11.2L6.2 9.4L11.8 3.8Z" fill="#F3BA2F"/>
            <path d="M0 8L1.8 9.8L3.6 8L1.8 6.2L0 8Z" fill="#F3BA2F"/>
            <path d="M12.4 8L14.2 9.8L16 8L14.2 6.2L12.4 8Z" fill="#F3BA2F"/>
            <path d="M8 11.8L9.8 13.6L11.6 11.8L9.8 10L8 11.8Z" fill="#F3BA2F"/>
          </svg>
        );
      case "arbitrum":
        return (
          <svg className="h-4 w-4" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#2D374B"/>
            <path d="M18.9565 14.8348L21.3361 17.7826H14.3478L9.04348 24L7 16.3043L18.9565 14.8348Z" fill="#28A0F0"/>
            <path d="M9.04348 24L18.9565 14.8348L16.5769 10.7826L7 16.3043L9.04348 24Z" fill="#28A0F0"/>
            <path d="M14.3478 17.7826L21.3361 17.7826L19.5217 8.52174L10.5 7L9.04348 24L14.3478 17.7826Z" fill="white"/>
          </svg>
        );
      case "optimism":
        return (
          <svg className="h-4 w-4" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#FF0420"/>
            <path d="M9.94 18.72C8.99 18.72 8.19 18.52 7.56 18.13C6.93 17.74 6.45 17.18 6.14 16.47C5.83 15.76 5.67 14.92 5.67 13.96C5.67 13 5.83 12.17 6.14 11.46C6.46 10.75 6.93 10.2 7.57 9.81C8.2 9.42 8.99 9.22 9.94 9.22C10.66 9.22 11.28 9.34 11.8 9.58C12.32 9.81 12.74 10.15 13.05 10.58C13.36 11.02 13.55 11.52 13.62 12.1H11.58C11.47 11.67 11.26 11.33 10.95 11.09C10.65 10.85 10.25 10.73 9.75 10.73C9.32 10.73 8.95 10.84 8.63 11.07C8.32 11.29 8.07 11.62 7.9 12.05C7.73 12.48 7.65 13.01 7.65 13.63V14.3C7.65 14.92 7.73 15.45 7.9 15.89C8.08 16.32 8.32 16.65 8.64 16.87C8.96 17.09 9.33 17.21 9.77 17.21C10.12 17.21 10.41 17.15 10.66 17.04C10.91 16.92 11.11 16.76 11.26 16.54C11.41 16.32 11.5 16.06 11.53 15.75H13.57C13.53 16.33 13.36 16.84 13.05 17.29C12.75 17.73 12.33 18.08 11.79 18.33C11.25 18.59 10.63 18.72 9.94 18.72ZM14.92 18.6V9.34H18.37C19.12 9.34 19.74 9.47 20.24 9.73C20.75 9.99 21.13 10.36 21.38 10.84C21.64 11.32 21.76 11.89 21.76 12.55C21.76 13.21 21.63 13.78 21.37 14.26C21.11 14.74 20.72 15.11 20.2 15.36C19.68 15.61 19.05 15.74 18.3 15.74H16.2V18.6H14.92ZM16.2 14.61H18.14C18.57 14.61 18.93 14.54 19.22 14.39C19.5 14.24 19.71 14.03 19.85 13.76C19.99 13.49 20.06 13.17 20.06 12.8C20.06 12.43 19.99 12.11 19.86 11.84C19.72 11.57 19.51 11.36 19.24 11.22C18.96 11.07 18.61 11 18.19 11H16.2V14.61Z" fill="white"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isMobile ? (
        <div className="space-y-2 animate-fade-in">
          <div className="text-sm text-muted-foreground font-medium mb-1">Select Network</div>
          <div className="grid grid-cols-2 gap-2">
            {networks.map((network) => (
              <Button
                key={network.id}
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center justify-start h-10 px-3",
                  selectedNetwork.id === network.id && "border-primary bg-primary/5"
                )}
                onClick={() => setSelectedNetwork(network)}
              >
                <div className="mr-2 h-5 w-5 rounded-full flex items-center justify-center">
                  {getNetworkIcon(network.icon)}
                </div>
                <span className="font-medium">{network.name}</span>
                {selectedNetwork.id === network.id && (
                  <Check className="h-4 w-4 ml-auto text-primary" />
                )}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 font-normal">
              <div className="mr-2 h-4 w-4 rounded-full flex items-center justify-center">
                {getNetworkIcon(selectedNetwork.icon)}
              </div>
              {selectedNetwork.name}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            {networks.map((network) => (
              <DropdownMenuItem
                key={network.id}
                className={cn(
                  "flex items-center cursor-pointer",
                  selectedNetwork.id === network.id && "bg-primary/5"
                )}
                onClick={() => setSelectedNetwork(network)}
              >
                <div className="mr-2 h-4 w-4 rounded-full flex items-center justify-center">
                  {getNetworkIcon(network.icon)}
                </div>
                <span>{network.name}</span>
                {selectedNetwork.id === network.id && (
                  <Check className="h-4 w-4 ml-auto text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
