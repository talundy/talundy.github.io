// Neural Network Model Creation and Management

class NeuralNetworkModel {
    constructor() {
        this.model = null;
        this.isTraining = false;
        this.trainingHistory = {
            accuracy: [],
            loss: [],
            epochs: []
        };
    }

    // Create a new neural network model
    createModel(inputShape = 784, hiddenUnits = 128, numClasses = 3, optimizer = 'adam', learningRate = 0.01) {
        this.model = tf.sequential({
            layers: [
                // Input layer
                tf.layers.dense({
                    inputShape: [inputShape],
                    units: hiddenUnits,
                    activation: 'relu',
                    kernelInitializer: 'varianceScaling'
                }),
                
                // Hidden layer
                tf.layers.dense({
                    units: hiddenUnits,
                    activation: 'relu',
                    kernelInitializer: 'varianceScaling'
                }),
                
                // Dropout for regularization
                tf.layers.dropout({ rate: 0.2 }),
                
                // Output layer
                tf.layers.dense({
                    units: numClasses,
                    activation: 'softmax',
                    kernelInitializer: 'varianceScaling'
                })
            ]
        });

        // Choose optimizer
        let optimizerInstance;
        switch (optimizer) {
            case 'sgd':
                optimizerInstance = tf.train.sgd(learningRate);
                break;
            case 'rmsprop':
                optimizerInstance = tf.train.rmsprop(learningRate);
                break;
            case 'adam':
            default:
                optimizerInstance = tf.train.adam(learningRate);
                break;
        }

        // Compile the model
        this.model.compile({
            optimizer: optimizerInstance,
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        console.log('Model created successfully');
        this.model.summary();
        return this.model;
    }

    // Get model summary information
    getModelInfo() {
        if (!this.model) {
            return {
                totalParams: 0,
                trainableParams: 0,
                layers: 0
            };
        }

        const totalParams = this.model.countParams();
        const trainableParams = this.model.countParams();
        
        return {
            totalParams,
            trainableParams,
            layers: this.model.layers.length
        };
    }

    // Update model hyperparameters
    updateHyperparameters(learningRate, hiddenUnits, optimizer = 'adam') {
        if (!this.model) return;

        // If hidden units or optimizer changed, recreate model
        const currentHiddenUnits = this.model.layers[0].units;
        if (currentHiddenUnits !== hiddenUnits) {
            this.createModel(784, hiddenUnits, 3, optimizer, learningRate);
        } else {
            // Just update learning rate
            this.model.optimizer.learningRate = learningRate;
        }
    }

    // Reset the model
    resetModel() {
        if (this.model) {
            this.model.dispose();
        }
        this.model = null;
        this.trainingHistory = {
            accuracy: [],
            loss: [],
            epochs: []
        };
        this.isTraining = false;
        console.log('Model reset');
    }

    // Check if model is ready for training
    isReady() {
        return this.model !== null && !this.isTraining;
    }

    // Set training state
    setTrainingState(isTraining) {
        this.isTraining = isTraining;
    }

    // Add training metrics to history
    addTrainingMetrics(epoch, accuracy, loss) {
        this.trainingHistory.epochs.push(epoch);
        this.trainingHistory.accuracy.push(accuracy);
        this.trainingHistory.loss.push(loss);
    }

    // Get training history
    getTrainingHistory() {
        return this.trainingHistory;
    }

    // Clear training history
    clearTrainingHistory() {
        this.trainingHistory = {
            accuracy: [],
            loss: [],
            epochs: []
        };
    }

    // Predict on input data
    async predict(inputData) {
        if (!this.model) {
            throw new Error('Model not initialized');
        }

        try {
            const prediction = this.model.predict(inputData);
            const predictionData = await prediction.data();
            prediction.dispose();
            return predictionData;
        } catch (error) {
            console.error('Prediction error:', error);
            throw error;
        }
    }

    // Get prediction with confidence
    async predictWithConfidence(inputData) {
        const predictions = await this.predict(inputData);
        const maxIndex = predictions.indexOf(Math.max(...predictions));
        const confidence = predictions[maxIndex] * 100;
        
        return {
            digit: maxIndex,
            confidence: confidence,
            allPredictions: Array.from(predictions)
        };
    }

    // Save model (for future implementation)
    async saveModel() {
        if (!this.model) {
            throw new Error('No model to save');
        }
        
        // This would save to browser's IndexedDB or download as file
        console.log('Model save functionality not yet implemented');
    }

    // Load model (for future implementation)
    async loadModel() {
        console.log('Model load functionality not yet implemented');
    }
}

// Export for use in other modules
window.NeuralNetworkModel = NeuralNetworkModel;
