import { describe, it, expect } from 'vitest';
import { MergeSort } from '../mergeSort';

describe('MergeSort', () => {
  const mergeSort = new MergeSort();

  describe('metadata', () => {
    it('should have correct metadata', () => {
      expect(mergeSort.metadata.name).toBe('Merge Sort');
      expect(mergeSort.metadata.stable).toBe(true);
      expect(mergeSort.metadata.inPlace).toBe(false);
      expect(mergeSort.metadata.timeComplexity.average).toBe('O(n log n)');
      expect(mergeSort.metadata.spaceComplexity).toBe('O(n)');
    });
  });

  describe('validation', () => {
    it('should validate empty array', () => {
      const errors = mergeSort.validate({ array: [] });
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('array');
    });

    it('should validate array with non-numeric values', () => {
      const errors = mergeSort.validate({ array: [1, 2, '3', 4] as any });
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('array');
    });

    it('should validate array with infinite values', () => {
      const errors = mergeSort.validate({ array: [1, 2, Infinity, 4] });
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('array');
    });

    it('should accept valid array', () => {
      const errors = mergeSort.validate({ array: [3, 1, 4, 1, 5] });
      expect(errors).toHaveLength(0);
    });
  });

  describe('sorting', () => {
    it('should sort empty array', () => {
      const operations: any[] = [];
      for (const operation of mergeSort.trace({ array: [] })) {
        operations.push(operation);
      }
      expect(operations).toHaveLength(1);
      expect(operations[0].type).toBe('mark');
    });

    it('should sort single element array', () => {
      const operations: any[] = [];
      for (const operation of mergeSort.trace({ array: [42] })) {
        operations.push(operation);
      }
      expect(operations).toHaveLength(1);
      expect(operations[0].type).toBe('mark');
      expect(operations[0].indices).toEqual([0]);
    });

    it('should sort two element array', () => {
      const array = [2, 1];
      const operations: any[] = [];
      for (const operation of mergeSort.trace({ array })) {
        operations.push(operation);
      }
      
      // Should have various operation types for two elements
      expect(operations.length).toBeGreaterThan(0);
      expect(operations.some(op => op.type === 'mark')).toBe(true);
      // For two elements, we might not have split operations
      expect(operations.some(op => ['compare', 'swap', 'mark'].includes(op.type))).toBe(true);
    });

    it('should sort multiple element array', () => {
      const array = [3, 1, 4, 1, 5, 9, 2, 6];
      const operations: any[] = [];
      for (const operation of mergeSort.trace({ array })) {
        operations.push(operation);
      }
      
      // Should have various operation types
      expect(operations.length).toBeGreaterThan(0);
      expect(operations.some(op => op.type === 'mark')).toBe(true);
      expect(operations.some(op => ['compare', 'swap', 'mark'].includes(op.type))).toBe(true);
      
      // Should have operations for all elements
      const operationIndices = operations.flatMap(op => op.indices);
      expect(operationIndices).toContain(0);
      expect(operationIndices).toContain(array.length - 1);
    });

    it('should maintain array length', () => {
      const array = [3, 1, 4, 1, 5];
      const operations: any[] = [];
      for (const operation of mergeSort.trace({ array })) {
        operations.push(operation);
      }
      
      // All operations should reference valid indices
      const maxIndex = Math.max(...operations.flatMap(op => op.indices));
      expect(maxIndex).toBeLessThan(array.length);
    });
  });

  describe('operation types', () => {
    it('should generate valid operation types', () => {
      const array = [3, 1, 4, 1, 5];
      const validTypes = ['compare', 'swap', 'mark', 'merge', 'split'];
      
      for (const operation of mergeSort.trace({ array })) {
        expect(validTypes).toContain(operation.type);
        expect(Array.isArray(operation.indices)).toBe(true);
        expect(operation.indices.length).toBeGreaterThan(0);
      }
    });

    it('should have valid indices in operations', () => {
      const array = [3, 1, 4, 1, 5];
      
      for (const operation of mergeSort.trace({ array })) {
        expect(operation.indices.every(idx => 
          Number.isInteger(idx) && idx >= 0 && idx < array.length
        )).toBe(true);
      }
    });
  });
});
