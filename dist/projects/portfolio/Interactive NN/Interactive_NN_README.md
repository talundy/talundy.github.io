Project: Interactive Neural Network Training + Digit Recognition Demo
MVP Features:
Load a small subset of MNIST digits (e.g., 0, 1, 2) directly in-browser.
Train a simple neural network (1–2 hidden layers) using TensorFlow.js.
Display live training progress with charts (accuracy, loss per epoch).
Provide a drawing canvas for the user to input digits.
Classify drawn digits with the trained model and display prediction + confidence.
Stretch Goals:
Show a 2D visualization of decision boundaries or feature embeddings updating during training.
Allow the user to adjust hyperparameters (learning rate, number of epochs, hidden units).
Add option to reset and retrain the model.
Provide a side-by-side comparison of the user’s drawn digit with nearest training examples.
Let the user save or share their trained model.
Tech Stack:
TensorFlow.js (neural network training and inference in-browser).
HTML5 Canvas (digit drawing interface).
Chart.js or D3.js (training progress visualization).
Vanilla JS or lightweight framework (React/Vanilla/whatever you prefer for structuring UI).

Interactive NN/
│
├── interactive_NN.html              # Main entry point
├── interactive_NN.css               # Custom styling
├── interactive_NN.js               # Main app logic (UI + drawing + training)
│
├── js/
│   ├── model.js            # TensorFlow.js model creation & training
│   ├── training.js         # Functions for loading data, training loop
│   ├── visualization.js    # Chart.js/D3.js plots for accuracy/loss
│   └── canvas.js           # Drawing pad logic
│
├── data/
│   └── mnist-sample.json   # Preprocessed small MNIST subset (optional, or load online)
│
├── assets/
│   └── icons/              # Any icons or images used in UI
│
└── Interactive_NN_README.md               # This document
