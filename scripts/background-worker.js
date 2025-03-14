const axios = require('axios');
const express = require('express');

const app = express();
require('dotenv').config();

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('<html><body>🟢</body></html>');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function checkMonitors() {
  try {
    console.log('Running monitor checks at', new Date().toLocaleString());
    const response = await axios.post(`${BASE_URL}/api/monitors/check`);

    if (response.data.results && response.data.results.length > 0) {
      console.log('Results:');
      response.data.results.forEach(result => {
        console.log(`- ${result.name}: ${result.status || (result.skipped ? 'Skipped' : 'Checked')}`);
      });
    } else {
      console.log('No monitors to check');
    }
  } catch (error) {
    console.error('Failed to check monitors:', error.message);
  }

  setTimeout(checkMonitors, 60000);
}

console.log('Starting continuous monitor checks...');
checkMonitors();