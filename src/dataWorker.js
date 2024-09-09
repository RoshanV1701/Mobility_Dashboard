importScripts('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js'); // Ensure the URL is correct and accessible

self.onmessage = function(e) {
  const { action, data } = e.data;

  switch(action) {
    case 'process':
      // Use PapaParse to parse the CSV data
      Papa.parse(data, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
          const processedData = calculateColumnAverages(results.data);
          self.postMessage({ action: 'processedData', data: processedData });
        }
      });
      break;
    case 'finalize':
      // Send a completion message when all data has been processed
      self.postMessage({ action: 'completed' });
      break;
  }
};

function calculateColumnAverages(data) {
  let sums = {};
  let counts = {};

  data.forEach(row => {
    Object.keys(row).forEach(key => {
      if (!sums[key]) sums[key] = 0;
      if (!counts[key]) counts[key] = 0;
      sums[key] += row[key];
      counts[key]++;
    });
  });

  let averages = {};
  Object.keys(sums).forEach(key => {
    averages[key] = sums[key] / counts[key];
  });

  return averages;
}
