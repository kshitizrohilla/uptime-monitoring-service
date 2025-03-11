import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function ResponseTimeChart({ checks }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!checks || checks.length === 0) return;

    const validChecks = checks.filter(check => check.status === 'up');

    if (validChecks.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = validChecks.map(check =>
      new Date(check.timestamp).toLocaleTimeString()
    );

    const data = validChecks.map(check => check.responseTime);

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Response Time (ms)',
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Response Time (ms)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function (tooltipItems) {
                const index = tooltipItems[0].dataIndex;
                return new Date(validChecks[index].timestamp).toLocaleString();
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [checks]);

  if (!checks || checks.length === 0) {
    return <div className="text-gray-500 text-center py-10">No data available</div>;
  }

  const hasData = checks.some(check => check.status === 'up');

  if (!hasData) {
    return <div className="text-gray-500 text-center py-10">No response time data available (site may be down)</div>;
  }

  return <canvas ref={chartRef} />;
}