import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Select from 'react-select';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse'; // Import PapaParse to parse CSV files
import { ClipLoader } from 'react-spinners'; // Spinner for loading state
import dataFile1 from './data/synthetic_data_1.csv'; // Import the local CSV files directly
import dataFile2 from './data/synthetic_data_2.csv'; // Import the local CSV files directly
import dataFile3 from './data/synthetic_data_3.csv'; // Import the local CSV files directly
import dataFile4 from './data/synthetic_data_4.csv'; // Import the local CSV files directly
import dataFile5 from './data/synthetic_data_5.csv'; // Import the local CSV files directly
import dataFile6 from './data/synthetic_data_6.csv'; // Import the local CSV files directly
import dataFile7 from './data/synthetic_data_7.csv'; // Import the local CSV files directly
import dataFile8 from './data/synthetic_data_8.csv'; // Import the local CSV files directly
import dataFile9 from './data/synthetic_data_9.csv'; // Import the local CSV files directly
import dataFile10 from './data/synthetic_data_10.csv'; // Import the local CSV files directly
import dataFile11 from './data/synthetic_data_11.csv'; // Import the local CSV files directly
import dataFile12 from './data/synthetic_data_12.csv'; // Import the local CSV files directly
import dataFile13 from './data/synthetic_data_13.csv'; // Import the local CSV files directly
import dataFile14 from './data/synthetic_data_14.csv'; // Import the local CSV files directly
import dataFile15 from './data/synthetic_data_15.csv'; // Import the local CSV files directly
import dataFile16 from './data/synthetic_data_16.csv'; // Import the local CSV files directly
import dataFile17 from './data/synthetic_data_17.csv'; // Import the local CSV files directly
import dataFile18 from './data/synthetic_data_18.csv'; // Import the local CSV files directly
import dataFile19 from './data/synthetic_data_19.csv'; // Import the local CSV files directly
import dataFile20 from './data/synthetic_data_20.csv'; // Import the local CSV files directly

// Register required components, including LinearScale
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false); // State to handle loading
  const [cache, setCache] = useState([]); // Cache array to store up to 5 datasets

  // Options for react-select with imported local files
  const options = [
    { value: dataFile1, label: 'Dataset 1' },
    { value: dataFile2, label: 'Dataset 2' },
    { value: dataFile3, label: 'Dataset 3' },
    { value: dataFile4, label: 'Dataset 4' },
    { value: dataFile5, label: 'Dataset 5' },
    { value: dataFile6, label: 'Dataset 6' },
    { value: dataFile7, label: 'Dataset 7' },
    { value: dataFile8, label: 'Dataset 8' },
    { value: dataFile9, label: 'Dataset 9' },
    { value: dataFile10, label: 'Dataset 10' },
    { value: dataFile11, label: 'Dataset 11' },
    { value: dataFile12, label: 'Dataset 12' },
    { value: dataFile13, label: 'Dataset 13' },
    { value: dataFile14, label: 'Dataset 14' },
    { value: dataFile15, label: 'Dataset 15' },
    { value: dataFile16, label: 'Dataset 16' },
    { value: dataFile17, label: 'Dataset 17' },
    { value: dataFile18, label: 'Dataset 18' },
    { value: dataFile19, label: 'Dataset 19' },
  ];

  useEffect(() => {
    const cachedData = cache.find(item => item.file === selectedDataset?.value);
    if (selectedDataset && cachedData) {
      // Use cached data if available
      setChartData(cachedData.data);
    } else if (selectedDataset) {
      // Load and process data if not in cache
      loadAndProcessData(selectedDataset.value);
    }
  }, [selectedDataset, cache]);

  const loadAndProcessData = async (file) => {
    setLoading(true);
    try {
      const response = await fetch(file);
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const data = results.data;
          const averages = calculateColumnAverages(data);
          const chartData = {
            labels: averages.map(item => item.label),
            datasets: [{
              label: 'Column Averages',
              data: averages.map(item => item.average),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            }]
          };
          updateChartData(file, chartData);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const updateChartData = (file, data) => {
    setChartData(data);
    updateCache(file, data);
  };

  const calculateColumnAverages = (data) => {
    const columnSums = data.reduce((acc, row) => {
      Object.keys(row).forEach((key) => {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(Number(row[key]) || 0);
      });
      return acc;
    }, {});
  
    return Object.keys(columnSums).map(key => ({
      label: key,
      average: columnSums[key].reduce((sum, curr) => sum + curr, 0) / columnSums[key].length
    }));
  };
  
  const updateCache = (file, data) => {
    // Add new dataset to the cache, and remove the oldest if cache exceeds 5 items
    const updatedCache = [...cache.filter(item => item.file !== file), { file, data }];
    if (updatedCache.length > 5) {
      updatedCache.shift(); // Remove the oldest dataset from the cache
    }
    setCache(updatedCache);
  };

  return (
    <div>
      <h1>Mobility Dashboard</h1>
      <Select options={options} onChange={setSelectedDataset} />
      {loading ? (
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      ) : (
        chartData.datasets && (
          <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
        )
      )}
    </div>
  );
}

export default App;
  