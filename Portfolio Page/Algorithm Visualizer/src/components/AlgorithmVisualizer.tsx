import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getAlgorithm, getAvailableAlgorithms } from '../algorithms';
import { AlgorithmPlayer } from '../player/player';
import { SVGRenderer } from '../renderers/svgRenderer';
import { PlayerState, PlayerMetrics } from '../player/types';
import { Operation } from '../types/algorithm';
import { 
  generateRandomArray, 
  generateSortedArray, 
  generateReversedArray, 
  generateNearlySortedArray, 
  generateArrayWithDuplicates 
} from '../utils/arrayGenerators';

const AlgorithmVisualizerContainer: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('mergeSort');
  const [arraySize, setArraySize] = useState<number>(20);
  const [currentArray, setCurrentArray] = useState<number[]>([]);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [metrics, setMetrics] = useState<PlayerMetrics | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<AlgorithmPlayer | null>(null);
  const rendererRef = useRef<SVGRenderer | null>(null);

  // Initialize renderer
  useEffect(() => {
    if (containerRef.current && !rendererRef.current) {
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
      
      rendererRef.current = new SVGRenderer(containerRef.current, config);
    }

    return () => {
      rendererRef.current?.destroy();
    };
  }, []);

  // Initialize player
  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = new AlgorithmPlayer(
        (state) => setPlayerState(state),
        (metrics) => setMetrics(metrics)
      );
    }

    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  // Generate initial array
  useEffect(() => {
    generateArray();
  }, [arraySize]);

  // Generate random array
  const generateArray = useCallback(() => {
    setIsGenerating(true);
    const array = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setCurrentArray(array);
    
    if (playerRef.current) {
      playerRef.current.setArray(array);
      generateAlgorithmTrace(array);
    }
    setIsGenerating(false);
  }, [arraySize]);

  // Generate algorithm trace
  const generateAlgorithmTrace = useCallback((array: number[]) => {
    const algorithm = getAlgorithm(selectedAlgorithm);
    if (!algorithm || !playerRef.current) return;

    const errors = algorithm.validate({ array });
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      return;
    }

    const operations: Operation[] = [];
    for (const operation of algorithm.trace({ array })) {
      operations.push(operation);
    }

    playerRef.current.setOperations(operations);
  }, [selectedAlgorithm]);

  // Handle algorithm change
  const handleAlgorithmChange = useCallback((algorithmName: string) => {
    setSelectedAlgorithm(algorithmName);
    if (playerRef.current && currentArray.length > 0) {
      generateAlgorithmTrace(currentArray);
    }
  }, [currentArray, generateAlgorithmTrace]);

  // Handle array size change
  const handleArraySizeChange = useCallback((size: number) => {
    setArraySize(size);
  }, []);

  // Player controls
  const handlePlay = useCallback(() => {
    playerRef.current?.play();
  }, []);

  const handlePause = useCallback(() => {
    playerRef.current?.pause();
  }, []);

  const handleReset = useCallback(() => {
    playerRef.current?.reset();
  }, []);

  const handleStepForward = useCallback(() => {
    playerRef.current?.stepForward();
  }, []);

  const handleStepBackward = useCallback(() => {
    playerRef.current?.stepBackward();
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    playerRef.current?.setSpeed(speed);
  }, []);

  // Update renderer when state changes
  useEffect(() => {
    if (rendererRef.current && playerState && currentArray.length > 0) {
      rendererRef.current.render(
        playerState.currentArray,
        playerState.operations,
        playerState.currentStep
      );
    }
  }, [playerState, currentArray]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          if (playerState?.isPlaying) {
            handlePause();
          } else {
            handlePlay();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleStepForward();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handleStepBackward();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          handleReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerState, handlePlay, handlePause, handleStepForward, handleStepBackward, handleReset]);

  return (
    <div className="algorithm-visualizer">
      <div className="controls-panel">
        <div className="control-group">
          <label htmlFor="algorithm-select">Algorithm:</label>
          <select
            id="algorithm-select"
            value={selectedAlgorithm}
            onChange={(e) => handleAlgorithmChange(e.target.value)}
          >
            {getAvailableAlgorithms().map(name => (
              <option key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="array-size">Array Size:</label>
          <input
            id="array-size"
            type="range"
            min="5"
            max="100"
            value={arraySize}
            onChange={(e) => handleArraySizeChange(parseInt(e.target.value))}
          />
          <span>{arraySize}</span>
        </div>

        <div className="control-group">
          <label htmlFor="array-pattern">Pattern:</label>
          <select
            id="array-pattern"
            value="random"
            onChange={(e) => {
              const pattern = e.target.value;
              let newArray: number[];
              switch (pattern) {
                case 'sorted':
                  newArray = generateSortedArray(arraySize);
                  break;
                case 'reversed':
                  newArray = generateReversedArray(arraySize);
                  break;
                case 'nearly-sorted':
                  newArray = generateNearlySortedArray(arraySize);
                  break;
                case 'duplicates':
                  newArray = generateArrayWithDuplicates(arraySize);
                  break;
                default:
                  newArray = generateRandomArray(arraySize);
              }
              setCurrentArray(newArray);
              if (playerRef.current) {
                playerRef.current.setArray(newArray);
                generateAlgorithmTrace(newArray);
              }
            }}
          >
            <option value="random">Random</option>
            <option value="sorted">Sorted</option>
            <option value="reversed">Reversed</option>
            <option value="nearly-sorted">Nearly Sorted</option>
            <option value="duplicates">With Duplicates</option>
          </select>
        </div>

        <div className="control-group">
          <button onClick={generateArray} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate New Array'}
          </button>
        </div>
      </div>

      <div className="visualization-container" ref={containerRef} />

      <div className="playback-controls">
        <div className="control-group">
          <button onClick={handleStepBackward} disabled={!playerState || playerState.currentStep === 0}>
            ⏮
          </button>
          <button onClick={playerState?.isPlaying ? handlePause : handlePlay}>
            {playerState?.isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={handleStepForward} disabled={!playerState || playerState.currentStep >= (playerState?.totalSteps || 0)}>
            ⏭
          </button>
          <button onClick={handleReset}>🔄</button>
        </div>

        <div className="control-group">
          <label htmlFor="speed-slider">Speed:</label>
          <input
            id="speed-slider"
            type="range"
            min="0.25"
            max="4"
            step="0.25"
            value={playerState?.speed || 1}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          />
          <span>{playerState?.speed || 1}x</span>
        </div>
      </div>

      {metrics && (
        <div className="metrics-panel">
          <div className="metric">
            <span className="metric-label">Step:</span>
            <span className="metric-value">{metrics.currentStep} / {metrics.totalSteps}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Comparisons:</span>
            <span className="metric-value">{metrics.comparisons}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Swaps:</span>
            <span className="metric-value">{metrics.swaps}</span>
          </div>
        </div>
      )}

      {selectedAlgorithm && (
        <div className="algorithm-info-panel">
          <h3>Algorithm Information</h3>
          <div className="algorithm-details">
            <div className="detail-item">
              <strong>Name:</strong> {getAlgorithm(selectedAlgorithm)?.metadata.name}
            </div>
            <div className="detail-item">
              <strong>Description:</strong> {getAlgorithm(selectedAlgorithm)?.metadata.description}
            </div>
            <div className="detail-item">
              <strong>Time Complexity:</strong> 
              <span className="complexity">
                Best: {getAlgorithm(selectedAlgorithm)?.metadata.timeComplexity.best} | 
                Average: {getAlgorithm(selectedAlgorithm)?.metadata.timeComplexity.average} | 
                Worst: {getAlgorithm(selectedAlgorithm)?.metadata.timeComplexity.worst}
              </span>
            </div>
            <div className="detail-item">
              <strong>Space Complexity:</strong> {getAlgorithm(selectedAlgorithm)?.metadata.spaceComplexity}
            </div>
            <div className="detail-item">
              <strong>Stable:</strong> {getAlgorithm(selectedAlgorithm)?.metadata.stable ? 'Yes' : 'No'}
            </div>
            <div className="detail-item">
              <strong>In-Place:</strong> {getAlgorithm(selectedAlgorithm)?.metadata.inPlace ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      )}

      <div className="help-panel">
        <h3>How to Use</h3>
        <ul>
          <li><strong>Space:</strong> Play/Pause</li>
          <li><strong>←/→:</strong> Step backward/forward</li>
          <li><strong>R:</strong> Reset</li>
          <li><strong>Speed slider:</strong> Adjust animation speed</li>
        </ul>
        <p>Watch how the algorithm divides the array, sorts subarrays, and merges them back together!</p>
      </div>
    </div>
  );
};

export default AlgorithmVisualizerContainer;
