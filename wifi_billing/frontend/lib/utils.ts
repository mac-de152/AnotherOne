export const formatCurrency = (value: number) => `Ksh ${Number(value || 0).toLocaleString()}`
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
