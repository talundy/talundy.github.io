// Simple Algorithm Visualizer - No Dependencies
// Shared JavaScript for algorithm visualization components

class SimpleAlgorithmVisualizer {
    constructor() {
        this.array = [];
        this.workingArray = []; // Working copy that gets updated during visualization
        this.operations = [];
        this.currentStep = 0;
        this.isPlaying = false;
        this.speed = 1;
        this.animationId = null;
        this.lastFrameTime = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.generateArray();
    }

    initializeElements() {
        this.visualization = document.getElementById('visualization');
        this.sizeSlider = document.getElementById('array-size');
        this.sizeDisplay = document.getElementById('size-display');
        this.patternSelect = document.getElementById('array-pattern');
        this.generateBtn = document.getElementById('generate-btn');
        this.stepBackBtn = document.getElementById('step-back');
        this.playPauseBtn = document.getElementById('play-pause');
        this.stepForwardBtn = document.getElementById('step-forward');
        this.resetBtn = document.getElementById('reset');
        this.speedSlider = document.getElementById('speed');
        this.speedDisplay = document.getElementById('speed-display');
        this.stepDisplay = document.getElementById('step-display');
        this.comparisonsDisplay = document.getElementById('comparisons');
        this.swapsDisplay = document.getElementById('swaps');
    }

    bindEvents() {
        this.sizeSlider.addEventListener('input', (e) => {
            this.sizeDisplay.textContent = e.target.value;
        });

        this.generateBtn.addEventListener('click', () => this.generateArray());
        this.patternSelect.addEventListener('change', () => this.generateArray());
        this.stepBackBtn.addEventListener('click', () => this.stepBackward());
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.stepForwardBtn.addEventListener('click', () => this.stepForward());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.speedSlider.addEventListener('input', (e) => {
            this.speed = parseFloat(e.target.value);
            this.speedDisplay.textContent = this.speed + 'x';
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.stepBackward();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.stepForward();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.reset();
                    break;
            }
        });
    }

    generateArray() {
        const size = parseInt(this.sizeSlider.value);
        const pattern = this.patternSelect.value;
        
        this.array = this.createArray(size, pattern);
        this.workingArray = [...this.array]; // Create working copy
        this.generateOperations();
        this.reset();
        this.render();
    }

    createArray(size, pattern) {
        let array = [];
        
        switch(pattern) {
            case 'sorted':
                array = Array.from({length: size}, (_, i) => i + 1);
                break;
            case 'reversed':
                array = Array.from({length: size}, (i) => size - i);
                break;
            case 'nearly-sorted':
                array = Array.from({length: size}, (_, i) => i + 1);
                // Swap a few elements
                for(let i = 0; i < 3; i++) {
                    const idx1 = Math.floor(Math.random() * size);
                    const idx2 = Math.floor(Math.random() * size);
                    [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
                }
                break;
            default: // random
                array = Array.from({length: size}, () => Math.floor(Math.random() * 100) + 1);
        }
        
        return array;
    }

    generateOperations() {
        this.operations = [];
        const array = [...this.array];
        
        // Simple merge sort operation generation
        this.generateMergeSortOperations(array, 0, array.length - 1);
    }

    generateMergeSortOperations(array, left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            
            this.operations.push({type: 'split', indices: [mid]});
            
            this.generateMergeSortOperations(array, left, mid);
            this.generateMergeSortOperations(array, mid + 1, right);
            
            this.generateMergeOperations(array, left, mid, right);
        } else if (left === right) {
            this.operations.push({type: 'mark', indices: [left], state: 'sorted'});
        }
    }

    generateMergeOperations(array, left, mid, right) {
        const leftArray = array.slice(left, mid + 1);
        const rightArray = array.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        this.operations.push({type: 'mark', indices: Array.from({length: right - left + 1}, (_, idx) => left + idx), state: 'active'});
        
        while (i < leftArray.length && j < rightArray.length) {
            this.operations.push({type: 'compare', indices: [left + i, mid + 1 + j]});
            
            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                this.operations.push({type: 'swap', indices: [k], values: [leftArray[i]]});
                i++;
            } else {
                array[k] = rightArray[j];
                this.operations.push({type: 'swap', indices: [k], values: [rightArray[j]]});
                j++;
            }
            k++;
        }
        
        while (i < leftArray.length) {
            array[k] = leftArray[i];
            this.operations.push({type: 'swap', indices: [k], values: [leftArray[i]]});
            i++;
            k++;
        }
        
        while (j < rightArray.length) {
            array[k] = rightArray[j];
            this.operations.push({type: 'swap', indices: [k], values: [rightArray[j]]});
            j++;
            k++;
        }
        
        this.operations.push({type: 'mark', indices: Array.from({length: right - left + 1}, (_, idx) => left + idx), state: 'sorted'});
    }

    // Apply operations to working array up to current step
    applyOperationsToStep(step) {
        // Reset working array to original
        this.workingArray = [...this.array];
        
        // Apply operations up to the specified step
        for (let i = 0; i < step; i++) {
            const operation = this.operations[i];
            if (operation && operation.type === 'swap') {
                // Apply the swap operation to the working array
                if (operation.indices && operation.values) {
                    operation.indices.forEach((index, idx) => {
                        if (operation.values[idx] !== undefined) {
                            this.workingArray[index] = operation.values[idx];
                        }
                    });
                }
            }
        }
    }

    render() {
        this.visualization.innerHTML = '';
        
        // Apply operations up to current step to get current state
        this.applyOperationsToStep(this.currentStep);
        
        const maxValue = Math.max(...this.workingArray);
        const barHeight = 300;
        
        this.workingArray.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = (value / maxValue * barHeight) + 'px';
            
            // Apply operation styling
            if (this.currentStep > 0) {
                const operation = this.operations[this.currentStep - 1];
                if (operation && operation.indices.includes(index)) {
                    if (operation.type === 'compare') {
                        bar.classList.add('comparing');
                    } else if (operation.type === 'mark') {
                        if (operation.state === 'sorted') {
                            bar.classList.add('sorted');
                        } else if (operation.state === 'active') {
                            bar.classList.add('active');
                        }
                    }
                }
            }
            
            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = value;
            bar.appendChild(label);
            
            this.visualization.appendChild(bar);
        });
        
        this.updateMetrics();
    }

    updateMetrics() {
        this.stepDisplay.textContent = `${this.currentStep} / ${this.operations.length}`;
        
        let comparisons = 0;
        let swaps = 0;
        
        for (let i = 0; i < this.currentStep; i++) {
            const operation = this.operations[i];
            if (operation.type === 'compare') comparisons++;
            if (operation.type === 'swap') swaps++;
        }
        
        this.comparisonsDisplay.textContent = comparisons;
        this.swapsDisplay.textContent = swaps;
        
        // Update button states
        this.stepBackBtn.disabled = this.currentStep === 0;
        this.stepForwardBtn.disabled = this.currentStep >= this.operations.length;
    }

    stepForward() {
        if (this.currentStep < this.operations.length) {
            this.currentStep++;
            this.render();
        }
    }

    stepBackward() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.render();
        }
    }

    reset() {
        this.currentStep = 0;
        this.isPlaying = false;
        this.playPauseBtn.textContent = '▶';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.render();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (this.currentStep >= this.operations.length) {
            this.reset();
        }
        
        this.isPlaying = true;
        this.playPauseBtn.textContent = '⏸';
        this.lastFrameTime = performance.now();
        this.animate();
    }

    pause() {
        this.isPlaying = false;
        this.playPauseBtn.textContent = '▶';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate() {
        if (!this.isPlaying) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        const stepInterval = 1000 / this.speed;

        if (deltaTime >= stepInterval) {
            if (this.currentStep < this.operations.length) {
                this.stepForward();
                this.lastFrameTime = currentTime;
            } else {
                this.pause();
                return;
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SimpleAlgorithmVisualizer();
});
