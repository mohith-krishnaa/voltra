import React from 'react';
import { 
  Zap, 
  Sun, 
  Clock, 
  Users, 
  FileText, 
  Phone, 
  ArrowRight, 
  TrendingDown, 
  CheckCircle2, 
  ShieldCheck, 
  Percent, 
  Sliders, 
  MapPin, 
  Sparkles,
  ChevronRight,
  Star,
  Activity,
  Layers,
  Award,
  BarChart3
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export default function HomeView({ 
  predictionResult, 
  household, 
  user,
  onStartPredict,
  onStartWhatIf,
  onViewUsage,
  onViewBills,
  onViewOffices,
  onViewOffers,
  onViewSolar,
  onViewSplit,
  onViewPay,
  currencySymbol = "₹" 
}) {
  const predictedUnits = predictionResult?.predicted_units || 324.3;
  const totalBill = predictionResult?.bill?.total_bill || 2108.16;
  const topTips = predictionResult?.actionable_tips?.slice(0, 3) || [];

  const chartData = {
    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug (Forecast)'],
    datasets: [
      {
        label: 'Monthly Units (kWh)',
        data: [265, 310, 395, 360, 315, Math.round(predictedUnits)],
        borderColor: '#E15B2D',
        backgroundColor: 'transparent',
        borderWidth: 3,
        tension: 0.35,
        pointBackgroundColor: '#E15B2D',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
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
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context) => ` ${context.parsed.y} kWh (Est. ${currencySymbol}${Math.round(context.parsed.y * 6.5)})`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 11 } }
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 11 } }
      }
    }
  };

  // Services Data
  const services = [
    {
      id: 'predict',
      title: 'Electricity Bill Forecasting',
      description: 'Physics-based appliance simulation, monthly kWh breakdown, and progressive slab tariff calculations.',
      icon: Zap,
      action: onStartPredict,
      badge: 'Core Engine'
    },
    {
      id: 'solar',
      title: 'Solar Rooftop & Subsidies',
      description: 'Calculate rooftop sizing, central government subsidies up to ₹78,000, and 25-year net ROI.',
      icon: Sun,
      action: onViewSolar,
      badge: 'PM Surya Ghar'
    },
    {
      id: 'whatif',
      title: 'What-If Simulation & Shifts',
      description: 'Test replacement of old non-inverter ACs, fan upgrades, and schedule shifting before buying.',
      icon: Sliders,
      action: onStartWhatIf,
      badge: 'Simulator'
    },
    {
      id: 'split',
      title: 'Roommate Bill Splitter',
      description: 'Appliance-weighted load division allocating AC runtime hours fairly with instant WhatsApp export.',
      icon: Users,
      action: onViewSplit || (() => {}),
      badge: 'Shared Flats'
    },
    {
      id: 'bills',
      title: 'Smart Bill Upload & OCR',
      description: 'Upload paper or digital bills to analyze historical consumption, fuel surcharges, and tier shifts.',
      icon: FileText,
      action: onViewBills,
      badge: 'OCR Scanner'
    },
    {
      id: 'offices',
      title: 'Emergency & Fuse Call Centers',
      description: 'Locate your nearest TGSPDCL sub-station, Assistant Engineer contacts, and 24x7 fuse call desks.',
      icon: Phone,
      action: onViewOffices,
      badge: '24x7 Helpline'
    }
  ];

  return (
    <div className="space-y-16 max-w-7xl mx-auto pb-12">
      
      {/* =========================================================================
          HERO SECTION (Clean Typographic Hero - No Image, Crisp Punchy Copy)
          ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden shadow-xs border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-14 lg:p-16">
        
        {/* Subtle decorative background ambient glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-100 dark:bg-orange-950/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-slate-100 dark:bg-slate-800/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-7">
          
          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/60 text-[#E15B2D] text-xs font-mono font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>ENERGY INTELLIGENCE & BILL FORECASTING</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.06]">
              Predict your <br />
              power bill with <span className="italic font-serif text-[#E15B2D] font-normal">precision</span>.
            </h1>
          </div>

          {/* Edited Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
            AI-powered appliance thermodynamics, real-time TGSPDCL progressive slab forecasting, and PM Surya Ghar rooftop solar subsidies. Know your exact electricity bill before the meter reader arrives.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartPredict}
              className="btn-orange-primary text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>Estimate Your Bill Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onViewSolar}
              className="btn-outline-card text-sm font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Sun className="w-4 h-4 text-[#E15B2D]" />
              <span>Solar Subsidy (₹78,000)</span>
            </button>

            <a
              href="tel:1912"
              className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#E15B2D] px-3 py-2 transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#E15B2D]" />
              <span>24x7 Helpline: 1912</span>
            </a>
          </div>

          {/* Key Feature Badges Strip */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="space-y-0.5">
              <span className="text-slate-400 block text-[10px] uppercase">Accuracy</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 92%+ Thermodynamic
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 block text-[10px] uppercase">Central Subsidy</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-500" /> Up to ₹78,000 DBT
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 block text-[10px] uppercase">State Welfare</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Gruha Jyothi Ready
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 block text-[10px] uppercase">ToD Solar Hours</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#E15B2D]" /> 20% Cheaper Window
              </span>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          SERVICES WE OFFER (6 Clean White Cards)
          ========================================================================= */}
      <section id="services-section" className="space-y-8 pt-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Services we offer
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              From appliance physics simulation to rooftop solar subsidies, we handle a wide range of home energy optimization needs with expert precision. Explore our specialties.
            </p>
          </div>

          <button
            onClick={onStartPredict}
            className="btn-outline-card text-xs font-bold self-start md:self-auto flex items-center gap-1.5"
          >
            <span>View all services</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* 6 Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => {
            const Icon = srv.icon;

            return (
              <div
                key={srv.id}
                onClick={srv.action}
                className="p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer group flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 group-hover:bg-orange-50 group-hover:text-[#E15B2D] dark:group-hover:bg-orange-950/40 dark:group-hover:text-[#F97316] flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#E15B2D] dark:group-hover:text-[#F97316] transition-colors">
                        {srv.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-[#E15B2D] transition-colors">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{srv.badge}</span>
                  <span className="flex items-center gap-1">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </section>


      {/* =========================================================================
          LIVE BILL FORECAST & ANALYTICS WIDGET
          ========================================================================= */}
      <section className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E15B2D] font-bold">
              ESTIMATED MONTHLY BILL
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Current Billing Cycle Forecast
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              LT-1 Domestic Tariff Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Big Total Number */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tighter font-mono tabular-nums">
              {currencySymbol}{totalBill.toFixed(2)}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4" />
                <span>4.2% lower than previous cycle</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estimated consumption: <strong className="text-slate-900 dark:text-white font-mono">{Math.round(predictedUnits)} kWh</strong> (92% confidence)
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onStartPredict}
                className="btn-orange-primary text-xs py-2.5 px-4 flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust Appliance Hours</span>
              </button>

              <button
                onClick={onViewOffers}
                className="btn-outline-card text-xs py-2.5 px-4 flex items-center gap-1.5"
              >
                <span>View Government Offers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Trend Chart */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">6-Month Trend</span>
              <span className="text-xs font-mono font-bold text-[#E15B2D]">August Projection</span>
            </div>
            <div className="h-44 sm:h-52 w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
