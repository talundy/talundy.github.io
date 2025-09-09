// Main Application Logic for Interactive Neural Network

class InteractiveNN {
    constructor() {
        this.modelManager = null;
        this.trainingManager = null;
        this.visualization = null;
        this.drawingCanvas = null;
        this.isInitialized = false;
    }

    // Initialize the application
    async initialize() {
        try {
            console.log('Initializing Interactive Neural Network...');
            
            // Initialize components
            this.modelManager = new NeuralNetworkModel();
            this.trainingManager = new TrainingManager(this.modelManager);
            this.visualization = new TrainingVisualization();
            this.drawingCanvas = new DrawingCanvas('drawingCanvas');

            // Initialize visualizations (with error handling)
            try {
                this.visualization.initializeCharts();
            } catch (error) {
                console.warn('Chart.js not available, continuing without charts:', error);
            }

            // Setup event listeners
            this.setupEventListeners();

            // Load data automatically
            await this.trainingManager.loadData();

            // Update UI state
            this.updateUIState();

            this.isInitialized = true;
            console.log('Interactive Neural Network initialized successfully');

        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize application: ' + error.message);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Training controls
        const trainBtn = document.getElementById('trainBtn');
        const resetBtn = document.getElementById('resetBtn');

        if (trainBtn) {
            trainBtn.addEventListener('click', this.handleTrainClick.bind(this));
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', this.handleResetClick.bind(this));
        }

        // Canvas controls
        const clearCanvas = document.getElementById('clearCanvas');
        const predictBtn = document.getElementById('predictBtn');

        if (clearCanvas) {
            clearCanvas.addEventListener('click', this.handleClearCanvas.bind(this));
        }

        if (predictBtn) {
            predictBtn.addEventListener('click', this.handlePredictClick.bind(this));
        }

        // Hyperparameter controls
        const epochsInput = document.getElementById('epochs');
        const learningRateInput = document.getElementById('learningRate');
        const learningRateSlider = document.getElementById('learningRateSlider');
        const hiddenUnitsInput = document.getElementById('hiddenUnits');
        const hiddenUnitsSlider = document.getElementById('hiddenUnitsSlider');
        const batchSizeSelect = document.getElementById('batchSize');
        const optimizerSelect = document.getElementById('optimizer');

        // Save/Load model buttons
        const saveModelBtn = document.getElementById('saveModelBtn');
        const loadModelBtn = document.getElementById('loadModelBtn');

        if (epochsInput) {
            epochsInput.addEventListener('change', this.updateUIState.bind(this));
        }

        if (learningRateInput && learningRateSlider) {
            learningRateInput.addEventListener('input', (e) => {
                learningRateSlider.value = e.target.value;
                this.updateUIState();
            });
            learningRateSlider.addEventListener('input', (e) => {
                learningRateInput.value = e.target.value;
                this.updateUIState();
            });
        }

        if (hiddenUnitsInput && hiddenUnitsSlider) {
            hiddenUnitsInput.addEventListener('input', (e) => {
                hiddenUnitsSlider.value = e.target.value;
                this.updateUIState();
            });
            hiddenUnitsSlider.addEventListener('input', (e) => {
                hiddenUnitsInput.value = e.target.value;
                this.updateUIState();
            });
        }

        if (batchSizeSelect) {
            batchSizeSelect.addEventListener('change', this.updateUIState.bind(this));
        }

        if (optimizerSelect) {
            optimizerSelect.addEventListener('change', this.updateUIState.bind(this));
        }

        if (saveModelBtn) {
            saveModelBtn.addEventListener('click', this.handleSaveModel.bind(this));
        }

        if (loadModelBtn) {
            loadModelBtn.addEventListener('click', this.handleLoadModel.bind(this));
        }
    }

    // Handle train button click
    async handleTrainClick() {
        if (!this.isInitialized) {
            this.showError('Application not initialized');
            return;
        }

        if (this.trainingManager.isTrainingInProgress()) {
            this.showWarning('Training already in progress');
            return;
        }

        try {
            // Get hyperparameters
            const epochs = parseInt(document.getElementById('epochs').value) || 10;
            const learningRate = parseFloat(document.getElementById('learningRate').value) || 0.01;
            const hiddenUnits = parseInt(document.getElementById('hiddenUnits').value) || 128;
            const batchSize = parseInt(document.getElementById('batchSize').value) || 32;
            const optimizer = document.getElementById('optimizer').value || 'adam';

            // Validate inputs
            if (epochs < 1 || epochs > 50) {
                this.showError('Epochs must be between 1 and 50');
                return;
            }

            if (learningRate < 0.001 || learningRate > 0.1) {
                this.showError('Learning rate must be between 0.001 and 0.1');
                return;
            }

            if (hiddenUnits < 32 || hiddenUnits > 512) {
                this.showError('Hidden units must be between 32 and 512');
                return;
            }

            // Update UI for training
            this.setTrainingUIState(true);

            // Start training
            const result = await this.trainingManager.trainModel(epochs, learningRate, hiddenUnits, batchSize, optimizer);

            if (result.success) {
                this.showSuccess(`Training completed successfully in ${(result.trainingTime / 1000).toFixed(1)}s`);
                this.updatePredictionDisplay();
            }

        } catch (error) {
            console.error('Training error:', error);
            this.showError('Training failed: ' + error.message);
        } finally {
            this.setTrainingUIState(false);
        }
    }

    // Handle reset button click
    handleResetClick() {
        if (!this.isInitialized) {
            this.showError('Application not initialized');
            return;
        }

        if (this.trainingManager.isTrainingInProgress()) {
            this.showWarning('Cannot reset during training');
            return;
        }

        try {
            // Reset model
            this.modelManager.resetModel();

            // Clear training history
            this.trainingManager.dispose();

            // Clear visualizations
            this.visualization.resetCharts();

            // Clear canvas
            this.drawingCanvas.clear();

            // Reset UI
            this.updateUIState();
            this.clearPredictionDisplay();

            this.showSuccess('Model reset successfully');

        } catch (error) {
            console.error('Reset error:', error);
            this.showError('Reset failed: ' + error.message);
        }
    }

    // Handle clear canvas button click
    handleClearCanvas() {
        if (this.drawingCanvas) {
            this.drawingCanvas.clear();
            this.clearPredictionDisplay();
        }
    }

    // Handle predict button click
    async handlePredictClick() {
        if (!this.isInitialized) {
            this.showError('Application not initialized');
            return;
        }

        if (!this.modelManager.isReady()) {
            this.showError('Model not trained yet. Please train the model first.');
            return;
        }

        if (!this.drawingCanvas.hasDrawing()) {
            this.showWarning('Please draw a digit first');
            return;
        }

        try {
            // Get image data from canvas
            const imageData = this.drawingCanvas.getImageData();
            
            if (!imageData) {
                this.showError('Failed to get image data');
                return;
            }

            // Make prediction
            const prediction = await this.modelManager.predictWithConfidence(imageData);

            // Update prediction display
            this.updatePredictionDisplay(prediction);

            // Update user drawing preview
            this.updateUserDrawingPreview();

            // Find and display nearest examples
            this.displayNearestExamples(imageData);

            // Clean up tensor
            imageData.dispose();

        } catch (error) {
            console.error('Prediction error:', error);
            this.showError('Prediction failed: ' + error.message);
        }
    }

    // Update prediction display
    updatePredictionDisplay(prediction = null) {
        const predictionDigit = document.querySelector('.prediction-digit');
        const predictionConfidence = document.querySelector('.prediction-confidence');

        if (prediction) {
            if (predictionDigit) {
                predictionDigit.textContent = prediction.digit;
            }
            if (predictionConfidence) {
                predictionConfidence.textContent = `${prediction.confidence.toFixed(1)}%`;
            }
        } else {
            this.clearPredictionDisplay();
        }
    }

    // Clear prediction display
    clearPredictionDisplay() {
        const predictionDigit = document.querySelector('.prediction-digit');
        const predictionConfidence = document.querySelector('.prediction-confidence');

        if (predictionDigit) {
            predictionDigit.textContent = '-';
        }
        if (predictionConfidence) {
            predictionConfidence.textContent = '0%';
        }
    }

    // Set training UI state
    setTrainingUIState(isTraining) {
        const trainBtn = document.getElementById('trainBtn');
        const resetBtn = document.getElementById('resetBtn');
        const progressText = document.getElementById('progressText');

        if (trainBtn) {
            trainBtn.disabled = isTraining;
            trainBtn.textContent = isTraining ? 'Training...' : 'Start Training';
        }

        if (resetBtn) {
            resetBtn.disabled = isTraining;
        }

        if (progressText && !isTraining) {
            progressText.textContent = 'Ready to train';
        }
    }

    // Update UI state
    updateUIState() {
        if (!this.isInitialized) return;

        const isModelReady = this.modelManager.isReady();
        const isTraining = this.trainingManager.isTrainingInProgress();

        // Update button states
        const trainBtn = document.getElementById('trainBtn');
        const resetBtn = document.getElementById('resetBtn');

        if (trainBtn) {
            trainBtn.disabled = isTraining;
        }

        if (resetBtn) {
            resetBtn.disabled = isTraining;
        }

        // Update model status
        const modelStatus = document.getElementById('modelStatus');
        if (modelStatus) {
            if (isTraining) {
                modelStatus.textContent = 'Training...';
                modelStatus.className = 'info-value warning';
            } else if (isModelReady) {
                modelStatus.textContent = 'Trained';
                modelStatus.className = 'info-value success';
            } else {
                modelStatus.textContent = 'Not trained';
                modelStatus.className = 'info-value';
            }
        }
    }

    // Show success message
    showSuccess(message) {
        console.log('Success:', message);
        // You could implement a toast notification system here
    }

    // Show error message
    showError(message) {
        console.error('Error:', message);
        // You could implement a toast notification system here
    }

    // Show warning message
    showWarning(message) {
        console.warn('Warning:', message);
        // You could implement a toast notification system here
    }

    // Update user drawing preview
    updateUserDrawingPreview() {
        const previewCanvas = document.getElementById('userDrawingPreview');
        const mainCanvas = document.getElementById('drawingCanvas');
        
        if (previewCanvas && mainCanvas) {
            const ctx = previewCanvas.getContext('2d');
            ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            ctx.drawImage(mainCanvas, 0, 0, previewCanvas.width, previewCanvas.height);
        }
    }

    // Display nearest training examples
    async displayNearestExamples(userImageData) {
        if (!this.trainingManager.rawTrainData) return;

        try {
            const nearestExamples = this.findNearestExamples(userImageData, 6);
            this.renderNearestExamples(nearestExamples);
        } catch (error) {
            console.error('Error finding nearest examples:', error);
        }
    }

    // Find nearest examples using simple distance calculation
    findNearestExamples(userImage, numExamples = 6) {
        const userPixels = Array.from(userImage.dataSync());
        const distances = [];

        for (let i = 0; i < this.trainingManager.rawTrainData.images.length; i++) {
            const trainImage = this.trainingManager.rawTrainData.images[i];
            const distance = this.calculateDistance(userPixels, trainImage);
            distances.push({
                index: i,
                distance: distance,
                image: trainImage,
                label: this.trainingManager.rawTrainData.labels[i]
            });
        }

        // Sort by distance and take the nearest examples
        distances.sort((a, b) => a.distance - b.distance);
        return distances.slice(0, numExamples);
    }

    // Calculate Euclidean distance between two images
    calculateDistance(image1, image2) {
        let sum = 0;
        for (let i = 0; i < image1.length; i++) {
            const diff = image1[i] - image2[i];
            sum += diff * diff;
        }
        return Math.sqrt(sum);
    }

    // Render nearest examples in the UI
    renderNearestExamples(examples) {
        const container = document.getElementById('nearestExamples');
        if (!container) return;

        container.innerHTML = '';

        examples.forEach(example => {
            const exampleItem = document.createElement('div');
            exampleItem.className = 'example-item';

            const canvas = document.createElement('canvas');
            canvas.className = 'example-canvas';
            canvas.width = 56;
            canvas.height = 56;

            const label = document.createElement('div');
            label.className = 'example-label';
            label.textContent = example.label;

            const similarity = document.createElement('div');
            similarity.className = 'example-similarity';
            similarity.textContent = `${(100 - example.distance * 10).toFixed(0)}%`;

            // Draw the example image
            this.drawImageOnCanvas(canvas, example.image);

            exampleItem.appendChild(canvas);
            exampleItem.appendChild(label);
            exampleItem.appendChild(similarity);
            container.appendChild(exampleItem);
        });
    }

    // Draw image data on a canvas
    drawImageOnCanvas(canvas, imageData) {
        const ctx = canvas.getContext('2d');
        const imageDataObj = ctx.createImageData(canvas.width, canvas.height);
        
        for (let i = 0; i < imageData.length; i++) {
            const pixelValue = Math.floor(imageData[i] * 255);
            const pixelIndex = i * 4;
            imageDataObj.data[pixelIndex] = pixelValue;     // Red
            imageDataObj.data[pixelIndex + 1] = pixelValue; // Green
            imageDataObj.data[pixelIndex + 2] = pixelValue; // Blue
            imageDataObj.data[pixelIndex + 3] = 255;        // Alpha
        }
        
        ctx.putImageData(imageDataObj, 0, 0);
    }

    // Handle save model
    async handleSaveModel() {
        if (!this.modelManager.isReady()) {
            this.showError('No trained model to save');
            return;
        }

        try {
            await this.modelManager.saveModel();
            this.showSuccess('Model saved successfully');
        } catch (error) {
            console.error('Save model error:', error);
            this.showError('Failed to save model: ' + error.message);
        }
    }

    // Handle load model
    async handleLoadModel() {
        try {
            await this.modelManager.loadModel();
            this.showSuccess('Model loaded successfully');
            this.updateUIState();
        } catch (error) {
            console.error('Load model error:', error);
            this.showError('Failed to load model: ' + error.message);
        }
    }

    // Get application state
    getState() {
        return {
            isInitialized: this.isInitialized,
            isModelReady: this.modelManager ? this.modelManager.isReady() : false,
            isTraining: this.trainingManager ? this.trainingManager.isTrainingInProgress() : false,
            hasDrawing: this.drawingCanvas ? this.drawingCanvas.hasDrawing() : false
        };
    }

    // Cleanup resources
    dispose() {
        if (this.modelManager) {
            this.modelManager.resetModel();
        }

        if (this.trainingManager) {
            this.trainingManager.dispose();
        }

        if (this.visualization) {
            this.visualization.destroy();
        }

        this.isInitialized = false;
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const app = new InteractiveNN();
    await app.initialize();
    
    // Make app globally available for debugging
    window.nnApp = app;
});

// Export for use in other modules
window.InteractiveNN = InteractiveNN;
