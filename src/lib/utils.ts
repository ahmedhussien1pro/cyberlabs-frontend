import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import api from '../../src/core/api/DOC.md';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
