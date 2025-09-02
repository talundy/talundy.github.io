import { Algorithm } from '../types/algorithm';
import { MergeSort } from './mergeSort';

export const algorithms: Record<string, Algorithm> = {
  mergeSort: new MergeSort(),
};

export const getAlgorithm = (name: string): Algorithm | undefined => {
  return algorithms[name];
};

export const getAvailableAlgorithms = (): string[] => {
  return Object.keys(algorithms);
};
