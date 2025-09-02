import { Operation } from '../types/algorithm';

export interface RendererConfig {
  width: number;
  height: number;
  barWidth: number;
  barSpacing: number;
  colors: {
    default: string;
    active: string;
    sorted: string;
    comparing: string;
    swapping: string;
    merged: string;
  };
}

export interface Renderer {
  render(array: number[], operations: Operation[], currentStep: number): void;
  resize(width: number, height: number): void;
  destroy(): void;
}
