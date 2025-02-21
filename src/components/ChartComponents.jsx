// src/components/ChartComponents.jsx
import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Define prop types for TypeScript support
/**
 * @typedef {Object} MonthData
 * @property {string} month - Month name
 * @property {number} workdays - Total workdays in month
 * @property {number} off_days - Days off
 * @property {number} req_onsite - Required onsite days
 * @property {number} badge_count - Completed onsite days
 * @property {string} perc_complete - Percentage complete as string (e.g., "75.0%")
 * @property {Array} logs - Log entries
 */

/**
 * @typedef {Object} OnsiteData
 * @property {number} year - Current year
 * @property {MonthData[]} months - Array of month data
 */

/**
 * Monthly breakdown bar chart
 * @param {Object} props
 * @param {MonthData[]} props.months - Array of month data
 */
export function MonthlyBarChart({ months }) {
  // Convert percentage strings to numbers
  const percentages = months.map(month => 
    parseFloat(month.perc_complete.replace('%', ''))
  );
  
  const currentMonthIndex = new Date().getMonth();
  
  const data = {
    labels: months.map(month => month.month.substring(0, 3)),
    datasets: [
      {
        label: 'Completion %',
        data: percentages,
        backgroundColor: months.map((_, index) => 
          index < currentMonthIndex 
            ? percentages[index] >= 100 
              ? 'rgba(34, 197, 94, 0.8)' // Green for completed
              : 'rgba(239, 68, 68, 0.8)' // Red for past months not completed
            : index === currentMonthIndex 
              ? 'rgba(59, 130, 246, 0.8)' // Blue for current month
              : 'rgba(156, 163, 175, 0.5)' // Gray for future months
        ),
        borderWidth: 0,
        borderRadius: 4,
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Completion: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          display: true,
          drawBorder: false,
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        }
      }
    }
  };
  
  return (
    <div style={{ height: '250px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

/**
 * Yearly progress doughnut chart
 * @param {Object} props
 * @param {number} props.completed - Completed days
 * @param {number} props.total - Total required days
 */
export function YearlyDoughnutChart({ completed, total }) {
  const percentage = (completed / total * 100).toFixed(1);
  
  const data = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [completed, total - completed],
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(203, 213, 225, 0.5)',
        ],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw} days`;
          }
        }
      }
    },
  };
  
  return (
    <div style={{ height: '200px', position: 'relative' }}>
      <Doughnut data={data} options={options} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{percentage}%</div>
        <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Complete</div>
      </div>
    </div>
  );
}

/**
 * Progress over time line chart
 * @param {Object} props
 * @param {MonthData[]} props.months - Array of month data
 */
export function ProgressLineChart({ months }) {
  const currentMonthIndex = new Date().getMonth();
  const cumulativeRequired = [];
  const cumulativeCompleted = [];
  
  // Calculate cumulative values
  let requiredTotal = 0;
  let completedTotal = 0;
  
  months.forEach((month, index) => {
    requiredTotal += month.req_onsite;
    completedTotal += month.badge_count;
    
    cumulativeRequired.push(requiredTotal);
    cumulativeCompleted.push(completedTotal);
  });
  
  const data = {
    labels: months.map(month => month.month.substring(0, 3)),
    datasets: [
      {
        label: 'Required',
        data: cumulativeRequired,
        borderColor: 'rgba(148, 163, 184, 1)',
        backgroundColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'Completed',
        data: cumulativeCompleted,
        borderColor: 'rgba(14, 165, 233, 1)',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(14, 165, 233, 1)',
        pointRadius: (context) => {
          const index = context.dataIndex;
          return index <= currentMonthIndex ? 4 : 0;
        },
        tension: 0.1,
        fill: true,
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        }
      }
    }
  };
  
  return (
    <div style={{ height: '250px' }}>
      <Line data={data} options={options} />
    </div>
  );
}

/**
 * Main Charts component that renders all chart types
 * @param {Object} props
 * @param {OnsiteData} props.data - Onsite data object
 */
export default function Charts({ data }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Calculate totals
  const totalRequired = data.months.reduce((sum, month) => sum + month.req_onsite, 0);
  const totalCompleted = data.months.reduce((sum, month) => sum + month.badge_count, 0);
  
  if (!mounted) {
    return <div className="p-4 text-center text-gray-500">Loading charts...</div>;
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h3 className="text-lg font-medium mb-4">Monthly Progress</h3>
        <MonthlyBarChart months={data.months} />
      </div>
      <div className="lg:col-span-1">
        <h3 className="text-lg font-medium mb-4">Yearly Progress</h3>
        <YearlyDoughnutChart completed={totalCompleted} total={totalRequired} />
      </div>
      <div className="lg:col-span-3">
        <h3 className="text-lg font-medium mb-4">Progress Over Time</h3>
        <ProgressLineChart months={data.months} />
      </div>
    </div>
  );
}