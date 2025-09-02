import { Operation } from '../types/algorithm';

export interface PlayerState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  operations: Operation[];
  currentArray: number[];
  originalArray: number[];
}

export interface PlayerControls {
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setSpeed: (speed: number) => void;
  setArray: (array: number[]) => void;
}

export interface PlayerMetrics {
  comparisons: number;
  swaps: number;
  elapsedTime: number;
  currentStep: number;
  totalSteps: number;
}
