// Depth-First Search Algorithm Visualizer - No Dependencies
// Shared JavaScript for algorithm visualization components

class DepthFirstSearchVisualizer {
    constructor() {
        this.graph = [];
        this.adjacencyList = [];
        this.operations = [];
        this.currentStep = 0;
        this.isPlaying = false;
        this.speed = 1;
        this.animationId = null;
        this.lastFrameTime = 0;
        this.nodePositions = [];
        
        this.initializeElements();
        this.bindEvents();
        this.generateGraph();
    }

    initializeElements() {
        this.visualization = document.getElementById('visualization');
        this.sizeSlider = document.getElementById('graph-size');
        this.sizeDisplay = document.getElementById('size-display');
        this.typeSelect = document.getElementById('graph-type');
        this.generateBtn = document.getElementById('generate-btn');
        this.stepBackBtn = document.getElementById('step-back');
        this.playPauseBtn = document.getElementById('play-pause');
        this.stepForwardBtn = document.getElementById('step-forward');
        this.resetBtn = document.getElementById('reset');
        this.speedSlider = document.getElementById('speed');
        this.speedDisplay = document.getElementById('speed-display');
        this.stepDisplay = document.getElementById('step-display');
        this.nodesVisitedDisplay = document.getElementById('nodes-visited');
        this.stackSizeDisplay = document.getElementById('stack-size');
    }

    bindEvents() {
        this.sizeSlider.addEventListener('input', (e) => {
            this.sizeDisplay.textContent = e.target.value;
        });

        this.generateBtn.addEventListener('click', () => this.generateGraph());
        this.typeSelect.addEventListener('change', () => this.generateGraph());
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

    generateGraph() {
        const size = parseInt(this.sizeSlider.value);
        const type = this.typeSelect.value;
        
        this.graph = this.createGraph(size, type);
        this.adjacencyList = this.createAdjacencyList(this.graph);
        this.nodePositions = this.calculateNodePositions(size, type);
        this.generateOperations();
        this.reset();
        this.render();
    }

    createGraph(size, type) {
        let graph = [];
        
        switch(type) {
            case 'binary-tree':
                // Create a binary tree structure
                graph = Array.from({length: size}, (_, i) => ({
                    id: i,
                    value: i + 1,
                    left: 2 * i + 1 < size ? 2 * i + 1 : null,
                    right: 2 * i + 2 < size ? 2 * i + 2 : null
                }));
                break;
                
            case 'random-tree':
                // Create a random tree structure
                graph = Array.from({length: size}, (_, i) => ({
                    id: i,
                    value: i + 1,
                    children: []
                }));
                
                // Create a random tree by connecting nodes randomly
                // Start with node 0 as root, then randomly connect other nodes
                const connected = new Set([0]);
                const unconnected = Array.from({length: size - 1}, (_, i) => i + 1);
                
                while (unconnected.length > 0) {
                    const randomUnconnected = unconnected.splice(Math.floor(Math.random() * unconnected.length), 1)[0];
                    const randomConnected = Array.from(connected)[Math.floor(Math.random() * connected.size)];
                    
                    // Add bidirectional connection
                    graph[randomConnected].children.push(randomUnconnected);
                    graph[randomUnconnected].children.push(randomConnected);
                    connected.add(randomUnconnected);
                }
                break;
                
            case 'grid':
                // Create a grid structure
                const gridSize = Math.ceil(Math.sqrt(size));
                graph = [];
                for (let i = 0; i < size; i++) {
                    const row = Math.floor(i / gridSize);
                    const col = i % gridSize;
                    const neighbors = [];
                    
                    // Add adjacent grid neighbors
                    if (row > 0) neighbors.push(i - gridSize);
                    if (row < gridSize - 1 && i + gridSize < size) neighbors.push(i + gridSize);
                    if (col > 0) neighbors.push(i - 1);
                    if (col < gridSize - 1 && i + 1 < size) neighbors.push(i + 1);
                    
                    graph.push({
                        id: i,
                        value: i + 1,
                        neighbors: neighbors
                    });
                }
                break;
                
            default: // random
                // Create a random graph with random connections
                graph = Array.from({length: size}, (_, i) => ({
                    id: i,
                    value: i + 1,
                    neighbors: []
                }));
                
                // Add random edges
                for (let i = 0; i < size; i++) {
                    const numEdges = Math.floor(Math.random() * 3) + 1; // 1-3 edges per node
                    for (let j = 0; j < numEdges; j++) {
                        const neighbor = Math.floor(Math.random() * size);
                        if (neighbor !== i && !graph[i].neighbors.includes(neighbor)) {
                            graph[i].neighbors.push(neighbor);
                            graph[neighbor].neighbors.push(i);
                        }
                    }
                }
        }
        
        return graph;
    }

    createAdjacencyList(graph) {
        const adjacencyList = [];
        
        for (let node of graph) {
            if (node.neighbors) {
                adjacencyList[node.id] = node.neighbors;
            } else if (node.children) {
                // Handle random tree structure
                adjacencyList[node.id] = node.children;
            } else if (node.left !== null || node.right !== null) {
                // Handle binary tree structure
                adjacencyList[node.id] = [];
                if (node.left !== null) adjacencyList[node.id].push(node.left);
                if (node.right !== null) adjacencyList[node.id].push(node.right);
            } else {
                adjacencyList[node.id] = [];
            }
        }
        
        return adjacencyList;
    }

    calculateTreeLevels(size) {
        // Calculate the level of each node in the random tree
        const levels = new Array(size).fill(-1);
        const queue = [{node: 0, level: 0}];
        levels[0] = 0;
        
        while (queue.length > 0) {
            const {node, level} = queue.shift();
            const neighbors = this.adjacencyList[node] || [];
            
            for (let neighbor of neighbors) {
                if (levels[neighbor] === -1) {
                    levels[neighbor] = level + 1;
                    queue.push({node: neighbor, level: level + 1});
                }
            }
        }
        
        return levels;
    }

    calculateNodePositions(size, type) {
        const positions = [];
        const containerSize = this.calculateContainerSize();
        const containerWidth = containerSize.width;
        const containerHeight = containerSize.height;
        const nodeRadius = 25;
        const margin = 50;
        
        if (type === 'binary-tree') {
            // Position nodes in a binary tree layout with proper spacing and triangular shape
            const levels = Math.ceil(Math.log2(size + 1));
            const verticalSpacing = 2 * nodeRadius + 20; // At least one node radius + padding
            
            // Binary tree specific horizontal spacing rules
            const baseSpacing = 80; // Base spacing between nodes
            const spacingMultiplier = 1.2; // Multiplier for larger trees
            const minSpacing = Math.max(60, baseSpacing * Math.pow(spacingMultiplier, levels - 4));
            
            // Calculate the required width for the bottom level to maintain triangular shape
            const bottomLevelNodes = Math.pow(2, levels - 1);
            const requiredWidth = (bottomLevelNodes - 1) * minSpacing + (2 * margin) + (2 * nodeRadius);
            const actualWidth = Math.max(containerWidth, requiredWidth);
            
            for (let i = 0; i < size; i++) {
                const level = Math.floor(Math.log2(i + 1));
                const positionInLevel = i - Math.pow(2, level) + 1;
                const nodesInLevel = Math.pow(2, level);
                
                // Calculate spacing for this level to maintain triangular shape
                let x;
                
                if (nodesInLevel === 1) {
                    // Single node (like root) - center it
                    x = actualWidth / 2;
                } else {
                    // Multiple nodes - use consistent spacing and center the level
                    const levelSpacing = minSpacing;
                    
                    // Calculate the total width this level needs
                    const levelWidth = (nodesInLevel - 1) * levelSpacing;
                    
                    // Center the level within the container
                    const levelStartX = (actualWidth - levelWidth) / 2;
                    
                    // Position node with consistent spacing
                    x = levelStartX + (positionInLevel * levelSpacing);
                }
                const y = margin + nodeRadius + (level * verticalSpacing);
                
                positions.push({x, y});
            }
        } else if (type === 'random-tree') {
            // Position nodes in a hierarchical tree layout for random trees
            const levels = this.calculateTreeLevels(size);
            const maxLevel = Math.max(...levels);
            
            // Group nodes by level
            const nodesByLevel = {};
            for (let i = 0; i < size; i++) {
                const level = levels[i];
                if (!nodesByLevel[level]) {
                    nodesByLevel[level] = [];
                }
                nodesByLevel[level].push(i);
            }
            
            // Position nodes within each level
            
            for (let level = 0; level <= maxLevel; level++) {
                const nodesInLevel = nodesByLevel[level] || [];
                const availableWidth = containerWidth - (2 * margin) - (2 * nodeRadius);
                const minSpacing = 2 * nodeRadius + 10; // At least one node radius + padding
                const verticalSpacing = 2 * nodeRadius + 20; // At least one node radius + padding
                
                if (nodesInLevel.length === 1) {
                    // Center single node
                    const nodeId = nodesInLevel[0];
                    positions[nodeId] = {
                        x: containerWidth / 2, 
                        y: margin + nodeRadius + (level * verticalSpacing)
                    };
                } else {
                    // Distribute multiple nodes evenly
                    const spacing = Math.max(minSpacing, availableWidth / (nodesInLevel.length - 1));
                    const startX = margin + nodeRadius;
                    
                    for (let i = 0; i < nodesInLevel.length; i++) {
                        const nodeId = nodesInLevel[i];
                        const x = startX + (i * spacing);
                        const y = margin + nodeRadius + (level * verticalSpacing);
                        
                        // Ensure node stays within container bounds
                        const clampedX = Math.max(margin + nodeRadius, 
                                               Math.min(x, containerWidth - margin - nodeRadius));
                        
                        positions[nodeId] = {x: clampedX, y: y};
                    }
                }
            }
        } else if (type === 'grid') {
            // Position nodes in a grid layout with proper spacing
            const gridSize = Math.ceil(Math.sqrt(size));
            const gridSpacing = 100; // Generous spacing for grid layout
            
            // Calculate required dimensions based on grid spacing
            const requiredWidth = (gridSize - 1) * gridSpacing + (2 * margin) + (2 * nodeRadius);
            const requiredHeight = (gridSize - 1) * gridSpacing + (2 * margin) + (2 * nodeRadius);
            const actualWidth = Math.max(containerWidth, requiredWidth);
            const actualHeight = Math.max(containerHeight, requiredHeight);
            
            // Center the grid within the container
            const gridWidth = (gridSize - 1) * gridSpacing;
            const gridHeight = (gridSize - 1) * gridSpacing;
            const startX = (actualWidth - gridWidth) / 2;
            const startY = (actualHeight - gridHeight) / 2;
            
            for (let i = 0; i < size; i++) {
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                const x = startX + (col * gridSpacing);
                const y = startY + (row * gridSpacing);
                
                positions.push({x, y});
            }
        } else {
            // Random positioning for random graphs with collision avoidance
            const availableWidth = containerWidth - (2 * margin) - (2 * nodeRadius);
            const availableHeight = containerHeight - (2 * margin) - (2 * nodeRadius);
            const minDistance = 2 * nodeRadius + 20; // Minimum distance between nodes
            const maxAttempts = 100; // Maximum attempts to place each node
            
            for (let i = 0; i < size; i++) {
                let attempts = 0;
                let validPosition = false;
                let x, y;
                
                while (!validPosition && attempts < maxAttempts) {
                    x = margin + nodeRadius + Math.random() * availableWidth;
                    y = margin + nodeRadius + Math.random() * availableHeight;
                    
                    // Check if this position is far enough from existing nodes
                    validPosition = true;
                    for (let j = 0; j < i; j++) {
                        const existingPos = positions[j];
                        const distance = Math.sqrt(Math.pow(x - existingPos.x, 2) + Math.pow(y - existingPos.y, 2));
                        if (distance < minDistance) {
                            validPosition = false;
                            break;
                        }
                    }
                    attempts++;
                }
                
                // If we couldn't find a valid position, use a fallback grid-like placement
                if (!validPosition) {
                    const fallbackCol = i % Math.ceil(Math.sqrt(size));
                    const fallbackRow = Math.floor(i / Math.ceil(Math.sqrt(size)));
                    const fallbackSpacing = Math.min(availableWidth, availableHeight) / Math.ceil(Math.sqrt(size));
                    x = margin + nodeRadius + (fallbackCol * fallbackSpacing);
                    y = margin + nodeRadius + (fallbackRow * fallbackSpacing);
                }
                
                positions.push({x, y});
            }
        }
        
        return positions;
    }

    calculateContainerSize() {
        const size = parseInt(this.sizeSlider.value);
        const type = this.typeSelect.value;
        const nodeRadius = 25;
        const margin = 50;
        const minSpacing = 2 * nodeRadius + 10; // At least one node radius + padding
        const verticalSpacing = 2 * nodeRadius + 20; // At least one node radius + padding
        
        let width = 600; // Base width
        let height = 400; // Base height
        
        switch(type) {
            case 'binary-tree':
                const levels = Math.ceil(Math.log2(size + 1));
                const bottomLevelNodes = Math.pow(2, levels - 1);
                
                // Use the same spacing calculation as in positioning
                const baseSpacing = 80;
                const spacingMultiplier = 1.2;
                const binaryTreeSpacing = Math.max(60, baseSpacing * Math.pow(spacingMultiplier, levels - 4));
                
                const requiredWidth = (bottomLevelNodes - 1) * binaryTreeSpacing + (2 * margin) + (2 * nodeRadius);
                width = Math.max(width, Math.min(requiredWidth, 1200)); // Increased cap for better spacing
                height = Math.max(height, (levels * verticalSpacing) + (2 * margin) + (2 * nodeRadius));
                break;
                
            case 'random-tree':
                // For random trees, we need to estimate the layout since we don't have the tree structure yet
                // Use a conservative estimate based on the maximum possible nodes per level
                const estimatedMaxLevel = Math.ceil(Math.log2(size + 1));
                const estimatedMaxNodesPerLevel = Math.min(size, Math.pow(2, estimatedMaxLevel - 1));
                const requiredWidthRandom = (estimatedMaxNodesPerLevel - 1) * minSpacing + (2 * margin) + (2 * nodeRadius);
                width = Math.max(width, Math.min(requiredWidthRandom, 1200)); // Increased cap for better spacing
                height = Math.max(height, (estimatedMaxLevel * verticalSpacing) + (2 * margin) + (2 * nodeRadius));
                break;
                
            case 'grid':
                const gridSize = Math.ceil(Math.sqrt(size));
                const gridSpacing = 100; // Match the spacing used in positioning
                const requiredWidthGrid = (gridSize - 1) * gridSpacing + (2 * margin) + (2 * nodeRadius);
                const requiredHeightGrid = (gridSize - 1) * gridSpacing + (2 * margin) + (2 * nodeRadius);
                width = Math.max(width, Math.min(requiredWidthGrid, 1200)); // Increased cap for better spacing
                height = Math.max(height, Math.min(requiredHeightGrid, 1000)); // Increased cap for better spacing
                break;
                
            case 'random':
                // For random graphs, use a larger base size to accommodate collision avoidance
                const randomBaseWidth = Math.max(800, size * 60); // Scale with number of nodes
                const randomBaseHeight = Math.max(600, size * 45);
                width = Math.max(width, Math.min(randomBaseWidth, 1200));
                height = Math.max(height, Math.min(randomBaseHeight, 1000));
                break;
        }
        
        return { width, height };
    }

    generateOperations() {
        this.operations = [];
        const visited = new Set();
        const stack = [];
        
        // Start DFS from node 0
        this.generateDFSOperations(0, visited, stack);
    }

    generateDFSOperations(startNode, visited, stack) {
        stack.push(startNode);
        this.operations.push({
            type: 'push',
            node: startNode,
            stack: [...stack]
        });
        
        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            
            if (!visited.has(current)) {
                // Mark as visited
                visited.add(current);
                this.operations.push({
                    type: 'visit',
                    node: current,
                    visited: [...visited]
                });
                
                // Get unvisited neighbors
                const neighbors = this.adjacencyList[current] || [];
                const unvisitedNeighbors = neighbors.filter(n => !visited.has(n));
                
                if (unvisitedNeighbors.length > 0) {
                    // Push first unvisited neighbor
                    const nextNode = unvisitedNeighbors[0];
                    stack.push(nextNode);
                    this.operations.push({
                        type: 'push',
                        node: nextNode,
                        stack: [...stack]
                    });
                } else {
                    // Pop current node (backtrack)
                    stack.pop();
                    this.operations.push({
                        type: 'pop',
                        node: current,
                        stack: [...stack]
                    });
                }
            } else {
                // Pop visited node (backtrack)
                stack.pop();
                this.operations.push({
                    type: 'pop',
                    node: current,
                    stack: [...stack]
                });
            }
        }
    }

    render() {
        this.visualization.innerHTML = '';
        
        // Calculate dynamic container size based on graph
        const containerSize = this.calculateContainerSize();
        
        // Create SVG for graph visualization
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', containerSize.height);
        svg.style.overflow = 'visible';
        
        // Draw edges first (so they appear behind nodes)
        this.drawEdges(svg);
        
        // Draw nodes
        this.drawNodes(svg);
        
        this.visualization.appendChild(svg);
        this.updateMetrics();
    }

    drawEdges(svg) {
        const graphType = this.typeSelect.value;
        
        if (graphType === 'binary-tree') {
            // Draw binary tree edges
            for (let i = 0; i < this.graph.length; i++) {
                const node = this.graph[i];
                if (node.left !== null) {
                    this.drawEdge(svg, i, node.left, 'tree');
                }
                if (node.right !== null) {
                    this.drawEdge(svg, i, node.right, 'tree');
                }
            }
        } else if (graphType === 'random-tree') {
            // Draw random tree edges
            for (let i = 0; i < this.adjacencyList.length; i++) {
                const neighbors = this.adjacencyList[i] || [];
                for (let neighbor of neighbors) {
                    if (neighbor > i) { // Avoid drawing edges twice
                        this.drawEdge(svg, i, neighbor, 'tree');
                    }
                }
            }
        } else {
            // Draw graph edges
            for (let i = 0; i < this.adjacencyList.length; i++) {
                const neighbors = this.adjacencyList[i] || [];
                for (let neighbor of neighbors) {
                    if (neighbor > i) { // Avoid drawing edges twice
                        this.drawEdge(svg, i, neighbor, 'graph');
                    }
                }
            }
        }
    }

    drawEdge(svg, from, to, type) {
        const fromPos = this.nodePositions[from];
        const toPos = this.nodePositions[to];
        
        if (!fromPos || !toPos) return;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromPos.x);
        line.setAttribute('y1', fromPos.y);
        line.setAttribute('x2', toPos.x);
        line.setAttribute('y2', toPos.y);
        line.setAttribute('stroke', '#ccc');
        line.setAttribute('stroke-width', '2');
        
        // Highlight edges that are part of current DFS path
        if (this.currentStep > 0) {
            const operation = this.operations[this.currentStep - 1];
            if (operation && operation.type === 'push') {
                if ((operation.node === from && this.isInCurrentPath(to)) ||
                    (operation.node === to && this.isInCurrentPath(from))) {
                    line.setAttribute('stroke', '#4a90e2');
                    line.setAttribute('stroke-width', '3');
                }
            }
        }
        
        svg.appendChild(line);
    }

    drawNodes(svg) {
        for (let i = 0; i < this.graph.length; i++) {
            const node = this.graph[i];
            const pos = this.nodePositions[i];
            
            if (!pos) continue;
            
            // Create node circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', '25');
            circle.setAttribute('fill', '#4a90e2');
            circle.setAttribute('stroke', '#333');
            circle.setAttribute('stroke-width', '2');
            
            // Apply operation styling
            if (this.currentStep > 0) {
                const operation = this.operations[this.currentStep - 1];
                if (operation) {
                    if (operation.type === 'visit' && operation.node === i) {
                        circle.setAttribute('fill', '#27ae60'); // Green for visited
                    } else if (operation.type === 'push' && operation.node === i) {
                        circle.setAttribute('fill', '#f39c12'); // Orange for active
                    } else if (operation.type === 'pop' && operation.node === i) {
                        circle.setAttribute('fill', '#e74c3c'); // Red for backtracking
                    }
                }
                
                // Check if node is currently in stack
                if (this.isInCurrentPath(i)) {
                    circle.setAttribute('stroke', '#e74c3c');
                    circle.setAttribute('stroke-width', '3');
                }
            }
            
            svg.appendChild(circle);
            
            // Create node label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y + 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-weight', 'bold');
            text.textContent = node.value;
            svg.appendChild(text);
        }
    }

    isInCurrentPath(nodeId) {
        if (this.currentStep === 0) return false;
        
        // Check if node is in the current stack
        for (let i = 0; i < this.currentStep; i++) {
            const operation = this.operations[i];
            if (operation && operation.type === 'push' && operation.stack) {
                if (operation.stack.includes(nodeId)) return true;
            }
        }
        return false;
    }

    updateMetrics() {
        this.stepDisplay.textContent = `${this.currentStep} / ${this.operations.length}`;
        
        let nodesVisited = 0;
        let stackSize = 0;
        
        for (let i = 0; i < this.currentStep; i++) {
            const operation = this.operations[i];
            if (operation.type === 'visit') nodesVisited++;
            if (operation.type === 'push' && operation.stack) {
                stackSize = Math.max(stackSize, operation.stack.length);
            }
        }
        
        this.nodesVisitedDisplay.textContent = nodesVisited;
        this.stackSizeDisplay.textContent = stackSize;
        
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
    new DepthFirstSearchVisualizer();
});
