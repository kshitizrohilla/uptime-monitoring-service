import axios from 'axios';
const BASE_URL = 'https://website-monitoring-service.onrender.com';

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
console.log('Press Ctrl+C to stop');
checkMonitors();