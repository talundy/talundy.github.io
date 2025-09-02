export const generateRandomArray = (size: number, min: number = 1, max: number = 100): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

export const generateSortedArray = (size: number, min: number = 1, max: number = 100): number[] => {
  return generateRandomArray(size, min, max).sort((a, b) => a - b);
};

export const generateReversedArray = (size: number, min: number = 1, max: number = 100): number[] => {
  return generateSortedArray(size, min, max).reverse();
};

export const generateNearlySortedArray = (size: number, min: number = 1, max: number = 100, swaps: number = 3): number[] => {
  const array = generateSortedArray(size, min, max);
  
  for (let i = 0; i < swaps; i++) {
    const idx1 = Math.floor(Math.random() * size);
    const idx2 = Math.floor(Math.random() * size);
    [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
  }
  
  return array;
};

export const generateArrayWithDuplicates = (size: number, min: number = 1, max: number = 50): number[] => {
  const uniqueValues = Math.min(max - min + 1, Math.floor(size / 2));
  const baseArray = generateRandomArray(uniqueValues, min, max);
  
  const result: number[] = [];
  for (let i = 0; i < size; i++) {
    result.push(baseArray[i % uniqueValues]);
  }
  
  // Shuffle the result
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
};
