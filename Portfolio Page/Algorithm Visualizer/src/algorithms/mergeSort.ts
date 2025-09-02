import { Algorithm, AlgorithmInput, AlgorithmMetadata, Operation, ValidationError } from '../types/algorithm';

export class MergeSort implements Algorithm {
  metadata: AlgorithmMetadata = {
    name: 'Merge Sort',
    description: 'A divide-and-conquer algorithm that recursively splits the array, sorts the subarrays, and merges them back together.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    stable: true,
    inPlace: false
  };

  validate(input: AlgorithmInput): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!input.array || input.array.length === 0) {
      errors.push({ field: 'array', message: 'Array must not be empty' });
    }
    
    if (input.array && input.array.some(val => typeof val !== 'number' || !Number.isFinite(val))) {
      errors.push({ field: 'array', message: 'Array must contain only finite numbers' });
    }
    
    return errors;
  }

  *trace(input: AlgorithmInput): Generator<Operation> {
    const array = [...input.array];
    const n = array.length;
    
    if (n <= 1) {
      yield { type: 'mark', indices: [0], state: 'sorted' };
      return;
    }

    yield* this.mergeSortTrace(array, 0, n - 1);
  }

  private *mergeSortTrace(array: number[], left: number, right: number): Generator<Operation> {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      // Mark the split point
      yield { type: 'split', indices: [mid], metadata: { left, right, mid } };
      
      // Recursively sort left half
      yield* this.mergeSortTrace(array, left, mid);
      
      // Recursively sort right half
      yield* this.mergeSortTrace(array, mid + 1, right);
      
      // Merge the sorted halves
      yield* this.mergeTrace(array, left, mid, right);
    } else if (left === right) {
      // Single element is sorted
      yield { type: 'mark', indices: [left], state: 'sorted' };
    }
  }

  private *mergeTrace(array: number[], left: number, mid: number, right: number): Generator<Operation> {
    const leftArray = array.slice(left, mid + 1);
    const rightArray = array.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    // Mark the range being merged
    yield { type: 'mark', indices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx), state: 'active' };
    
    while (i < leftArray.length && j < rightArray.length) {
      // Compare elements
      yield { type: 'compare', indices: [left + i, mid + 1 + j], values: [leftArray[i], rightArray[j]] };
      
      if (leftArray[i] <= rightArray[j]) {
        array[k] = leftArray[i];
        yield { type: 'swap', indices: [k], values: [leftArray[i]] };
        i++;
      } else {
        array[k] = rightArray[j];
        yield { type: 'swap', indices: [k], values: [rightArray[j]] };
        j++;
      }
      k++;
    }
    
    // Copy remaining elements from left array
    while (i < leftArray.length) {
      array[k] = leftArray[i];
      yield { type: 'swap', indices: [k], values: [leftArray[i]] };
      i++;
      k++;
    }
    
    // Copy remaining elements from right array
    while (j < rightArray.length) {
      array[k] = rightArray[j];
      yield { type: 'swap', indices: [k], values: [rightArray[j]] };
      j++;
      k++;
    }
    
    // Mark the merged range as sorted
    yield { type: 'mark', indices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx), state: 'sorted' };
  }
}
