# Thomas Lundy - Portfolio Website

A modern, responsive portfolio website showcasing my technical skills, projects, and professional experience. Built with vanilla HTML, CSS, and JavaScript for optimal performance and accessibility.

## 🌐 Live Website

Visit the live website: [talundy.github.io](https://talundy.github.io)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Portfolio Projects](#portfolio-projects)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Contact](#contact)

## 🎯 Overview

This portfolio website serves as a comprehensive showcase of my technical abilities, featuring interactive projects, detailed skill demonstrations, and professional experience. The site is designed with a focus on performance, accessibility, and user experience.

### Key Highlights

- **Interactive Algorithm Visualizers**: Step-by-step visualization of sorting and graph algorithms
- **Neural Network Demo**: Browser-based machine learning with TensorFlow.js
- **Responsive Design**: Optimized for all device sizes
- **Performance Optimized**: Fast loading with minimal dependencies
- **Accessibility Focused**: Keyboard navigation and semantic HTML

## ✨ Features

### 🏠 Homepage
- Clean, modern hero section with call-to-action buttons
- Overview of website sections
- Professional navigation with smooth scrolling
- Social media integration (LinkedIn, GitHub)

### 👨‍💻 About Me Page
- Comprehensive skill breakdown across multiple categories:
  - **Software**: Python, Java, C, RISC-V Assembly, HTML, CSS, JavaScript, SQL, Swift, System Verilog HDL
  - **Software Technologies**: Docker, Linux, Git, GitHub, Arduino, AWS (Lambda, EC2, S3, IAM)
  - **Hardware Experience**: RISC-V 32i, STM32 ARM, Raspberry Pi, FPGAs, Digital-Analog Converters
  - **Hardware Tooling**: Oscilloscopes, Digital Multimeters, Logic Analyzers, Reflow Oven
- Background and interests sections (expandable)

### 💼 Experience Page
- Professional experience showcase
- Education and certifications
- Technical skills matrix
- Soft skills and domain knowledge

### 🚀 Portfolio Page
- Featured project highlights
- Interactive project demos
- Detailed project documentation
- Direct links to live implementations

## 📁 Project Structure

```
talundy.github.io/
├── index.html                          # Homepage
├── package.json                        # Dependencies
├── README.md                          # This file
│
├── About Me Page/
│   ├── about_me.html                  # About page
│   ├── Background/                    # Background content
│   ├── Interests/                     # Interests content
│   └── Skills/                        # Skills content
│
├── Experience Page/
│   └── experience.html                # Experience page
│
├── Portfolio Page/
│   ├── portfolio.html                 # Portfolio overview
│   │
│   ├── Algorithm Visualizer/          # Algorithm visualization project
│   │   ├── merge_sort.html           # Merge sort visualizer
│   │   ├── insertion_sort.html       # Insertion sort visualizer
│   │   ├── depth_first_search.html   # DFS visualizer
│   │   ├── *.js                      # Algorithm implementations
│   │   └── README.md                 # Algorithm project docs
│   │
│   └── Interactive NN/                # Neural network project
│       ├── interactive_NN.html       # Main NN demo
│       ├── interactive_NN.css        # NN-specific styles
│       ├── interactive_NN.js         # Main application logic
│       ├── js/                       # Modular JavaScript
│       │   ├── model.js             # TensorFlow.js model
│       │   ├── training.js          # Training logic
│       │   ├── visualization.js     # Chart.js integration
│       │   └── canvas.js            # Drawing canvas
│       ├── data/                     # Training data
│       ├── assets/                   # Icons and images
│       └── Interactive_NN_README.md  # NN project docs
│
└── styles/                           # Global stylesheets
    ├── common.css                    # Shared styles
    ├── home.css                      # Homepage styles
    ├── pages.css                     # Page layout styles
    ├── portfolio.css                 # Portfolio styles
    ├── job.css                       # Experience page styles
    └── algorithm-visualizer.css      # Algorithm visualizer styles
```

## 🎮 Portfolio Projects

### 1. Algorithm Visualizers

**Interactive algorithm visualization tools with professional controls and real-time metrics.**

#### Features:
- **Sorting Algorithms**: Merge Sort, Insertion Sort
- **Graph Algorithms**: Depth-First Search
- **Interactive Controls**: Play, pause, step forward/backward, reset
- **Keyboard Shortcuts**: Space (play/pause), ←/→ (step), R (reset)
- **Real-time Metrics**: Comparisons, swaps, nodes visited, stack size
- **Multiple Data Patterns**: Random, sorted, reversed, nearly sorted arrays
- **Graph Types**: Binary trees, grid layouts, random graphs
- **Responsive Design**: Works on desktop and mobile
- **No Dependencies**: Pure HTML, CSS, and JavaScript

#### Technical Highlights:
- **Modular Architecture**: Shared CSS and JavaScript patterns
- **Modern ES6+**: Classes, arrow functions, destructuring
- **Performance**: Efficient rendering with requestAnimationFrame
- **Accessibility**: Keyboard navigation and semantic HTML
- **File Size**: ~24KB per visualizer (vs 107MB with dependencies!)

#### Live Demos:
- [Merge Sort Visualizer](https://talundy.github.io/Portfolio%20Page/Algorithm%20Visualizer/merge_sort.html)
- [Insertion Sort Visualizer](https://talundy.github.io/Portfolio%20Page/Algorithm%20Visualizer/insertion_sort.html)
- [Depth-First Search Visualizer](https://talundy.github.io/Portfolio%20Page/Algorithm%20Visualizer/depth_first_search.html)

### 2. Interactive Neural Network

**Browser-based machine learning demo using TensorFlow.js for handwritten digit recognition.**

#### Features:
- **Real-time Training**: Train neural networks directly in the browser
- **Interactive Drawing**: Draw digits on HTML5 canvas
- **Live Predictions**: Get real-time predictions with confidence scores
- **Training Visualization**: Live charts showing accuracy and loss
- **Hyperparameter Control**: Adjust learning rate, epochs, and hidden units
- **Model Reset**: Retrain with different parameters
- **MNIST Dataset**: Uses subset of handwritten digit data

#### Technical Stack:
- **TensorFlow.js**: Neural network training and inference
- **Chart.js**: Training progress visualization
- **HTML5 Canvas**: Drawing interface
- **Modular Architecture**: Separated concerns across multiple JS files

#### Live Demo:
- [Interactive Neural Network](https://talundy.github.io/Portfolio%20Page/Interactive%20NN/interactive_NN.html)

## 🛠 Technologies Used

### Frontend
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with flexbox, grid, and animations
- **JavaScript (ES6+)**: Modern JavaScript features and modular architecture
- **Responsive Design**: Mobile-first approach

### Libraries & Frameworks
- **TensorFlow.js**: Machine learning in the browser
- **Chart.js**: Data visualization and training progress charts
- **No Build Tools**: Pure vanilla implementation for optimal performance

### Development Tools
- **Git**: Version control
- **GitHub Pages**: Hosting and deployment
- **Testing Libraries**: Jest, Testing Library (for future testing)

### Hardware & Embedded
- **RISC-V 32i Architecture**: Low-level programming experience
- **STM32 ARM**: Embedded systems development
- **FPGAs**: Hardware description and digital design
- **Arduino**: IoT and prototyping

### Cloud & DevOps
- **AWS**: Lambda, EC2, S3, IAM
- **Docker**: Containerization
- **Linux**: System administration
- **Git/GitHub**: Version control and collaboration

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- No additional software required - runs entirely in the browser

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/talundy/talundy.github.io.git
   cd talundy.github.io
   ```

2. **Open in browser**
   ```bash
   # Option 1: Use a local server (recommended)
   python -m http.server 8000
   # Then visit http://localhost:8000
   
   # Option 2: Open directly
   open index.html
   ```

3. **Explore the projects**
   - Navigate to different pages using the main navigation
   - Try the interactive algorithm visualizers
   - Experiment with the neural network demo

### Development Setup

```bash
# Install dependencies (optional - for testing)
npm install

# Run tests (when implemented)
npm test
```

## 🌐 Deployment

### GitHub Pages (Current)
The website is automatically deployed via GitHub Pages:
- Repository: `talundy/talundy.github.io`
- URL: `https://talundy.github.io`
- Auto-deployment on push to main branch

### Manual Deployment
1. Upload all files to your web server
2. Ensure proper file permissions
3. Configure server for SPA routing if needed

### Custom Domain (Optional)
To use a custom domain:
1. Add `CNAME` file with your domain
2. Configure DNS settings
3. Update GitHub Pages settings

## 🤝 Contributing

While this is a personal portfolio, suggestions and improvements are welcome:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/improvement`)
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Areas for Contribution
- Accessibility improvements
- Performance optimizations
- New algorithm visualizers
- Additional portfolio projects
- Documentation enhancements

## 📞 Contact

- **LinkedIn**: [linkedin.com/in/tlundy448](https://linkedin.com/in/tlundy448)
- **GitHub**: [github.com/talundy](https://github.com/talundy)
- **Email**: Available through LinkedIn

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **TensorFlow.js Team**: For making machine learning accessible in browsers
- **Chart.js**: For excellent data visualization capabilities
- **GitHub**: For providing free hosting via GitHub Pages
- **Open Source Community**: For the tools and libraries that make this possible

---

**Built with ❤️ by Thomas Lundy**

*Last updated: January 2025*
