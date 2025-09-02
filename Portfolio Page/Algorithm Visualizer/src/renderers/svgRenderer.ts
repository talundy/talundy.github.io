import { Renderer, RendererConfig } from './types';
import { Operation } from '../types/algorithm';

export class SVGRenderer implements Renderer {
  private svg: SVGElement;
  private config: RendererConfig;
  private barElements: SVGElement[] = [];

  constructor(container: HTMLElement, config: RendererConfig) {
    this.config = config;
    this.svg = this.createSVG();
    container.appendChild(this.svg);
  }

  private createSVG(): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.config.width.toString());
    svg.setAttribute('height', this.config.height.toString());
    svg.style.display = 'block';
    svg.style.margin = '0 auto';
    return svg;
  }

  render(array: number[], operations: Operation[], currentStep: number): void {
    this.clearBars();
    this.createBars(array);
    this.applyOperations(operations, currentStep);
  }

  private clearBars(): void {
    this.barElements.forEach(bar => bar.remove());
    this.barElements = [];
  }

  private createBars(array: number[]): void {
    const maxValue = Math.max(...array);
    const barHeight = this.config.height * 0.8;
    
    array.forEach((value, index) => {
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const x = index * (this.config.barWidth + this.config.barSpacing);
      const height = (value / maxValue) * barHeight;
      const y = this.config.height - height;
      
      bar.setAttribute('x', x.toString());
      bar.setAttribute('y', y.toString());
      bar.setAttribute('width', this.config.barWidth.toString());
      bar.setAttribute('height', height.toString());
      bar.setAttribute('fill', this.config.colors.default);
      bar.setAttribute('stroke', '#333');
      bar.setAttribute('stroke-width', '1');
      
      // Add value label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', (x + this.config.barWidth / 2).toString());
      label.setAttribute('y', (y - 5).toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '12');
      label.setAttribute('fill', '#333');
      label.textContent = value.toString();
      
      this.svg.appendChild(bar);
      this.svg.appendChild(label);
      this.barElements.push(bar);
    });
  }

  private applyOperations(operations: Operation[], currentStep: number): void {
    // Reset all bars to default color
    this.barElements.forEach(bar => {
      bar.setAttribute('fill', this.config.colors.default);
    });

    // Apply operations up to current step
    for (let i = 0; i < currentStep && i < operations.length; i++) {
      const operation = operations[i];
      this.applyOperation(operation);
    }
  }

  private applyOperation(operation: Operation): void {
    switch (operation.type) {
      case 'compare':
        operation.indices.forEach(index => {
          if (this.barElements[index]) {
            this.barElements[index].setAttribute('fill', this.config.colors.comparing);
          }
        });
        break;
      
      case 'swap':
        operation.indices.forEach(index => {
          if (this.barElements[index]) {
            this.barElements[index].setAttribute('fill', this.config.colors.swapping);
          }
        });
        break;
      
      case 'mark':
        operation.indices.forEach(index => {
          if (this.barElements[index]) {
            const color = operation.state === 'sorted' 
              ? this.config.colors.sorted 
              : operation.state === 'active'
              ? this.config.colors.active
              : this.config.colors.merged;
            this.barElements[index].setAttribute('fill', color);
          }
        });
        break;
      
      case 'merge':
        operation.indices.forEach(index => {
          if (this.barElements[index]) {
            this.barElements[index].setAttribute('fill', this.config.colors.merged);
          }
        });
        break;
      
      case 'split':
        // Split operations are visual markers, no color changes needed
        break;
    }
  }

  resize(width: number, height: number): void {
    this.config.width = width;
    this.config.height = height;
    this.svg.setAttribute('width', width.toString());
    this.svg.setAttribute('height', height.toString());
  }

  destroy(): void {
    this.svg.remove();
  }
}
