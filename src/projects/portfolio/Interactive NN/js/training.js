// Training Functions for Neural Network

class TrainingManager {
    constructor(modelManager) {
        this.modelManager = modelManager;
        this.trainingData = null;
        this.testData = null;
        this.isTraining = false;
        this.trainingStartTime = null;
    }

    // Load MNIST data using TensorFlow.js data utilities
    async loadData() {
        try {
            console.log('Loading MNIST data...');
            this.updateDataStatus('Loading MNIST data...');
            
            // Try to load MNIST data, but with better error handling
            const { trainData, testData } = await this.loadMNISTSubset();
            
            this.trainingData = trainData;
            this.testData = testData;
            
            console.log('MNIST data loaded successfully');
            console.log(`Training samples: ${this.trainingData.xs.shape[0]}`);
            console.log(`Test samples: ${this.testData.xs.shape[0]}`);
            
            this.updateDataStatus('Data loaded successfully');
            this.updateDataCount(this.trainingData.xs.shape[0], this.testData.xs.shape[0]);
            this.displaySampleDigits();
            
            return { trainData, testData };
        } catch (error) {
            console.error('Error loading MNIST data:', error);
            this.updateDataStatus('MNIST data unavailable, using synthetic data');
            
            // Fallback to synthetic data if MNIST loading fails
            console.log('Falling back to synthetic data...');
            const { trainData, testData } = this.generateSyntheticData();
            
            this.trainingData = trainData;
            this.testData = testData;
            
            this.updateDataStatus('Using synthetic data');
            this.updateDataCount(this.trainingData.xs.shape[0], this.testData.xs.shape[0]);
            this.displaySampleDigits();
            
            return { trainData, testData };
        }
    }

    // Load MNIST subset focusing on digits 0, 1, 2
    async loadMNISTSubset() {
        try {
            // Use a different MNIST data source that's more reliable
            const response = await fetch('https://storage.googleapis.com/tfjs-examples/mnist_train.csv');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const csvText = await response.text();
            const lines = csvText.split('\n').filter(line => line.trim());
            
            // Parse CSV data
            const dataArray = lines.map(line => {
                const values = line.split(',');
                const label = parseInt(values[0]);
                const pixels = values.slice(1).map(val => parseFloat(val) / 255.0);
                return { label, pixels };
            });
            
            // Filter for digits 0, 1, 2 only
            const filteredData = dataArray.filter(row => {
                const label = row.label;
                return label >= 0 && label <= 2;
            });
            
            // Split into train/test (80/20)
            const splitIndex = Math.floor(filteredData.length * 0.8);
            const trainData = filteredData.slice(0, splitIndex);
            const testData = filteredData.slice(splitIndex);
            
            // Process training data
            const trainImages = trainData.map(row => row.pixels);
            const trainLabels = trainData.map(row => row.label);
            
            // Process test data
            const testImages = testData.map(row => row.pixels);
            const testLabels = testData.map(row => row.label);
            
            // Convert to tensors
            const trainX = tf.tensor2d(trainImages);
            const trainY = tf.oneHot(tf.tensor1d(trainLabels, 'int32'), 3); // 3 classes: 0, 1, 2
            
            const testX = tf.tensor2d(testImages);
            const testY = tf.oneHot(tf.tensor1d(testLabels, 'int32'), 3);
            
            // Store raw data for visualization
            this.rawTrainData = { images: trainImages, labels: trainLabels };
            this.rawTestData = { images: testImages, labels: testLabels };
            
            return {
                trainData: { xs: trainX, ys: trainY },
                testData: { xs: testX, ys: testY }
            };
            
        } catch (error) {
            console.error('Error loading MNIST subset:', error);
            throw error;
        }
    }

    // Generate synthetic MNIST-like data for demonstration (fallback)
    generateSyntheticData() {
        const numTrainSamples = 1000;
        const numTestSamples = 200;
        const imageSize = 28 * 28; // 784 pixels
        const numClasses = 3; // Only digits 0, 1, 2

        // Generate more realistic synthetic data
        const trainImages = [];
        const trainLabels = [];
        const testImages = [];
        const testLabels = [];

        // Generate training data
        for (let i = 0; i < numTrainSamples; i++) {
            const label = Math.floor(Math.random() * numClasses);
            const image = this.generateDigitImage(label);
            trainImages.push(image);
            trainLabels.push(label);
        }

        // Generate test data
        for (let i = 0; i < numTestSamples; i++) {
            const label = Math.floor(Math.random() * numClasses);
            const image = this.generateDigitImage(label);
            testImages.push(image);
            testLabels.push(label);
        }

        // Convert to tensors
        const trainX = tf.tensor2d(trainImages);
        const trainY = tf.oneHot(tf.tensor1d(trainLabels, 'int32'), numClasses);
        const testX = tf.tensor2d(testImages);
        const testY = tf.oneHot(tf.tensor1d(testLabels, 'int32'), numClasses);

        // Store raw data for visualization
        this.rawTrainData = { images: trainImages, labels: trainLabels };
        this.rawTestData = { images: testImages, labels: testLabels };

        return {
            trainData: { xs: trainX, ys: trainY },
            testData: { xs: testX, ys: testY }
        };
    }

    // Generate a simple digit-like image
    generateDigitImage(digit) {
        const image = new Array(784).fill(0);
        
        // Create simple patterns for each digit
        switch (digit) {
            case 0: // Circle-like pattern
                for (let i = 0; i < 28; i++) {
                    for (let j = 0; j < 28; j++) {
                        const dist = Math.sqrt((i - 14) ** 2 + (j - 14) ** 2);
                        if (dist > 8 && dist < 12) {
                            image[i * 28 + j] = Math.random() * 0.8 + 0.2;
                        }
                    }
                }
                break;
            case 1: // Vertical line
                for (let i = 4; i < 24; i++) {
                    for (let j = 10; j < 18; j++) {
                        image[i * 28 + j] = Math.random() * 0.8 + 0.2;
                    }
                }
                break;
            case 2: // Curved pattern
                for (let i = 0; i < 28; i++) {
                    for (let j = 0; j < 28; j++) {
                        if ((i < 8 && j > 4 && j < 24) || 
                            (i > 8 && i < 20 && j > 20) ||
                            (i > 20 && j > 4 && j < 24)) {
                            image[i * 28 + j] = Math.random() * 0.8 + 0.2;
                        }
                    }
                }
                break;
        }
        
        return image;
    }

    // Train the model
    async trainModel(epochs = 10, learningRate = 0.01, hiddenUnits = 128, batchSize = 32, optimizer = 'adam') {
        if (this.isTraining) {
            throw new Error('Training already in progress');
        }

        try {
            this.isTraining = true;
            this.trainingStartTime = Date.now();
            
            // Update model hyperparameters
            this.modelManager.updateHyperparameters(learningRate, hiddenUnits, optimizer);
            
            // Create model if it doesn't exist
            if (!this.modelManager.model) {
                this.modelManager.createModel(784, hiddenUnits, 3);
            }

            // Load data if not already loaded
            if (!this.trainingData) {
                await this.loadData();
            }

            this.modelManager.setTrainingState(true);
            this.modelManager.clearTrainingHistory();

            console.log('Starting training...');
            console.log(`Epochs: ${epochs}, Learning Rate: ${learningRate}, Hidden Units: ${hiddenUnits}`);

            // Training loop
            for (let epoch = 0; epoch < epochs; epoch++) {
                console.log(`Epoch ${epoch + 1}/${epochs}`);
                
                // Train for one epoch
                const history = await this.modelManager.model.fit(
                    this.trainingData.xs,
                    this.trainingData.ys,
                    {
                        epochs: 1,
                        batchSize: batchSize,
                        validationData: [this.testData.xs, this.testData.ys],
                        verbose: 0
                    }
                );

                // Extract metrics
                const loss = history.history.loss[0];
                const accuracy = history.history.acc[0];
                const valLoss = history.history.val_loss[0];
                const valAccuracy = history.history.val_acc[0];

                // Store metrics
                this.modelManager.addTrainingMetrics(epoch + 1, valAccuracy, valLoss);

                // Update UI
                this.updateTrainingProgress(epoch + 1, epochs, valAccuracy, valLoss);

                // Clean up - check if dispose method exists
                if (history && typeof history.dispose === 'function') {
                    history.dispose();
                }
            }

            const trainingTime = Date.now() - this.trainingStartTime;
            console.log(`Training completed in ${trainingTime}ms`);

            // Final evaluation
            const finalMetrics = await this.evaluateModel();
            
            return {
                success: true,
                trainingTime,
                finalMetrics
            };

        } catch (error) {
            console.error('Training error:', error);
            throw error;
        } finally {
            this.isTraining = false;
            this.modelManager.setTrainingState(false);
        }
    }

    // Evaluate the model
    async evaluateModel() {
        if (!this.modelManager.model || !this.testData) {
            throw new Error('Model or test data not available');
        }

        try {
            const evaluation = this.modelManager.model.evaluate(
                this.testData.xs,
                this.testData.ys,
                { verbose: 0 }
            );

            const loss = evaluation[0].dataSync()[0];
            const accuracy = evaluation[1].dataSync()[0];

            // Clean up - dispose each tensor in the evaluation array
            if (Array.isArray(evaluation)) {
                evaluation.forEach(tensor => {
                    if (tensor && typeof tensor.dispose === 'function') {
                        tensor.dispose();
                    }
                });
            }

            return {
                loss: loss,
                accuracy: accuracy
            };
        } catch (error) {
            console.error('Evaluation error:', error);
            throw error;
        }
    }

    // Update training progress in UI
    updateTrainingProgress(currentEpoch, totalEpochs, accuracy, loss) {
        const progress = (currentEpoch / totalEpochs) * 100;
        
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Epoch ${currentEpoch}/${totalEpochs} - Accuracy: ${(accuracy * 100).toFixed(1)}%`;
        }

        // Update model info
        this.updateModelInfo(accuracy, loss);
    }

    // Update model information display
    updateModelInfo(accuracy, loss) {
        const modelAccuracy = document.getElementById('modelAccuracy');
        const modelLoss = document.getElementById('modelLoss');
        const modelStatus = document.getElementById('modelStatus');
        const trainingTime = document.getElementById('trainingTime');

        if (modelAccuracy) {
            modelAccuracy.textContent = `${(accuracy * 100).toFixed(1)}%`;
        }

        if (modelLoss) {
            modelLoss.textContent = loss.toFixed(4);
        }

        if (modelStatus) {
            modelStatus.textContent = this.isTraining ? 'Training...' : 'Trained';
            modelStatus.className = this.isTraining ? 'info-value warning' : 'info-value success';
        }

        if (trainingTime && this.trainingStartTime) {
            const elapsed = Date.now() - this.trainingStartTime;
            trainingTime.textContent = `${(elapsed / 1000).toFixed(1)}s`;
        }
    }

    // Stop training
    stopTraining() {
        if (this.isTraining) {
            this.isTraining = false;
            this.modelManager.setTrainingState(false);
            console.log('Training stopped');
        }
    }

    // Check if training is in progress
    isTrainingInProgress() {
        return this.isTraining;
    }

    // Get training data info
    getDataInfo() {
        if (!this.trainingData) {
            return null;
        }

        return {
            trainSamples: this.trainingData.xs.shape[0],
            testSamples: this.testData.xs.shape[0],
            inputShape: this.trainingData.xs.shape[1],
            numClasses: this.testData.ys.shape[1]
        };
    }

    // Update data status in UI
    updateDataStatus(status) {
        const dataStatus = document.getElementById('dataStatus');
        if (dataStatus) {
            dataStatus.textContent = status;
            dataStatus.className = status.includes('Error') ? 'data-status error' : 
                                  status.includes('Loading') ? 'data-status warning' : 
                                  'data-status success';
        }
    }

    // Update data count in UI
    updateDataCount(trainCount, testCount) {
        const dataCount = document.getElementById('dataCount');
        if (dataCount) {
            dataCount.textContent = `Train: ${trainCount} | Test: ${testCount}`;
        }
    }

    // Display sample digits from training data
    displaySampleDigits() {
        const sampleDigitsContainer = document.getElementById('sampleDigits');
        if (!sampleDigitsContainer || !this.rawTrainData) return;

        // Clear existing samples
        sampleDigitsContainer.innerHTML = '';

        // Get one sample from each class (0, 1, 2)
        const samples = [];
        for (let digit = 0; digit < 3; digit++) {
            const index = this.rawTrainData.labels.findIndex(label => label === digit);
            if (index !== -1) {
                samples.push({
                    image: this.rawTrainData.images[index],
                    label: digit
                });
            }
        }

        // Create canvas elements for each sample
        samples.forEach(sample => {
            const digitContainer = document.createElement('div');
            digitContainer.className = 'digit-sample';

            const canvas = document.createElement('canvas');
            canvas.className = 'digit-canvas';
            canvas.width = 28;
            canvas.height = 28;

            const label = document.createElement('div');
            label.className = 'digit-label';
            label.textContent = sample.label;

            // Draw the digit on canvas
            this.drawDigitOnCanvas(canvas, sample.image);

            digitContainer.appendChild(canvas);
            digitContainer.appendChild(label);
            sampleDigitsContainer.appendChild(digitContainer);
        });
    }

    // Draw a digit on a canvas element
    drawDigitOnCanvas(canvas, imageData) {
        const ctx = canvas.getContext('2d');
        const imageDataObj = ctx.createImageData(28, 28);
        
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

    // Clean up resources
    dispose() {
        if (this.trainingData) {
            this.trainingData.xs.dispose();
            this.trainingData.ys.dispose();
        }
        if (this.testData) {
            this.testData.xs.dispose();
            this.testData.ys.dispose();
        }
    }
}

// Export for use in other modules
window.TrainingManager = TrainingManager;
