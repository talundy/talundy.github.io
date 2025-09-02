export interface AlgorithmMetadata {
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
}

export interface Operation {
  type: 'compare' | 'swap' | 'mark' | 'merge' | 'split';
  indices: number[];
  values?: number[];
  state?: 'active' | 'sorted' | 'pivot' | 'merged';
  metadata?: Record<string, unknown>;
}

export interface AlgorithmTrace {
  operations: Operation[];
  finalArray: number[];
  metadata: AlgorithmMetadata;
}

export interface AlgorithmInput {
  array: number[];
  size?: number;
  settings?: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface Algorithm {
  metadata: AlgorithmMetadata;
  validate(input: AlgorithmInput): ValidationError[];
  trace(input: AlgorithmInput): Generator<Operation>;
}
