# Algorithm Visualizers

A collection of lightweight, professional algorithm visualizers that demonstrate different algorithms with clean, efficient code. Includes both sorting algorithms and graph traversal algorithms.

## Available Visualizers

### Sorting Algorithms

#### Merge Sort Visualizer
- File: `merge_sort.html`
- Algorithm: Merge Sort (divide-and-conquer)
- Complexity: O(n log n) time, O(n) space
- Best for: Stable sorting, consistent performance

#### Insertion Sort Visualizer
- File: `insertion_sort.html`
- Algorithm: Insertion Sort (incremental)
- Complexity: O(n²) average/worst, O(n) best case
- Best for: Small arrays, nearly sorted data

### Graph Algorithms

#### Depth-First Search Visualizer
- File: `depth_first_search.html`
- Algorithm: Depth-First Search (graph traversal)
- Complexity: O(V + E) time, O(V) space
- Best for: Graph exploration, cycle detection, topological sorting
- Graph Types: Binary trees, grid graphs, random graphs

## Features

### Core Functionality
- Interactive Visualization: Step-by-step algorithm execution
- Professional Controls: Play, pause, step forward/backward, reset
- Keyboard Shortcuts: Space (play/pause), ←/→ (step), R (reset)
- Real-time Metrics: Track algorithm-specific progress indicators
- Responsive Design: Works on desktop and mobile
- No Dependencies: Pure HTML, CSS, and JavaScript
- Shared Styling: Consistent look and feel across all visualizers

### Sorting Algorithm Features
- Multiple Array Patterns: Random, sorted, reversed, nearly sorted
- Array Size Control: Adjustable from 5 to 50 elements
- Metrics: Comparisons, swaps, and step progress

### Graph Algorithm Features
- Multiple Graph Types: Binary trees, grid layouts, random graphs
- Graph Size Control: Adjustable from 5 to 15 nodes
- Metrics: Nodes visited, stack size, and step progress
- Visual Path Tracking: Shows current DFS traversal path

## How to Use

### Sorting Algorithms
1. Choose your algorithm: `merge_sort.html` or `insertion_sort.html`
2. Adjust array size (5-50 elements)
3. Select array pattern (random, sorted, reversed, nearly sorted)
4. Generate new arrays and watch the algorithm work
5. Control playback with buttons or keyboard shortcuts

### Graph Algorithms
1. Choose your algorithm: `depth_first_search.html`
2. Adjust graph size (5-15 nodes)
3. Select graph type (tree, grid, or random)
4. Generate new graphs and watch the DFS traversal
5. Control playback with buttons or keyboard shortcuts

### General Controls
- **Play/Pause**: Start or stop automatic execution
- **Step Forward/Backward**: Move through algorithm steps manually
- **Reset**: Return to initial state
- **Speed Control**: Adjust animation speed from 0.25x to 4x
- **Generate**: Create new data structures to visualize

## Engineering Highlights

- Modular Architecture: Shared CSS and JavaScript patterns
- Clean Code: Well-organized JavaScript classes
- Modern ES6+: Classes, arrow functions, destructuring
- Performance: Efficient rendering with requestAnimationFrame
- Accessibility: Keyboard navigation and semantic HTML
- Responsive: Mobile-first CSS design
- Maintainable: Easy to add new algorithms

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Deployment

Simply upload the HTML files to any web server or GitHub Pages. No build process required!

## Code Structure

### Shared Components
- CSS: `../../styles/algorithm-visualizer.css` - All visual styling and animations
- Common Patterns: Shared control structure and user interface

### Algorithm-Specific Files
```javascript
// Merge Sort
class SimpleAlgorithmVisualizer {
  generateMergeSortOperations() // Generate merge sort steps
}

// Insertion Sort  
class InsertionSortVisualizer {
  generateInsertionSortOperations() // Generate insertion sort steps
}

// Depth-First Search
class DepthFirstSearchVisualizer {
  createGraph() // Generate different graph types
  generateDFSOperations() // Generate DFS traversal steps
  drawNodes() // Render graph nodes
  drawEdges() // Render graph edges
}
```

### Architecture Patterns
- **Visualizer Class**: Each algorithm has its own class extending common functionality
- **Operation Generation**: Algorithms generate step-by-step operations for visualization
- **Rendering**: Separate rendering logic for different data structures (arrays vs graphs)
- **State Management**: Track current step, operations, and visualization state

## Customization

The visualizers are easily customizable:
- **Colors**: Modify CSS variables for different color schemes
- **Animation Speeds**: Adjust timing and transition durations
- **Data Structure Limits**: Change size ranges for arrays and graphs
- **New Algorithms**: Add new visualizers by following the established pattern
- **Graph Types**: Extend DFS visualizer with additional graph structures
- **Metrics**: Customize what performance indicators are displayed

## Performance

- File Size: ~24KB per visualizer (vs 107MB with dependencies!)
- Load Time: Instant (no JavaScript bundles)
- Animation: Smooth 60 FPS
- Memory: Efficient operation tracking

## Algorithm Details

### How Sorting Visualizers Work
1. **Data Generation**: Create arrays with different patterns (random, sorted, etc.)
2. **Operation Generation**: Pre-compute all algorithm steps for smooth playback
3. **Step-by-Step Execution**: Apply operations one at a time to show progress
4. **Visual Feedback**: Color-code elements based on current operation type
5. **Metrics Tracking**: Count comparisons, swaps, and track progress

### How Graph Visualizers Work
1. **Graph Generation**: Create different graph structures (trees, grids, random)
2. **Layout Calculation**: Position nodes appropriately for each graph type
3. **Traversal Simulation**: Generate DFS operations (push, visit, pop)
4. **Path Visualization**: Show current traversal path and stack state
5. **State Tracking**: Monitor visited nodes, stack size, and progress

## Why This Approach?

This modular version demonstrates:
- **Engineering Judgment**: Reusable components without over-engineering
- **Code Quality**: Clean, maintainable code that scales
- **User Experience**: Fast loading, responsive design
- **Deployment**: Easy to deploy and maintain
- **Extensibility**: Simple to add new algorithms and data structures
- **Educational Value**: Clear visualization of complex algorithms

The best engineering solution provides both simplicity and scalability while making complex algorithms accessible and understandable! 
