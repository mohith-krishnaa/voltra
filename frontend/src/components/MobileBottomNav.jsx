import React, { useState } from 'react';
import { 
  Home, 
  Zap, 
  Sun,
  Tag,
  BarChart3, 
  FileText, 
  MapPin,
  Lightbulb,
  Sliders,
  Users,
  Award,
  MoreHorizontal
} from 'lucide-react';

const PRIMARY_TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'predict', label: 'Predict', icon: Zap },
  { id: 'solar', label: 'Solar ROI', icon: Sun },
  { id: 'offers', label: 'Offers', icon: Tag },
];

const MORE_TABS = [
  { id: 'ev', label: 'EV', icon: Zap },
  { id: 'rewards', label: 'Badges', icon: Award },
  { id: 'usage', label: 'Usage', icon: BarChart3 },
  { id: 'whatif', label: 'What-If', icon: Sliders },
  { id: 'split', label: 'Split', icon: Users },
  { id: 'savings', label: 'Savings', icon: Lightbulb },
  { id: 'bills', label: 'Bills', icon: FileText },
  { id: 'offices', label: 'Offices', icon: MapPin },
];

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  const [showMore, setShowMore] = useState(false);

  const isMoreActive = MORE_TABS.some(t => t.id === activeTab);

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-[#111111] border-t border-white/10 px-4 py-3 grid grid-cols-6 gap-1 shadow-2xl">
          {MORE_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowMore(false); }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition ${
                  isActive 
                    ? 'text-[#A3FF6B] font-bold bg-[#A3FF6B]/10' 
                    : 'text-[#8A8A84] hover:text-[#F5F3ED]'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[9px] mt-1 truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 flex items-center justify-around">
        {PRIMARY_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowMore(false); }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                isActive 
                  ? 'text-[#A3FF6B] font-bold' 
                  : 'text-[#8A8A84] hover:text-[#F5F3ED]'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
            showMore || isMoreActive
              ? 'text-[#A3FF6B] font-bold' 
              : 'text-[#8A8A84] hover:text-[#F5F3ED]'
          }`}
        >
          <MoreHorizontal className="h-5 w-5 stroke-2" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
}
