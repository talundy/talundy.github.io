// Drawing Canvas Functionality

class DrawingCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        
        // Canvas settings
        this.brushSize = 20;
        this.brushColor = '#000000';
        this.backgroundColor = '#ffffff';
        
        this.initializeCanvas();
        this.setupEventListeners();
    }

    // Initialize canvas settings
    initializeCanvas() {
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }

        // Set canvas size
        this.canvas.width = 280;
        this.canvas.height = 280;

        // Set drawing styles
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = this.brushSize;
        this.ctx.strokeStyle = this.brushColor;
        this.ctx.fillStyle = this.backgroundColor;

        // Fill background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Setup event listeners for drawing
    setupEventListeners() {
        if (!this.canvas) return;

        // Mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));

        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Start drawing
    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
    }

    // Draw on canvas
    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();

        this.lastX = currentX;
        this.lastY = currentY;
    }

    // Stop drawing
    stopDrawing() {
        this.isDrawing = false;
    }

    // Handle touch events
    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                         e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    // Clear the canvas
    clear() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.brushColor;
    }

    // Get canvas image data as tensor
    getImageData() {
        if (!this.canvas) return null;

        // Get image data
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        // Convert to grayscale and normalize
        const grayscale = [];
        for (let i = 0; i < data.length; i += 4) {
            // Convert RGB to grayscale using luminance formula
            const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
            // Normalize to 0-1 range (invert so black = 1, white = 0)
            grayscale.push((255 - gray) / 255);
        }

        // Reshape to 28x28 (MNIST format)
        const reshaped = [];
        for (let i = 0; i < 28; i++) {
            const row = [];
            for (let j = 0; j < 28; j++) {
                // Sample from the 280x280 canvas to get 28x28
                const sourceX = Math.floor(j * 10);
                const sourceY = Math.floor(i * 10);
                const sourceIndex = sourceY * 280 + sourceX;
                row.push(grayscale[sourceIndex] || 0);
            }
            reshaped.push(row);
        }

        // Flatten to 1D array
        const flattened = reshaped.flat();

        // Create tensor
        return tf.tensor2d([flattened], [1, 784]);
    }

    // Check if canvas has any drawing
    hasDrawing() {
        if (!this.canvas) return false;

        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        // Check if any pixel is not white
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
                return true;
            }
        }
        return false;
    }

    // Set brush size
    setBrushSize(size) {
        this.brushSize = size;
        this.ctx.lineWidth = size;
    }

    // Set brush color
    setBrushColor(color) {
        this.brushColor = color;
        this.ctx.strokeStyle = color;
    }

    // Get canvas as data URL
    getDataURL() {
        return this.canvas.toDataURL();
    }

    // Load image from data URL
    loadFromDataURL(dataURL) {
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        };
        img.src = dataURL;
    }

    // Resize canvas
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.initializeCanvas();
    }

    // Get canvas dimensions
    getDimensions() {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    // Enable/disable drawing
    setDrawingEnabled(enabled) {
        this.canvas.style.pointerEvents = enabled ? 'auto' : 'none';
        this.canvas.style.cursor = enabled ? 'crosshair' : 'default';
    }

    // Add grid overlay (for debugging)
    showGrid() {
        this.ctx.strokeStyle = '#cccccc';
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= this.canvas.width; x += 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.canvas.height; y += 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Reset drawing styles
        this.ctx.strokeStyle = this.brushColor;
        this.ctx.lineWidth = this.brushSize;
    }

    // Remove grid overlay
    hideGrid() {
        this.clear();
    }
}

// Export for use in other modules
window.DrawingCanvas = DrawingCanvas;
