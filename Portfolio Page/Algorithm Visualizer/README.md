# Algorithm Visualizer

A fast, polished, in-browser tool that teaches algorithms interactively and demonstrates solid software engineering craft.

## 🚀 Live Demo

[View Live Demo](https://talundy.github.io/Portfolio%20Page/Algorithm%20Visualizer/algo_visualizer.html)

## ✨ Features

- **Interactive Visualization**: Step-by-step algorithm execution with real-time updates
- **Professional Controls**: Play, pause, step forward/backward, reset, and speed control
- **Keyboard Shortcuts**: Full keyboard navigation (Space, ←/→, R)
- **Real-time Metrics**: Track comparisons, swaps, and execution progress
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility First**: ARIA support, keyboard navigation, reduced motion support
- **Performance Optimized**: 60 FPS animations for arrays up to 200 elements

## 🏗️ Architecture

Built with clean separation of concerns and professional engineering practices:

- **Algorithms**: Pure, deterministic TypeScript modules with validation
- **Player**: Manages playback state, timing, and operation execution
- **Renderers**: SVG-based visualization with configurable colors and themes
- **UI**: React components with hooks for state management
- **Testing**: Comprehensive test suite with unit and integration tests

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand for lightweight global state
- **Styling**: CSS with modern features and accessibility support
- **Build Tool**: Vite for fast development and optimized builds
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **Testing**: Vitest for unit testing
- **Deployment**: GitHub Pages with automatic CI/CD

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd algorithm-visualizer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format

# Preview production build
npm run preview
```

## 📊 Current Algorithms

### Merge Sort
- **Complexity**: O(n log n) time, O(n) space
- **Stability**: Stable
- **In-place**: No
- **Best for**: Large datasets, guaranteed performance

## 🎯 Engineering Highlights

### Code Quality
- **Type Safety**: Full TypeScript coverage with strict mode
- **Clean Architecture**: Clear separation between algorithm logic, visualization, and UI
- **Error Handling**: Comprehensive validation and graceful error recovery
- **Performance**: Optimized rendering with requestAnimationFrame

### Testing & Quality
- **Unit Tests**: Algorithm correctness and edge cases
- **Integration Tests**: Player and renderer interactions
- **Property-based Testing**: Random array generation and validation
- **Performance Testing**: FPS monitoring and optimization

### Accessibility
- **Keyboard Navigation**: Full keyboard support for all controls
- **Screen Reader Support**: ARIA labels and live regions
- **Reduced Motion**: Respects user preferences for animations
- **High Contrast**: Support for high contrast mode

### Performance
- **60 FPS Target**: Smooth animations for optimal user experience
- **Memory Management**: Efficient operation tracking and cleanup
- **Responsive Design**: Optimized for various screen sizes
- **Bundle Optimization**: Code splitting and tree shaking

## 🔧 Configuration

### Customization

The visualizer can be customized through the renderer configuration:

```typescript
const config = {
  width: 800,
  height: 400,
  barWidth: 30,
  barSpacing: 5,
  colors: {
    default: '#4a90e2',
    active: '#f39c12',
    sorted: '#27ae60',
    comparing: '#e74c3c',
    swapping: '#9b59b6',
    merged: '#2ecc71'
  }
};
```

### Adding New Algorithms

1. Implement the `Algorithm` interface
2. Add to the algorithm registry
3. Update the UI components
4. Add tests and documentation

## 🧪 Testing Strategy

### Unit Tests
- Algorithm correctness (sorted output, permutation property)
- Player state management
- Renderer operations

### Integration Tests
- End-to-end user interactions
- Performance benchmarks
- Accessibility compliance

### Test Commands
```bash
npm test              # Run all tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
```

## 📈 Performance Metrics

- **Time to First Interaction**: < 2 seconds
- **Animation Performance**: 60 FPS for n ≤ 200
- **Bundle Size**: < 100KB gzipped
- **Load Time**: < 3 seconds on 3G

## 🌐 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Fallbacks**: Graceful degradation for older browsers

## 📚 Documentation

- [Product Requirements](./docs/PRD.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

## 🚧 Roadmap

### v1.1 (Next 2 weeks)
- [ ] Insertion Sort algorithm
- [ ] Side-by-side algorithm comparison
- [ ] Enhanced metrics and analytics

### v1.2 (Next month)
- [ ] Graph algorithms (BFS/DFS)
- [ ] Interactive graph editor
- [ ] Pathfinding visualizations

### v1.3 (Next quarter)
- [ ] Dynamic programming table visualizations
- [ ] Algorithm complexity analysis
- [ ] Performance profiling tools

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the excellent framework
- TypeScript team for type safety
- Vite team for the build tool
- Open source community for inspiration

## 📞 Contact

- **Author**: Tyler Lundy
- **Portfolio**: [talundy.github.io](https://talundy.github.io)
- **GitHub**: [@talundy](https://github.com/talundy)

---

**Built with ❤️ and professional engineering practices**
