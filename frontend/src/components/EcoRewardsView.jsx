import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  ShieldCheck, 
  Leaf, 
  Sparkles, 
  Zap, 
  Check, 
  Share2, 
  ChevronRight, 
  TrendingUp,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function EcoRewardsView({ household, predictionResult, currencySymbol = "₹" }) {
  const [completedQuests, setCompletedQuests] = useState([1]);
  const [userPoints, setUserPoints] = useState(650);

  const predictedUnits = predictionResult?.predicted_units || 324.3;
  const occupants = household?.occupants || 3;
  const unitsPerPerson = Math.round(predictedUnits / occupants);

  // Calculate Eco Score (Base 100 minus penalty for excessive power per person)
  // Benchmark: <80 units/person is 5-star (Score 90+), 80-120 is 4-star (Score 75-90), >150 is low
  let ecoScore = 95;
  if (unitsPerPerson > 150) {
    ecoScore = Math.max(45, 95 - (unitsPerPerson - 150) * 0.4);
  } else if (unitsPerPerson > 90) {
    ecoScore = Math.max(65, 95 - (unitsPerPerson - 90) * 0.3);
  }
  ecoScore = Math.round(ecoScore);

  const quests = [
    {
      id: 1,
      title: "Thermostat Hero",
      desc: "Keep all bedroom ACs set to 24°C or higher for 5 consecutive nights.",
      points: 150,
      badge: "❄️ Cooling Master",
      impact: "Saves ~₹420/month"
    },
    {
      id: 2,
      title: "Solar Super Shifter",
      desc: "Run washing machine and geyser between 10:00 AM and 4:00 PM during peak solar injection.",
      points: 100,
      badge: "☀️ Day-Tripper",
      impact: "20% Tariff Discount"
    },
    {
      id: 3,
      title: "Subsidy Sentinel (Gruha Jyothi Guard)",
      desc: "Keep total monthly household consumption strictly under 200 kWh.",
      points: 250,
      badge: "🛡️ Zero-Bill Hero",
      impact: "100% Free Power Bill"
    },
    {
      id: 4,
      title: "Phantom Load Hunter",
      desc: "Switch off microwave, TV setup box, and laptop chargers at the main wall socket when not in use.",
      points: 75,
      badge: "🔌 Vampire Slayer",
      impact: "Cuts 18 kWh Standby"
    }
  ];

  const handleToggleQuest = (id, points) => {
    if (completedQuests.includes(id)) {
      setCompletedQuests(completedQuests.filter(qId => qId !== id));
      setUserPoints(prev => Math.max(0, prev - points));
    } else {
      setCompletedQuests([...completedQuests, id]);
      setUserPoints(prev => prev + points);
    }
  };

  const handleShareCertificate = () => {
    const text = `🏆 *VOLTRA ECO ENERGY CERTIFICATE*\n\n` +
      `🌱 *Household:* ${household?.name || 'Green Household'}\n` +
      `⚡ *Eco Energy Score:* ${ecoScore} / 100 (Top 12% Energy Efficient Homes)\n` +
      `🏅 *Earned Eco Points:* ${userPoints} Points\n` +
      `📉 *Per Capita Usage:* ${unitsPerPerson} kWh / person\n\n` +
      `👉 Test your household efficiency score at: https://voltra.netlify.app`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#A3FF6B]/15 text-[#A3FF6B] border border-[#A3FF6B]/30">
              🏆 ENERGY REWARDS & ECO BADGES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F3ED] tracking-tight">
            Household Eco Score & Weekly Quests
          </h2>
          <p className="text-sm text-[#8A8A84] max-w-2xl leading-relaxed">
            Gamify your energy savings. Complete weekly power conservation quests, unlock green efficiency badges, and earn rewards.
          </p>
        </div>

        <button
          type="button"
          onClick={handleShareCertificate}
          className="editorial-btn-lime text-xs flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Eco Certificate</span>
        </button>
      </div>

      {/* Main Score Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#111111] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        
        {/* Score Ring */}
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-mono uppercase text-[#8A8A84] tracking-widest block">
            HOUSEHOLD ECO SCORE
          </span>
          <div className="text-6xl sm:text-7xl font-black font-mono text-[#A3FF6B]">
            {ecoScore}<span className="text-2xl text-[#8A8A84]">/100</span>
          </div>
          <p className="text-xs text-[#8A8A84]">
            Based on {occupants} occupants & {unitsPerPerson} kWh / person.
          </p>
        </div>

        {/* Tier Status */}
        <div className="p-5 rounded-2xl bg-[#0B0B0B] border border-white/5 space-y-2">
          <span className="text-[10px] font-mono text-[#8A8A84] uppercase">CURRENT RANK STATUS</span>
          <div className="text-xl font-bold text-[#F5F3ED] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#A3FF6B]" />
            <span>{ecoScore >= 85 ? '🌟 5-Star Green Champion' : ecoScore >= 70 ? '⚡ 4-Star Eco Saver' : '🌱 Emerging Saver'}</span>
          </div>
          <p className="text-xs text-[#8A8A84]">Top 15% cleanest energy efficiency in your district.</p>
        </div>

        {/* Earned Points */}
        <div className="p-5 rounded-2xl bg-[#0B0B0B] border border-white/5 space-y-2">
          <span className="text-[10px] font-mono text-[#8A8A84] uppercase">TOTAL ECO POINTS</span>
          <div className="text-3xl font-black font-mono text-[#A3FF6B]">
            {userPoints} <span className="text-sm font-normal text-[#8A8A84]">PTS</span>
          </div>
          <p className="text-xs text-[#8A8A84]">Redeemable for DISCOM bill cashback promo codes.</p>
        </div>

      </div>

      {/* Weekly Energy Quests */}
      <div className="p-7 sm:p-8 rounded-3xl bg-[#111111] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#A3FF6B] font-bold block">
              WEEKLY ENERGY SAVINGS CHALLENGES
            </span>
            <h3 className="text-xl font-bold text-[#F5F3ED]">Active Quests</h3>
          </div>
          <span className="text-xs font-mono text-[#8A8A84]">
            {completedQuests.length} of {quests.length} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map((q) => {
            const isCompleted = completedQuests.includes(q.id);
            return (
              <div
                key={q.id}
                onClick={() => handleToggleQuest(q.id, q.points)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isCompleted
                    ? 'bg-[#A3FF6B]/10 border-[#A3FF6B]'
                    : 'bg-[#0B0B0B] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-[#A3FF6B]">
                      {q.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#F5F3ED]">
                      +{q.points} PTS
                    </span>
                  </div>

                  <h4 className={`text-base font-bold ${isCompleted ? 'text-[#A3FF6B]' : 'text-[#F5F3ED]'}`}>
                    {q.title}
                  </h4>
                  <p className="text-xs text-[#8A8A84] leading-relaxed">
                    {q.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400">{q.impact}</span>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    isCompleted ? 'bg-[#A3FF6B] border-[#A3FF6B] text-[#0B0B0B]' : 'border-white/20'
                  }`}>
                    {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
