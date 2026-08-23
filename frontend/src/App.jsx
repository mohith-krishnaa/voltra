import React, { useState, useEffect } from 'react';
import AppNavbar from './components/AppNavbar';
import MobileBottomNav from './components/MobileBottomNav';
import HomeView from './components/HomeView';
import PredictionWizard from './components/PredictionWizard';
import UsageAnalyticsView from './components/UsageAnalyticsView';
import WhatIfSimulator from './components/WhatIfSimulator';
import SavingsView from './components/SavingsView';
import OffersView from './components/OffersView';
import SolarRoiView from './components/SolarRoiView';
import TodTariffView from './components/TodTariffView';
import BillSplitterView from './components/BillSplitterView';
import ProfileView from './components/ProfileView';
import BillUploadView from './components/BillUploadView';
import NearbyOfficesView from './components/NearbyOfficesView';
import AuthModal from './components/AuthModal';
import VoltraLogo from './components/common/VoltraLogo';

const DEFAULT_APPLIANCES = {
  ac: { count: 1, hours: 4.0 },
  air_cooler: { count: 0, hours: 0 },
  fridge: { count: 1, hours: 24.0 },
  fan: { count: 3, hours: 8.0 },
  light: { count: 6, hours: 5.0 },
  water_heater: { count: 1, hours: 0.3 },
  rice_cooker: { count: 1, hours: 0.5 },
  mixer_grinder: { count: 1, hours: 0.15 },
  induction_cooktop: { count: 0, hours: 0 },
  microwave: { count: 1, hours: 0.1 },
  water_purifier: { count: 1, hours: 1.0 },
  mobile_chargers: { count: 2, hours: 2.0 },
  laptop_computer: { count: 1, hours: 4.0 },
  tv_home_theater: { count: 1, hours: 3.0 },
  wifi_router: { count: 1, hours: 24.0 },
  iron_box: { count: 1, hours: 0.15 },
  washing_machine: { count: 1, hours: 0.5 },
  ev_charger: { count: 0, hours: 0.0 },
  immersion_rod: { count: 0, hours: 0 }, air_purifier: { count: 0, hours: 0 },
  wet_grinder: { count: 0, hours: 0 }, electric_kettle: { count: 0, hours: 0 }, dishwasher: { count: 0, hours: 0 },
  earbuds_chargers: { count: 0, hours: 0 }, smart_speakers: { count: 0, hours: 0 }, gaming_console: { count: 0, hours: 0 },
  vacuum_cleaner: { count: 0, hours: 0 }, hair_dryer: { count: 0, hours: 0 }
};

const DEFAULT_HOUSEHOLD = {
  house_type: "Apartment-2BHK",
  area_sqft: 1150,
  occupants: 4,
  season: "Summer",
  tariff_zone: "TGSPDCL-Telangana",
  enable_gruha_jyothi: false,
  usc_number: "1029384729",
  consumer_name: "K. V. Rajesh Kumar",
  mobile_number: "+91 98490 12345",
  door_no: "Flat 402, Block-B, Green Meadows",
  street: "KPHB 6th Phase, Near JNTU",
  city: "Hyderabad",
  pincode: "500072",
  meter_number: "TG-SM-98241",
  sanctioned_load: 3.5,
  gruha_jyothi_linked: true
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [household, setHousehold] = useState(DEFAULT_HOUSEHOLD);
  const [appliances, setAppliances] = useState(DEFAULT_APPLIANCES);
  const [predictionResult, setPredictionResult] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState({ code: 'PROMPT15', discount: 31.62 });
  const [tariffs, setTariffs] = useState([]);
  const [demoPresets, setDemoPresets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('voltra_user');
      return (saved && saved !== 'undefined' && saved !== 'null') ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [applianceSpecs, setApplianceSpecs] = useState([]);

  // Sync dark class on html root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchTariffs();
    fetchDemoPresets();
    fetchApplianceSpecs();
  }, []);

  const fetchApplianceSpecs = async () => {
    try {
      const res = await fetch('/api/appliances/specs');
      if (res.ok) {
        const data = await res.json();
        setApplianceSpecs(data.specs || []);
      }
    } catch (e) {
      console.warn("Failed to load appliance specs", e);
    }
  };

  const fetchTariffs = async () => {
    try {
      const res = await fetch('/api/tariffs');
      if (res.ok) {
        const data = await res.json();
        setTariffs(data.available_tariffs || []);
      }
    } catch (e) {
      console.warn("Failed to load tariffs", e);
    }
  };

  const fetchDemoPresets = async () => {
    try {
      const res = await fetch('/api/demo-presets');
      if (res.ok) {
        const data = await res.json();
        setDemoPresets(data.presets || []);
      }
    } catch (e) {
      console.warn("Failed to load presets", e);
    }
  };

  const runPrediction = async (currentHousehold = household, currentAppliances = appliances) => {
    setLoading(true);
    try {
      const payload = {
        household: {
          ...currentHousehold,
          appliances: currentAppliances
        }
      };

      const res = await fetch('/api/predict/monthly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setPredictionResult(data);
        return data;
      }
      throw new Error("API offline, using client-side engine");
    } catch (err) {
      // Client-Side Physics & TGSPDCL Tariff Fallback Engine
      const season = currentHousehold.season || "Summer";
      const acMult = season === "Summer" ? 1.35 : season === "Winter" ? 0.30 : 1.0;
      
      let units = 40.0; // Base baseline
      const breakdown = [];
      const appSpecs = {
        ac: { name: '1.5-Ton Inverter AC', kw: 1.5, duty: 0.55, mult: acMult },
        fan: { name: 'Ceiling Fan', kw: 0.07, duty: 1.0, mult: 1.0 },
        fridge: { name: 'Refrigerator', kw: 0.25, duty: 0.40, mult: 1.1 },
        light: { name: 'LED Points', kw: 0.02, duty: 1.0, mult: 1.0 },
        water_heater: { name: 'Storage Geyser', kw: 2.0, duty: 1.0, mult: season === "Winter" ? 1.6 : 0.4 },
        washing_machine: { name: 'Washing Machine', kw: 0.5, duty: 0.7, mult: 1.0 },
        tv_home_theater: { name: 'Smart TV', kw: 0.12, duty: 1.0, mult: 1.0 },
        laptop_computer: { name: 'Laptop Workstation', kw: 0.09, duty: 0.8, mult: 1.0 },
        wifi_router: { name: 'Wi-Fi Router', kw: 0.015, duty: 1.0, mult: 1.0 }
      };

      Object.entries(currentAppliances).forEach(([k, val]) => {
        const count = val?.count || 0;
        const hours = val?.hours || 0;
        if (count > 0 && hours > 0) {
          const spec = appSpecs[k] || { name: k.replace('_', ' ').toUpperCase(), kw: 0.1, duty: 0.8, mult: 1.0 };
          const appMonthlyKwh = Math.round(count * hours * spec.kw * spec.duty * 30 * spec.mult * 10) / 10;
          units += appMonthlyKwh;
          breakdown.push({
            appliance_id: k,
            appliance_name: spec.name,
            monthly_units: appMonthlyKwh,
            estimated_cost: Math.round(appMonthlyKwh * 6.8)
          });
        }
      });

      const totalUnits = Math.round(units * 10) / 10;
      const zone = currentHousehold.tariff_zone || "TGSPDCL-Telangana";
      
      let energyCharge = 0;
      let fixedCharge = 50.0;
      let dutyAmount = Math.round(totalUnits * 0.06 * 100) / 100;
      const slabBreakdown = [];
      let isZeroBill = false;
      let subsidyName = null;

      // 1. ANDHRA PRADESH (APSPDCL / APEPDCL / APCPDCL)
      if (zone.includes("APSPDCL") || zone.includes("APEPDCL") || zone.includes("APCPDCL") || zone.includes("-AP")) {
        if (totalUnits <= 75) {
          fixedCharge = 25.0;
          const s1 = Math.min(30, totalUnits);
          const s2 = Math.max(0, totalUnits - 30);
          energyCharge = s1 * 1.90 + s2 * 3.00;
          slabBreakdown.push({ slab_name: '0-30 units (Lifeline)', units_in_slab: s1, rate_per_unit: 1.90, slab_total: s1 * 1.90 });
          if (s2 > 0) slabBreakdown.push({ slab_name: '31-75 units (Group A)', units_in_slab: s2, rate_per_unit: 3.00, slab_total: s2 * 3.00 });
        } else if (totalUnits <= 225) {
          fixedCharge = 50.0;
          const s1 = Math.min(50, totalUnits);
          const s2 = Math.min(50, Math.max(0, totalUnits - 50));
          const s3 = Math.min(100, Math.max(0, totalUnits - 100));
          const s4 = Math.max(0, totalUnits - 200);
          energyCharge = s1 * 3.10 + s2 * 3.80 + s3 * 4.80 + s4 * 6.80;
          slabBreakdown.push({ slab_name: '0-50 units', units_in_slab: s1, rate_per_unit: 3.10, slab_total: s1 * 3.10 });
          if (s2 > 0) slabBreakdown.push({ slab_name: '51-100 units', units_in_slab: s2, rate_per_unit: 3.80, slab_total: s2 * 3.80 });
          if (s3 > 0) slabBreakdown.push({ slab_name: '101-200 units', units_in_slab: s3, rate_per_unit: 4.80, slab_total: s3 * 4.80 });
          if (s4 > 0) slabBreakdown.push({ slab_name: '201-225 units', units_in_slab: s4, rate_per_unit: 6.80, slab_total: s4 * 6.80 });
        } else {
          fixedCharge = 75.0;
          const s1 = Math.min(50, totalUnits);
          const s2 = Math.min(50, Math.max(0, totalUnits - 50));
          const s3 = Math.min(100, Math.max(0, totalUnits - 100));
          const s4 = Math.min(100, Math.max(0, totalUnits - 200));
          const s5 = Math.max(0, totalUnits - 300);
          energyCharge = s1 * 3.80 + s2 * 4.80 + s3 * 6.80 + s4 * 7.90 + s5 * 8.90;
          slabBreakdown.push({ slab_name: '0-50 units', units_in_slab: s1, rate_per_unit: 3.80, slab_total: s1 * 3.80 });
          if (s2 > 0) slabBreakdown.push({ slab_name: '51-100 units', units_in_slab: s2, rate_per_unit: 4.80, slab_total: s2 * 4.80 });
          if (s3 > 0) slabBreakdown.push({ slab_name: '101-200 units', units_in_slab: s3, rate_per_unit: 6.80, slab_total: s3 * 6.80 });
          if (s4 > 0) slabBreakdown.push({ slab_name: '201-300 units', units_in_slab: s4, rate_per_unit: 7.90, slab_total: s4 * 7.90 });
          if (s5 > 0) slabBreakdown.push({ slab_name: '300+ units', units_in_slab: s5, rate_per_unit: 8.90, slab_total: s5 * 8.90 });
        }
      }
      // 2. TAMIL NADU (TANGEDCO / TNEB - 100 Units Free)
      else if (zone.includes("TANGEDCO") || zone.includes("TNEB") || zone.includes("TamilNadu")) {
        const s1 = Math.min(100, totalUnits);
        const s2 = Math.min(100, Math.max(0, totalUnits - 100));
        const s3 = Math.min(200, Math.max(0, totalUnits - 200));
        const s4 = Math.max(0, totalUnits - 400);
        energyCharge = s1 * 0.00 + s2 * 2.25 + s3 * 4.50 + s4 * 6.00;
        fixedCharge = totalUnits <= 100 ? 0.0 : 50.0;
        dutyAmount = Math.round((energyCharge + fixedCharge) * 0.05 * 100) / 100;
        slabBreakdown.push({ slab_name: '0-100 units (Free Govt Subsidy)', units_in_slab: s1, rate_per_unit: 0.00, slab_total: 0.0 });
        if (s2 > 0) slabBreakdown.push({ slab_name: '101-200 units', units_in_slab: s2, rate_per_unit: 2.25, slab_total: s2 * 2.25 });
        if (s3 > 0) slabBreakdown.push({ slab_name: '201-400 units', units_in_slab: s3, rate_per_unit: 4.50, slab_total: s3 * 4.50 });
        if (s4 > 0) slabBreakdown.push({ slab_name: '400+ units', units_in_slab: s4, rate_per_unit: 6.00, slab_total: s4 * 6.00 });
        subsidyName = "Tamil Nadu 100 Units Free Universal Subsidy";
      }
      // 3. KARNATAKA (BESCOM)
      else if (zone.includes("BESCOM") || zone.includes("Karnataka")) {
        const s1 = Math.min(100, totalUnits);
        const s2 = Math.max(0, totalUnits - 100);
        energyCharge = s1 * 4.75 + s2 * 7.00;
        fixedCharge = 110.0;
        dutyAmount = Math.round((energyCharge + fixedCharge) * 0.09 * 100) / 100;
        slabBreakdown.push({ slab_name: '0-100 units', units_in_slab: s1, rate_per_unit: 4.75, slab_total: s1 * 4.75 });
        if (s2 > 0) slabBreakdown.push({ slab_name: '>100 units', units_in_slab: s2, rate_per_unit: 7.00, slab_total: s2 * 7.00 });
        if (currentHousehold.enable_gruha_jyothi && totalUnits <= 200) {
          isZeroBill = true;
          subsidyName = "Karnataka Gruha Jyothi (Zero Bill ≤ 200 units)";
        }
      }
      // 4. DELHI (BSES - 200 Free Units)
      else if (zone.includes("BSES") || zone.includes("Delhi")) {
        const s1 = Math.min(200, totalUnits);
        const s2 = Math.min(200, Math.max(0, totalUnits - 200));
        const s3 = Math.max(0, totalUnits - 400);
        energyCharge = s1 * 3.00 + s2 * 4.50 + s3 * 6.50;
        fixedCharge = 60.0;
        dutyAmount = Math.round((energyCharge + fixedCharge) * 0.05 * 100) / 100;
        slabBreakdown.push({ slab_name: '0-200 units', units_in_slab: s1, rate_per_unit: 3.00, slab_total: s1 * 3.00 });
        if (s2 > 0) slabBreakdown.push({ slab_name: '201-400 units', units_in_slab: s2, rate_per_unit: 4.50, slab_total: s2 * 4.50 });
        if (s3 > 0) slabBreakdown.push({ slab_name: '>400 units', units_in_slab: s3, rate_per_unit: 6.50, slab_total: s3 * 6.50 });
        if (totalUnits <= 200) {
          isZeroBill = true;
          subsidyName = "Delhi 200 Units 100% Free Power Subsidy";
        }
      }
      // 5. MAHARASHTRA (MSEDCL)
      else if (zone.includes("MSEDCL") || zone.includes("Maharashtra")) {
        const s1 = Math.min(100, totalUnits);
        const s2 = Math.min(200, Math.max(0, totalUnits - 100));
        const s3 = Math.min(200, Math.max(0, totalUnits - 300));
        const s4 = Math.max(0, totalUnits - 500);
        energyCharge = s1 * 5.88 + s2 * 11.26 + s3 * 15.72 + s4 * 17.81;
        fixedCharge = 128.0;
        dutyAmount = Math.round((energyCharge + fixedCharge) * 0.16 * 100) / 100;
        slabBreakdown.push({ slab_name: '0-100 units', units_in_slab: s1, rate_per_unit: 5.88, slab_total: s1 * 5.88 });
        if (s2 > 0) slabBreakdown.push({ slab_name: '101-300 units', units_in_slab: s2, rate_per_unit: 11.26, slab_total: s2 * 11.26 });
        if (s3 > 0) slabBreakdown.push({ slab_name: '301-500 units', units_in_slab: s3, rate_per_unit: 15.72, slab_total: s3 * 15.72 });
        if (s4 > 0) slabBreakdown.push({ slab_name: '>500 units', units_in_slab: s4, rate_per_unit: 17.81, slab_total: s4 * 17.81 });
      }
      // 6. DEFAULT / TELANGANA (TGSPDCL & TGNPDCL - TSERC LT-1)
      else {
        if (totalUnits <= 100) {
          fixedCharge = 25.0;
          const s1 = Math.min(50, totalUnits);
          const s2 = Math.max(0, totalUnits - 50);
          energyCharge = s1 * 1.95 + s2 * 3.10;
          slabBreakdown.push({ slab_name: '0-50 units (Category A)', units_in_slab: s1, rate_per_unit: 1.95, slab_total: s1 * 1.95 });
          if (s2 > 0) slabBreakdown.push({ slab_name: '51-100 units (Category A)', units_in_slab: s2, rate_per_unit: 3.10, slab_total: s2 * 3.10 });
        } else if (totalUnits <= 200) {
          fixedCharge = 50.0;
          const s1 = Math.min(100, totalUnits);
          const s2 = Math.max(0, totalUnits - 100);
          energyCharge = s1 * 3.40 + s2 * 4.80;
          slabBreakdown.push({ slab_name: '0-100 units (Category B-i)', units_in_slab: s1, rate_per_unit: 3.40, slab_total: s1 * 3.40 });
          if (s2 > 0) slabBreakdown.push({ slab_name: '101-200 units (Category B-i)', units_in_slab: s2, rate_per_unit: 4.80, slab_total: s2 * 4.80 });
        } else {
          fixedCharge = 80.0;
          const s1 = Math.min(200, totalUnits);
          const s2 = Math.min(100, Math.max(0, totalUnits - 200));
          const s3 = Math.max(0, totalUnits - 300);
          energyCharge = s1 * 5.10 + s2 * 7.70 + s3 * 9.00;
          slabBreakdown.push({ slab_name: '0-200 units (Category B-ii)', units_in_slab: s1, rate_per_unit: 5.10, slab_total: s1 * 5.10 });
          if (s2 > 0) slabBreakdown.push({ slab_name: '201-300 units', units_in_slab: s2, rate_per_unit: 7.70, slab_total: s2 * 7.70 });
          if (s3 > 0) slabBreakdown.push({ slab_name: '300+ units', units_in_slab: s3, rate_per_unit: 9.00, slab_total: s3 * 9.00 });
        }

        if (currentHousehold.enable_gruha_jyothi && totalUnits <= 200) {
          isZeroBill = true;
          subsidyName = "Telangana Gruha Jyothi (100% Free Bill ≤ 200 units)";
        }
      }

      const rawSubtotal = energyCharge + fixedCharge + dutyAmount;
      const totalBill = isZeroBill ? 0.0 : Math.round(rawSubtotal * 100) / 100;

      const fallbackResult = {
        predicted_units: totalUnits,
        confidence_score: 0.94,
        tariff_zone: zone,
        bill: {
          total_bill: totalBill,
          energy_charge: Math.round(energyCharge * 100) / 100,
          fixed_charge: fixedCharge,
          duty_amount: dutyAmount,
          currency_symbol: "₹",
          is_zero_bill: isZeroBill,
          subsidy_name: subsidyName,
          slab_breakdown: slabBreakdown
        },
        appliance_breakdown: breakdown,
        actionable_tips: [
          { title: 'Increase AC Set Temperature to 24°C', savings_inr: 420, category: 'Cooling', difficulty: 'Easy', desc: 'Each 1°C increase above 18°C reduces AC power draw by 6%.' },
          { title: 'Upgrade 3 Ceiling Fans to 28W BLDC', savings_inr: 310, category: 'Efficiency', difficulty: 'Medium', desc: 'BLDC motor fans consume only 28W compared to traditional 75W fans.' },
          { title: 'Shift Heavy Washing & Geyser to Solar Hours', savings_inr: 180, category: 'Time-of-Day', difficulty: 'Easy', desc: 'Benefit from daytime solar off-peak tariff rebates and avoid evening surcharges.' }
        ]
      };

      setPredictionResult(fallbackResult);
      return fallbackResult;
    } finally {
      setLoading(false);
    }
  };

  // Initial calculation on load
  useEffect(() => {
    runPrediction();
  }, []);

  const handleApplyPreset = (preset) => {
    if (!preset) return;
    setHousehold(prev => ({
      ...prev,
      house_type: preset.house_type || prev.house_type,
      area_sqft: preset.area_sqft || prev.area_sqft,
      occupants: preset.occupants || prev.occupants,
      tariff_zone: preset.tariff_zone || prev.tariff_zone,
      season: preset.season || prev.season
    }));

    if (preset.appliances) {
      setAppliances(preset.appliances);
    }

    runPrediction(
      { ...household, ...preset },
      preset.appliances || appliances
    );
  };

  const handleSeasonChange = (newSeason) => {
    const updated = { ...household, season: newSeason };
    setHousehold(updated);
    runPrediction(updated, appliances);
  };

  const handleLogout = () => {
    localStorage.removeItem('voltra_token');
    localStorage.removeItem('voltra_user');
    setUser(null);
  };

  const handleApplyOffer = (offer) => {
    setAppliedPromo(offer);
    setActiveTab('pay');
  };

  const currencySymbol = predictionResult?.bill?.currency_symbol || "₹";

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-16 md:pb-0 transition-colors">
      
      {/* 1. Header Navigation Bar */}
      <AppNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSelectDemoPreset={handleApplyPreset}
        onOpenProfile={() => setActiveTab('profile')}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* TAB 1: Home Overview & Hero */}
        {activeTab === 'home' && (
          <HomeView
            predictionResult={predictionResult}
            household={household}
            onStartPredict={() => setActiveTab('predict')}
            onStartWhatIf={() => setActiveTab('whatif')}
            onViewUsage={() => setActiveTab('usage')}
            onViewBills={() => setActiveTab('bills')}
            onViewOffices={() => setActiveTab('offices')}
            onViewOffers={() => setActiveTab('offers')}
            onViewSolar={() => setActiveTab('solar')}
            currencySymbol={currencySymbol}
          />
        )}

        {/* TAB 2: Guided Prediction Wizard */}
        {activeTab === 'predict' && (
          <PredictionWizard
            household={household}
            setHousehold={setHousehold}
            appliances={appliances}
            setAppliances={setAppliances}
            predictionResult={predictionResult}
            tariffs={tariffs}
            applianceSpecs={applianceSpecs}
            onSeasonChange={handleSeasonChange}
            onRunPrediction={() => runPrediction(household, appliances)}
            onStartWhatIf={() => setActiveTab('whatif')}
            onViewOffers={() => setActiveTab('offers')}
            loading={loading}
            currencySymbol={currencySymbol}
          />
        )}

        {/* TAB 3: Usage Analytics & Historical Tracking */}
        {activeTab === 'usage' && (
          <UsageAnalyticsView
            household={household}
            predictionResult={predictionResult}
            currencySymbol={currencySymbol}
          />
        )}

        {/* TAB 4: What-If Appliance Simulator */}
        {activeTab === 'whatif' && (
          <WhatIfSimulator
            currentHousehold={household}
            currentAppliances={appliances}
            baseBill={predictionResult?.bill?.total_bill || 2108.16}
            baseUnits={predictionResult?.predicted_units || 324.3}
            currencySymbol={currencySymbol}
          />
        )}

        {/* TAB 5: Savings & Recommendations */}
        {activeTab === 'savings' && (
          <SavingsView
            tips={predictionResult?.actionable_tips}
            onStartWhatIf={() => setActiveTab('whatif')}
            onViewOffers={() => setActiveTab('offers')}
            currencySymbol={currencySymbol}
          />
        )}

        {/* TAB 6: Recommended Offers & Solar Subsidies */}
        {activeTab === 'offers' && (
          <OffersView
            onApplyOffer={handleApplyOffer}
            onStartSolar={() => setActiveTab('solar')}
          />
        )}

        {/* TAB 7: Solar ROI & PM Surya Ghar Calculator */}
        {activeTab === 'solar' && (
          <SolarRoiView
            household={household}
            predictionResult={predictionResult}
            currencySymbol={currencySymbol}
          />
        )}

        {/* TAB 8: Live Time-of-Day (ToD) Peak Hours */}
        {activeTab === 'tod' && (
          <TodTariffView
            currencySymbol={currencySymbol}
          />
        )}

        {/* TAB 9: Roommate Bill Splitter */}
        {activeTab === 'split' && (
          <BillSplitterView
            predictionResult={predictionResult}
            currencySymbol={currencySymbol}
          />
        )}

        {/* TAB 9: Profile & Domestic Account Settings */}
        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            household={household}
            setHousehold={setHousehold}
            tariffs={tariffs}
            onLogout={handleLogout}
            currencySymbol={currencySymbol}
          />
        )}

        {/* TAB 9: Bill Upload & Past Bills */}
        {activeTab === 'bills' && (
          <BillUploadView
            currencySymbol={currencySymbol}
          />
        )}

        {/* TAB 10: Nearby Offices & TGSPDCL Fuse Call */}
        {activeTab === 'offices' && (
          <NearbyOfficesView />
        )}

      </main>

      {/* 3. Mobile Bottom Navigation Dock */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 4. Footer with Voltra Logo */}
      <footer className="hidden md:block border-t border-white/10 bg-[#0B0B0B] py-8 text-xs text-[#8A8A84]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VoltraLogo size="small" />
            <span className="text-[#8A8A84]/80 font-mono">Domestic Energy Intelligence Engine</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px] text-[#8A8A84]">
            <button onClick={() => setActiveTab('offers')} className="hover:text-[#A3FF6B] transition">Offers & Subsidies</button>
            <button onClick={() => setActiveTab('pay')} className="hover:text-[#A3FF6B] transition">Instant Bill Pay</button>
            <button onClick={() => setActiveTab('offices')} className="hover:text-[#A3FF6B] transition">TGSPDCL 1912</button>
            <button onClick={() => setActiveTab('profile')} className="hover:text-[#A3FF6B] transition">Consumer Registry</button>
          </div>
        </div>
      </footer>

      {/* 5. Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />

    </div>
  );
}
