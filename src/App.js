import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Select from 'react-select';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';
import { ClipLoader } from 'react-spinners';  // Import a spinner

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);  // State to handle loading

  // Options for react-select
  const options = Array.from({ length: 20 }, (_, i) => ({
    value: `https://raw.githubusercontent.com/RoshanV1701/Mobility_Dashboard/main/synthetic_data_${i + 1}.csv`,
    label: `Dataset ${i + 1}`
  }));

  useEffect(() => {
    if (selectedDataset) {
      loadAndProcessData(selectedDataset.value);
    }
  }, [selectedDataset]);

  const loadAndProcessData = async (url) => {
    setLoading(true);  // Start loading
    try {
      const response = await axios.get(url, {
        responseType: 'blob' // Important: response type as blob for parsing
      });
      // Using papaparse to parse the CSV data
      Papa.parse(response.data, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const data = results.data;
          const averages = calculateColumnAverages(data);
          updateChartData(averages);
          setLoading(false);  // Stop loading
        }
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);  // Stop loading if there is an error
    }
  };

  const calculateColumnAverages = (data) => {
    const columnSums = data.reduce((acc, row) => {
      Object.keys(row).forEach((key) => {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(row[key]);
      });
      return acc;
    }, {});

    return Object.keys(columnSums).map(key => ({
      label: key,
      average: columnSums[key].reduce((sum, curr) => sum + curr, 0) / columnSums[key].length
    }));
  };

  const updateChartData = (averages) => {
    setChartData({
      labels: averages.map(item => item.label),
      datasets: [{
        label: 'Column Averages',
        data: averages.map(item => item.average),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }]
    });
  };

  return (
    <div>
      <h1>Mobility Dashboard</h1>
      <Select options={options} onChange={setSelectedDataset} />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : (
        chartData.datasets && (
          <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
        )
      )}
    </div>
  );
};

export default App;
