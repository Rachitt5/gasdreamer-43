
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGwei(value: number): string {
  return value.toFixed(2)
}

export function formatUSD(value: number): string {
  return `$${value.toFixed(2)}`
}

export function getGasLevel(gwei: number): "low" | "medium" | "high" {
  if (gwei < 30) return "low"
  if (gwei < 100) return "medium"
  return "high"
}

export function getGasLevelColor(level: "low" | "medium" | "high"): string {
  switch (level) {
    case "low":
      return "text-gas-low"
    case "medium":
      return "text-gas-medium"
    case "high":
      return "text-gas-high"
    default:
      return "text-gas-medium"
  }
}

export function getGasLevelBg(level: "low" | "medium" | "high"): string {
  switch (level) {
    case "low":
      return "bg-gas-low/10"
    case "medium":
      return "bg-gas-medium/10"
    case "high":
      return "bg-gas-high/10"
    default:
      return "bg-gas-medium/10"
  }
}

export function getGasLevelBorder(level: "low" | "medium" | "high"): string {
  switch (level) {
    case "low":
      return "border-gas-low/20"
    case "medium":
      return "border-gas-medium/20"
    case "high":
      return "border-gas-high/20"
    default:
      return "border-gas-medium/20"
  }
}

// Truncates a long string like an ethereum address
export function truncateAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Calculate the percentage of a value within a range
export function calculatePercentage(value: number, min: number, max: number): number {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
}
