import { Operation } from '../types/algorithm';
import { PlayerState, PlayerControls, PlayerMetrics } from './types';

export class AlgorithmPlayer implements PlayerControls {
  private state: PlayerState;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private onStateChange: (state: PlayerState) => void;
  private onMetricsChange: (metrics: PlayerMetrics) => void;

  constructor(
    onStateChange: (state: PlayerState) => void,
    onMetricsChange: (metrics: PlayerMetrics) => void
  ) {
    this.onStateChange = onStateChange;
    this.onMetricsChange = onMetricsChange;
    
    this.state = {
      isPlaying: false,
      currentStep: 0,
      totalSteps: 0,
      speed: 1,
      operations: [],
      currentArray: [],
      originalArray: []
    };
  }

  setArray(array: number[]): void {
    this.state.originalArray = [...array];
    this.state.currentArray = [...array];
    this.state.operations = [];
    this.state.currentStep = 0;
    this.state.totalSteps = 0;
    this.updateState();
  }

  setOperations(operations: Operation[]): void {
    this.state.operations = operations;
    this.state.totalSteps = operations.length;
    this.state.currentStep = 0;
    this.updateState();
  }

  play(): void {
    if (this.state.currentStep >= this.state.totalSteps) {
      this.reset();
    }
    
    this.state.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.animate();
    this.updateState();
  }

  pause(): void {
    this.state.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.updateState();
  }

  reset(): void {
    this.pause();
    this.state.currentStep = 0;
    this.state.currentArray = [...this.state.originalArray];
    this.updateState();
    this.updateMetrics();
  }

  stepForward(): void {
    if (this.state.currentStep < this.state.totalSteps) {
      this.executeStep(this.state.currentStep);
      this.state.currentStep++;
      this.updateState();
      this.updateMetrics();
    }
  }

  stepBackward(): void {
    if (this.state.currentStep > 0) {
      this.state.currentStep--;
      this.revertToStep(this.state.currentStep);
      this.updateState();
      this.updateMetrics();
    }
  }

  setSpeed(speed: number): void {
    this.state.speed = Math.max(0.25, Math.min(4, speed));
    this.updateState();
  }

  private animate(): void {
    if (!this.state.isPlaying) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    const stepInterval = 1000 / this.state.speed; // milliseconds per step

    if (deltaTime >= stepInterval) {
      if (this.state.currentStep < this.state.totalSteps) {
        this.stepForward();
        this.lastFrameTime = currentTime;
      } else {
        this.pause();
        return;
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private executeStep(stepIndex: number): void {
    if (stepIndex >= this.state.operations.length) return;

    const operation = this.state.operations[stepIndex];
    this.applyOperation(operation);
  }

  private applyOperation(operation: Operation): void {
    switch (operation.type) {
      case 'swap':
        if (operation.indices.length === 1 && operation.values && operation.values.length === 1) {
          this.state.currentArray[operation.indices[0]] = operation.values[0];
        }
        break;
      case 'mark':
        // Marking is handled by the renderer, no array changes needed
        break;
      case 'compare':
        // Comparison is handled by the renderer, no array changes needed
        break;
      case 'merge':
        // Merge operations update the array
        if (operation.values) {
          operation.indices.forEach((index, i) => {
            if (operation.values && operation.values[i] !== undefined) {
              this.state.currentArray[index] = operation.values[i];
            }
          });
        }
        break;
      case 'split':
        // Split operations don't change the array
        break;
    }
  }

  private revertToStep(stepIndex: number): void {
    // Reset to original array and replay operations up to stepIndex
    this.state.currentArray = [...this.state.originalArray];
    
    for (let i = 0; i < stepIndex; i++) {
      this.executeStep(i);
    }
  }

  private updateState(): void {
    this.onStateChange({ ...this.state });
  }

  private updateMetrics(): void {
    const metrics: PlayerMetrics = {
      comparisons: this.countOperations('compare'),
      swaps: this.countOperations('swap'),
      elapsedTime: this.state.currentStep,
      currentStep: this.state.currentStep,
      totalSteps: this.state.totalSteps
    };
    
    this.onMetricsChange(metrics);
  }

  private countOperations(type: Operation['type']): number {
    return this.state.operations
      .slice(0, this.state.currentStep)
      .filter(op => op.type === type).length;
  }

  getState(): PlayerState {
    return { ...this.state };
  }

  destroy(): void {
    this.pause();
  }
}
