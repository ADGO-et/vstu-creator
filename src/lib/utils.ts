import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isAxiosError, AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getAxiosError = (error: unknown): AxiosError | null => {
  return isAxiosError(error) ? error : null;
};
