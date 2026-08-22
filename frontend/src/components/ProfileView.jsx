import React, { useState } from 'react';
import { 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Building, 
  ShieldCheck, 
  LogOut, 
  Save, 
  Check, 
  CreditCard,
  Zap,
  Sparkles
} from 'lucide-react';
import VoltraLogo from './common/VoltraLogo';

export default function ProfileView({ user, onLogout, household, setHousehold }) {
  const [consumerData, setConsumerData] = useState({
    usc_number: household?.usc_number || '1029384729',
    consumer_name: household?.consumer_name || 'K. V. Rajesh Kumar',
    mobile_number: household?.mobile_number || '+91 98490 12345',
    door_no: household?.door_no || 'Flat 402, Block-B, Green Meadows',
    street: household?.street || 'KPHB 6th Phase, Near JNTU',
    city: household?.city || 'Hyderabad',
    pincode: household?.pincode || '500072',
    meter_number: household?.meter_number || 'TG-SM-98241',
    sanctioned_load: household?.sanctioned_load || 3.5,
    gruha_jyothi_linked: household?.gruha_jyothi_linked ?? true
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setHousehold({
      ...household,
      ...consumerData
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className='space-y-10 max-w-4xl mx-auto py-2'>
      
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6'>
        <div className='space-y-1'>
          <h2 className='text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
            Consumer Profile & Electricity Connection
          </h2>
          <p className='text-sm text-slate-600 dark:text-slate-400'>
            Manage your Unique Service Connection (USC) number, address, and state tariff link.
          </p>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className='btn-outline-card text-xs py-2 px-3 flex items-center gap-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer self-start sm:self-auto'
          >
            <LogOut className='w-3.5 h-3.5' />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className='space-y-8'>
        
        {/* Card 1: Account Information */}
        <div className='p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6'>
          <span className='text-xs font-mono uppercase tracking-widest text-slate-500 font-bold block'>
            01 / ACCOUNT DETAILS
          </span>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs'>
            <div>
              <label className='block text-slate-500 mb-1 font-mono uppercase'>Account Email</label>
              <input
                type='email'
                disabled
                value={user?.email || 'consumer@voltra.in'}
                className='w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed'
              />
            </div>

            <div>
              <label className='block text-slate-500 mb-1 font-mono uppercase'>Registered Consumer Name</label>
              <input
                type='text'
                value={consumerData.consumer_name}
                onChange={(e) => setConsumerData({ ...consumerData, consumer_name: e.target.value })}
                className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]'
              />
            </div>
          </div>
        </div>

        {/* Card 2: Electricity Connection Details */}
        <div className='p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6'>
          <span className='text-xs font-mono uppercase tracking-widest text-slate-500 font-bold block'>
            02 / DISCOM SERVICE CONNECTION (USC)
          </span>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono'>
            <div>
              <label className='block text-slate-500 mb-1 uppercase'>USC / Service No.</label>
              <input
                type='text'
                value={consumerData.usc_number}
                onChange={(e) => setConsumerData({ ...consumerData, usc_number: e.target.value })}
                className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#E15B2D]'
              />
            </div>

            <div>
              <label className='block text-slate-500 mb-1 uppercase'>Smart Meter Serial</label>
              <input
                type='text'
                value={consumerData.meter_number}
                onChange={(e) => setConsumerData({ ...consumerData, meter_number: e.target.value })}
                className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]'
              />
            </div>

            <div>
              <label className='block text-slate-500 mb-1 uppercase'>Sanctioned Load (kW)</label>
              <input
                type='number'
                step='0.5'
                value={consumerData.sanctioned_load}
                onChange={(e) => setConsumerData({ ...consumerData, sanctioned_load: parseFloat(e.target.value) })}
                className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]'
              />
            </div>
          </div>
        </div>

        {/* Card 3: Address Information */}
        <div className='p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6'>
          <span className='text-xs font-mono uppercase tracking-widest text-slate-500 font-bold block'>
            03 / SERVICE PREMISES ADDRESS
          </span>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs'>
            <div>
              <label className='block text-slate-500 mb-1 font-mono uppercase'>Door / Flat Number</label>
              <input
                type='text'
                value={consumerData.door_no}
                onChange={(e) => setConsumerData({ ...consumerData, door_no: e.target.value })}
                className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]'
              />
            </div>

            <div>
              <label className='block text-slate-500 mb-1 font-mono uppercase'>Street / Landmark</label>
              <input
                type='text'
                value={consumerData.street}
                onChange={(e) => setConsumerData({ ...consumerData, street: e.target.value })}
                className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]'
              />
            </div>

            <div>
              <label className='block text-slate-500 mb-1 font-mono uppercase'>City / District</label>
              <input
                type='text'
                value={consumerData.city}
                onChange={(e) => setConsumerData({ ...consumerData, city: e.target.value })}
                className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]'
              />
            </div>

            <div>
              <label className='block text-slate-500 mb-1 font-mono uppercase'>PIN Code</label>
              <input
                type='text'
                value={consumerData.pincode}
                onChange={(e) => setConsumerData({ ...consumerData, pincode: e.target.value })}
                className='w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#E15B2D]'
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className='flex items-center justify-between pt-2'>
          {savedMsg ? (
            <span className='text-xs font-mono font-bold text-emerald-600 flex items-center gap-1'>
              <Check className='w-4 h-4' /> Profile details updated successfully!
            </span>
          ) : <div />}

          <button
            type='submit'
            className='btn-orange-primary text-xs py-3 px-6 flex items-center gap-2 cursor-pointer shadow-sm'
          >
            <Save className='w-4 h-4' />
            <span>Save Profile Changes</span>
          </button>
        </div>

      </form>

    </div>
  );
}
