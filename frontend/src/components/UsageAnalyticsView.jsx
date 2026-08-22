import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Layers, 
  Sliders, 
  Zap, 
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function UsageAnalyticsView({ household, predictionResult, currencySymbol = '₹' }) {
  const [timeRange, setTimeRange] = useState('monthly'); // 'daily', 'monthly'

  const predictedUnits = predictionResult?.predicted_units || 324.3;

  const monthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug (Forecast)'],
    datasets: [
      {
        label: 'Monthly kWh',
        data: [210, 235, 265, 310, 395, 360, 315, Math.round(predictedUnits)],
        borderColor: '#E15B2D',
        backgroundColor: 'rgba(225, 91, 45, 0.08)',
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#E15B2D',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 5
      }
    ]
  };

  const hourlyLoadData = {
    labels: ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM (Peak)', '9 PM (Peak)', '11 PM'],
    datasets: [
      {
        label: 'Load kW',
        data: [0.6, 0.4, 0.8, 1.4, 1.8, 1.5, 3.2, 3.8, 1.2],
        backgroundColor: [
          '#CBD5E1', '#CBD5E1', '#CBD5E1', '#CBD5E1', '#FDBA74', '#FDBA74', '#E15B2D', '#E15B2D', '#CBD5E1'
        ],
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#FFFFFF',
        bodyColor: '#F8FAFC',
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 11 } } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 11 } } }
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950 text-[#E15B2D]">
              CONSUMPTION INTELLIGENCE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Historical Analytics & Grid Load Curves
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Compare seasonal power trends, progressive slab step-ups, and typical 24-hour diurnal load profiles.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              timeRange === 'monthly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Monthly Trend
          </button>
          <button
            onClick={() => setTimeRange('hourly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              timeRange === 'hourly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            24h Diurnal Curve
          </button>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
            {timeRange === 'monthly' ? '8-MONTH CONSUMPTION PROGRESSION (KWH)' : '24-HOUR DOMESTIC LOAD CURVE (KW)'}
          </span>
          <span className="text-xs font-mono font-bold text-[#E15B2D]">
            {timeRange === 'monthly' ? 'August Forecast: 324 kWh' : 'Peak: 3.8 kW at 9 PM'}
          </span>
        </div>

        <div className="h-72 w-full">
          {timeRange === 'monthly' ? (
            <Line data={monthlyChartData} options={chartOptions} />
          ) : (
            <Bar data={hourlyLoadData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Key Metric Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400">Average Daily Consumption</span>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">10.8 kWh <span className="text-sm font-normal text-slate-500">/ day</span></div>
          <p className="text-xs text-slate-500">Calculated over current 30-day billing cycle.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400">Base Baseline Load</span>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">380 Watts</div>
          <p className="text-xs text-slate-500">Continuous background draw (Refrigerator, Wi-Fi router, standby).</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400">Highest Load Tier</span>
          <div className="text-3xl font-black font-mono text-[#E15B2D]">LT-1(B)(ii)</div>
          <p className="text-xs text-slate-500">Progressive slab rate ₹9.00/unit activated above 200 units.</p>
        </div>
      </div>

    </div>
  );
}
