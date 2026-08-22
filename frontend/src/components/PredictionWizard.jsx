import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Layers, 
  History, 
  CheckCircle, 
  Zap, 
  RotateCcw,
  Loader2
} from 'lucide-react';
import StepHome from './wizard/StepHome';
import StepAppliances from './wizard/StepAppliances';
import StepHistory from './wizard/StepHistory';
import StepResult from './wizard/StepResult';

const STEPS = [
  { id: 1, label: 'Your Home', num: '01' },
  { id: 2, label: 'Appliances', num: '02' },
  { id: 3, label: 'Bill History', num: '03' },
  { id: 4, label: 'Forecast', num: '04' },
];

export default function PredictionWizard({
  household,
  setHousehold,
  appliances,
  setAppliances,
  predictionResult,
  tariffs = [],
  applianceSpecs = [],
  onSeasonChange,
  onRunPrediction,
  onStartWhatIf,
  onViewOffers,
  loading,
  currencySymbol = "₹"
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleRunForecast = async () => {
    setIsCalculating(true);
    setTimeout(async () => {
      await onRunPrediction();
      setIsCalculating(false);
      setCurrentStep(4);
    }, 900);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-4">
      
      {/* Modern Stepper Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
          <span className="font-bold text-[#E15B2D]">WIZARD / ESTIMATE BILL</span>
          <span>STEP {currentStep} OF 4</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id} 
                onClick={() => {
                  if (isCompleted || isCurrent) setCurrentStep(step.id);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isCurrent 
                    ? 'border-[#E15B2D] bg-orange-50/60 dark:bg-orange-950/30 text-slate-900 dark:text-white font-bold shadow-xs' 
                    : isCompleted 
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300' 
                    : 'border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 text-slate-400 dark:text-slate-600'
                }`}
              >
                <div className="text-[11px] font-mono text-slate-400 font-bold">{step.num}</div>
                <div className={`text-xs font-bold tracking-tight ${isCurrent ? 'text-[#E15B2D]' : ''}`}>
                  {step.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculating Loading State */}
      {isCalculating ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-24 text-center space-y-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center mx-auto text-[#E15B2D]">
            <Zap className="w-8 h-8 animate-bounce text-[#E15B2D]" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Calculating Energy Forecast...
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Simulating appliance thermodynamics, active duty cycles, and state DISCOM progressive tariff slabs.
            </p>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {/* STEP 1: Your Home */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <StepHome
                household={household}
                setHousehold={setHousehold}
                tariffs={tariffs}
                onNext={() => setCurrentStep(2)}
              />
            </motion.div>
          )}

          {/* STEP 2: Appliances */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <StepAppliances
                appliances={appliances}
                setAppliances={setAppliances}
                household={household}
                applianceSpecs={applianceSpecs}
                onSeasonChange={onSeasonChange}
                onNext={() => setCurrentStep(3)}
                onPrev={() => setCurrentStep(1)}
              />
            </motion.div>
          )}

          {/* STEP 3: Bill History */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <StepHistory
                household={household}
                setHousehold={setHousehold}
                onRunPrediction={handleRunForecast}
                onPrev={() => setCurrentStep(2)}
                currencySymbol={currencySymbol}
              />
            </motion.div>
          )}

          {/* STEP 4: Prediction Result & Breakdown */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <StepResult
                predictionResult={predictionResult}
                household={household}
                appliances={appliances}
                onStartWhatIf={onStartWhatIf}
                onViewOffers={onViewOffers}
                onStartPredictAgain={() => setCurrentStep(1)}
                currencySymbol={currencySymbol}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

    </div>
  );
}
