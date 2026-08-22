import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PieChart as PieIcon, BarChart3, Table as TableIcon } from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const COLOR_PALETTE = [
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#f43f5e', // rose
  '#3b82f6', // blue
  '#14b8a6', // teal
  '#ec4899', // pink
  '#84cc16', // lime
  '#64748b', // slate
  '#eab308'  // yellow
];

export default function BreakdownCharts({ breakdown = [], currencySymbol = "₹" }) {
  const [viewMode, setViewMode] = useState('doughnut'); // 'doughnut', 'bar', 'table'

  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl text-center text-slate-400">
        No breakdown data available. Run prediction to view energy distribution.
      </div>
    );
  }

  // Filter out zero-consumption items
  const activeItems = breakdown.filter(item => item.monthly_kwh > 0);

  const labels = activeItems.map(item => item.display_name);
  const unitsData = activeItems.map(item => item.monthly_kwh);
  const costData = activeItems.map(item => item.estimated_cost);

  const doughnutData = {
    labels: labels,
    datasets: [
      {
        data: unitsData,
        backgroundColor: COLOR_PALETTE.slice(0, activeItems.length),
        borderColor: '#0f172a',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#cbd5e1',
          font: { size: 11, family: 'Plus Jakarta Sans' },
          padding: 12,
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const item = activeItems[index];
            return ` ${item.display_name}: ${item.monthly_kwh} kWh (${item.percentage}%) • ${currencySymbol}${item.estimated_cost}`;
          },
        },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleFont: { size: 12, family: 'Plus Jakarta Sans', weight: 'bold' },
        bodyFont: { size: 11, family: 'Plus Jakarta Sans' },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    cutout: '68%',
  };

  const barData = {
    labels: labels,
    datasets: [
      {
        label: `Estimated Cost (${currencySymbol})`,
        data: costData,
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        hoverBackgroundColor: 'rgba(16, 185, 129, 1)',
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const item = activeItems[index];
            return ` Cost: ${currencySymbol}${item.estimated_cost} (${item.monthly_kwh} kWh • ${item.percentage}%)`;
          },
        },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#94a3b8', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
    },
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800">
      
      {/* Header & Toggle view buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <span>Appliance Energy & Cost Breakdown</span>
            <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Explainable AI
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Identifies exact heavy-hitting appliances driving up your utility bill</p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('doughnut')}
            className={`p-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'doughnut' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Doughnut Share Chart"
          >
            <PieIcon className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Share</span>
          </button>
          <button
            onClick={() => setViewMode('bar')}
            className={`p-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'bar' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Cost Bar Chart"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Cost</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'table' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Data Table"
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Chart Render Area */}
      <div className="h-64 sm:h-72 w-full flex items-center justify-center">
        {viewMode === 'doughnut' && (
          <div className="relative w-full h-full">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-32 hidden sm:flex">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Top Driver</span>
              <span className="text-sm font-bold text-emerald-400">{activeItems[0]?.display_name}</span>
              <span className="text-xs text-slate-300 font-mono font-bold">{activeItems[0]?.percentage}%</span>
            </div>
          </div>
        )}

        {viewMode === 'bar' && (
          <Bar data={barData} options={barOptions} />
        )}

        {viewMode === 'table' && (
          <div className="w-full h-full overflow-y-auto overflow-x-auto pr-1">
            <table className="w-full min-w-[320px] sm:min-w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 sticky top-0 bg-slate-950">
                <tr>
                  <th className="pb-2 font-medium">Appliance</th>
                  <th className="pb-2 font-medium text-center">Qty / Runtime</th>
                  <th className="pb-2 font-medium text-right">Units (kWh)</th>
                  <th className="pb-2 font-medium text-right">Est. Cost</th>
                  <th className="pb-2 font-medium text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeItems.map((item, idx) => (
                  <tr key={item.appliance} className="hover:bg-slate-900/50">
                    <td className="py-2.5 font-medium text-slate-200 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                        style={{ backgroundColor: COLOR_PALETTE[idx % COLOR_PALETTE.length] }}
                      />
                      <span className="truncate">{item.display_name}</span>
                    </td>
                    <td className="py-2.5 text-center text-slate-400 whitespace-nowrap">
                      {item.count > 0 ? `${item.count}x • ${item.hours_per_day}h/d` : '-'}
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-300 whitespace-nowrap">{item.monthly_kwh}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">{currencySymbol}{item.estimated_cost}</td>
                    <td className="py-2.5 text-right font-mono text-slate-400 whitespace-nowrap">{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
