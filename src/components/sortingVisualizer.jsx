import React, { useState, useRef } from 'react';
import { bubbleSortAnimations } from '../algorithms/bubblesort';
import { selectionSortAnimations } from '../algorithms/selectionsort';
import { insertionSortAnimations } from '../algorithms/insertionsort';
import { mergeSortAnimations } from '../algorithms/mergesort';
import { quickSortAnimations } from '../algorithms/quicksort';
import './SortingVisualizer.css';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  Tooltip,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  BarElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale,
  Legend
);

function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("Enter numbers and select an algorithm to sort!");
  const [sorted, setSorted] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubbleSort");
  const [activeBars, setActiveBars] = useState([]);
  const [comparisonHistory, setComparisonHistory] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [animationTimeouts, setAnimationTimeouts] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [pivotIndex, setPivotIndex] = useState(null);
  const [mergingIndices, setMergingIndices] = useState([]);
  const [speed, setSpeed] = useState(300);
  
  const chartRef = useRef(null);

  const handleAlgorithmChange = (e) => {
    setSelectedAlgorithm(e.target.value);
    setComparisons(0);
    setMessage(`You selected ${e.target.value}!`);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGenerateArray = () => {
    const newArray = inputValue
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    setArray(newArray);
    setMessage("Ready to sort!");
    setComparisons(0);
    setActiveBars([]);
    setSorted(false);
    setComparisonHistory([]);
    setCurrentStep(0);
  };

  const animateSorting = (animations, startStep = 0) => {
    const tempArray = array.slice();
    let timeouts = [];
    let localComparisons = comparisons;

    animations.slice(startStep).forEach((action, index) => {
      const timeout = setTimeout(() => {
        if (action.type === "compare") {
          const [i, j] = action.indices;
          setActiveBars([i, j]);
          localComparisons++;
          setComparisons(localComparisons);
          setComparisonHistory(prev => [...prev, { step: startStep + index, comparisons: localComparisons }]);
          setMessage(`Comparing index ${i} (${tempArray[i]}) and ${j} (${tempArray[j]})`);
        }

        if (action.type === "swap") {
          const [i, j] = action.indices;
          [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
          setArray(tempArray.slice());
          setMessage(`Swapping ${tempArray[j]} and ${tempArray[i]}!`);
        }

        if (action.type === "overwrite") {
          const { indices, value } = action;
          tempArray[indices[0]] = value;
          setArray(tempArray.slice());
        }

        if (action.type === "sorted") {
          setActiveBars([]);
          setSorted(true);
          setMessage("Sorting complete!!");
        }

        if (action.type === "pivot") {
          setPivotIndex(action.index);
          setMessage(`Pivot selected: index ${action.index} (${tempArray[action.index]})`);
        }

        if (action.type === "merge") {
          setMergingIndices(action.indices);
          setMessage(`Merging indices: ${action.indices.join(', ')}`);
        }
      }, index * speed);

      timeouts.push(timeout);
    });

    setAnimationTimeouts(timeouts);
    setCurrentStep(startStep + animations.length);
    setIsSorting(true);
  };

  const handleSort = () => {
    if (array.length === 0) {
      setMessage("Please enter some numbers first!");
      return;
    }

    let animations = [];
    if (selectedAlgorithm === "bubbleSort") {
      animations = bubbleSortAnimations(array);
    } else if (selectedAlgorithm === "selectionSort") {
      animations = selectionSortAnimations(array);
    } else if (selectedAlgorithm === "insertionSort") {
      animations = insertionSortAnimations(array);
    } else if (selectedAlgorithm === "mergeSort") {
      animations = mergeSortAnimations(array);
    } else if (selectedAlgorithm === "quickSort") {
      animations = quickSortAnimations(array);
    }

    if (isSorting) {
      animateSorting(animations, currentStep);
    } else {
      animateSorting(animations);
    }
  };

  const handleStop = () => {
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    setAnimationTimeouts([]);
    setIsSorting(false);
    setMessage("Sorting process has been stopped.");
  };

  const getBlockColor = (index) => {
    if (sorted) return "#33ccff";
    if (index === pivotIndex) return "#8a2be2";
    if (activeBars.includes(index)) return "#ffcc33";
    if (mergingIndices.includes(index)) return "#00ffff";
    return "#39ff14";
  };

  const chartData = {
    labels: comparisonHistory.map(d => d.step),
    datasets: [
      {
        label: 'Comparisons Over Steps',
        data: comparisonHistory.map(d => d.comparisons),
        borderColor: 'rgba(0, 255, 255, 1)',
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const complexityData = {
  labels: ['Best Case', 'Average Case', 'Worst Case'],
  datasets: [
    {
      label: 'Time Complexity',
      data: getComplexityValues(selectedAlgorithm),
      backgroundColor: [
        'rgba(57, 255, 20, 0.6)',
        'rgba(0, 255, 255, 0.6)',
        'rgba(255, 51, 51, 0.6)'
      ],
      borderColor: [
        'rgba(57, 255, 20, 1)',
        'rgba(0, 255, 255, 1)',
        'rgba(255, 51, 51, 1)'
      ],
      borderWidth: 1,
    }
  ]
};
function getComplexityValues(algorithm) {
  switch(algorithm) {
    case 'bubbleSort':
      return [1, 0.5, 1];
    case 'selectionSort':
      return [0.7, 0.7, 0.7]; 
    case 'insertionSort':
      return [0.3, 0.5, 1]; 
    case 'mergeSort':
      return [0.2, 0.3, 0.4]; 
    case 'quickSort':
      return [0.2, 0.3, 1]; 
    default:
      return [0, 0, 0];
  }
}

  
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { 
      position: 'top',
      labels: {
        color: '#e0e0ff',
        font: {
          family: 'Orbitron'
        }
      }
    },
    title: { 
      display: true, 
      text: 'Sorting Comparisons Live 📈',
      color: '#e0e0ff',
      font: {
        family: 'Orbitron',
        size: 16
      }
    },
  },
  scales: {
    y: {
      ticks: {
        color: '#e0e0ff'
      },
      grid: {
        color: 'rgba(224, 224, 255, 0.1)'
      }
    },
    x: {
      ticks: {
        color: '#e0e0ff'
      },
      grid: {
        color: 'rgba(224, 224, 255, 0.1)'
      }
    }
  }
};

const complexityOptions = {
  responsive: true,
  plugins: {
    legend: { 
      position: 'top',
      labels: {
        color: '#e0e0ff',
        font: {
          family: 'Orbitron'
        }
      }
    },
    title: { 
      display: true, 
      text: 'Algorithm Complexity Analysis 🧠',
      color: '#e0e0ff',
      font: {
        family: 'Orbitron',
        size: 16
      }
    },
  },
  scales: {
    y: {
      ticks: {
        color: '#e0e0ff'
      },
      grid: {
        color: 'rgba(224, 224, 255, 0.1)'
      }
    },
    x: {
      ticks: {
        color: '#e0e0ff'
      },
      grid: {
        color: 'rgba(224, 224, 255, 0.1)'
      }
    }
  }
};


return (
  <div className="visualizer">
   <h1> Sorting Visualizer</h1>

    <div className="controls">
      <input 
        type="text" 
        placeholder="Type numbers with comma"
        value={inputValue}
        onChange={handleInputChange}
        className="input-box"
      />
      <button onClick={handleGenerateArray} className="action-button">Create Array</button>

      <div className="dropdown">
        <label>Select Algorithm: </label>
        <select value={selectedAlgorithm} onChange={handleAlgorithmChange}>
          <option value="bubbleSort">Bubble Sort</option>
          <option value="selectionSort">Selection Sort</option>
          <option value="insertionSort">Insertion Sort</option>
          <option value="mergeSort">Merge Sort</option>
          <option value="quickSort">Quick Sort</option>
        </select>
      </div>

      <div className="dropdown">
        <label>Speed (ms): </label>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <span>{speed} ms</span>
      </div>

      <button onClick={handleSort} className="action-button sort" disabled={isSorting}>Start Sorting</button>
      <button onClick={handleStop} className="action-button stop" disabled={!isSorting}>Stop Sorting</button>
    </div>

    <div className="info">
      <p>Comparisons: <strong>{comparisons}</strong></p>
    </div>

    <div className="block-container">
    <div className="message-container">
    <h2>{message}</h2>
  </div>
    <br />
      {array.map((value, idx) => (
        <div
          key={idx}
          className={`block ${activeBars.includes(idx) ? 'highlight' : ''}`}
          style={{
            backgroundColor: getBlockColor(idx),
            color: idx === pivotIndex ? 'white' : 'var(--primary-bg)',
          }}
        >
          {value}
        </div>
      ))}
    </div>

    

    <div className="chart-container">
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>

    <div className="complexity-chart">
      <Bar data={complexityData} options={complexityOptions} />
    </div>
  </div>
);
}
export default SortingVisualizer;
